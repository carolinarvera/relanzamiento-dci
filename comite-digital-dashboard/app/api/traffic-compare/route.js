import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { getAccessToken } from '../../lib/seoaudit';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DUP_FROM = '2026-10-08'; // desde esta fecha GA4 duplica page_view
const DUP_TO = '2026-10-20'; // el 21 de octubre se ajustó la etiqueta
const DUP_BASE = { start: '2026-09-08', end: '2026-10-07' };
const PROPS = { axxis: 'GA4_AXXIS_ID', diners: 'GA4_DINERS_ID' };
const CACHE = new Map();
const TTL = 20 * 60 * 1000;
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const iso = (d) => d.toISOString().slice(0, 10);
const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
function shift(dateStr, months) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = ((total % 12) + 12) % 12;
  return `${ny}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(d, daysIn(ny, nm))).padStart(2, '0')}`;
}
function labelRange(a, b) {
  const [ya, ma, da] = a.split('-').map(Number);
  const [yb, mb, db] = b.split('-').map(Number);
  if (ya === yb && ma === mb) return `${da} al ${db} de ${MESES[mb - 1]} de ${yb}`;
  if (ya === yb) return `${da} de ${MESES[ma - 1]} al ${db} de ${MESES[mb - 1]} de ${yb}`;
  return `${da} de ${MESES[ma - 1]} de ${ya} al ${db} de ${MESES[mb - 1]} de ${yb}`;
}

// Tráfico total del sitio (todos los canales) por día: periodo actual, mismo rango del mes anterior y del año anterior
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const key = `${brand}|${range.start}|${range.end}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

    const propertyId = process.env[PROPS[brand]];
    const token = await getAccessToken();
    const today = iso(new Date());
    const end = range.end > today ? today : range.end;
    const dayCount = Math.round((Date.parse(end) - Date.parse(range.start)) / 86400000) + 1;
    const addDays = (d, n) => iso(new Date(Date.parse(d) + n * 86400000)).replace(/-/g, '');
    const cutEnd = (start) => iso(new Date(Date.parse(start) + (dayCount - 1) * 86400000));

    const periods = [
      { key: 'cur', start: range.start, end },
      { key: 'prevMonth', start: shift(range.start, -1) },
      { key: 'prevYear', start: shift(range.start, -12) },
    ].map((p) => ({ ...p, end: p.end || cutEnd(p.start) }));

    const post = async (body) => (await axios.post(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      body,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 },
    ).catch(() => ({ data: {} }))).data.rows || [];

    // Páginas por sesión de cada canal ANTES del page_view duplicado (8 sep a 7 oct 2026), para estimar vistas reales
    const baseRows = await post({ dateRanges: [{ startDate: DUP_BASE.start, endDate: DUP_BASE.end }], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }], limit: 50 });
    const ratio = {};
    let bs = 0; let bv = 0;
    baseRows.forEach((r) => { const se = Number(r.metricValues[0].value); const vi = Number(r.metricValues[1].value); ratio[r.dimensionValues[0].value] = se ? vi / se : 0; bs += se; bv += vi; });
    const avgRatio = bs ? bv / bs : 0;

    const compared = await Promise.all(periods.map(async (pd) => {
      const rows = await post({ dateRanges: [{ startDate: pd.start, endDate: pd.end }], dimensions: [{ name: 'date' }, { name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }], limit: 10000 });
      const byDate = {};
      rows.forEach((r) => {
        const d = r.dimensionValues[0].value;
        const ch = r.dimensionValues[1].value;
        const vi = Number(r.metricValues[0].value);
        const se = Number(r.metricValues[1].value);
        const dup = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` >= DUP_FROM && `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` <= DUP_TO;
        const est = dup ? se * (ratio[ch] || avgRatio) : vi;
        const x = byDate[d] || { views: 0, sessions: 0, viewsEst: 0 };
        x.views += vi; x.sessions += se; x.viewsEst += est;
        byDate[d] = x;
      });
      Object.values(byDate).forEach((x) => { x.viewsEst = Math.round(x.viewsEst); });
      return { ...pd, label: labelRange(pd.start, pd.end), byDate };
    }));

    const data = {
      brand, dupFrom: DUP_FROM, dupTo: DUP_TO,
      periods: compared.map((c) => {
        const vals = Object.values(c.byDate);
        return { key: c.key, label: c.label, start: c.start, end: c.end, views: vals.reduce((a, v) => a + v.views, 0), viewsEst: vals.reduce((a, v) => a + v.viewsEst, 0), sessions: vals.reduce((a, v) => a + v.sessions, 0), hasData: vals.length > 0 };
      }),
      points: Array.from({ length: dayCount }, (_, i) => {
        const pt = { day: i + 1 };
        compared.forEach((c) => {
          const v = c.byDate[addDays(c.start, i)];
          pt[`${c.key}Views`] = v ? v.views : null;
          pt[`${c.key}Sessions`] = v ? v.sessions : null;
          pt[`${c.key}ViewsEst`] = v ? v.viewsEst : null;
        });
        return pt;
      }),
    };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Traffic compare API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
