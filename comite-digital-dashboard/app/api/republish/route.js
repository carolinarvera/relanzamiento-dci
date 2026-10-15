import axios from 'axios';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Artículos para republicar en redes: los que mejor resultado orgánico tuvieron (alcance y % de interacción sobre el alcance)
// en los últimos 180 días y que NO se publicaron en ninguna red en los últimos 60 días.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=3600, stale-while-revalidate=21600' };
const CACHE = new Map();
const DAY = 86400000;
const MIN_AGE_DAYS = 60; // solo artículos cuya última publicación en redes tiene más de 60 días
const SITE = { axxis: 'https://revistaaxxis.com.co', diners: 'https://revistadiners.com.co' };
const STOP = new Set('para como esta este estos estas desde entre sobre hacia donde cuando porque pero también conozca conoce link nuestra bio revista arquitectura fotografías fotografia cortesía'.split(' '));

const plain = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&#\d+;|&amp;|&quot;/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const decode = (t) => String(t || '').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const words = (t) => new Set(plain(t).split(' ').filter((w) => w.length >= 5 && !STOP.has(w)));
const normUrl = (u) => { try { const x = new URL(u); return `${x.origin}${x.pathname}`.replace(/\/?$/, '/'); } catch { return null; } };

async function pagedUrl(url, maxPages) {
  let data = [];
  let next = url;
  for (let i = 0; i < maxPages && next; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const r = await axios.get(next).catch(() => null);
    if (!r) break;
    data = data.concat(r.data.data || []);
    next = r.data.paging?.next || null;
  }
  return data;
}

const pctRank = (arr, v) => (arr.length ? arr.filter((x) => x <= v).length / arr.length : 0);

export async function GET(request) {
  try {
    const brand = new URL(request.url).searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const hit = CACHE.get(brand);
    if (hit && Date.now() - hit.at < 3 * 3600000) return Response.json(hit.data, { headers: CORS });
    const U = process.env.META_ACCESS_TOKEN;
    const fbId = brand === 'axxis' ? process.env.META_AXXIS_FB_PAGE_ID : process.env.META_DINERS_FB_PAGE_ID;
    const igId = brand === 'axxis' ? process.env.META_AXXIS_PAGE_ID : process.env.META_DINERS_PAGE_ID;
    const acc = (await axios.get('https://graph.facebook.com/v19.0/me/accounts', { params: { access_token: U } })).data.data || [];
    const pageTok = acc.find((p) => p.id === fbId)?.access_token || U;
    const now = Date.now();
    const origin = SITE[brand];

    // 1) Artículos publicados en el sitio (últimos ~210 días): título, enlace y fecha
    const wpUrl = (page) => `${origin}/wp-json/wp/v2/posts?per_page=100&page=${page}&after=${new Date(now - 210 * DAY).toISOString().slice(0, 19)}&_fields=id,link,title,date`;
    const wpPages = await Promise.all([1, 2, 3, 4].map((p) => axios.get(wpUrl(p), { timeout: 20000 }).then((r) => r.data).catch(() => [])));
    const articles = wpPages.flat().map((a) => ({ title: decode(a.title?.rendered), url: normUrl(a.link), date: a.date }));
    const byUrl = new Map(articles.map((a) => [a.url, a]));

    // 2) Facebook: publicaciones de enlace de los últimos 180 días, en 6 ventanas en paralelo
    const fbWin = Array.from({ length: 6 }, (_, i) => ({ since: Math.floor((now - (i + 1) * 30 * DAY) / 1000), until: Math.floor((now - i * 30 * DAY) / 1000) }));
    const fbParts = await Promise.all(fbWin.map((w) => pagedUrl(`https://graph.facebook.com/v19.0/${fbId}/posts?fields=id,created_time,permalink_url,status_type,reactions.summary(true).limit(0),comments.summary(true).limit(0),shares,attachments{unshimmed_url},insights.metric(post_total_media_view_unique,post_clicks)&since=${w.since}&until=${w.until}&limit=50&access_token=${pageTok}`, 3)));
    const fb = fbParts.flat().map((p) => {
      const link = normUrl(p.attachments?.data?.[0]?.unshimmed_url || '');
      // Meta devuelve la misma métrica por periodo (día, semana, vida): el acumulado es el mayor
      const ins = {};
      (p.insights?.data || []).forEach((d) => { ins[d.name] = Math.max(ins[d.name] || 0, d.values?.[0]?.value || 0); });
      const reach = ins.post_total_media_view_unique || 0;
      const inter = (p.reactions?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) + (p.shares?.count || 0);
      return { at: p.created_time, link, reach, inter, clicks: ins.post_clicks || 0, rate: reach ? inter / reach : null, permalink: p.permalink_url };
    }).filter((p) => p.link && p.link.startsWith(origin));

    // 3) Instagram: últimas publicaciones (180 días) con alcance e interacciones
    const igAll = await pagedUrl(`https://graph.facebook.com/v19.0/${igId}/media?fields=id,caption,permalink,timestamp,like_count,comments_count,media_type,media_product_type,insights.metric(reach,saved,shares,total_interactions)&limit=50&access_token=${U}`, 4);
    const ig = igAll.filter((m) => m.timestamp && now - Date.parse(m.timestamp) <= 180 * DAY).map((m) => {
      const ins = {};
      (m.insights?.data || []).forEach((d) => { ins[d.name] = Math.max(ins[d.name] || 0, d.values?.[0]?.value || 0); });
      const reach = ins.reach || 0;
      const inter = ins.total_interactions || ((m.like_count || 0) + (m.comments_count || 0));
      const type = m.media_product_type === 'REELS' ? 'Reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : m.media_type === 'VIDEO' ? 'Video' : 'Imagen';
      return { at: m.timestamp, caption: m.caption || '', reach, inter, saved: ins.saved || 0, rate: reach ? inter / reach : null, permalink: m.permalink, type };
    });
    // IG no trae el enlace: se asocia al artículo con más palabras clave en común, publicado hasta 10 días antes (o 3 después) de la publicación
    const artW = articles.map((a) => ({ a, w: words(a.title), t: Date.parse(a.date) }));
    ig.forEach((p) => {
      const cw = words(p.caption.split('\n')[0] + ' ' + p.caption.slice(0, 400));
      const t = Date.parse(p.at);
      let best = null;
      artW.forEach((x) => {
        if (t - x.t > 12 * DAY || x.t - t > 3 * DAY) return;
        let c = 0; x.w.forEach((w) => { if (cw.has(w)) c += 1; });
        const sc = x.w.size ? c / Math.min(x.w.size, 6) : 0;
        if (c >= 2 && (!best || sc > best.sc)) best = { sc, a: x.a };
      });
      p.link = best && best.sc >= 0.4 ? best.a.url : null;
    });

    // 4) Por artículo: mejor resultado por red y última vez publicado en cualquier red
    const byArt = new Map();
    const get = (u) => { if (!byArt.has(u)) byArt.set(u, { url: u, fb: null, ig: null, last: 0 }); return byArt.get(u); };
    fb.forEach((p) => { const o = get(p.link); o.last = Math.max(o.last, Date.parse(p.at)); if (p.reach >= 200 && (!o.fb || p.rate > o.fb.rate)) o.fb = p; });
    ig.filter((p) => p.link).forEach((p) => { const o = get(p.link); o.last = Math.max(o.last, Date.parse(p.at)); if (p.reach >= 200 && (!o.ig || p.rate > o.ig.rate)) o.ig = p; });
    const fbRates = fb.filter((p) => p.reach >= 200).map((p) => p.rate), fbReach = fb.filter((p) => p.reach >= 200).map((p) => p.reach);
    const igRates = ig.filter((p) => p.reach >= 200).map((p) => p.rate), igReach = ig.filter((p) => p.reach >= 200).map((p) => p.reach);
    const items = [];
    let excludedRecent = 0;
    byArt.forEach((o) => {
      const art = byUrl.get(o.url);
      if (!art) return;
      if (now - o.last < MIN_AGE_DAYS * DAY) { excludedRecent += 1; return; }
      const sFb = o.fb ? 0.5 * pctRank(fbRates, o.fb.rate) + 0.5 * pctRank(fbReach, o.fb.reach) : 0;
      const sIg = o.ig ? 0.5 * pctRank(igRates, o.ig.rate) + 0.5 * pctRank(igReach, o.ig.reach) : 0;
      const score = Math.max(sFb, sIg);
      if (score < 0.7) return;
      items.push({
        title: art.title, url: o.url, published: art.date, lastPosted: new Date(o.last).toISOString(), daysSince: Math.round((now - o.last) / DAY), score,
        fb: o.fb ? { at: o.fb.at, reach: o.fb.reach, rate: o.fb.rate, inter: o.fb.inter, clicks: o.fb.clicks, permalink: o.fb.permalink } : null,
        ig: o.ig ? { at: o.ig.at, reach: o.ig.reach, rate: o.ig.rate, inter: o.ig.inter, saved: o.ig.saved, type: o.ig.type, permalink: o.ig.permalink } : null,
      });
    });
    // Descarta también los que ya aparecen en publicaciones de Instagram del último mes sin enlace asociado (misma nota, otro texto)
    const recentIg = ig.filter((p) => now - Date.parse(p.at) < MIN_AGE_DAYS * DAY).map((p) => words(p.caption.slice(0, 500)));
    const fresh = items.filter((it) => { const tw = words(it.title); return !recentIg.some((cw) => { let c = 0; tw.forEach((w) => { if (cw.has(w)) c += 1; }); return c >= 3 && c / Math.max(tw.size, 1) >= 0.5; }); });
    excludedRecent += items.length - fresh.length;
    items.length = 0; fresh.forEach((x) => items.push(x));
    items.sort((a, b) => b.score - a.score);
    const data = {
      brand, fetchedAt: new Date().toISOString(),
      basis: { fbPosts: fb.length, igPosts: ig.length, igLinked: ig.filter((p) => p.link).length, articles: articles.length, excludedRecent, minReach: 200, windowDays: 180, noRepeatDays: MIN_AGE_DAYS },
      items: items.slice(0, 15),
    };
    CACHE.set(brand, { at: Date.now(), data });
    return Response.json(data, { headers: CORS });
  } catch (e) {
    return Response.json({ error: e.response?.data?.error?.message || e.message }, { status: 502, headers: CORS });
  }
}
