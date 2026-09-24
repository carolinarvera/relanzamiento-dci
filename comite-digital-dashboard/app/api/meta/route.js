import axios from 'axios';
import { resolveRange } from '../../lib/range';

async function getPageAccessTokens(userToken) {
  try {
    const res = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
      params: { access_token: userToken },
    });
    const tokens = {};
    (res.data.data || []).forEach((page) => {
      tokens[page.id] = page.access_token;
    });
    return tokens;
  } catch (err) {
    console.error('Error obteniendo Page Access Tokens:', err.response?.data || err.message);
    return {};
  }
}

export const dynamic = 'force-dynamic';

const sumVal = (v) => (v && typeof v === 'object' ? Object.values(v).reduce((a, n) => a + n, 0) : v || 0);
const chg = (cur, prev) => (prev ? cur / prev - 1 : null);

async function fbRange(pageId, pageToken, since, until) {
  const r = await axios.get(`https://graph.facebook.com/v19.0/${pageId}/insights`, {
    params: {
      metric: 'page_media_view,page_total_media_view_unique,page_actions_post_reactions_total,page_views_total,page_daily_follows,page_daily_unfollows_unique',
      period: 'total_over_range',
      since,
      until,
      access_token: pageToken,
    },
  });
  const out = {};
  (r.data.data || []).forEach((m) => { out[m.name] = sumVal(m.values?.[0]?.value); });
  return out;
}

async function topFbPosts(pageId, pageToken, r) {
  const day = (d, plus = 0) => Math.floor(Date.parse(`${d}T00:00:00Z`) / 1000) + plus * 86400;
  let res = await axios.get(`https://graph.facebook.com/v19.0/${pageId}/posts`, {
    params: {
      fields: 'id,message,created_time,permalink_url,full_picture,status_type,shares,reactions.summary(true).limit(0),comments.summary(true).limit(0)',
      since: day(r.start), until: day(r.end, 1), limit: 100, access_token: pageToken,
    },
  });
  let posts = res.data.data || [];
  for (let page = 0; page < 3 && res.data.paging?.next && posts.length < 400; page += 1) {
    res = await axios.get(res.data.paging.next);
    posts = posts.concat(res.data.data || []);
  }
  const score = (p) => (p.reactions?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) + (p.shares?.count || 0);
  const sortedPosts = [...posts].sort((a, b) => score(b) - score(a));
  const maturePosts = sortedPosts.filter((p) => Date.now() - Date.parse(p.created_time) > 3 * 86400000);
  const topCandidates = sortedPosts.slice(0, 10);
  const worstCandidates = maturePosts.slice(-10);
  const candidates = [...new Map([...topCandidates, ...worstCandidates].map((p) => [p.id, p])).values()];
  const withInsights = await Promise.all(candidates.map(async (p) => {
    try {
      const ins = await axios.get(`https://graph.facebook.com/v19.0/${p.id}/insights`, {
        params: { metric: 'post_media_view,post_total_media_view_unique,post_clicks', access_token: pageToken },
      });
      const v = {};
      (ins.data.data || []).forEach((i) => { if (i.period === 'lifetime' || v[i.name] === undefined) v[i.name] = i.values?.[0]?.value || 0; });
      return { p, v };
    } catch { return { p, v: {} }; }
  }));
  const kind = (t) => (t === 'added_video' ? 'Video' : t === 'added_photos' ? 'Foto' : t === 'shared_story' ? 'Enlace' : 'Publicación');
  const shape = ({ p, v }) => ({
    id: p.id, permalink: p.permalink_url, image: p.full_picture || null, type: kind(p.status_type),
    date: p.created_time.slice(0, 10), caption: (p.message || '').replace(/\s+/g, ' ').slice(0, 140),
    reactions: p.reactions?.summary?.total_count || 0, comments: p.comments?.summary?.total_count || 0, shares: p.shares?.count || 0,
    interactions: score(p), views: v.post_media_view || 0, viewers: v.post_total_media_view_unique || 0, clicks: v.post_clicks || 0,
  });
  const byId = new Map(withInsights.map((x) => [x.p.id, x]));
  const top = topCandidates.map((p) => byId.get(p.id)).filter(Boolean).sort((a, b) => score(b.p) - score(a.p)).slice(0, 5).map(shape);
  const bottom = worstCandidates.map((p) => byId.get(p.id)).filter(Boolean).sort((a, b) => score(a.p) - score(b.p) || (a.v.post_total_media_view_unique || 0) - (b.v.post_total_media_view_unique || 0)).slice(0, 3).map(shape);
  return { top, bottom };
}

async function fbDetail(pageId, pageToken, errors, label, r) {
  try {
    const day = (d, plus = 0) => Math.floor(Date.parse(`${d}T00:00:00Z`) / 1000) + plus * 86400;
    const u = day(r.end, 1);
    const m1 = day(r.start);
    const m2 = day(r.prevStart);
    const pu = day(r.prevEnd, 1);
    const [cur, prev, page, cityRes, topPosts] = await Promise.all([
      fbRange(pageId, pageToken, m1, u),
      fbRange(pageId, pageToken, m2, pu),
      axios.get(`https://graph.facebook.com/v19.0/${pageId}`, { params: { fields: 'followers_count', access_token: pageToken } }),
      axios.get(`https://graph.facebook.com/v19.0/${pageId}/insights`, {
        params: { metric: 'page_follows_city', period: 'day', access_token: pageToken },
      }).then((r) => r.data.data?.[0]?.values?.slice(-1)[0]?.value || {}).catch(() => ({})),
      topFbPosts(pageId, pageToken, r).catch((e) => { errors.push(`${label} Facebook top posts: ` + (e.response?.data?.error?.message || e.message)); return { top: [], bottom: [] }; }),
    ]);
    const followersTotal = page.data.followers_count || 0;
    const cities = Object.entries(cityRes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.split(',')[0], pct: followersTotal ? value / followersTotal : 0 }));
    const views = cur.page_media_view || 0;
    const reactions = cur.page_actions_post_reactions_total || 0;
    return {
      followers: page.data.followers_count || 0,
      views, viewsChange: chg(views, prev.page_media_view),
      viewers: cur.page_total_media_view_unique || 0, viewersChange: chg(cur.page_total_media_view_unique, prev.page_total_media_view_unique),
      reactions, reactionsChange: chg(reactions, prev.page_actions_post_reactions_total),
      profileViews: cur.page_views_total || 0, profileViewsChange: chg(cur.page_views_total, prev.page_views_total),
      engagementRate: views ? reactions / views : 0,
      prevEngagementRate: prev.page_media_view ? (prev.page_actions_post_reactions_total || 0) / prev.page_media_view : null,
      newFollowers: cur.page_daily_follows || 0,
      newFollowersChange: chg(cur.page_daily_follows, prev.page_daily_follows),
      unfollows: cur.page_daily_unfollows_unique || 0,
      cities,
      topPosts: topPosts.top,
      bottomPosts: topPosts.bottom,
    };
  } catch (err) {
    errors.push(`${label} Facebook detalle: ` + (err.response?.data?.error?.message || err.message));
    return null;
  }
}

async function topIgPosts(igId, token, r) {
  const day = (d, plus = 0) => Math.floor(Date.parse(`${d}T00:00:00Z`) / 1000) + plus * 86400;
  let res = await axios.get(`https://graph.facebook.com/v19.0/${igId}/media`, {
    params: {
      fields: 'id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count',
      since: day(r.start), until: day(r.end, 1), limit: 100, access_token: token,
    },
  });
  let media = res.data.data || [];
  for (let page = 0; page < 3 && res.data.paging?.next && media.length < 300; page += 1) {
    res = await axios.get(res.data.paging.next);
    media = media.concat(res.data.data || []);
  }
  const engagement = (m) => (m.like_count || 0) + (m.comments_count || 0);
  const sorted = media.filter((m) => m.timestamp).sort((a, b) => engagement(b) - engagement(a));
  const mature = sorted.filter((m) => Date.now() - Date.parse(m.timestamp) > 3 * 86400000);
  const topCandidates = sorted.slice(0, 12);
  const worstCandidates = mature.slice(-12);
  const candidates = [...new Map([...topCandidates, ...worstCandidates].map((m) => [m.id, m])).values()];
  const withInsights = await Promise.all(candidates.map(async (m) => {
    try {
      const ins = await axios.get(`https://graph.facebook.com/v19.0/${m.id}/insights`, {
        params: { metric: 'reach,saved,shares,total_interactions,views', access_token: token },
      });
      const v = {};
      (ins.data.data || []).forEach((i) => { v[i.name] = i.values?.[0]?.value || 0; });
      return { m, v };
    } catch { return null; }
  }));
  const kind = (m) => (m.media_product_type === 'REELS' ? 'Reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : m.media_type === 'VIDEO' ? 'Video' : 'Imagen');
  const shape = ({ m, v }) => ({
    id: m.id, permalink: m.permalink, image: m.thumbnail_url || m.media_url || null, type: kind(m),
    date: m.timestamp.slice(0, 10), caption: (m.caption || '').replace(/\s+/g, ' ').slice(0, 140),
    likes: m.like_count || 0, comments: m.comments_count || 0,
    reach: v.reach || 0, views: v.views || 0, saved: v.saved || 0, shares: v.shares || 0, interactions: v.total_interactions || 0,
  });
  const byId = new Map(withInsights.filter(Boolean).map((x) => [x.m.id, x]));
  const inter = (x) => x.v.total_interactions || 0;
  const top = topCandidates.map((m) => byId.get(m.id)).filter(Boolean).sort((a, b) => inter(b) - inter(a)).slice(0, 5).map(shape);
  const bottom = worstCandidates.map((m) => byId.get(m.id)).filter(Boolean).sort((a, b) => inter(a) - inter(b)).slice(0, 3).map(shape);
  return { top, bottom };
}

async function igPeriod(igId, token, r, which) {
  const day = (d, plus = 0) => Math.floor(Date.parse(`${d}T00:00:00Z`) / 1000) + plus * 86400;
  const start = which === 'prev' ? r.prevStart : r.start;
  const end = which === 'prev' ? r.prevEnd : r.end;
  const until = day(end, 1);
  const since = Math.max(day(start), until - 30 * 86400);
  const [core, fol] = await Promise.all([
    axios.get(`https://graph.facebook.com/v19.0/${igId}/insights`, {
      params: { metric: 'reach,total_interactions', period: 'day', metric_type: 'total_value', since, until, access_token: token },
    }),
    axios.get(`https://graph.facebook.com/v19.0/${igId}/insights`, {
      params: { metric: 'follows_and_unfollows', period: 'day', metric_type: 'total_value', breakdown: 'follow_type', since, until, access_token: token },
    }).catch(() => null),
  ]);
  const v = {};
  (core.data.data || []).forEach((m) => { v[m.name] = m.total_value?.value || 0; });
  const newFollowers = fol?.data?.data?.[0]?.total_value?.breakdowns?.[0]?.results?.find((x) => x.dimension_values[0] === 'FOLLOWER')?.value ?? null;
  return { reach: v.reach || 0, interactions: v.total_interactions || 0, newFollowers };
}

async function igDetail(igId, token, errors, label, range) {
  try {
    const demo = (breakdown) => axios.get(`https://graph.facebook.com/v19.0/${igId}/insights`, {
      params: { metric: 'follower_demographics', period: 'lifetime', metric_type: 'total_value', breakdown, access_token: token },
    }).then((r) => r.data.data?.[0]?.total_value?.breakdowns?.[0]?.results || []);
    const [ageGender, city, acct, topPosts, curP, prevP] = await Promise.all([
      demo('age,gender'),
      demo('city'),
      axios.get(`https://graph.facebook.com/v19.0/${igId}`, { params: { fields: 'followers_count', access_token: token } }),
      topIgPosts(igId, token, range).catch((e) => { errors.push(`${label} Instagram top posts: ` + (e.response?.data?.error?.message || e.message)); return { top: [], bottom: [] }; }),
      igPeriod(igId, token, range, 'cur'),
      igPeriod(igId, token, range, 'prev').catch(() => null),
    ]);
    const valid = ageGender.filter((r) => ['F', 'M'].includes(r.dimension_values[1]) && r.dimension_values[0] !== '13-17');
    const total = valid.reduce((a, r) => a + r.value, 0);
    const byAge = {};
    valid.forEach((r) => {
      const a = r.dimension_values[0];
      byAge[a] = byAge[a] || { age: a, mujeres: 0, hombres: 0 };
      byAge[a][r.dimension_values[1] === 'F' ? 'mujeres' : 'hombres'] = total ? r.value / total : 0;
    });
    const women = valid.filter((r) => r.dimension_values[1] === 'F').reduce((a, r) => a + r.value, 0);
    const cityTotal = city.reduce((a, r) => a + r.value, 0);
    return {
      followers: acct.data.followers_count || 0,
      topPosts: topPosts.top,
      bottomPosts: topPosts.bottom,
      period: {
        reach: curP.reach, reachChange: prevP?.reach ? curP.reach / prevP.reach - 1 : null,
        newFollowers: curP.newFollowers, newFollowersChange: prevP?.newFollowers ? curP.newFollowers / prevP.newFollowers - 1 : null,
        engagementRate: curP.reach ? curP.interactions / curP.reach : 0,
        prevEngagementRate: prevP?.reach ? prevP.interactions / prevP.reach : null,
      },
      ageGender: Object.values(byAge).sort((x, y) => x.age.localeCompare(y.age, 'es', { numeric: true })),
      women: total ? women / total : 0,
      men: total ? 1 - women / total : 0,
      cities: city.sort((a, b) => b.value - a.value).slice(0, 5).map((r) => ({ name: r.dimension_values[0].split(',')[0], pct: cityTotal ? r.value / cityTotal : 0 })),
    };
  } catch (err) {
    errors.push(`${label} Instagram detalle: ` + (err.response?.data?.error?.message || err.message));
    return null;
  }
}

export async function GET(request) {
  try {
    const range = resolveRange(new URL(request.url).searchParams);
    const toUnix = (d, plusDay = 0) => Math.floor(Date.parse(`${d}T00:00:00Z`) / 1000) + plusDay * 86400;
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');

    // IDs de Instagram Business Account (usados vía Facebook Graph API)
    const errors = [];
    const until = toUnix(range.end, 1);
    const since = Math.max(toUnix(range.start), until - 30 * 86400);
    const axxisIgId = process.env.META_AXXIS_PAGE_ID || 'default';
    const dinersIgId = process.env.META_DINERS_PAGE_ID || 'default';
    // IDs de página de Facebook (distintos a los de Instagram)
    const axxisFbId = process.env.META_AXXIS_FB_PAGE_ID || 'default';
    const dinersFbId = process.env.META_DINERS_FB_PAGE_ID || 'default';

    // Facebook Page Insights requiere el Page Access Token (no el de usuario)
    const pageTokens = await getPageAccessTokens(token);
    const axxisFbToken = pageTokens[axxisFbId] || token;
    const dinersFbToken = pageTokens[dinersFbId] || token;

    // Instagram insights (vía graph.facebook.com, no graph.instagram.com)
    const [axxisIgRes, dinersIgRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisIgId}/insights`, {
        params: {
          metric: 'reach,profile_views,accounts_engaged,total_interactions',
          period: 'day',
          metric_type: 'total_value',
          since,
          until,
          access_token: token,
        },
      }).catch((err) => {
        errors.push('AXXIS Instagram: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
      axios.get(`https://graph.facebook.com/v19.0/${dinersIgId}/insights`, {
        params: {
          metric: 'reach,profile_views,accounts_engaged,total_interactions',
          period: 'day',
          metric_type: 'total_value',
          since,
          until,
          access_token: token,
        },
      }).catch((err) => {
        errors.push('Diners Instagram: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
    ]);

    // Facebook Page insights (page_fans/page_impressions* fueron deprecadas por Meta en 2023)
    const [axxisFbRes, dinersFbRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisFbId}/insights`, {
        params: {
          metric: 'page_post_engagements,page_views_total',
          period: 'day',
          since,
          until,
          access_token: axxisFbToken,
        },
      }).catch((err) => {
        errors.push('AXXIS Facebook: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
      axios.get(`https://graph.facebook.com/v19.0/${dinersFbId}/insights`, {
        params: {
          metric: 'page_post_engagements,page_views_total',
          period: 'day',
          since,
          until,
          access_token: dinersFbToken,
        },
      }).catch((err) => {
        errors.push('Diners Facebook: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
    ]);

    // Fan count (seguidores) como proxy de alcance — page_fans fue deprecada
    const [axxisFbFields, dinersFbFields] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisFbId}`, {
        params: { fields: 'fan_count', access_token: axxisFbToken },
      }).catch(() => ({ data: null })),
      axios.get(`https://graph.facebook.com/v19.0/${dinersFbId}`, {
        params: { fields: 'fan_count', access_token: dinersFbToken },
      }).catch(() => ({ data: null })),
    ]);

    const [axxisFbD, dinersFbD, axxisIgD, dinersIgD] = await Promise.all([
      fbDetail(axxisFbId, axxisFbToken, errors, 'AXXIS', range),
      fbDetail(dinersFbId, dinersFbToken, errors, 'Diners', range),
      igDetail(axxisIgId, token, errors, 'AXXIS', range),
      igDetail(dinersIgId, token, errors, 'Diners', range),
    ]);

    return Response.json({
      range,
      errors,
      axxis: {
        instagram: { ...parseInstagramResponse(axxisIgRes.data), detail: axxisIgD },
        facebook: { ...parseFacebookResponse(axxisFbRes.data, axxisFbFields.data), detail: axxisFbD },
      },
      diners: {
        instagram: { ...parseInstagramResponse(dinersIgRes.data), detail: dinersIgD },
        facebook: { ...parseFacebookResponse(dinersFbRes.data, dinersFbFields.data), detail: dinersFbD },
      },
    });
  } catch (error) {
    console.error('Meta API Error:', error.message);
    return Response.json({ error: error.message }, { status: 502 });
  }
}

function parseInstagramResponse(data) {
  if (!data || !data.data) {
    return {
      reach: 0,
      impressions: 0,
      engagement: 0,
      engagementRate: 0,
    };
  }

  const metrics = {};
  data.data.forEach(item => {
    metrics[item.name] = item.total_value?.value ?? item.values?.[0]?.value ?? 0;
  });

  const reach = metrics.reach || 0;
  const engagement = metrics.total_interactions || metrics.accounts_engaged || 0;

  return {
    reach,
    impressions: metrics.profile_views || 0,
    engagement,
    engagementRate: reach ? (engagement / reach) : 0,
  };
}

function parseFacebookResponse(data, fieldsData) {
  const metrics = {};
  if (data && data.data) {
    data.data.forEach(item => {
      metrics[item.name] = (item.values || []).reduce((sum, v) => sum + (v.value || 0), 0);
    });
  }

  const impressions = metrics.page_views_total || 0;
  const engagement = metrics.page_post_engagements || 0;
  const reach = fieldsData?.fan_count || 0;

  return {
    reach,
    impressions,
    engagement,
    engagementRate: reach ? (engagement / reach) : 0,
  };
}
