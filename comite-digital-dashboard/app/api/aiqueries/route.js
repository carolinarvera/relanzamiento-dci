import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { getAccessToken } from '../../lib/ga4';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const iso = (d) => d.toISOString().slice(0, 10);
const CACHE = new Map();

// Las IA no envían lo que escribió el usuario. Se aproxima con las consultas de Google
// que llevan a las mismas páginas a las que llegan las visitas desde asistentes de IA.
async function pageQueries(token, siteUrl, url, startDate, endDate) {
  const res = await axios.post(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { startDate, endDate, dimensions: ['query'], rowLimit: 8, dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: url }] }] },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return (res.data.rows || []).map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position }));
}

export async function GET(request) {
  try {
    const u = new URL(request.url);
    const brand = u.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const paths = (u.searchParams.get('paths') || '').split('|').filter((p) => p.startsWith('/')).slice(0, 8);
    const range = resolveRange(u.searchParams);
    const key = `${brand}|${range.start}|${range.end}|${paths.join('|')}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < 30 * 60 * 1000) return Response.json(hit.data);
    const siteUrl = brand === 'diners' ? process.env.GSC_DINERS_URL : process.env.GSC_AXXIS_URL;
    const origin = new URL(siteUrl.startsWith('sc-domain:') ? `https://${siteUrl.slice(10)}` : siteUrl).origin;
    const lag = iso(new Date(Date.now() - 3 * 86400000));
    const end = range.end > lag ? lag : range.end;
    const start = range.start > end ? end : range.start;
    const token = await getAccessToken();
    const perPage = await Promise.all(paths.map(async (path) => {
      const full = `${origin}${path.endsWith('/') ? path : `${path}/`}`;
      const rows = await pageQueries(token, siteUrl, full, start, end).catch(() => []);
      return { path, queries: rows };
    }));
    const merged = {};
    perPage.forEach((p) => p.queries.forEach((q) => {
      const m = merged[q.query] || (merged[q.query] = { query: q.query, clicks: 0, impressions: 0, posW: 0, pages: new Set() });
      m.clicks += q.clicks; m.impressions += q.impressions; m.posW += q.position * q.impressions; m.pages.add(p.path);
    }));
    const queries = Object.values(merged)
      .map((m) => ({ query: m.query, clicks: m.clicks, impressions: m.impressions, position: m.impressions ? m.posW / m.impressions : null, pages: m.pages.size }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
      .slice(0, 15);
    const data = { range: { start, end }, queries, perPage };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    return Response.json({ error: detail }, { status: 502 });
  }
}
