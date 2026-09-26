import { resolveRange } from '../../lib/range';
import { getAccessToken, runReport } from '../../lib/ga4';
import { isMock, mockEmailTraffic } from '../../lib/mock';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const EMAIL = { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'Email' } } };

async function build(token, propertyId, range) {
  const both = [
    { startDate: range.start, endDate: range.end, name: 'cur' },
    { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' },
  ];
  const cur = [{ startDate: range.start, endDate: range.end }];
  const [totals, siteTotals, campaigns, sources, daily] = await Promise.all([
    runReport(token, propertyId, { dateRanges: both, metrics: ['screenPageViews', 'sessions', 'totalUsers'].map((name) => ({ name })), dimensionFilter: EMAIL }),
    runReport(token, propertyId, { dateRanges: both, metrics: ['screenPageViews', 'sessions'].map((name) => ({ name })) }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'sessionCampaignName' }], metrics: ['screenPageViews', 'sessions'].map((name) => ({ name })), dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 40 }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8 }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'date' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, orderBys: [{ dimension: { dimensionName: 'date' } }] }),
  ]);
  const pick = (rows, name, i) => {
    const r = rows.find((x) => x.dimensionValues.some((v) => v.value === name));
    return r ? Number(r.metricValues[i].value) : 0;
  };
  return {
    views: pick(totals, 'cur', 0), prevViews: pick(totals, 'prev', 0),
    sessions: pick(totals, 'cur', 1), prevSessions: pick(totals, 'prev', 1),
    users: pick(totals, 'cur', 2), prevUsers: pick(totals, 'prev', 2),
    siteViews: pick(siteTotals, 'cur', 0), prevSiteViews: pick(siteTotals, 'prev', 0),
    siteSessions: pick(siteTotals, 'cur', 1),
    campaigns: campaigns.map((r) => ({ name: r.dimensionValues[0].value, views: Number(r.metricValues[0].value), sessions: Number(r.metricValues[1].value) })),
    sources: sources.map((r) => ({ name: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) })),
    daily: daily.map((r) => {
      const d = r.dimensionValues[0].value;
      return { date: d, label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: Number(r.metricValues[0].value) };
    }),
  };
}

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const range = resolveRange(params);
    if (isMock(params)) return Response.json(mockEmailTraffic(range));
    const token = await getAccessToken();
    const [axxis, diners] = await Promise.all([
      build(token, process.env.GA4_AXXIS_ID, range),
      build(token, process.env.GA4_DINERS_ID, range),
    ]);
    return Response.json({ range, axxis, diners });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Email traffic error:', detail);
    return Response.json({ error: `GA4 (email): ${detail}` }, { status: 502 });
  }
}
