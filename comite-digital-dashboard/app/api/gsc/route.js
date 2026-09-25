import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { isMock, mockGsc } from '../../lib/mock';

export const dynamic = 'force-dynamic';

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

const iso = (d) => d.toISOString().slice(0, 10);

async function periodTotals(token, siteUrl, range) {
  const lagLimit = iso(new Date(Date.now() - 3 * 86400000));
  const endDate = range.end > lagLimit ? lagLimit : range.end;
  const startDate = range.start > endDate ? endDate : range.start;
  const res = await axios.post(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { startDate, endDate },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const row = res.data.rows?.[0] || {};
  return { clicks: row.clicks || 0, impressions: row.impressions || 0, ctr: row.ctr || 0, position: row.position || 0 };
}

const HOME_URL = { axxis: 'https://revistaaxxis.com.co/', diners: 'https://revistadiners.com.co/' };

async function homeTotals(token, siteUrl, homeUrl, range) {
  const one = async (r) => {
    const lagLimit = iso(new Date(Date.now() - 3 * 86400000));
    const endDate = r.end > lagLimit ? lagLimit : r.end;
    const startDate = r.start > endDate ? endDate : r.start;
    const res = await axios.post(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      { startDate, endDate, dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: homeUrl }] }] },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const row = res.data.rows?.[0] || {};
    return { clicks: row.clicks || 0, impressions: row.impressions || 0, ctr: row.ctr || 0, position: row.position || 0 };
  };
  const [cur, prev] = await Promise.all([one(range), one({ start: range.prevStart, end: range.prevEnd }).catch(() => null)]);
  return { ...cur, prev };
}

async function siteTotals(token, siteUrl, range) {
  const [cur, prev] = await Promise.all([
    periodTotals(token, siteUrl, range),
    periodTotals(token, siteUrl, { start: range.prevStart, end: range.prevEnd }).catch(() => null),
  ]);
  return { ...cur, prev };
}

export async function GET(request) {
  try {
    const range = resolveRange(new URL(request.url).searchParams);
    if (isMock(new URL(request.url).searchParams)) return Response.json(mockGsc(range));
    const token = await getAccessToken();
    const [axxis, diners] = await Promise.all([
      siteTotals(token, process.env.GSC_AXXIS_URL, range),
      siteTotals(token, process.env.GSC_DINERS_URL, range),
    ]);
    const [axxisHome, dinersHome] = await Promise.all([
      homeTotals(token, process.env.GSC_AXXIS_URL, HOME_URL.axxis, range).catch(() => null),
      homeTotals(token, process.env.GSC_DINERS_URL, HOME_URL.diners, range).catch(() => null),
    ]);
    axxis.home = axxisHome;
    diners.home = dinersHome;
    return Response.json({ range, axxis, diners });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.response?.data?.error_description || error.message;
    console.error('GSC API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
