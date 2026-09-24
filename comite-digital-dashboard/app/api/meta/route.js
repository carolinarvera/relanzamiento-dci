import axios from 'axios';

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
      metric: 'page_media_view,page_total_media_view_unique,page_actions_post_reactions_total,page_views_total',
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

async function fbDetail(pageId, pageToken, errors, label) {
  try {
    const now = new Date();
    const u = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000);
    const m1 = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1) / 1000);
    const m2 = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1) / 1000);
    const [cur, prev, page] = await Promise.all([
      fbRange(pageId, pageToken, m1, u),
      fbRange(pageId, pageToken, m2, m1),
      axios.get(`https://graph.facebook.com/v19.0/${pageId}`, { params: { fields: 'followers_count', access_token: pageToken } }),
    ]);
    const views = cur.page_media_view || 0;
    const reactions = cur.page_actions_post_reactions_total || 0;
    return {
      followers: page.data.followers_count || 0,
      views, viewsChange: chg(views, prev.page_media_view),
      viewers: cur.page_total_media_view_unique || 0, viewersChange: chg(cur.page_total_media_view_unique, prev.page_total_media_view_unique),
      reactions, reactionsChange: chg(reactions, prev.page_actions_post_reactions_total),
      profileViews: cur.page_views_total || 0, profileViewsChange: chg(cur.page_views_total, prev.page_views_total),
      engagementRate: views ? reactions / views : 0,
    };
  } catch (err) {
    errors.push(`${label} Facebook detalle: ` + (err.response?.data?.error?.message || err.message));
    return null;
  }
}

async function igDetail(igId, token, errors, label) {
  try {
    const demo = (breakdown) => axios.get(`https://graph.facebook.com/v19.0/${igId}/insights`, {
      params: { metric: 'follower_demographics', period: 'lifetime', metric_type: 'total_value', breakdown, access_token: token },
    }).then((r) => r.data.data?.[0]?.total_value?.breakdowns?.[0]?.results || []);
    const [ageGender, city, acct] = await Promise.all([
      demo('age,gender'),
      demo('city'),
      axios.get(`https://graph.facebook.com/v19.0/${igId}`, { params: { fields: 'followers_count', access_token: token } }),
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

export async function GET() {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');

    // IDs de Instagram Business Account (usados vía Facebook Graph API)
    const errors = [];
    const until = Math.floor(Date.now() / 1000);
    const since = until - 29 * 86400;
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
      fbDetail(axxisFbId, axxisFbToken, errors, 'AXXIS'),
      fbDetail(dinersFbId, dinersFbToken, errors, 'Diners'),
      igDetail(axxisIgId, token, errors, 'AXXIS'),
      igDetail(dinersIgId, token, errors, 'Diners'),
    ]);

    return Response.json({
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
