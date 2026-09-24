import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const BRAND_RE = { axxis: /a+x+i+s/, diners: /din+ers?/ };
const TRAFFIC_OBJECTIVES = ['OUTCOME_TRAFFIC', 'LINK_CLICKS'];

const CACHE = new Map();
const TTL = 30 * 60 * 1000;

async function paged(url, params) {
  let res = await axios.get(url, { params });
  let data = res.data.data || [];
  for (let i = 0; i < 6 && res.data.paging?.next; i += 1) {
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

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const limit = Math.min(Number(url.searchParams.get('limit')) || 10, 20);
    const cacheKey = `${brand}|${range.start}|${range.end}|${limit}`;
    const hit = CACHE.get(cacheKey);
    const cacheHeaders = { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' };
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true }, { headers: cacheHeaders });

    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');
    const accounts = await paged('https://graph.facebook.com/v19.0/me/adaccounts', { fields: 'id,name,currency', limit: 50, access_token: token });

    const ads = [];
    for (const account of accounts) {
      // eslint-disable-next-line no-await-in-loop
      const campaigns = await paged(`https://graph.facebook.com/v19.0/${account.id}/campaigns`, {
        fields: 'id,name,objective',
        filtering: JSON.stringify([{ field: 'objective', operator: 'IN', value: TRAFFIC_OBJECTIVES }]),
        limit: 500,
        access_token: token,
      }).catch(() => []);
      const ids = campaigns.filter((c) => BRAND_RE[brand].test(norm(c.name))).map((c) => c.id);
      if (!ids.length) continue;
      // eslint-disable-next-line no-await-in-loop
      const rows = await paged(`https://graph.facebook.com/v19.0/${account.id}/insights`, {
        level: 'ad',
        fields: 'ad_id,ad_name,campaign_name,spend,impressions,reach,frequency,cpm,cpc,inline_link_clicks,actions,video_play_actions,video_avg_time_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions,video_thruplay_watched_actions',
        time_range: JSON.stringify({ since: range.start, until: range.end }),
        filtering: JSON.stringify([{ field: 'campaign.id', operator: 'IN', value: ids }]),
        limit: 500,
        access_token: token,
      });
      rows.forEach((r) => ads.push({ account, r }));
    }

    const top = ads.sort((a, b) => Number(b.r.spend || 0) - Number(a.r.spend || 0)).slice(0, limit);
    if (!top.length) {
      const empty = { range, brand, ads: [], currency: accounts[0]?.currency || 'COP' };
      CACHE.set(cacheKey, { at: Date.now(), data: empty });
      return Response.json(empty, { headers: cacheHeaders });
    }

    const adIds = top.map((x) => x.r.ad_id);
    const [creatives, ageRows] = await Promise.all([
      // creativos por cuenta (el parámetro ids ya no se acepta en versiones nuevas de la API)
      Promise.all([...new Set(top.map((x) => x.account.id))].map((accId) => paged(`https://graph.facebook.com/v19.0/${accId}/ads`, {
        fields: 'id,creative.thumbnail_width(480).thumbnail_height(480){thumbnail_url,image_url,body,title,video_id,object_story_spec}',
        filtering: JSON.stringify([{ field: 'id', operator: 'IN', value: top.filter((x) => x.account.id === accId).map((x) => x.r.ad_id) }]),
        limit: 100,
        access_token: token,
      }).catch(() => []))).then((lists) => Object.fromEntries(lists.flat().map((ad) => [ad.id, ad]))),
      // la edad se pide por cuenta (los anuncios pueden estar en cuentas distintas)
      Promise.all([...new Set(top.map((x) => x.account.id))].map((accId) => paged(`https://graph.facebook.com/v19.0/${accId}/insights`, {
        level: 'ad',
        breakdowns: 'age',
        fields: 'ad_id,reach',
        time_range: JSON.stringify({ since: range.start, until: range.end }),
        filtering: JSON.stringify([{ field: 'ad.id', operator: 'IN', value: top.filter((x) => x.account.id === accId).map((x) => x.r.ad_id) }]),
        limit: 500,
        access_token: token,
      }).catch(() => []))).then((lists) => lists.flat()),
    ]);

    const ageByAd = {};
    ageRows.forEach((row) => {
      ageByAd[row.ad_id] = ageByAd[row.ad_id] || [];
      ageByAd[row.ad_id].push({ age: row.age, reach: Number(row.reach || 0) });
    });

    const out = top.map(({ account, r }) => {
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
        campaign: r.campaign_name,
        image: cr.thumbnail_url || cr.image_url || null,
        fullImage: cr.image_url || null,
        isVideo: Boolean(cr.video_id),
        headline,
        text,
        currency: account.currency,
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
        thruplays: first(r.video_thruplay_watched_actions),
        retention: { p25: p(r.video_p25_watched_actions), p50: p(r.video_p50_watched_actions), p75: p(r.video_p75_watched_actions), p100: p(r.video_p100_watched_actions) },
        profileVisits: sumMatching(r.actions, /profile_visit|profile_view/i),
        igFollows: sumMatching(r.actions, /follow/i),
        age: ageList.map((x) => ({ age: x.age, pct: ageTotal ? x.reach / ageTotal : 0 })),
      };
    });

    const data = { range, brand, ads: out, currency: out[0]?.currency || 'COP' };
    CACHE.set(cacheKey, { at: Date.now(), data });
    return Response.json(data, { headers: cacheHeaders });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Pauta trafico API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
