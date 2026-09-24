import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export async function GET(request) {
  try {
    const range = resolveRange(new URL(request.url).searchParams);
    const token = await getAccessToken();
    const [axxis, diners] = await Promise.all([
      buildProperty(token, process.env.GA4_AXXIS_ID, 'axxis', range),
      buildProperty(token, process.env.GA4_DINERS_ID, 'diners', range),
    ]);
    return Response.json({ range, axxis: parseGA4Response(axxis), diners: parseGA4Response(diners) });
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


const FIXED_SECTIONS = {
  axxis: [
    { slug: 'arquitectura', label: 'Arquitectura' },
    { slug: 'diseno', label: 'Diseño' },
    { slug: 'decoracion', label: 'Decoración' },
  ],
};

const sectionOf = (path) => path.split('/')[1] || '';
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const SITE_BASE = { axxis: 'https://revistaaxxis.com.co', diners: 'https://revistadiners.com.co' };
const decodeEntities = (t) => t
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

async function topArticles(brand, pageList) {
  const articles = pageList
    .filter((p) => p.path.split('/').filter(Boolean).length >= 2)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  return Promise.all(articles.map(async (a) => {
    const segs = a.path.split('/').filter(Boolean);
    const slug = segs[segs.length - 1];
    let title = null;
    let date = null;
    try {
      const r = await axios.get(`${SITE_BASE[brand]}/wp-json/wp/v2/posts`, { params: { slug, _fields: 'date,title' }, timeout: 8000 });
      const post = r.data?.[0];
      if (post) {
        title = decodeEntities(post.title?.rendered || '');
        const [yy, mm, dd] = post.date.slice(0, 10).split('-').map(Number);
        date = `${dd} de ${MONTH_NAMES[mm - 1]} de ${yy}`;
      }
    } catch { /* sin título/fecha si el sitio no responde */ }
    return { path: a.path, views: a.views, title, date, topic: cap(segs[0].replace(/-/g, ' ')) };
  }));
}

async function buildSections(token, propertyId, brand, range) {
  const cur = { startDate: range.start, endDate: range.end };
  const prev = { startDate: range.prevStart, endDate: range.prevEnd };

  const rows = await runReport(token, propertyId, {
    dateRanges: [{ ...cur, name: 'cur' }, { ...prev, name: 'prev' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    limit: 100000,
  });
  const pages = { cur: [], prev: [] };
  rows.forEach((r) => {
    const range = r.dimensionValues[1]?.value === 'prev' ? 'prev' : 'cur';
    pages[range].push({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) });
  });
  const total = (list, slug) => list.filter((p) => sectionOf(p.path) === slug).reduce((a, p) => a + p.views, 0);

  let defs = FIXED_SECTIONS[brand];
  if (!defs) {
    const totals = {};
    pages.cur.forEach((p) => { const sl = sectionOf(p.path); if (sl) totals[sl] = (totals[sl] || 0) + p.views; });
    defs = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([slug]) => ({ slug, label: cap(slug.replace(/-/g, ' ')) }));
  }

  const sections = await Promise.all(defs.map(async ({ slug, label }) => {
    const daily = (await runReport(token, propertyId, {
      dateRanges: [cur],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: `/${slug}` } } },
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    })).map((r) => {
      const d = r.dimensionValues[0].value;
      return { label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: Number(r.metricValues[0].value) };
    });
    const peak = daily.reduce((best, d) => (!best || d.value > best.value ? d : best), null);
    const topPages = pages.cur.filter((p) => sectionOf(p.path) === slug).sort((a, b) => b.views - a.views).slice(0, 5);
    const views = total(pages.cur, slug);
    return { slug, label, views, change: pct(views, total(pages.prev, slug)), topPages, daily, peak };
  }));

  const top = [...sections].sort((a, b) => b.views - a.views)[0];
  const articles = await topArticles(brand, pages.cur);
  return { articles, sections, summary: top ? { topSection: top.label, topArticle: top.topPages[0]?.path || null } : null };
}

async function buildAudience(token, propertyId, r) {
  const range = { startDate: r.start, endDate: r.end };
  const rep = (dimension, metrics, extra = {}) =>
    runReport(token, propertyId, { dateRanges: [range], dimensions: [{ name: dimension }], metrics: metrics.map((name) => ({ name })), ...extra });

  const [devices, channels, gender, age, ageGender] = await Promise.all([
    rep('deviceCategory', ['totalUsers']),
    rep('sessionDefaultChannelGroup', ['sessions', 'screenPageViews', 'totalUsers'], { orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    rep('userGender', ['totalUsers']).catch(() => []),
    rep('userAgeBracket', ['totalUsers'], { orderBys: [{ dimension: { dimensionName: 'userAgeBracket' } }] }).catch(() => []),
    runReport(token, propertyId, {
      dateRanges: [range],
      dimensions: [{ name: 'userAgeBracket' }, { name: 'userGender' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ dimension: { dimensionName: 'userAgeBracket' } }],
    }).catch(() => []),
  ]);

  const share = (rows, idx = 0) => {
    const total = rows.reduce((a, r) => a + Number(r.metricValues[idx].value), 0);
    return rows.map((r) => ({ name: r.dimensionValues[0].value, value: Number(r.metricValues[idx].value), pct: total ? Number(r.metricValues[idx].value) / total : 0 }));
  };
  const known = (list) => list.filter((x) => x.name !== 'unknown' && x.name !== '(not set)');
  const renorm = (list) => { const t = list.reduce((a, x) => a + x.value, 0); return list.map((x) => ({ ...x, pct: t ? x.value / t : 0 })); };

  const sessionsTotal = channels.reduce((a, r) => a + Number(r.metricValues[0].value), 0);
  return {
    devices: share(devices).sort((a, b) => b.pct - a.pct),
    channels: channels.map((r) => ({
      name: r.dimensionValues[0].value,
      sessions: Number(r.metricValues[0].value),
      views: Number(r.metricValues[1].value),
      users: Number(r.metricValues[2].value),
      pct: sessionsTotal ? Number(r.metricValues[0].value) / sessionsTotal : 0,
    })),
    ageGender: (() => {
      const valid = ageGender.filter((r) => ['female', 'male'].includes(r.dimensionValues[1].value) && r.dimensionValues[0].value !== 'unknown');
      const total = valid.reduce((a, r) => a + Number(r.metricValues[0].value), 0);
      const byAge = {};
      valid.forEach((r) => {
        const a = r.dimensionValues[0].value;
        byAge[a] = byAge[a] || { age: a, mujeres: 0, hombres: 0 };
        byAge[a][r.dimensionValues[1].value === 'female' ? 'mujeres' : 'hombres'] = total ? Number(r.metricValues[0].value) / total : 0;
      });
      return Object.values(byAge).sort((x, y) => x.age.localeCompare(y.age, 'es', { numeric: true }));
    })(),
    gender: renorm(known(share(gender))),
    age: renorm(known(share(age))),
  };
}

async function buildProperty(token, propertyId, brand, range) {
  const today = new Date();
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const dayOfMonth = today.getUTCDate() - 1 || 1;
  const yearStart = `${range.end.slice(0, 4)}-01-01`;
  const prevMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
  const prevSameDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, dayOfMonth));

  const [kpis, monthly, daily, partial, sectionData, audience] = await Promise.all([
    runReport(token, propertyId, {
      dateRanges: [
        { startDate: range.start, endDate: range.end, name: 'cur' },
        { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' },
      ],
      metrics: ['sessions', 'screenPageViews', 'totalUsers', 'newUsers', 'bounceRate', 'averageSessionDuration', 'engagementRate'].map((name) => ({ name })),
    }),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: yearStart, endDate: range.end }],
      dimensions: [{ name: 'yearMonth' }],
      metrics: ['sessions', 'screenPageViews', 'totalUsers'].map((name) => ({ name })),
      orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
    }),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: range.start, endDate: range.end }],
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
    buildSections(token, propertyId, brand, range),
    buildAudience(token, propertyId, range),
  ]);

  const byName = (rows, name) => rows.find((r) => r.dimensionValues.some((v) => v.value === name));
  const last = byName(kpis, 'cur');
  const prior = byName(kpis, 'prev') || { metricValues: kpis[0].metricValues.map(() => ({ value: 0 })) };

  const monthlyHistory = monthly.map((r) => ({
    month: `${MONTHS[Number(r.dimensionValues[0].value.slice(4)) - 1]} ${r.dimensionValues[0].value.slice(0, 4)}`,
    sesiones: num(r, 0), vistas: num(r, 1), usuarios: num(r, 2),
  }));

  const dailyViews = daily.map((r) => {
    const d = r.dimensionValues[0].value;
    return { label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: num(r, 0) };
  });

  const dr = (name) => byName(partial, name);
  const cur = dr('cur');
  const prev = dr('prev');

  const dailyPeaks = [];
  dailyViews
    .map((d, i) => ({ ...d, i }))
    .sort((x, y) => y.value - x.value)
    .forEach((d) => {
      if (dailyPeaks.length < 3 && dailyPeaks.every((p) => Math.abs(p.i - d.i) >= 7)) dailyPeaks.push(d);
    });
  dailyPeaks.sort((x, y) => x.i - y.i);
  dailyPeaks.forEach((p) => delete p.i);

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
    sections: sectionData.sections,
    topArticles: sectionData.articles,
    audience,
    sectionSummary: sectionData.summary,
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
    sections: res.sections || [],
    topArticles: res.topArticles || [],
    audience: res.audience || null,
    sectionSummary: res.sectionSummary || null,
    septPartial: res.septPartial || null,
  };
}
