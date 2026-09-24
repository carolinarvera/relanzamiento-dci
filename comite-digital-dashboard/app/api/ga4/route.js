import axios from 'axios';

export const dynamic = 'force-dynamic';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export async function GET() {
  try {
    const token = await getAccessToken();
    const [axxis, diners] = await Promise.all([
      buildProperty(token, process.env.GA4_AXXIS_ID),
      buildProperty(token, process.env.GA4_DINERS_ID),
    ]);
    return Response.json({ axxis: parseGA4Response(axxis), diners: parseGA4Response(diners) });
  } catch (error) {
    const detail = error.response?.data?.error_description || error.response?.data?.error?.message || error.message;
    console.error('GA4 API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}

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

async function runReport(token, propertyId, body) {
  const res = await axios.post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.rows || [];
}

const num = (row, i) => Number(row.metricValues[i].value);
const pct = (cur, prev) => (prev ? cur / prev - 1 : null);
const iso = (d) => d.toISOString().slice(0, 10);

function fmtDuration(sec) {
  const s = Math.round(sec);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0')).join(':');
}

async function buildProperty(token, propertyId) {
  const today = new Date();
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const dayOfMonth = today.getUTCDate() - 1 || 1;
  const yearStart = `${today.getUTCFullYear()}-01-01`;
  const prevMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
  const prevSameDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, dayOfMonth));

  const [monthly, daily, partial] = await Promise.all([
    runReport(token, propertyId, {
      dateRanges: [{ startDate: yearStart, endDate: 'today' }],
      dimensions: [{ name: 'yearMonth' }],
      metrics: ['sessions', 'screenPageViews', 'totalUsers', 'newUsers', 'bounceRate', 'averageSessionDuration', 'engagementRate'].map((name) => ({ name })),
      orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
    }),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: iso(prevMonthStart), endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    runReport(token, propertyId, {
      dateRanges: [
        { startDate: iso(monthStart), endDate: 'today', name: 'cur' },
        { startDate: iso(prevMonthStart), endDate: iso(prevSameDay), name: 'prev' },
      ],
      metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
    }),
  ]);

  const currentYm = `${today.getUTCFullYear()}${String(today.getUTCMonth() + 1).padStart(2, '0')}`;
  const closed = monthly.filter((r) => r.dimensionValues[0].value !== currentYm);
  const last = closed[closed.length - 1];
  const prior = closed[closed.length - 2];

  const monthlyHistory = closed.map((r) => ({
    month: `${MONTHS[Number(r.dimensionValues[0].value.slice(4)) - 1]} ${r.dimensionValues[0].value.slice(0, 4)}`,
    sesiones: num(r, 0), vistas: num(r, 1), usuarios: num(r, 2),
  }));

  const dailyViews = daily
    .filter((r) => r.dimensionValues[0].value >= iso(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1))).replace(/-/g, ''))
    .map((r) => {
      const d = r.dimensionValues[0].value;
      return { label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: num(r, 0) };
    });

  const dr = (name) => partial.find((r) => r.dimensionValues.some((v) => v.value === name));
  const cur = dr('cur');
  const prev = dr('prev');

  const dailyPeaks = dailyViews
    .map((d, i) => ({ ...d, i }))
    .filter((d, _, arr) => {
      const prev = dailyViews[d.i - 1]?.value ?? -1;
      const next = dailyViews[d.i + 1]?.value ?? -1;
      return d.value > prev && d.value >= next;
    })
    .sort((x, y) => y.value - x.value)
    .slice(0, 3)
    .map(({ label, value }) => ({ label, value }));

  return {
    sessions: num(last, 0), pageviews: num(last, 1), users: num(last, 2), newUsers: num(last, 3),
    bounceRate: num(last, 4), avgSessionDuration: fmtDuration(num(last, 5)), engagementRate: num(last, 6),
    sessionsChange: pct(num(last, 0), num(prior, 0)),
    pageviewsChange: pct(num(last, 1), num(prior, 1)),
    usersChange: pct(num(last, 2), num(prior, 2)),
    newUsersChange: pct(num(last, 3), num(prior, 3)),
    bounceRateChange: pct(num(last, 4), num(prior, 4)),
    avgSessionDurationChange: pct(num(last, 5), num(prior, 5)),
    engagementRateChange: pct(num(last, 6), num(prior, 6)),
    monthlyHistory,
    dailyViews,
    dailyPeaks,
    septPartial: cur && prev ? {
      range: `1 al ${dayOfMonth} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][today.getUTCMonth()]}`,
      views: num(cur, 0), viewsChange: pct(num(cur, 0), num(prev, 0)),
      users: num(cur, 1), usersChange: pct(num(cur, 1), num(prev, 1)),
    } : null,
  };
}

function parseGA4Response(res) {
  return {
    sessions: res.sessions || 0,
    users: res.users || 0,
    organicSessions: res.organicSessions || 0,
    paidSessions: res.paidSessions || 0,
    newUsers: res.newUsers || 0,
    pageviews: res.pageviews || 0,
    bounceRate: res.bounceRate || 0,
    avgSessionDuration: res.avgSessionDuration || null,
    engagementRate: res.engagementRate || 0,
    sessionsChange: res.sessionsChange ?? null,
    pageviewsChange: res.pageviewsChange ?? null,
    usersChange: res.usersChange ?? null,
    newUsersChange: res.newUsersChange ?? null,
    bounceRateChange: res.bounceRateChange ?? null,
    avgSessionDurationChange: res.avgSessionDurationChange ?? null,
    engagementRateChange: res.engagementRateChange ?? null,
    monthlyHistory: res.monthlyHistory || [],
    dailyViews: res.dailyViews || [],
    dailyPeaks: res.dailyPeaks || [],
    septPartial: res.septPartial || null,
  };
}
