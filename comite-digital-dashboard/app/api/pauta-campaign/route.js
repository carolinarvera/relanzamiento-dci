import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const CACHE = new Map();
const TTL = 30 * 60 * 1000;

async function paged(url, params) {
  let res = await axios.get(url, { params });
  let data = res.data.data || [];
  for (let i = 0; i < 8 && res.data.paging?.next; i += 1) {
    res = await axios.get(res.data.paging.next);
    data = data.concat(res.data.data || []);
  }
  return data;
}

const val = (arr, type) => {
  const hit = (arr || []).find((a) => a.action_type === type);
  return hit ? Number(hit.value) : null;
};
const sumMatching = (actions, re) => {
  const rows = (actions || []).filter((a) => re.test(a.action_type));
  return rows.length ? rows.reduce((s, a) => s + Number(a.value), 0) : null;
};
const first = (arr) => (arr && arr[0] ? Number(arr[0].value) : null);

const GENDER_LABEL = { male: 'Hombres', female: 'Mujeres', unknown: 'Sin especificar' };

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get('campaignId');
    if (!campaignId) return Response.json({ error: 'campaignId requerido' }, { status: 400 });
    const range = resolveRange(url.searchParams);
    const cacheKey = `${campaignId}|${range.start}|${range.end}`;
    const hit = CACHE.get(cacheKey);
    const cacheHeaders = { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' };
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true }, { headers: cacheHeaders });

    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');
    const timeRange = JSON.stringify({ since: range.start, until: range.end });

    const [daily, demo, adsets, adRows] = await Promise.all([
      paged(`https://graph.facebook.com/v19.0/${campaignId}/insights`, {
        fields: 'impressions,reach,spend,inline_link_clicks',
        time_increment: 1,
        time_range: timeRange,
        limit: 500,
        access_token: token,
      }).catch(() => []),
      paged(`https://graph.facebook.com/v19.0/${campaignId}/insights`, {
        fields: 'impressions,reach,spend,actions,inline_link_clicks',
        breakdowns: 'age,gender',
        time_range: timeRange,
        limit: 500,
        access_token: token,
      }).catch(() => []),
      paged(`https://graph.facebook.com/v19.0/${campaignId}/adsets`, {
        fields: 'id,name,status,effective_status,targeting,daily_budget,lifetime_budget',
        limit: 200,
        access_token: token,
      }).catch(() => []),
      paged(`https://graph.facebook.com/v19.0/${campaignId}/insights`, {
        level: 'ad',
        fields: 'ad_id,ad_name,adset_name,spend,impressions,reach,frequency,cpm,cpc,inline_link_clicks,actions,video_play_actions,video_avg_time_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions',
        time_range: timeRange,
        limit: 500,
        access_token: token,
      }).catch(() => []),
    ]);

    const dailySeries = daily
      .map((r) => ({ date: r.date_start, impressions: Number(r.impressions || 0), reach: Number(r.reach || 0), spend: Number(r.spend || 0), linkClicks: Number(r.inline_link_clicks || 0) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const demoRows = demo.map((r) => {
      const linkClicks = Number(r.inline_link_clicks || 0);
      const spend = Number(r.spend || 0);
      const actions = Object.fromEntries((r.actions || []).map((a) => [a.action_type, Number(a.value)]));
      const results = actions.link_click || linkClicks || 0;
      return {
        age: r.age,
        gender: r.gender,
        genderLabel: GENDER_LABEL[r.gender] || r.gender,
        impressions: Number(r.impressions || 0),
        reach: Number(r.reach || 0),
        spend,
        results,
        costPerResult: results ? spend / results : null,
      };
    });
    const totalReach = demoRows.reduce((a, r) => a + r.reach, 0);
    const byGenderTotal = demoRows.reduce((acc, r) => { acc[r.gender] = (acc[r.gender] || 0) + r.reach; return acc; }, {});
    const totalSpendDemo = demoRows.reduce((a, r) => a + r.spend, 0);

    const geoOf = (t) => {
      const g = t?.geo_locations;
      if (!g) return null;
      const parts = [];
      if (g.countries?.length) parts.push(g.countries.join(', '));
      if (g.cities?.length) parts.push(g.cities.map((c) => c.name).join(', '));
      if (g.regions?.length) parts.push(g.regions.map((r) => r.name).join(', '));
      return parts.join(' · ') || null;
    };
    const interestsOf = (t) => {
      const specs = t?.flexible_spec || [];
      const names = specs.flatMap((s) => (s.interests || []).map((i) => i.name)).concat((t?.interests || []).map((i) => i.name));
      return [...new Set(names)];
    };

    const adsetsOut = adsets.map((a) => ({
      id: a.id,
      name: a.name,
      status: a.effective_status || a.status,
      ageMin: a.targeting?.age_min ?? null,
      ageMax: a.targeting?.age_max ?? null,
      genders: (a.targeting?.genders || []).map((g) => (g === 1 ? 'Hombres' : g === 2 ? 'Mujeres' : 'Todos')).join(', ') || 'Todos',
      geo: geoOf(a.targeting),
      interests: interestsOf(a.targeting),
      dailyBudget: a.daily_budget ? Number(a.daily_budget) : null,
      lifetimeBudget: a.lifetime_budget ? Number(a.lifetime_budget) : null,
    }));

    const adIds = [...new Set(adRows.map((r) => r.ad_id))];
    let creatives = {};
    let ageByAd = {};
    if (adIds.length) {
      const ageRows = await paged(`https://graph.facebook.com/v19.0/${campaignId}/insights`, {
        level: 'ad', breakdowns: 'age', fields: 'ad_id,reach', time_range: timeRange, limit: 500, access_token: token,
      }).catch(() => []);
      // fetch creatives individually per ad (small campaigns, so no batching needed)
      const credata = await Promise.all(adIds.map((id) => axios.get(`https://graph.facebook.com/v19.0/${id}`, {
        params: { fields: 'creative.thumbnail_width(480).thumbnail_height(480){thumbnail_url,image_url,body,title,video_id,object_story_spec}', access_token: token },
      }).then((r) => [id, r.data]).catch(() => [id, null])));
      creatives = Object.fromEntries(credata.filter(([, d]) => d));
      ageByAd = ageRows.reduce((acc, row) => { (acc[row.ad_id] = acc[row.ad_id] || []).push({ age: row.age, reach: Number(row.reach || 0) }); return acc; }, {});
    }

    const ads = adRows.map((r) => {
      const cr = creatives[r.ad_id]?.creative || {};
      const spec = cr.object_story_spec || {};
      const text = cr.body || spec.link_data?.message || spec.video_data?.message || spec.photo_data?.caption || null;
      const headline = cr.title || spec.link_data?.name || spec.video_data?.title || null;
      const views3s = val(r.actions, 'video_view');
      const p = (arr) => { const v = first(arr); return v !== null && views3s ? v / views3s : null; };
      const ageList = (ageByAd[r.ad_id] || []).sort((a, b) => a.age.localeCompare(b.age, 'es', { numeric: true }));
      const ageTotal = ageList.reduce((s, x) => s + x.reach, 0);
      return {
        id: r.ad_id,
        name: r.ad_name,
        adset: r.adset_name,
        image: cr.thumbnail_url || cr.image_url || null,
        isVideo: Boolean(cr.video_id),
        headline,
        text,
        spend: Number(r.spend || 0),
        impressions: Number(r.impressions || 0),
        reach: Number(r.reach || 0),
        frequency: Number(r.frequency || 0),
        cpm: Number(r.cpm || 0),
        cpc: Number(r.cpc || 0),
        linkClicks: Number(r.inline_link_clicks || 0),
        landingPageViews: val(r.actions, 'landing_page_view'),
        videoViews3s: views3s,
        avgWatchSeconds: first(r.video_avg_time_watched_actions),
        retention: { p25: p(r.video_p25_watched_actions), p50: p(r.video_p50_watched_actions), p75: p(r.video_p75_watched_actions), p100: p(r.video_p100_watched_actions) },
        profileVisits: sumMatching(r.actions, /profile_visit|profile_view/i),
        igFollows: sumMatching(r.actions, /follow/i),
        age: ageList.map((x) => ({ age: x.age, pct: ageTotal ? x.reach / ageTotal : 0 })),
      };
    }).sort((a, b) => b.spend - a.spend);

    const data = {
      range,
      totals: { impressions: dailySeries.reduce((a, d) => a + d.impressions, 0), reach: Math.max(...demoRows.map((r) => r.reach), 0) || totalReach, cpc: (() => { const s = dailySeries.reduce((a, d) => a + d.spend, 0); const l = dailySeries.reduce((a, d) => a + d.linkClicks, 0); return l ? s / l : null; })() },
      daily: dailySeries,
      demographics: { rows: demoRows, totalReach, byGenderTotal, totalSpend: totalSpendDemo },
      adsets: adsetsOut,
      ads,
    };
    CACHE.set(cacheKey, { at: Date.now(), data });
    return Response.json(data, { headers: cacheHeaders });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Pauta campaign API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
