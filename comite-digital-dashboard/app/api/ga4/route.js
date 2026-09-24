import axios from 'axios';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const MOCK = {
  axxis: {
        sessions: 93919,
        users: 80065,
        newUsers: 72360,
        pageviews: 136612,
        bounceRate: 0.48,
        avgSessionDuration: '00:01:23',
        engagementRate: 0.5171,
        sessionsChange: -0.318,
        pageviewsChange: -0.168,
        usersChange: -0.306,
        newUsersChange: -0.318,
        bounceRateChange: -0.234,
        avgSessionDurationChange: -0.038,
        engagementRateChange: 0.40,
        dailyViews: [
          { label: '2 ago', value: 5250 },
          { label: '3 ago', value: 4700 },
          { label: '4 ago', value: 5400 },
          { label: '5 ago', value: 5200 },
          { label: '6 ago', value: 5900 },
          { label: '7 ago', value: 5500 },
          { label: '8 ago', value: 5000 },
          { label: '9 ago', value: 5100 },
          { label: '10 ago', value: 4650 },
          { label: '11 ago', value: 4900 },
          { label: '12 ago', value: 4750 },
          { label: '13 ago', value: 3400 },
          { label: '14 ago', value: 3800 },
          { label: '15 ago', value: 3700 },
          { label: '16 ago', value: 4000 },
          { label: '17 ago', value: 3500 },
          { label: '18 ago', value: 4400 },
          { label: '19 ago', value: 4900 },
          { label: '20 ago', value: 4200 },
          { label: '21 ago', value: 3900 },
          { label: '22 ago', value: 3300 },
          { label: '23 ago', value: 2200 },
          { label: '24 ago', value: 2400 },
          { label: '25 ago', value: 4700 },
          { label: '26 ago', value: 4300 },
          { label: '27 ago', value: 4400 },
          { label: '28 ago', value: 3800 },
          { label: '29 ago', value: 3750 },
          { label: '30 ago', value: 4200 },
          { label: '31 ago', value: 5186 },
          { label: '1 sep', value: 3900 },
          { label: '2 sep', value: 4000 },
          { label: '3 sep', value: 3500 },
          { label: '4 sep', value: 3200 },
          { label: '5 sep', value: 3000 },
          { label: '6 sep', value: 3200 },
          { label: '7 sep', value: 3800 },
          { label: '8 sep', value: 3600 },
          { label: '9 sep', value: 3300 },
          { label: '10 sep', value: 3500 },
          { label: '11 sep', value: 3300 },
          { label: '12 sep', value: 2800 },
          { label: '13 sep', value: 3200 },
          { label: '14 sep', value: 3800 },
          { label: '15 sep', value: 3400 },
          { label: '16 sep', value: 3500 },
          { label: '17 sep', value: 2400 },
          { label: '18 sep', value: 3300 },
          { label: '19 sep', value: 3647 },
          { label: '20 sep', value: 3400 }
        ],
        dailyPeaks: [
          { label: '6 ago', value: 5900, note: 'Estadio de Bogotá' },
          { label: '31 ago', value: 5186, note: 'Colegio Chía' },
          { label: '19 sep', value: 3647, note: 'Edificio Gimnasio Los Cerros' },
        ],
        septPartial: { range: '1 al 21 de septiembre', views: 67523, viewsChange: -0.31, users: 42749, usersChange: -0.241 },
        analysis: 'Cerramos agosto con 136.612 visitas, por debajo de julio (164.000), pero cerca de la meta mensual de 140.000, con un promedio diario estable de unas 4.400 visitas salvo un fin de semana. El tiempo de lectura estuvo afectado por un error de Analytics durante diez días y, además, el terremoto marcó parte de la línea editorial, representando un reto para adaptar los contenidos de AXXIS a la coyuntura.',
        monthlyHistory: [
          { month: 'ene 2026', sesiones: 102342, vistas: 131316, usuarios: 81215 },
          { month: 'feb 2026', sesiones: 86510, vistas: 114258, usuarios: 68357 },
          { month: 'mar 2026', sesiones: 99187, vistas: 123321, usuarios: 77472 },
          { month: 'abr 2026', sesiones: 70962, vistas: 89357, usuarios: 58182 },
          { month: 'may 2026', sesiones: 69142, vistas: 86765, usuarios: 54400 },
          { month: 'jun 2026', sesiones: 97699, vistas: 117470, usuarios: 80778 },
          { month: 'jul 2026', sesiones: 137622, vistas: 164159, usuarios: 115360 },
          { month: 'ago 2026', sesiones: 93919, vistas: 136612, usuarios: 80065 },
        ],
      },
  diners: {
        sessions: 89340,
        users: 71200,
        organicSessions: 65400,
        paidSessions: 12100,
      },
};

export async function GET() {
  try {
    const key = JSON.parse(process.env.GOOGLE_CLOUD_JSON_KEY);
    if (!key.private_key || !key.client_email) {
      throw new Error('GOOGLE_CLOUD_JSON_KEY no es una llave de cuenta de servicio. Campos encontrados: ' + Object.keys(key).join(', '));
    }
    const token = await getAccessToken(key);
    const [axxis, diners] = await Promise.all([
      buildProperty(token, process.env.GA4_AXXIS_ID, MOCK.axxis),
      buildProperty(token, process.env.GA4_DINERS_ID, MOCK.diners),
    ]);
    return Response.json({ axxis: parseGA4Response(axxis), diners: parseGA4Response(diners), source: 'ga4' });
  } catch (error) {
    console.error('GA4 API Error:', error.response?.data || error.message);
    return Response.json({
      axxis: parseGA4Response(MOCK.axxis),
      diners: parseGA4Response(MOCK.diners),
      source: 'mock',
      error: JSON.stringify(error.response?.data || error.message),
    });
  }
}

async function getAccessToken(key) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.private_key.replace(/\\n/g, '\n'), 'base64url');
  const res = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: unsigned + '.' + signature }),
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

async function buildProperty(token, propertyId, fallback) {
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

  const dailyPeaks = (fallback.dailyPeaks || [])
    .map((pk) => ({ ...pk, value: dailyViews.find((d) => d.label === pk.label)?.value ?? pk.value }));

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
    analysis: fallback.analysis,
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
    analysis: res.analysis || null,
  };
}
