import axios from 'axios';
import { getAccessToken, runReport } from '../../lib/ga4';
import semrush from '../../lib/semrush.json';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=1800, stale-while-revalidate=7200' };
const CACHE = new Map();
const DAY = 86400000;
const iso = (d) => d.toISOString().slice(0, 10);
const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const BRAND = { axxis: ['axxis', 'axis', 'axsis'], diners: ['diners', 'dinners'] };
const SITE_NAME = /\s*[|\-–—]\s*(revista\s+)?(axxis|diners)[^|]*$/i;
const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };
const cut = (t, n) => { const s = String(t || '').replace(/\s+/g, ' ').trim(); return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s; };
const QUESTION = /^(como|que|cual|cuales|cuanto|cuanta|donde|cuando|por que|quien|mejores|mejor|ideas|tendencias|tipos|para que|vale la pena)\b/;

async function gscToken() {
  const res = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
    grant_type: 'refresh_token', client_id: process.env.GA4_OAUTH_CLIENT_ID, client_secret: process.env.GA4_OAUTH_CLIENT_SECRET, refresh_token: process.env.GA4_OAUTH_REFRESH_TOKEN,
  }));
  return res.data.access_token;
}

async function gscRows(token, site, start, end) {
  const res = await axios.post(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    { startDate: start, endDate: end, dimensions: ['query', 'page'], rowLimit: 25000 }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.rows || [];
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const hit = CACHE.get(brand);
    if (hit && Date.now() - hit.at < 20 * 60 * 1000) return Response.json(hit.data, { headers: CORS });
    const prop = brand === 'axxis' ? process.env.GA4_AXXIS_ID : process.env.GA4_DINERS_ID;
    const site = brand === 'axxis' ? process.env.GSC_AXXIS_URL : process.env.GSC_DINERS_URL;
    const origin = new URL(site.startsWith('sc-domain:') ? `https://${site.slice(10)}` : site).origin;
    const now = Date.now();
    const end = iso(new Date(now - DAY)), start = iso(new Date(now - 30 * DAY));
    const pEnd = iso(new Date(now - 31 * DAY)), pStart = iso(new Date(now - 60 * DAY));
    const gEnd = iso(new Date(now - 3 * DAY));

    const [gtoken, token] = await Promise.all([gscToken(), getAccessToken()]);
    const pageMetrics = [{ name: 'screenPageViews' }, { name: 'userEngagementDuration' }, { name: 'activeUsers' }];
    const [gsc, cur, prev, ai] = await Promise.all([
      gscRows(gtoken, site, start, gEnd).catch(() => []),
      runReport(token, prop, { dateRanges: [{ startDate: start, endDate: end }], dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }], metrics: pageMetrics, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 3000 }).catch(() => []),
      runReport(token, prop, { dateRanges: [{ startDate: pStart, endDate: pEnd }], dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], limit: 5000 }).catch(() => []),
      runReport(token, prop, { dateRanges: [{ startDate: start, endDate: end }], dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }, { name: 'sessionSource' }], metrics: [{ name: 'sessions' }], dimensionFilter: { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { value: 'AI Assistant' } } }, limit: 500 }).catch(() => []),
    ]);

    const title = new Map(); const pages = [];
    cur.forEach((r) => {
      const p = r.dimensionValues[0].value; const t = r.dimensionValues[1].value.replace(SITE_NAME, '').trim();
      const v = Number(r.metricValues[0].value); const u = Number(r.metricValues[2].value) || 1;
      if (!/^\/[^/]+\/[^/]+\/?$/.test(p) || /^\/(tag|author|page|category|busqueda|search|wp-)/i.test(p)) return; // solo notas dentro de una sección
      if (!title.has(p)) title.set(p, t);
      pages.push({ path: p, title: t, views: v, read: Number(r.metricValues[1].value) / u, section: p.split('/')[1] });
    });
    const T = (p) => title.get(p) || p;
    const link = (p) => `${origin}${p}`;

    // Consultas editoriales por página (sin marca ni navegacionales)
    const isBrand = (q) => BRAND[brand].some((b) => norm(q).includes(b)) || /www|http|\.com/.test(q);
    const byPage = new Map(); const byQuery = new Map();
    gsc.forEach((r) => {
      const q = r.keys[0]; if (isBrand(q)) return;
      const p = pathOf(r.keys[1]);
      const row = { q, p, clicks: r.clicks, imp: r.impressions, pos: r.position };
      (byPage.get(p) || byPage.set(p, []).get(p)).push(row);
      const cur0 = byQuery.get(q);
      if (!cur0 || row.imp > cur0.imp) byQuery.set(q, { ...row, totalImp: (cur0 ? cur0.totalImp : 0) + row.imp }); else cur0.totalImp += row.imp;
    });
    const topQ = (p, n = 3) => (byPage.get(p) || []).slice().sort((a, b) => b.imp - a.imp).slice(0, n).map((x) => x.q);

    // 1) Refrescar: consultas con demanda en posición 6 a 20
    const opp = [...byQuery.values()].filter((r) => r.totalImp >= 80 && r.pos >= 6 && r.pos <= 20).sort((a, b) => b.totalImp - a.totalImp);
    const seen = new Set(); const refresh = [];
    opp.forEach((o) => { if (refresh.length < 5 && !seen.has(o.p)) { seen.add(o.p); refresh.push(o); } });
    const refreshRows = refresh.map((o) => {
      const t = T(o.p); const has = norm(t).includes(norm(o.q));
      return {
        title: t, url: link(o.p), query: o.q, impressions: o.totalImp, position: Math.round(o.pos * 10) / 10,
        suggestion: `${norm(t).startsWith(norm(o.q)) ? 'El título ya empieza con la consulta: el ajuste está en la descripción y en los enlaces internos.' : has ? `Mover la consulta al inicio del título: «${cap(o.q)}: ${cut(t.replace(new RegExp(o.q, 'i'), '').replace(/^[\s:,\-–]+/, ''), 60)}».` : `Título sugerido: «${cap(o.q)}: ${cut(t, 70)}».`} Responder "${o.q}" en la primera frase, sumar un dato o fecha reciente y enlazarla desde 3 notas de ${(pages.find((x) => x.path === o.p) || {}).section || 'la misma sección'}.`,
      };
    });

    // 2) Sección que más crece
    const prevBySection = {}; prev.forEach((r) => { const s = r.dimensionValues[0].value.split('/')[1]; prevBySection[s] = (prevBySection[s] || 0) + Number(r.metricValues[0].value); });
    const curBySection = {}; pages.forEach((x) => { curBySection[x.section] = (curBySection[x.section] || 0) + x.views; });
    const sec = Object.keys(curBySection).filter((s) => curBySection[s] >= 1000 && prevBySection[s] >= 500).map((s) => ({ s, views: curBySection[s], change: curBySection[s] / prevBySection[s] - 1 })).sort((a, b) => b.change - a.change)[0];
    const growthRows = sec ? pages.filter((x) => x.section === sec.s).sort((a, b) => b.views - a.views).slice(0, 5).map((x) => {
      const k = topQ(x.path, 3);
      return {
        title: x.title, url: link(x.path), views: x.views, keywords: k,
        suggestion: k.length ? `Publicar una nota hermana con la consulta "${k[0]}" en el título${k[1] ? ` y "${k[1]}" en el primer subtítulo` : ''}, con otro ángulo (lista, guía o caso) y enlace a esta nota. Descripción de 150 caracteres que responda la consulta.` : `Sin consultas en Google todavía: reescribir el título con el nombre propio y el lugar, y publicar una nota hermana de la misma sección con ese tema.`,
      };
    }) : [];

    // 0) Contenido nuevo: demanda propia (Search Console, donde casi no aparecemos) cruzada con lo que publica la competencia
    const refreshQ = new Set(refresh.map((o) => o.q));
    const REL = brand === 'axxis'
      ? /arquitect|dise[nñ]|casa|apartamento|interior|decor|mueble|cocina|ba[nñ]o|jard|paisaj|edific|vivienda|proyecto|remodel|museo|parque|hotel|oficina|estudio|colecci|material|sala|habitaci|fachada|plaza|torre|centro|barrio/
      : /restaurante|gastron|chef|cocina|vino|bar|caf[eé]|viaj|hotel|destino|playa|cine|serie|pel[ií]cula|m[uú]sica|concierto|libro|moda|reloj|joya|belleza|salud|tecnolog|festival|exposici/;
    const seenStem = new Set();
    const pool0 = [...byQuery.values()].filter((r) => r.totalImp >= 60 && r.pos > 12 && !refreshQ.has(r.q) && !QUESTION.test(norm(r.q)) && norm(r.q).split(' ').length >= 2 && REL.test(norm(r.q)))
      .sort((a, b) => b.totalImp - a.totalImp).filter((r) => { const k = norm(r.q).split(' ')[0]; if (seenStem.has(k)) return false; seenStem.add(k); return true; }).slice(0, 10);
    const news = await Promise.all(pool0.map((r) => axios.get(`https://news.google.com/rss/search?q=${encodeURIComponent(`"${r.q}" when:30d`)}&hl=es-419&gl=CO&ceid=CO:es-419`, { timeout: 12000, responseType: 'text', headers: { 'User-Agent': 'Mozilla/5.0' } }).then((x) => [...String(x.data).matchAll(/<item>(.*?)<\/item>/gs)].map((m) => { const t = /<title>(.*?)<\/title>/s.exec(m[1])?.[1] || ''; const clean = t.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); const i = clean.lastIndexOf(' - '); return { title: i > 0 ? clean.slice(0, i) : clean, source: i > 0 ? clean.slice(i + 3) : '' }; }).filter((n) => !/axxis|diners/i.test(n.source)).slice(0, 20)).catch(() => [])));
    const angle = (q) => {
      const n = norm(q);
      if (brand === 'diners') {
        if (/restaurante|bar\b|caf[eé]|brunch|pizzeria/.test(n)) return `${cap(q)}: 10 lugares con nombre propio y qué pedir`;
        if (/pelicula|serie|cine|documental/.test(n)) return `${cap(q)}: reparto, trama y dónde verla`;
        if (/barrio|festival|hotel|museo|parque|exposici|concierto/.test(n)) return `${cap(q)}: historia, datos y por qué ir`;
        return `${cap(q)}: guía con datos y ejemplos`;
      }
      if (/casa|apartamento|interior|decor|mueble|cocina|ba[nñ]o|sala|habitaci|remodel/.test(n)) return `${cap(q)}: 10 ideas de diseñadores colombianos`;
      if (/museo|parque|plaza|torre|centro|barrio|edific|hotel|proyecto|estudio|fachada/.test(n)) return `${cap(q)}: historia, autor y por qué visitarlo`;
      return `${cap(q)}: guía con ejemplos colombianos`;
    };
    const BR = brand === 'axxis' ? 'Revista AXXIS' : 'Revista Diners';
    const relevant = (q, n) => norm(q).split(' ').filter((t) => t.length >= 4).every((t) => norm(n.title).includes(t));
    const newContentAuto = pool0.map((r, i) => {
      const toks = norm(r.q).split(' ').filter((t) => t.length >= 4);
      const comp = news[i].filter((n) => relevant(r.q, n));
      const related = [...byQuery.values()].filter((x) => x.q !== r.q && toks.length && toks.every((t) => norm(x.q).includes(t))).sort((a, b) => b.totalImp - a.totalImp).slice(0, 2).map((x) => x.q);
      const title = angle(r.q); const slug = norm(r.q).replace(/ /g, '-');
      const meta = `${cap(r.q)}: ${/ideas/.test(title) ? 'ideas, proyectos y nombres propios' : /historia/.test(title) ? 'historia, autor y datos clave' : 'ejemplos, nombres y datos'} del diseño colombiano. Lea más en ${BR}.`;
      return {
        query: r.q, impressions: r.totalImp, position: Math.round(r.pos * 10) / 10, competitors: comp.length, example: comp[0] || null, title, titleChars: title.length, meta, metaChars: meta.length, slug,
        keywords: [r.q, ...related], score: r.totalImp * (1 + Math.log(1 + comp.length)),
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
    // Con Semrush (volumen y dificultad en Colombia) la lista se arma con los temas de mayor búsqueda; Search Console aporta lo que ya tenemos
    const newContent = (semrush[brand] || []).length ? semrush[brand].map((x) => {
      const mine = byQuery.get(x.query) || byQuery.get(norm(x.query));
      const toks = norm(x.query).split(' ').filter((t) => t.length >= 4);
      const related = [...byQuery.values()].filter((y) => norm(y.q) !== norm(x.query) && toks.length && toks.every((t) => norm(y.q).includes(t))).sort((a, b) => b.totalImp - a.totalImp).slice(0, 2).map((y) => y.q);
      return {
        query: x.query, volume: x.volume, kd: x.kd, competitor: x.competitor, source: `Semrush, ${semrush.fetchedAt}`,
        impressions: mine ? mine.totalImp : 0, position: mine ? Math.round(mine.pos * 10) / 10 : null,
        title: x.title, titleChars: x.title.length, meta: x.meta, metaChars: x.meta.length, slug: norm(x.query).replace(/ /g, '-'),
        keywords: [x.query, ...related],
      };
    }) : newContentAuto;

    // 3) Alargar la sesión desde las notas más leídas. Las notas de marca (contenido en alianza) solo se enlazan con notas editoriales.
    const brandCache = globalThis.__brandNote || (globalThis.__brandNote = new Map());
    const BRAND_TITLE = /presenta (su|sus)\b|nueva (l[ií]nea|colecci[oó]n)|lanza\b|nuevas posibilidades|^[A-ZÁÉÍÓÚ][\wÁÉÍÓÚáéíóúñ+&. ]{1,24}:\s/;
    const isBrandNote = async (path, ttl = '') => {
      if (BRAND_TITLE.test(ttl)) return true;
      const k = `${brand}${path}`; if (brandCache.has(k)) return brandCache.get(k);
      const slug = path.split('/').filter(Boolean).pop();
      const v = await axios.get(`${origin}/wp-json/wp/v2/posts`, { params: { slug, _fields: 'content' }, timeout: 15000 }).then((r) => {
        const txt = String(r.data?.[0]?.content?.rendered || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        if (!txt) return null;
        return /(para m[aá]s informaci[oó]n|m[aá]s informaci[oó]n:|www\.|\.com\.co|\.com\b|@[a-z0-9._]{3,})/i.test(txt.slice(-450));
      }).catch(() => null);
      if (v !== null) brandCache.set(k, v);
      return v;
    };
    const ranked = pages.slice().sort((a, b) => b.views - a.views);
    const bySec = {}; ranked.forEach((x) => { (bySec[x.section] = bySec[x.section] || []).push(x); });
    const cand = new Map(); ranked.slice(0, 14).forEach((x) => cand.set(x.path, x)); Object.values(bySec).forEach((l) => l.slice(0, 12).forEach((x) => cand.set(x.path, x)));
    const flags = new Map(); const queue = [...cand.keys()];
    await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) { const pth = queue.shift(); flags.set(pth, await isBrandNote(pth, cand.get(pth)?.title)); } }));
    const editorial = (x) => flags.get(x.path) === false; // solo cuenta como editorial lo verificado
    const topPages = ranked.filter(editorial).slice(0, 5); // las notas de alianza no aparecen en la lista
    const longRows = topPages.map((x) => {
      const same = (bySec[x.section] || []).filter((y) => y.path !== x.path && editorial(y));
      const rel = (same.length >= 2 ? same : ranked.filter((y) => y.path !== x.path && editorial(y))).slice(0, 2);
      const links = rel.length ? `«${cut(rel[0].title, 55)}»${rel[1] ? ` y «${cut(rel[1].title, 55)}»` : ''}` : '';
      return {
        title: x.title, url: link(x.path), views: x.views, readSec: Math.round(x.read), brandNote: false,
        suggestion: `${links ? `Enlazar dentro del texto (no al final) a ${links}, notas editoriales.` : 'Elegir 2 notas editoriales de la sección para enlazar dentro del texto.'} Cerrar con un bloque "Siga leyendo" también editorial y ${x.read < 30 ? 'abrir con un primer párrafo más corto: hoy se lee menos de 30 segundos' : 'subir una galería o dato visual a la mitad del texto'}.`,
      };
    });

    // 4) Notas a crear para que las cite la IA: preguntas con demanda
    const qs = [...byQuery.values()].filter((r) => QUESTION.test(norm(r.q)) && r.totalImp >= 30).sort((a, b) => b.totalImp - a.totalImp);
    const pool = qs.length >= 3 ? qs : [...qs, ...[...byQuery.values()].filter((r) => !QUESTION.test(norm(r.q)) && r.totalImp >= 80 && r.pos > 10).sort((a, b) => b.totalImp - a.totalImp)];
    const aiCreate = pool.slice(0, 5).map((r) => ({
      topic: cap(r.q), impressions: r.totalImp, position: Math.round(r.pos * 10) / 10, keywords: [r.q, ...topQ(r.p, 2).filter((x) => x !== r.q)].slice(0, 3),
      suggestion: `Nota nueva titulada «${cap(r.q)}${QUESTION.test(norm(r.q)) ? '' : ': guía con datos y ejemplos'}». Abrir con la respuesta en dos frases, seguir con una lista numerada, cerrar con 3 preguntas frecuentes y fecha de actualización. Usar ${r.q} y sus variantes en subtítulos.`,
    }));

    // 5) Notas a ajustar para que las cite la IA
    const aiBy = new Map(); ai.forEach((r) => { const p = r.dimensionValues[0].value; const o = aiBy.get(p) || { path: p, title: r.dimensionValues[1].value.replace(SITE_NAME, '').trim(), sessions: 0, sources: {} }; const n = Number(r.metricValues[0].value); o.sessions += n; const s = r.dimensionValues[2].value; o.sources[s] = (o.sources[s] || 0) + n; aiBy.set(p, o); });
    const aiPages = [...aiBy.values()].filter((x) => x.path !== '/').sort((a, b) => b.sessions - a.sessions).slice(0, 3);
    const aiAdjust = aiPages.map((x) => ({
      title: T(x.path) !== x.path ? T(x.path) : x.title, url: link(x.path), sessions: x.sessions, sources: Object.entries(x.sources).sort((a, b) => b[1] - a[1]).slice(0, 2).map((e) => e[0]),
      suggestion: `Abrir con la respuesta directa en las dos primeras frases; poner fecha de actualización visible; sumar datos citables (cifras, nombres, fechas); agregar 3 preguntas frecuentes con marcado FAQ y subtítulos en forma de pregunta${topQ(x.path, 1)[0] ? ` sobre "${topQ(x.path, 1)[0]}"` : ''}.`,
    }));
    const aiTotal = ai.reduce((a, r) => a + Number(r.metricValues[0].value), 0);

    const data = {
      brand, range: { start, end }, gscEnd: gEnd,
      refresh: refreshRows, growth: { section: sec ? { name: sec.s, views: sec.views, change: sec.change } : null, rows: growthRows },
      longSession: longRows, newContent, aiCreate, aiAdjust, aiSessions: aiTotal,
    };
    CACHE.set(brand, { at: Date.now(), data });
    return Response.json(data, { headers: CORS });
  } catch (e) {
    return Response.json({ error: e.response?.data?.error?.message || e.message }, { status: 502, headers: CORS });
  }
}
