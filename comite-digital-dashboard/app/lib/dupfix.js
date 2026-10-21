import axios from 'axios';

// Desde esta fecha GA4 repite el evento page_view (4 a 8 veces). Las vistas se estiman con las
// páginas por sesión que tenía cada canal antes del problema; sesiones, usuarios y canales no cambian.
export const DUP_FROM = '2026-10-08';
export const DUP_TO = '2026-10-20'; // el 21 de octubre se ajustó la etiqueta: desde ese día las vistas son reales
const DUP_BASE = { start: '2026-09-08', end: '2026-10-07' };
const TTL = 20 * 60 * 1000;
const CACHE = new Map();
const iso = (d) => d.toISOString().slice(0, 10);

async function run(token, propertyId, body) {
  const res = await axios.post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    body,
    { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 },
  ).catch(() => ({ data: {} }));
  return res.data.rows || [];
}

// Factores de corrección: por día, por rango (actual y anterior) y por mes
export async function getDupFactors(token, propertyId, range) {
  const key = `${propertyId}|${range.start}|${range.end}|${range.prevStart}`;
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.f;
  const today = iso(new Date());
  const lastEnd = range.end > today ? today : range.end;
  const from = [range.start, range.prevStart].sort()[0];
  const to = [lastEnd, range.prevEnd].sort().reverse()[0];
  const f = { day: {}, month: {}, cur: 1, prev: 1, active: false };
  if (to < DUP_FROM || from > DUP_TO) { CACHE.set(key, { at: Date.now(), f }); return f; }

  const base = await run(token, propertyId, { dateRanges: [{ startDate: DUP_BASE.start, endDate: DUP_BASE.end }], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }], limit: 50 });
  const ratio = {};
  let bs = 0; let bv = 0;
  base.forEach((r) => { const se = Number(r.metricValues[0].value); const vi = Number(r.metricValues[1].value); ratio[r.dimensionValues[0].value] = se ? vi / se : 0; bs += se; bv += vi; });
  const avg = bs ? bv / bs : 0;

  const monthStart = `${DUP_FROM.slice(0, 7)}-01`;
  const rows = await run(token, propertyId, { dateRanges: [{ startDate: [from, monthStart].sort()[0], endDate: to }], dimensions: [{ name: 'date' }, { name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }], limit: 25000 });
  const byDay = {};
  rows.forEach((r) => {
    const d = r.dimensionValues[0].value;
    const ch = r.dimensionValues[1].value;
    const vi = Number(r.metricValues[0].value);
    const se = Number(r.metricValues[1].value);
    const dash = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
    const est = dash >= DUP_FROM && dash <= DUP_TO ? se * (ratio[ch] || avg) : vi;
    const x = byDay[d] || { v: 0, e: 0 };
    x.v += vi; x.e += est;
    byDay[d] = x;
  });
  const span = (a, b) => {
    let v = 0; let e = 0;
    Object.entries(byDay).forEach(([d, x]) => {
      const dash = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
      if (dash >= a && dash <= b) { v += x.v; e += x.e; }
    });
    return v ? e / v : 1;
  };
  Object.entries(byDay).forEach(([d, x]) => {
    f.day[d] = x.v ? x.e / x.v : 1;
    const mk = d.slice(0, 6);
    f.month[mk] = f.month[mk] || { v: 0, e: 0 };
    f.month[mk].v += x.v; f.month[mk].e += x.e;
  });
  Object.keys(f.month).forEach((k) => { f.month[k] = f.month[k].v ? f.month[k].e / f.month[k].v : 1; });
  f.cur = span(range.start, lastEnd);
  f.prev = span(range.prevStart, range.prevEnd);
  f.active = true;
  CACHE.set(key, { at: Date.now(), f });
  return f;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const CUR_KEYS = new Set(['views', 'vistas', 'pageviews', 'value']);
const PREV_KEYS = new Set(['viewsPrev', 'vistasPrev', 'prevViews']);
const CHANGE_KEYS = new Set(['viewsChange', 'pageviewsChange']);

// Corrige en sitio las vistas de la respuesta de GA4 de una marca
export function applyDupFix(data, f) {
  if (!f || !f.active) return data;
  const round = (n) => Math.round(n);
  const walk = (o, ctx) => {
    if (Array.isArray(o)) { o.forEach((x) => walk(x, ctx)); return; }
    if (!o || typeof o !== 'object') return;
    let c = ctx;
    if (typeof o.date === 'string' && /^\d{8}$/.test(o.date)) c = { factor: f.day[o.date] ?? 1 };
    else if (typeof o.month === 'string') {
      const [mes, y] = o.month.split(' ');
      const mi = MESES.indexOf(mes);
      if (mi >= 0 && y) c = { factor: f.month[`${y}${String(mi + 1).padStart(2, '0')}`] ?? 1 };
    }
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (typeof v === 'number') {
        if (CUR_KEYS.has(k) || k === 'vistas') o[k] = round(v * (c ? c.factor : f.cur));
        else if (PREV_KEYS.has(k)) o[k] = round(v * f.prev);
        else if (CHANGE_KEYS.has(k) || (k === 'change' && o.views !== undefined)) o[k] = f.prev ? (1 + v) * (f.cur / f.prev) - 1 : v;
      } else walk(v, c);
    });
  };
  walk(data, null);
  data.viewsCorrected = { from: DUP_FROM, to: DUP_TO, factor: Math.round(f.cur * 1000) / 1000 };
  return data;
}
