import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';

const iso = (d) => d.toISOString().slice(0, 10);

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

const BUCKETS = [
  { label: 'Posición 1-3', min: 0, max: 3.5 },
  { label: 'Posición 4-10', min: 3.5, max: 10.5 },
  { label: 'Posición 11-20', min: 10.5, max: 20.5 },
  { label: 'Posición 21-50', min: 20.5, max: 50.5 },
  { label: 'Posición 51+', min: 50.5, max: Infinity },
];

async function query(token, siteUrl, body) {
  const res = await axios.post(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.rows || [];
}

const shape = (r, key) => ({ key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });

async function buildSite(token, siteUrl, range) {
  const lagLimit = iso(new Date(Date.now() - 3 * 86400000));
  const endDate = range.end > lagLimit ? lagLimit : range.end;
  const startDate = range.start > endDate ? endDate : range.start;
  const base = { startDate, endDate };

  const [pages, topQueries, allQueries] = await Promise.all([
    query(token, siteUrl, { ...base, dimensions: ['page'], rowLimit: 10 }),
    query(token, siteUrl, { ...base, dimensions: ['query'], rowLimit: 10 }),
    query(token, siteUrl, { ...base, dimensions: ['query'], rowLimit: 25000 }),
  ]);

  const origin = new URL(siteUrl.startsWith('sc-domain:') ? `https://${siteUrl.slice(10)}` : siteUrl).origin;
  const byPosition = allQueries
    .filter((r) => r.impressions >= 100)
    .sort((a, b) => a.position - b.position)
    .slice(0, 10)
    .map((r) => shape(r, r.keys[0]));

  const buckets = BUCKETS.map((b) => {
    const rows = allQueries.filter((r) => r.position >= b.min && r.position < b.max);
    return {
      label: b.label,
      queries: rows.length,
      clicks: rows.reduce((a, r) => a + r.clicks, 0),
      impressions: rows.reduce((a, r) => a + r.impressions, 0),
    };
  });

  return {
    pages: pages.map((r) => shape(r, r.keys[0].replace(origin, '') || '/')),
    queries: topQueries.map((r) => shape(r, r.keys[0])),
    byPosition,
    buckets,
    totalQueries: allQueries.length,
    truncated: allQueries.length >= 25000,
  };
}

export async function GET(request) {
  try {
    const range = resolveRange(new URL(request.url).searchParams);
    const token = await getAccessToken();
    const [axxis, diners] = await Promise.all([
      buildSite(token, process.env.GSC_AXXIS_URL, range),
      buildSite(token, process.env.GSC_DINERS_URL, range),
    ]);
    return Response.json({ range, axxis, diners });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.response?.data?.error_description || error.message;
    console.error('SEO API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
