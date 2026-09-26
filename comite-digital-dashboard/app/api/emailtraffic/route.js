import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { getAccessToken, runReport } from '../../lib/ga4';
import { isMock, mockEmailTraffic } from '../../lib/mock';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const EMAIL = { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'Email' } } };

const SITE = { axxis: 'revistaaxxis.com.co', diners: 'revistadiners.com.co' };
const decodeEntities = (t) => String(t || '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const titleCache = new Map();

async function postInfo(domain, path) {
  const segs = path.split('/').filter(Boolean);
  const slug = segs[segs.length - 1];
  const key = `${domain}|${slug}`;
  if (titleCache.has(key)) return titleCache.get(key);
  let info = { title: null, date: null };
  try {
    const r = await axios.get(`https://${domain}/wp-json/wp/v2/posts`, { params: { slug, _fields: 'date,title' }, timeout: 8000 });
    const post = r.data?.[0];
    if (post) info = { title: decodeEntities(post.title?.rendered), date: post.date.slice(0, 10) };
  } catch { /* sin título si el sitio no responde */ }
  titleCache.set(key, info);
  return info;
}


async function build(token, propertyId, range, domain) {
  const both = [
    { startDate: range.start, endDate: range.end, name: 'cur' },
    { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' },
  ];
  const cur = [{ startDate: range.start, endDate: range.end }];
  const QUAL = ['averageSessionDuration', 'bounceRate', 'engagementRate', 'sessions'].map((name) => ({ name }));
  const internal = { andGroup: { expressions: [EMAIL, { filter: { fieldName: 'pageReferrer', stringFilter: { matchType: 'CONTAINS', value: domain } } }] } };
  const [totals, siteTotals, campaigns, sources, daily, pages, qEmail, qSite, flowRows, allPages, dowHour, landings] = await Promise.all([
    runReport(token, propertyId, { dateRanges: both, metrics: ['screenPageViews', 'sessions', 'totalUsers'].map((name) => ({ name })), dimensionFilter: EMAIL }),
    runReport(token, propertyId, { dateRanges: both, metrics: ['screenPageViews', 'sessions'].map((name) => ({ name })) }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'sessionCampaignName' }], metrics: ['screenPageViews', 'sessions'].map((name) => ({ name })), dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 40 }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8 }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'date' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, orderBys: [{ dimension: { dimensionName: 'date' } }] }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 12 }),
    runReport(token, propertyId, { dateRanges: cur, metrics: QUAL, dimensionFilter: EMAIL }),
    runReport(token, propertyId, { dateRanges: cur, metrics: QUAL }),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'pageReferrer' }, { name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: internal, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 60 }).catch(() => []),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 400 }).catch(() => []),
    runReport(token, propertyId, { dateRanges: [{ startDate: range.prevStart, endDate: range.end }], dimensions: [{ name: 'dayOfWeek' }, { name: 'hour' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: EMAIL, limit: 200 }).catch(() => []),
    runReport(token, propertyId, { dateRanges: cur, dimensions: [{ name: 'landingPage' }], metrics: [{ name: 'sessions' }], dimensionFilter: EMAIL, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 400 }).catch(() => []),
  ]);
  const byHour = Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, '0')}h`, value: 0 }));
  const dowSum = Array(7).fill(0);
  dowHour.forEach((r) => {
    const d = Number(r.dimensionValues[0].value);
    const h = Number(r.dimensionValues[1].value);
    const v = Number(r.metricValues[0].value);
    if (byHour[h]) byHour[h].value += v;
    if (d >= 0 && d < 7) dowSum[d] += v;
  });
  const countDow = Array(7).fill(0);
  for (let t = new Date(`${range.prevStart}T00:00:00Z`); t <= new Date(`${range.end}T00:00:00Z`); t = new Date(t.getTime() + 86400000)) countDow[t.getUTCDay()] += 1;
  const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const byDow = [1, 2, 3, 4, 5, 6, 0].map((d) => ({ label: DOW[d], value: countDow[d] ? Math.round(dowSum[d] / countDow[d]) : 0 }));
  const landingSessions = {};
  const norm = (p) => (p.split('?')[0].replace(/\/+$/, '') || '/');
  landings.forEach((r) => { const p = norm(r.dimensionValues[0].value); landingSessions[p] = (landingSessions[p] || 0) + Number(r.metricValues[0].value); });
  const secondClicks = allPages
    .map((r) => { const path = r.dimensionValues[0].value; const views = Number(r.metricValues[0].value); return { path, views: Math.max(0, views - (landingSessions[norm(path)] || 0)) }; })
    .filter((x) => x.views > 0 && !x.path.includes('/wp-content/'))
    .sort((a, b) => b.views - a.views);
  const secondTotal = secondClicks.reduce((a, x) => a + x.views, 0);
  const pageRows = allPages.map((r) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) })).filter((x) => !x.path.includes('/wp-content/'));
  const isArticle = (p) => p.split('/').filter(Boolean).length >= 2 && !/^\/(marketplace|carrito|producto|mi-cuenta|finalizar-compra)/.test(p);
  const articleRows = pageRows.filter((x) => isArticle(x.path)).sort((a, b) => b.views - a.views).slice(0, 15);
  const infos = [];
  for (let i = 0; i < articleRows.length; i += 5) infos.push(...(await Promise.all(articleRows.slice(i, i + 5).map((a) => postInfo(domain, a.path)))));
  const articles = articleRows.map((a, k) => ({ path: a.path, views: a.views, entries: landingSessions[norm(a.path)] || 0, title: infos[k].title, date: infos[k].date, topic: (a.path.split('/').filter(Boolean)[0] || '').replace(/-/g, ' ') }));
  const otherPages = pageRows.filter((x) => !isArticle(x.path)).sort((a, b) => b.views - a.views).slice(0, 5);
  const articleTotal = pageRows.filter((x) => isArticle(x.path)).reduce((a, x) => a + x.views, 0);
  const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };
  const flows = flowRows.map((r) => ({ from: pathOf(r.dimensionValues[0].value), to: r.dimensionValues[1].value, views: Number(r.metricValues[0].value) })).filter((f) => f.from !== f.to && !f.from.includes('/wp-content/'));
  const q = (rows) => (rows[0] ? { sec: Number(rows[0].metricValues[0].value), bounce: Number(rows[0].metricValues[1].value), engagement: Number(rows[0].metricValues[2].value), sessions: Number(rows[0].metricValues[3].value) } : null);
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
    flows,
    articles,
    otherPages,
    articleTotal,
    byHour,
    byDow,
    secondClicks: secondClicks.slice(0, 10),
    secondTotal,
    pages: pages.map((r) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) })),
    quality: { email: q(qEmail), site: q(qSite) },
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
      build(token, process.env.GA4_AXXIS_ID, range, SITE.axxis),
      build(token, process.env.GA4_DINERS_ID, range, SITE.diners),
    ]);
    return Response.json({ range, axxis, diners });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Email traffic error:', detail);
    return Response.json({ error: `GA4 (email): ${detail}` }, { status: 502 });
  }
}
