import axios from 'axios';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Mejores horas y días: publicaciones orgánicas (Facebook e Instagram, últimos 180 días) y entrega de pauta por hora (últimos 30 días).
const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=3600, stale-while-revalidate=21600' };
const CACHE = new Map();
const iso = (d) => d.toISOString().slice(0, 10);
const BRAND_RE = { axxis: /a+x+i+s/, diners: /din+ers?/ };
const DOW = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

async function paged(url, params, maxPages = 5) {
  let res = await axios.get(url, { params });
  let data = res.data.data || [];
  for (let i = 0; i < maxPages && res.data.paging?.next; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    res = await axios.get(res.data.paging.next);
    data = data.concat(res.data.data || []);
  }
  return data;
}

function bucket(list, minN) {
  const byH = {}; const byD = {};
  list.forEach((p) => {
    const d = new Date(Date.parse(p.at) - 5 * 3600000); // hora de Bogotá (UTC-5, sin horario de verano)
    const h = d.getUTCHours(); const wd = d.getUTCDay();
    (byH[h] = byH[h] || { n: 0, sum: 0 }); byH[h].n += 1; byH[h].sum += p.eng;
    (byD[wd] = byD[wd] || { n: 0, sum: 0 }); byD[wd].n += 1; byD[wd].sum += p.eng;
  });
  const hours = Object.entries(byH).map(([h, v]) => ({ hour: Number(h), n: v.n, avg: v.sum / v.n })).filter((x) => x.n >= minN).sort((a, b) => b.avg - a.avg);
  const days = Object.entries(byD).map(([d, v]) => ({ day: DOW[d], n: v.n, avg: v.sum / v.n })).filter((x) => x.n >= minN).sort((a, b) => b.avg - a.avg);
  return { n: list.length, hours: hours.slice(0, 4), days: days.slice(0, 3), worstDays: days.slice(-2).reverse() };
}

export async function GET(request) {
  try {
    const brand = new URL(request.url).searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const hit = CACHE.get(brand);
    if (hit && Date.now() - hit.at < 3 * 3600000) return Response.json(hit.data, { headers: CORS });
    const U = process.env.META_ACCESS_TOKEN;
    const fbId = brand === 'axxis' ? process.env.META_AXXIS_FB_PAGE_ID : process.env.META_DINERS_FB_PAGE_ID;
    const igId = brand === 'axxis' ? process.env.META_AXXIS_PAGE_ID : process.env.META_DINERS_PAGE_ID;
    const cutoff = Date.now() - 180 * 86400000;
    const acc = (await axios.get('https://graph.facebook.com/v19.0/me/accounts', { params: { access_token: U } })).data.data || [];
    const pageTok = acc.find((p) => p.id === fbId)?.access_token || U;

    const [fbRaw, igRaw, adAccounts] = await Promise.all([
      paged(`https://graph.facebook.com/v19.0/${fbId}/posts`, { fields: 'created_time,reactions.summary(true).limit(0),comments.summary(true).limit(0),shares,status_type', limit: 100, access_token: pageTok }, 4).catch(() => []),
      paged(`https://graph.facebook.com/v19.0/${igId}/media`, { fields: 'timestamp,like_count,comments_count,media_type,media_product_type', limit: 100, access_token: U }, 4).catch(() => []),
      paged('https://graph.facebook.com/v19.0/me/adaccounts', { fields: 'id', limit: 50, access_token: U }, 1).catch(() => []),
    ]);
    const fb = fbRaw.filter((p) => Date.parse(p.created_time) >= cutoff).map((p) => ({ at: p.created_time, eng: (p.reactions?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) + (p.shares?.count || 0) }));
    const ig = igRaw.filter((m) => m.timestamp && Date.parse(m.timestamp) >= cutoff).map((m) => ({ at: m.timestamp, eng: (m.like_count || 0) + (m.comments_count || 0), type: m.media_product_type === 'REELS' ? 'Reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : m.media_type === 'VIDEO' ? 'Video' : 'Imagen' }));
    const igTypes = {};
    ig.forEach((m) => { (igTypes[m.type] = igTypes[m.type] || { n: 0, sum: 0 }); igTypes[m.type].n += 1; igTypes[m.type].sum += m.eng; });

    // Pauta por hora (zona horaria de la cuenta de anuncios, Bogotá)
    const since = iso(new Date(Date.now() - 30 * 86400000)); const until = iso(new Date(Date.now() - 86400000));
    const hourly = {};
    await Promise.all(adAccounts.map(async (a) => {
      const rows = await paged(`https://graph.facebook.com/v19.0/${a.id}/insights`, { level: 'campaign', fields: 'campaign_name,spend,impressions,inline_link_clicks', breakdowns: 'hourly_stats_aggregated_by_advertiser_time_zone', time_range: JSON.stringify({ since, until }), limit: 500, access_token: U }, 6).catch(() => []);
      rows.forEach((r) => {
        if (!BRAND_RE[brand].test((r.campaign_name || '').toLowerCase())) return;
        const h = parseInt(String(r.hourly_stats_aggregated_by_advertiser_time_zone).split(':')[0], 10);
        const o = (hourly[h] = hourly[h] || { spend: 0, clicks: 0, imp: 0 });
        o.spend += Number(r.spend || 0); o.clicks += Number(r.inline_link_clicks || 0); o.imp += Number(r.impressions || 0);
      });
    }));
    const hrs = Object.entries(hourly).map(([h, v]) => ({ hour: Number(h), cpc: v.clicks ? v.spend / v.clicks : null, spend: v.spend, clicks: v.clicks, ctr: v.imp ? v.clicks / v.imp : null })).sort((a, b) => a.hour - b.hour);
    const totSpend = hrs.reduce((a, x) => a + x.spend, 0); const totClicks = hrs.reduce((a, x) => a + x.clicks, 0);
    const avgCpc = totClicks ? totSpend / totClicks : null;
    const ok = hrs.filter((x) => x.clicks >= 100 && x.cpc);
    const ads = {
      range: { since, until }, avgCpc,
      best: ok.slice().sort((a, b) => a.cpc - b.cpc).slice(0, 4).map((x) => ({ hour: x.hour, cpc: x.cpc, ctr: x.ctr })),
      worst: ok.slice().sort((a, b) => b.cpc - a.cpc).slice(0, 4).map((x) => ({ hour: x.hour, cpc: x.cpc, spendShare: totSpend ? x.spend / totSpend : 0 })),
      // gasto en horas de madrugada (0 a 5) y su CPC frente al promedio
      overnight: (() => { const o = hrs.filter((x) => x.hour <= 5); const s = o.reduce((a, x) => a + x.spend, 0); const c = o.reduce((a, x) => a + x.clicks, 0); return { spendShare: totSpend ? s / totSpend : 0, cpc: c ? s / c : null }; })(),
    };
    const data = {
      brand, fetchedAt: new Date().toISOString(),
      facebook: bucket(fb, 10), instagram: bucket(ig, 10),
      igTypes: Object.entries(igTypes).map(([k, v]) => ({ type: k, n: v.n, avg: v.sum / v.n })).filter((x) => x.n >= 5).sort((a, b) => b.avg - a.avg),
      ads,
    };
    CACHE.set(brand, { at: Date.now(), data });
    return Response.json(data, { headers: CORS });
  } catch (e) {
    return Response.json({ error: e.response?.data?.error?.message || e.message }, { status: 502, headers: CORS });
  }
}
