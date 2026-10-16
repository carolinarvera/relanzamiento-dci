import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SITES = { axxis: { site: 'https://revistaaxxis.com.co', prop: 'GA4_AXXIS_ID' }, diners: { site: 'https://revistadiners.com.co', prop: 'GA4_DINERS_ID' } };
const ERR_WORDS = ['404', 'not found', 'page not found', 'no encontrada', 'no encontrado'];
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => iso(new Date(Date.parse(s) + n * 86400000));
const CACHE = new Map();
const TTL = 30 * 60 * 1000;

const errFilter = { orGroup: { expressions: ERR_WORDS.map((v) => ({ filter: { fieldName: 'pageTitle', stringFilter: { matchType: 'CONTAINS', value: v, caseSensitive: false } } })) } };
const okFilter = { notExpression: errFilter };

async function getAccessToken() {
  const res = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.GA4_OAUTH_CLIENT_ID,
      client_secret: process.env.GA4_OAUTH_CLIENT_SECRET,
      refresh_token: process.env.GA4_OAUTH_REFRESH_TOKEN,
    }),
  );
  return res.data.access_token;
}

const trim = (p) => {
  let v = p;
  try { v = decodeURI(p); } catch { /* ruta ya decodificada */ }
  v = v.split('?')[0];
  return v.length > 1 ? v.replace(/\/+$/, '') : v;
};

async function paths(token, propertyId, startDate, endDate, filter, withTitle) {
  const res = await axios.post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      dateRanges: [{ startDate, endDate }],
      dimensions: withTitle ? [{ name: 'pagePath' }, { name: 'pageTitle' }] : [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: filter,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 250000,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const map = new Map();
  (res.data.rows || []).forEach((r) => {
    const p = trim(r.dimensionValues[0].value);
    const views = Number(r.metricValues[0].value || 0);
    const cur = map.get(p);
    if (cur) cur.views += views;
    else map.set(p, { path: p, title: withTitle ? r.dimensionValues[1].value : null, views });
  });
  return map;
}

async function published(site, startDate, endDate) {
  const out = [];
  for (let page = 1; page <= 10; page += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await axios.get(`${site}/wp-json/wp/v2/posts`, {
      params: { after: `${startDate}T00:00:00`, before: `${addDays(endDate, 1)}T00:00:00`, per_page: 100, page, _fields: 'link,date,title' },
      timeout: 20000,
      validateStatus: () => true,
    });
    if (res.status !== 200 || !Array.isArray(res.data)) break;
    res.data.forEach((p) => out.push({ path: trim(new URL(p.link).pathname), title: String(p.title?.rendered || '').replace(/<[^>]+>/g, ''), date: p.date.slice(0, 10) }));
    if (res.data.length < 100) break;
  }
  return out;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const cacheKey = `${brand}|${range.start}|${range.end}`;
    const hit = CACHE.get(cacheKey);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

    const { site, prop } = SITES[brand];
    const propertyId = process.env[prop];
    const token = await getAccessToken();
    const today = iso(new Date());
    const end = range.end > today ? today : range.end;
    const start = range.start;

    // dos tandas para no exceder las solicitudes simultáneas de GA4
    const [curErr, beforeErr] = await Promise.all([
      paths(token, propertyId, start, end, errFilter, true),
      paths(token, propertyId, addDays(start, -365), addDays(start, -1), errFilter, false),
    ]);
    const [okPeriod, ok90] = await Promise.all([
      paths(token, propertyId, start, end, okFilter, false),
      paths(token, propertyId, addDays(end, -89), end, okFilter, false),
    ]);
    const posts = await published(site, start, end).catch(() => []);

    // ---- 1 y 2: páginas creadas en el periodo y cuántas ya dan error ----
    const createdWithError = posts
      .filter((p) => curErr.has(p.path))
      .map((p) => ({ path: p.path, title: p.title, date: p.date, views: curErr.get(p.path).views }))
      .sort((a, b) => b.views - a.views);

    // ---- 3: todas las páginas con error (últimos 12 meses hasta el fin del periodo) ----
    const all = new Map(beforeErr);
    curErr.forEach((v, k) => { const prev = all.get(k); all.set(k, { path: k, views: (prev ? prev.views : 0) + v.views }); });

    // ---- 4: arregladas en el periodo: tenían error antes y ahora cargan bien ----
    const fixed = [...beforeErr.values()]
      .filter((p) => !curErr.has(p.path) && okPeriod.has(p.path))
      .map((p) => ({ path: p.path, viewsBefore: p.views, viewsNow: okPeriod.get(p.path).views }))
      .sort((a, b) => b.viewsBefore - a.viewsBefore);

    // ---- 5: pendientes: con error en 12 meses y sin verse cargando bien en los últimos 90 días ----
    const pending = [...all.values()]
      .filter((p) => !ok90.has(p.path))
      .map((p) => ({ path: p.path, views: p.views, inPeriod: curErr.has(p.path), viewsPeriod: curErr.has(p.path) ? curErr.get(p.path).views : 0 }))
      .sort((a, b) => b.viewsPeriod - a.viewsPeriod || b.views - a.views);

    const data = {
      brand,
      range: { start, end, label: range.label },
      windows: { allFrom: addDays(start, -365), working90From: addDays(end, -89) },
      published: posts.length,
      createdWithError: createdWithError.length,
      createdWithErrorPages: createdWithError.slice(0, 100),
      totalAll: all.size,
      fixedPeriod: fixed.length,
      fixedPeriodPages: fixed.slice(0, 100),
      pending: pending.length,
      pendingStillErroring: pending.filter((p) => p.inPeriod).length,
      pendingPages: pending.slice(0, 100),
      errorsInPeriod: curErr.size,
    };
    CACHE.set(cacheKey, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('SEO health API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
