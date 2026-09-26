import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { isMock, mockGa4 } from '../../lib/mock';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export async function GET(request) {
  try {
    const range = resolveRange(new URL(request.url).searchParams);
    if (isMock(new URL(request.url).searchParams)) return Response.json(mockGa4(range));
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

const MAX_CONCURRENT = 6;
const gates = {};

async function withGate(propertyId, fn) {
  const g = (gates[propertyId] = gates[propertyId] || { active: 0, queue: [] });
  if (g.active >= MAX_CONCURRENT) await new Promise((resolve) => g.queue.push(resolve));
  g.active += 1;
  try {
    return await fn();
  } finally {
    g.active -= 1;
    const next = g.queue.shift();
    if (next) next();
  }
}

async function runReport(token, propertyId, body) {
  const call = () => axios.post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const res = await withGate(propertyId, async () => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await call();
      } catch (err) {
        const quota = err.response?.status === 429 || /quota|concurrent/i.test(err.response?.data?.error?.message || '');
        if (!quota || attempt >= 3) throw err;
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  });
  const rows = res.data.rows || [];
  rows.totals = res.data.totals?.[0]?.metricValues || null;
  return rows;
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

async function buildHome(token, propertyId, range) {
  const f = { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'EXACT', value: '/' } } };
  const cur = { startDate: range.start, endDate: range.end };
  const both = [{ ...cur, name: 'cur' }, { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' }];
  const seg = (kind) => ({ andGroup: { expressions: [f, { filter: { fieldName: 'newVsReturning', stringFilter: { matchType: 'EXACT', value: kind } } }] } });
  const [kpis, dailyRows, hourRows, chanRows, durRows, newChanRows, retChanRows] = await Promise.all([
    runReport(token, propertyId, { dateRanges: both, metrics: ['screenPageViews', 'totalUsers', 'bounceRate', 'userEngagementDuration', 'activeUsers', 'newUsers'].map((name) => ({ name })), dimensionFilter: f }),
    runReport(token, propertyId, { dateRanges: [cur], dimensions: [{ name: 'date' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: f, orderBys: [{ dimension: { dimensionName: 'date' } }] }),
    runReport(token, propertyId, { dateRanges: [cur], dimensions: [{ name: 'hour' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: f }),
    runReport(token, propertyId, { dateRanges: both, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'screenPageViews' }], dimensionFilter: f, limit: 100 }),
    runReport(token, propertyId, { dateRanges: both, dimensions: [{ name: 'newVsReturning' }], metrics: [{ name: 'averageSessionDuration' }, { name: 'totalUsers' }, { name: 'sessionsPerUser' }], dimensionFilter: f }).catch(() => []),
    runReport(token, propertyId, { dateRanges: [cur], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], dimensionFilter: seg('new'), limit: 30 }).catch(() => []),
    runReport(token, propertyId, { dateRanges: [cur], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], dimensionFilter: seg('returning'), limit: 30 }).catch(() => []),
  ]);
  const durOf = (kind, which) => {
    const row = durRows.find((x) => x.dimensionValues[0].value === kind && x.dimensionValues[1]?.value === which);
    return row ? Number(row.metricValues[0].value) : null;
  };
  const hv = (kind, which, i) => { const r = durRows.find((x) => x.dimensionValues[0].value === kind && x.dimensionValues[1]?.value === which); return r ? Number(r.metricValues[i].value) : 0; };
  const hTotCur = hv('new', 'cur', 1) + hv('returning', 'cur', 1);
  const hTotPrev = hv('new', 'prev', 1) + hv('returning', 'prev', 1);
  const homeReturning = hTotCur ? {
    newPct: hv('new', 'cur', 1) / hTotCur, returningPct: hv('returning', 'cur', 1) / hTotCur,
    prevNewPct: hTotPrev ? hv('new', 'prev', 1) / hTotPrev : null, prevReturningPct: hTotPrev ? hv('returning', 'prev', 1) / hTotPrev : null,
    perUser: { new: hv('new', 'cur', 2), returning: hv('returning', 'cur', 2), prevNew: hv('new', 'prev', 2) || null, prevReturning: hv('returning', 'prev', 2) || null },
  } : null;
  const chans = (rows) => rows.map((x) => ({ name: x.dimensionValues[0].value, sessions: Number(x.metricValues[0].value) }));
  const pick = (name) => kpis.find((r) => r.dimensionValues.some((v) => v.value === name));
  const c = pick('cur');
  const pv = pick('prev');
  const m = (row, i) => (row ? Number(row.metricValues[i].value) : 0);
  const read = (row) => (m(row, 4) ? m(row, 3) / m(row, 4) : 0);
  const daily = dailyRows.map((r) => {
    const d = r.dimensionValues[0].value;
    return { date: d, label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: Number(r.metricValues[0].value) };
  });
  const peak = daily.reduce((b, d) => (!b || d.value > b.value ? d : b), null);
  const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, '0')}h`, value: 0 }));
  hourRows.forEach((r) => { const slot = hourly[Number(r.dimensionValues[0].value)]; if (slot) slot.value = Number(r.metricValues[0].value); });
  const chan = {};
  chanRows.forEach((r) => {
    const name = r.dimensionValues[0].value;
    const which = r.dimensionValues[1]?.value === 'prev' ? 'prevViews' : 'views';
    chan[name] = chan[name] || { name, views: 0, prevViews: 0 };
    chan[name][which] = Number(r.metricValues[0].value);
  });
  return {
    viewsPrev: m(pv, 0), usersPrev: m(pv, 1), bounceRatePrev: m(pv, 2), readSecPrev: read(pv),
    views: m(c, 0), viewsChange: pct(m(c, 0), m(pv, 0)),
    users: m(c, 1), usersChange: pct(m(c, 1), m(pv, 1)),
    newUsers: m(c, 5), newUsersChange: pct(m(c, 5), m(pv, 5)),
    newDuration: { sec: durOf('new', 'cur'), prevSec: durOf('new', 'prev') },
    returningDuration: { sec: durOf('returning', 'cur'), prevSec: durOf('returning', 'prev') },
    newChannels: chans(newChanRows), returningChannels: chans(retChanRows),
    returning: homeReturning,
    bounceRate: m(c, 2), bounceRateChange: pct(m(c, 2), m(pv, 2)),
    readSec: read(c), readChange: pct(read(c), read(pv)),
    daily, peak, hourly, channels: Object.values(chan),
  };
}

const ABOVE_AVG_FACTOR = 1.15;
const DEVICE_ES = { mobile: 'Móvil', desktop: 'Escritorio', tablet: 'Tablet', 'smart tv': 'Smart TV' };

const CHANNEL_ES = {
  'Organic Search': 'Búsqueda orgánica', Direct: 'Directo', 'Organic Social': 'Social orgánico', 'Paid Social': 'Social pagado',
  'Paid Search': 'Búsqueda pagada', Referral: 'Referido', Email: 'Email', Display: 'Display', Unassigned: 'Sin asignar',
  'Organic Video': 'Video orgánico', 'Cross-network': 'Cross-network', Affiliates: 'Afiliados',
};

async function buildAboveAvgAnalysis(token, propertyId, range, dailyViews) {
  if (!dailyViews.length) return [];
  const avg = dailyViews.reduce((a, d) => a + d.value, 0) / dailyViews.length;
  const days = dailyViews.filter((d) => d.value > avg * ABOVE_AVG_FACTOR);
  if (!days.length) return [];
  const dateRanges = [{ startDate: range.start, endDate: range.end }];
  const wanted = new Set(days.map((d) => d.date));

  const [pageRows, pageChannelRows, hourRows, dayRows, deviceRows] = await Promise.all([
    runReport(token, propertyId, {
      dateRanges, dimensions: [{ name: 'date' }, { name: 'pagePath' }],
      metrics: ['screenPageViews', 'userEngagementDuration', 'activeUsers'].map((name) => ({ name })),
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 100000,
    }),
    runReport(token, propertyId, {
      dateRanges, dimensions: [{ name: 'date' }, { name: 'pagePath' }, { name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 100000,
    }),
    runReport(token, propertyId, {
      dateRanges, dimensions: [{ name: 'date' }, { name: 'hour' }],
      metrics: [{ name: 'screenPageViews' }], limit: 10000,
    }),
    runReport(token, propertyId, {
      dateRanges, dimensions: [{ name: 'date' }],
      metrics: ['userEngagementDuration', 'activeUsers'].map((name) => ({ name })),
    }),
    runReport(token, propertyId, {
      dateRanges, dimensions: [{ name: 'date' }, { name: 'deviceCategory' }],
      metrics: [{ name: 'screenPageViews' }], limit: 10000,
    }),
  ]);

  const group = (rows) => {
    const m = {};
    rows.forEach((r) => {
      const d = r.dimensionValues[0].value;
      if (wanted.has(d)) (m[d] = m[d] || []).push(r);
    });
    return m;
  };
  const pagesBy = group(pageRows);
  const pageChannelsBy = {};
  pageChannelRows.forEach((r) => {
    const k = `${r.dimensionValues[0].value}|${r.dimensionValues[1].value}`;
    (pageChannelsBy[k] = pageChannelsBy[k] || []).push(r);
  });
  const hoursBy = group(hourRows);
  const dayBy = group(dayRows);
  const devicesBy = group(deviceRows);

  return days.map((d) => {
    const pages = (pagesBy[d.date] || [])
      .filter((r) => r.dimensionValues[1].value !== '/')
      .sort((a, b) => num(b, 0) - num(a, 0)).slice(0, 3)
      .map((r) => {
        const chRows = pageChannelsBy[`${d.date}|${r.dimensionValues[1].value}`] || [];
        const chTotal = chRows.reduce((a, x) => a + num(x, 0), 0);
        const channels = [...chRows].sort((a, b) => num(b, 0) - num(a, 0)).slice(0, 3)
          .map((x) => ({ name: CHANNEL_ES[x.dimensionValues[2].value] || x.dimensionValues[2].value, share: chTotal ? num(x, 0) / chTotal : 0 }));
        return { path: r.dimensionValues[1].value, views: num(r, 0), readSec: num(r, 2) ? num(r, 1) / num(r, 2) : 0, channels };
      });
    const hours = (hoursBy[d.date] || []).sort((a, b) => num(b, 0) - num(a, 0)).slice(0, 3)
      .map((r) => ({ hour: `${String(Number(r.dimensionValues[1].value)).padStart(2, '0')}h`, views: num(r, 0) }));
    const dvRows = devicesBy[d.date] || [];
    const dvTotal = dvRows.reduce((a, r) => a + num(r, 0), 0);
    const devices = dvRows.sort((a, b) => num(b, 0) - num(a, 0)).slice(0, 3)
      .map((r) => ({ name: DEVICE_ES[r.dimensionValues[1].value] || r.dimensionValues[1].value, share: dvTotal ? num(r, 0) / dvTotal : 0 }));
    const dr = (dayBy[d.date] || [])[0];
    const readSec = dr && num(dr, 1) ? num(dr, 0) / num(dr, 1) : 0;
    return { label: d.label, views: d.value, pages, devices, hours, readTime: fmtDuration(readSec) };
  });
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
      return { date: d, label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: Number(r.metricValues[0].value) };
    });
    const hourRows = await runReport(token, propertyId, {
      dateRanges: [cur],
      dimensions: [{ name: 'hour' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: `/${slug}` } } },
    });
    const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, '0')}h`, value: 0 }));
    hourRows.forEach((r) => { const slot = hourly[Number(r.dimensionValues[0].value)]; if (slot) slot.value = Number(r.metricValues[0].value); });
    const peak = daily.reduce((best, d) => (!best || d.value > best.value ? d : best), null);
    const secFilter = { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: `/${slug}` } } };
    const byViews = [{ metric: { metricName: 'screenPageViews' }, desc: true }];
    const [dayPageRows, dayChannelRows, dayHourRows] = await Promise.all([
      runReport(token, propertyId, {
        dateRanges: [cur], dimensions: [{ name: 'date' }, { name: 'pagePath' }],
        metrics: ['screenPageViews', 'userEngagementDuration', 'activeUsers'].map((name) => ({ name })),
        dimensionFilter: secFilter, orderBys: byViews, limit: 100000,
      }),
      runReport(token, propertyId, {
        dateRanges: [cur], dimensions: [{ name: 'date' }, { name: 'pagePath' }, { name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'screenPageViews' }], dimensionFilter: secFilter, orderBys: byViews, limit: 100000,
      }),
      runReport(token, propertyId, {
        dateRanges: [cur], dimensions: [{ name: 'date' }, { name: 'pagePath' }, { name: 'hour' }],
        metrics: [{ name: 'screenPageViews' }], dimensionFilter: secFilter, orderBys: byViews, limit: 100000,
      }),
    ]);
    const topPageByDay = {};
    const topPagesByDay = {};
    const keyOf = {};
    dayPageRows.forEach((r) => {
      const d = r.dimensionValues[0].value;
      const path = r.dimensionValues[1].value;
      if (path === `/${slug}` || path === `/${slug}/`) return;
      const label = `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`;
      const list = (topPagesByDay[label] = topPagesByDay[label] || []);
      if (list.length >= 3) return;
      const users = Number(r.metricValues[2].value);
      const entry = { path, views: Number(r.metricValues[0].value), readSec: users ? Number(r.metricValues[1].value) / users : 0, channels: [], peakHour: null };
      list.push(entry);
      if (list.length === 1) topPageByDay[label] = entry;
      keyOf[`${d}|${path}`] = entry;
    });
    const chAcc = {};
    dayChannelRows.forEach((r) => {
      const k = `${r.dimensionValues[0].value}|${r.dimensionValues[1].value}`;
      if (keyOf[k]) (chAcc[k] = chAcc[k] || []).push({ name: CHANNEL_ES[r.dimensionValues[2].value] || r.dimensionValues[2].value, n: Number(r.metricValues[0].value) });
    });
    Object.entries(chAcc).forEach(([k, list]) => {
      const tot = list.reduce((a, x) => a + x.n, 0);
      keyOf[k].channels = list.sort((x, y) => y.n - x.n).slice(0, 3).map((x) => ({ name: x.name, share: tot ? x.n / tot : 0 }));
    });
    const hrBest = {};
    dayHourRows.forEach((r) => {
      const k = `${r.dimensionValues[0].value}|${r.dimensionValues[1].value}`;
      const n = Number(r.metricValues[0].value);
      if (keyOf[k] && (!hrBest[k] || n > hrBest[k].n)) hrBest[k] = { n, h: Number(r.dimensionValues[2].value) };
    });
    Object.entries(hrBest).forEach(([k, v]) => { keyOf[k].peakHour = `${String(v.h).padStart(2, '0')}h`; });
    let peakPages = [];
    if (peak) {
      const iso = `${peak.date.slice(0, 4)}-${peak.date.slice(4, 6)}-${peak.date.slice(6)}`;
      const peakRows = await runReport(token, propertyId, {
        dateRanges: [{ startDate: iso, endDate: iso }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: `/${slug}` } } },
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5,
      });
      peakPages = peakRows.map((r) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) }));
    }
    const topPages = pages.cur.filter((p) => sectionOf(p.path) === slug).sort((a, b) => b.views - a.views).slice(0, 10);
    const views = total(pages.cur, slug);
    return { slug, label, views, change: pct(views, total(pages.prev, slug)), topPages, peakPages, topPageByDay, topPagesByDay, daily, peak, hourly };
  }));

  const top = [...sections].sort((a, b) => b.views - a.views)[0];
  const articles = await topArticles(brand, pages.cur);
  return { articles, sections, summary: top ? { topSection: top.label, topArticle: top.topPages[0]?.path || null } : null };
}

const AUDIENCE_TTL_MS = 60 * 60 * 1000;
const audienceCache = new Map();

async function cachedAudience(token, propertyId, r, brand) {
  const key = `${propertyId}|${r.start}|${r.end}`;
  const hit = audienceCache.get(key);
  if (hit && Date.now() - hit.at < AUDIENCE_TTL_MS) return hit.value;
  const value = await buildAudience(token, propertyId, r, brand);
  // Solo se guarda si los datos sujetos a cuota llegaron completos; si no, se reintenta en la siguiente carga.
  if (!value.debug?.length) audienceCache.set(key, { at: Date.now(), value });
  else if (hit) return { ...hit.value, stale: true };
  return value;
}

async function buildAudience(token, propertyId, r, brand) {
  const range = { startDate: r.start, endDate: r.end };
  const rep = (dimension, metrics, extra = {}) =>
    runReport(token, propertyId, { dateRanges: [range], dimensions: [{ name: dimension }], metrics: metrics.map((name) => ({ name })), ...extra });

  const aiFilter = { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'AI Assistant' } } };
  const dbg = [];
  const trap = (label) => (e) => { dbg.push(`${label}: ${e.response?.data?.error?.message || e.message}`); return []; };
  const [devices, channels, gender, age, ageGender, cityRows, countryRows, aiSources, aiLanding, prevChannels, prevDevices, newVsRet, newChan, retChan, regionRows, osRows, osPrevRows, brandRows, intRows, intGenderRows, intAgeRows, qualityRows] = await Promise.all([
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
    rep('city', ['totalUsers'], { limit: 6, metricAggregations: ['TOTAL'], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }] }).catch(() => []),
    rep('country', ['totalUsers'], { limit: 4, metricAggregations: ['TOTAL'], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }] }).catch(() => []),
    rep('sessionSource', ['sessions', 'screenPageViews', 'totalUsers'], { dimensionFilter: aiFilter, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 10 }).catch(() => []),
    rep('landingPage', ['sessions'], { dimensionFilter: aiFilter, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 30 }).catch(() => []),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: r.prevStart, endDate: r.prevEnd }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
    }).catch(() => []),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: r.prevStart, endDate: r.prevEnd }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
    }).catch(() => []),
    runReport(token, propertyId, {
      dateRanges: [{ ...range, name: 'cur' }, { startDate: r.prevStart, endDate: r.prevEnd, name: 'prev' }],
      dimensions: [{ name: 'newVsReturning' }],
      metrics: [{ name: 'averageSessionDuration' }, { name: 'totalUsers' }, { name: 'sessionsPerUser' }],
    }).catch(() => []),
    runReport(token, propertyId, {
      dateRanges: [range],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      dimensionFilter: { filter: { fieldName: 'newVsReturning', stringFilter: { matchType: 'EXACT', value: 'new' } } },
      limit: 30,
    }).catch(() => []),
    runReport(token, propertyId, {
      dateRanges: [range],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      dimensionFilter: { filter: { fieldName: 'newVsReturning', stringFilter: { matchType: 'EXACT', value: 'returning' } } },
      limit: 30,
    }).catch(() => []),
    rep('region', ['totalUsers'], { limit: 8, dimensionFilter: { filter: { fieldName: 'country', stringFilter: { matchType: 'EXACT', value: 'Colombia' } } }, orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }] }).catch(() => []),
    rep('operatingSystem', ['totalUsers'], { orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }] }).catch(() => []),
    runReport(token, propertyId, { dateRanges: [{ startDate: r.prevStart, endDate: r.prevEnd }], dimensions: [{ name: 'operatingSystem' }], metrics: [{ name: 'totalUsers' }] }).catch(() => []),
    rep('mobileDeviceBranding', ['totalUsers'], { orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }] }).catch(() => []),
    rep('brandingInterest', ['totalUsers'], { limit: 400, orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }] }).catch(trap('interests')),
    runReport(token, propertyId, { dateRanges: [range], dimensions: [{ name: 'brandingInterest' }, { name: 'userGender' }], metrics: [{ name: 'totalUsers' }], limit: 10000 }).catch(trap('interestsGender')),
    runReport(token, propertyId, { dateRanges: [range], dimensions: [{ name: 'brandingInterest' }, { name: 'userAgeBracket' }], metrics: [{ name: 'totalUsers' }], limit: 10000 }).catch(trap('interestsAge')),
    rep('sessionDefaultChannelGroup', ['averageSessionDuration', 'bounceRate', 'engagementRate', 'sessions']).catch(() => []),
  ]);
  const returningChannels = retChan.map((x) => ({ name: x.dimensionValues[0].value, sessions: Number(x.metricValues[0].value) }));
  const returningDuration = { sec: null, prevSec: null };
  const newChannels = newChan.map((x) => ({ name: x.dimensionValues[0].value, sessions: Number(x.metricValues[0].value) }));
  const durOf = (kind, which) => {
    const row = newVsRet.find((x) => x.dimensionValues[0].value === kind && x.dimensionValues[1]?.value === which);
    return row ? Number(row.metricValues[0].value) : null;
  };
  const newDuration = { sec: durOf('new', 'cur'), prevSec: durOf('new', 'prev') };
  const rowOf = (kind, which) => newVsRet.find((x) => x.dimensionValues[0].value === kind && x.dimensionValues[1]?.value === which);
  const mv = (kind, which, i) => { const r = rowOf(kind, which); return r ? Number(r.metricValues[i].value) : 0; };
  const totCur = mv('new', 'cur', 1) + mv('returning', 'cur', 1);
  const totPrev = mv('new', 'prev', 1) + mv('returning', 'prev', 1);
  const returning = totCur ? {
    newPct: mv('new', 'cur', 1) / totCur, returningPct: mv('returning', 'cur', 1) / totCur,
    prevNewPct: totPrev ? mv('new', 'prev', 1) / totPrev : null, prevReturningPct: totPrev ? mv('returning', 'prev', 1) / totPrev : null,
    perUser: { new: mv('new', 'cur', 2), returning: mv('returning', 'cur', 2), prevNew: mv('new', 'prev', 2) || null, prevReturning: mv('returning', 'prev', 2) || null },
  } : null;
  returningDuration.sec = durOf('returning', 'cur');
  returningDuration.prevSec = durOf('returning', 'prev');
  const prevByName = {};
  prevChannels.forEach((row) => { prevByName[row.dimensionValues[0].value] = { sessions: Number(row.metricValues[0].value), views: Number(row.metricValues[1].value) }; });
  const prevSessionsTotal = Object.values(prevByName).reduce((a, c) => a + c.sessions, 0);
  const aiPages = await topArticles(brand, aiLanding.map((r) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) })));
  const geo = (rows) => {
    const total = Number(rows.totals?.[0]?.value || 0);
    return rows
      .filter((r) => !['(not set)', ''].includes(r.dimensionValues[0].value))
      .slice(0, 5)
      .map((r) => ({ name: r.dimensionValues[0].value, pct: total ? Number(r.metricValues[0].value) / total : 0 }));
  };

  const share = (rows, idx = 0) => {
    const total = rows.reduce((a, r) => a + Number(r.metricValues[idx].value), 0);
    return rows.map((r) => ({ name: r.dimensionValues[0].value, value: Number(r.metricValues[idx].value), pct: total ? Number(r.metricValues[idx].value) / total : 0 }));
  };
  const known = (list) => list.filter((x) => x.name !== 'unknown' && x.name !== '(not set)');
  const renorm = (list) => { const t = list.reduce((a, x) => a + x.value, 0); return list.map((x) => ({ ...x, pct: t ? x.value / t : 0 })); };

  const grandUsers = Number(countryRows.totals?.[0]?.value || 0) || share(devices).reduce((a, x) => a + x.value, 0);
  const REG_ES = { Bogota: 'Bogotá D.C.', Atlantico: 'Atlántico', Bolivar: 'Bolívar', Boyaca: 'Boyacá', Narino: 'Nariño', Cordoba: 'Córdoba', Quindio: 'Quindío', Caqueta: 'Caquetá', Choco: 'Chocó', Guainia: 'Guainía', Vaupes: 'Vaupés', Norte_de_Santander: 'Norte de Santander' };
  const regions = regionRows
    .filter((x) => !['(not set)', ''].includes(x.dimensionValues[0].value))
    .slice(0, 6)
    .map((x) => ({ name: REG_ES[x.dimensionValues[0].value] || x.dimensionValues[0].value, pct: grandUsers ? Number(x.metricValues[0].value) / grandUsers : 0 }));
  const OS_ES = { Macintosh: 'macOS', 'Chrome OS': 'ChromeOS' };
  const osPrev = share(osPrevRows);
  const osList = share(osRows).filter((x) => x.name !== '(not set)').slice(0, 5).map((x) => ({ name: OS_ES[x.name] || x.name, pct: x.pct, prevPct: (osPrev.find((y) => y.name === x.name) || {}).pct ?? null }));
  const brands = share(brandRows).filter((x) => !['(not set)', ''].includes(x.name)).slice(0, 5).map((x) => ({ name: x.name, pct: x.pct }));
  const intUsers = (rows) => rows.filter((x) => x.dimensionValues[0].value !== '(not set)');
  const intTotal = grandUsers;
  const notSetRow = intRows.find((x) => x.dimensionValues[0].value === '(not set)');
  const REL = /travel|food|dining|home|garden|luxury|architect|interior|design|fashion|apparel|beauty|wine|restaurant|real estate|vehicle|auto|culture|art|shopper|hotel|resort/i;
  const INT_ES = [
    ['Travel', 'Viajes'], ['Food & Dining', 'Gastronomía'], ['Home & Garden', 'Hogar y jardín'], ['Luxury', 'Lujo'], ['Fashion', 'Moda'], ['Apparel', 'Ropa'],
    ['Beauty & Wellness', 'Belleza y bienestar'], ['Wine', 'Vinos'], ['Restaurant', 'Restaurantes'], ['Real Estate', 'Bienes raíces'],
    ['Vehicles & Transportation', 'Vehículos'], ['Autos & Vehicles', 'Vehículos'], ['Auto', 'Autos'], ['Sports & Fitness', 'Deportes y fitness'],
    ['News & Politics', 'Noticias y política'], ['Technology', 'Tecnología'], ['Business Professionals', 'Profesionales de negocios'],
    ['Shoppers', 'Compradores'], ['Media & Entertainment', 'Medios y entretenimiento'], ['Arts & Entertainment', 'Arte y entretenimiento'],
    ['Lifestyles & Hobbies', 'Estilo de vida y hobbies'], ['Banking & Finance', 'Banca y finanzas'], ['Soccer Fans', 'Fútbol'], ['Sports Fans', 'Aficionados al deporte'],
    ['Home Decor Enthusiasts', 'Aficionados a la decoración'], ['Travel Buffs', 'Viajeros frecuentes'], ['Cooking Enthusiasts', 'Cocina'], ['Aspiring Chefs', 'Aspirantes a chef'],
    ['Shopping Enthusiasts', 'Aficionados a las compras'], ['Auto Enthusiasts', 'Aficionados a los autos'], ['Beauty Mavens', 'Expertos en belleza'], ['Luxury Shoppers', 'Compradores de lujo'],
    ['Foodies', 'Foodies'], ['Wine Enthusiasts', 'Amantes del vino'], ['Frequently Dining Out', 'Salen a comer con frecuencia'], ['Fashionistas', 'Fashionistas'], ['Value Shoppers', 'Compradores de ofertas'],
    ['Avid News Readers', 'Lectores de noticias'], ['Technophiles', 'Tecnófilos'], ['Entertainment News Enthusiasts', 'Noticias de entretenimiento'], ['Avid Local News Readers', 'Noticias locales'],
  ];
  const esInterest = (path) => {
    const parts = path.split('/').slice(-2);
    return parts.map((t) => (INT_ES.find(([en]) => en === t) || [null, t])[1]).join(' › ');
  };
  const allInt = intUsers(intRows);
  const relevant = allInt.filter((x) => REL.test(x.dimensionValues[0].value)).slice(0, 6);
  const rest = allInt.filter((x) => !relevant.includes(x)).slice(0, 6 - relevant.length);
  const pickedInt = [...relevant, ...rest];
  const interests = pickedInt.map((x) => ({ raw: x.dimensionValues[0].value, name: esInterest(x.dimensionValues[0].value), pct: intTotal ? Number(x.metricValues[0].value) / intTotal : 0 }));
  const interestsCoverage = intTotal && notSetRow ? 1 - Number(notSetRow.metricValues[0].value) / intTotal : null;
  const segTotals = { Mujeres: 0, Hombres: 0 };
  gender.forEach((x) => { const n = x.dimensionValues[0].value; if (n === 'female') segTotals.Mujeres = Number(x.metricValues[0].value); if (n === 'male') segTotals.Hombres = Number(x.metricValues[0].value); });
  const ageTotals = {};
  age.forEach((x) => { ageTotals[x.dimensionValues[0].value] = Number(x.metricValues[0].value); });
  const ageKeys = Object.keys(ageTotals).filter((k) => k !== 'unknown' && k !== '(not set)').sort();
  const cell = (rows, interest, seg) => {
    const r = rows.find((x) => x.dimensionValues[0].value === interest && x.dimensionValues[1].value === seg);
    return r ? Number(r.metricValues[0].value) : 0;
  };
  const interestsBySegment = interests.length && (Object.values(segTotals).some(Boolean) || ageKeys.length) ? {
    segments: ['Mujeres', 'Hombres', ...ageKeys],
    rows: interests.map((it) => ({
      name: it.name,
      values: [
        segTotals.Mujeres ? cell(intGenderRows, it.raw, 'female') / segTotals.Mujeres : 0,
        segTotals.Hombres ? cell(intGenderRows, it.raw, 'male') / segTotals.Hombres : 0,
        ...ageKeys.map((k) => (ageTotals[k] ? cell(intAgeRows, it.raw, k) / ageTotals[k] : 0)),
      ],
    })),
  } : null;
  const qOf = (name) => {
    const r = qualityRows.find((x) => x.dimensionValues[0].value === name);
    return r ? { sec: Number(r.metricValues[0].value), bounce: Number(r.metricValues[1].value), engagement: Number(r.metricValues[2].value), sessions: Number(r.metricValues[3].value) } : null;
  };
  const qSessions = qualityRows.reduce((a, x) => a + Number(x.metricValues[3].value), 0);
  const qw = (i) => (qSessions ? qualityRows.reduce((a, x) => a + Number(x.metricValues[i].value) * Number(x.metricValues[3].value), 0) / qSessions : 0);
  const aiQuality = { ai: qOf('AI Assistant'), organic: qOf('Organic Search'), site: qSessions ? { sec: qw(0), bounce: qw(1), engagement: qw(2), sessions: qSessions } : null };
  const sessionsTotal = channels.reduce((a, r) => a + Number(r.metricValues[0].value), 0);
  return {
    regions: regions.length ? regions : null,
    os: osList.length ? osList : null,
    brands: brands.length ? brands : null,
    interests: interests.length ? interests.map(({ raw, ...rest }) => rest) : null,
    interestsCoverage,
    debug: dbg,
    interestsBySegment,
    returning,
    newDuration,
    newChannels,
    returningDuration,
    returningChannels,
    devices: share(devices).sort((a, b) => b.pct - a.pct).map((d) => ({ ...d, prevPct: (share(prevDevices).find((x) => x.name === d.name) || {}).pct ?? null })),
    channels: channels.map((r) => ({
      name: r.dimensionValues[0].value,
      sessions: Number(r.metricValues[0].value),
      views: Number(r.metricValues[1].value),
      users: Number(r.metricValues[2].value),
      pct: sessionsTotal ? Number(r.metricValues[0].value) / sessionsTotal : 0,
      prevSessions: prevByName[r.dimensionValues[0].value]?.sessions ?? 0,
      prevViews: prevByName[r.dimensionValues[0].value]?.views ?? 0,
      prevPct: prevSessionsTotal ? (prevByName[r.dimensionValues[0].value]?.sessions ?? 0) / prevSessionsTotal : 0,
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
    ai: {
      sources: aiSources.map((r) => ({ name: r.dimensionValues[0].value, sessions: Number(r.metricValues[0].value), views: Number(r.metricValues[1].value), users: Number(r.metricValues[2].value) })),
      pages: aiPages.map((a) => ({ path: a.path, sessions: a.views, title: a.title })),
      quality: aiQuality,
    },
    cities: geo(cityRows),
    countries: geo(countryRows),
    gender: renorm(known(share(gender))),
    age: renorm(known(share(age))),
  };
}

const byNameEarly = (rows, name) => rows.find((r) => r.dimensionValues.some((v) => v.value === name));

async function buildProperty(token, propertyId, brand, range) {
  const today = new Date();
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const dayOfMonth = today.getUTCDate() - 1 || 1;
  const yearStart = `${range.end.slice(0, 4)}-01-01`;
  const prevMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
  const prevSameDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, dayOfMonth));

  const [kpis, monthly, daily, partial, sectionData, audience, hourRows, organicRows, sourceRows, hourPrevRows, dailyPrevRows, home] = await Promise.all([
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
    cachedAudience(token, propertyId, range, brand),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: range.start, endDate: range.end }],
      dimensions: [{ name: 'hour' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
    }),
    runReport(token, propertyId, {
      dateRanges: [
        { startDate: range.start, endDate: range.end, name: 'cur' },
        { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' },
      ],
      metrics: ['screenPageViews', 'sessions', 'bounceRate'].map((name) => ({ name })),
      dimensionFilter: { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'Organic Search' } } },
    }),
    runReport(token, propertyId, {
      dateRanges: [
        { startDate: range.start, endDate: range.end, name: 'cur' },
        { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' },
      ],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      limit: 10000,
    }),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: range.prevStart, endDate: range.prevEnd }],
      dimensions: [{ name: 'hour' }],
      metrics: [{ name: 'screenPageViews' }],
    }),
    runReport(token, propertyId, {
      dateRanges: [{ startDate: range.prevStart, endDate: range.prevEnd }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    buildHome(token, propertyId, range).catch((e) => { console.error('home', e.message); return null; }),
  ]);
  const socialShare = (regex) => {
    const sums = { cur: 0, prev: 0 };
    const totals = { cur: 0, prev: 0 };
    sourceRows.forEach((row) => {
      const src = row.dimensionValues[0].value.toLowerCase();
      const which = row.dimensionValues[1]?.value === 'prev' ? 'prev' : 'cur';
      const n = Number(row.metricValues[0].value);
      totals[which] += n;
      if (regex.test(src)) sums[which] += n;
    });
    const share = totals.cur ? sums.cur / totals.cur : 0;
    const prevShare = totals.prev ? sums.prev / totals.prev : null;
    return { sessions: sums.cur, share, shareChange: prevShare ? share / prevShare - 1 : null };
  };
  const social = { instagram: socialShare(/(^|\.)(instagram|ig)(\.|$)|instagram/), facebook: socialShare(/facebook|(^|\.)fb(\.|$)|^fb$/) };
  const orgCur = byNameEarly(organicRows, 'cur');
  const orgPrev = byNameEarly(organicRows, 'prev');
  const organic = orgCur ? {
    views: num(orgCur, 0), viewsChange: orgPrev ? pct(num(orgCur, 0), num(orgPrev, 0)) : null,
    sessions: num(orgCur, 1),
    bounceRate: num(orgCur, 2), bounceRateChange: orgPrev ? pct(num(orgCur, 2), num(orgPrev, 2)) : null,
  } : null;
  const hourlyViews = Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, '0')}h`, vistas: 0, sesiones: 0 }));
  hourRows.forEach((r) => {
    const h = Number(r.dimensionValues[0].value);
    if (!hourlyViews[h]) return;
    hourlyViews[h].vistas = num(r, 0);
    hourlyViews[h].sesiones = num(r, 1);
  });
  hourPrevRows.forEach((r) => { const slot = hourlyViews[Number(r.dimensionValues[0].value)]; if (slot) slot.vistasPrev = num(r, 0); });
  const prevDailyViews = dailyPrevRows.map((r) => ({ date: r.dimensionValues[0].value, value: num(r, 0) }));

  const byName = (rows, name) => rows.find((r) => r.dimensionValues.some((v) => v.value === name));
  const last = byName(kpis, 'cur');
  const prior = byName(kpis, 'prev') || { metricValues: kpis[0].metricValues.map(() => ({ value: 0 })) };

  const monthlyHistory = monthly.map((r) => ({
    month: `${MONTHS[Number(r.dimensionValues[0].value.slice(4)) - 1]} ${r.dimensionValues[0].value.slice(0, 4)}`,
    sesiones: num(r, 0), vistas: num(r, 1), usuarios: num(r, 2),
  }));

  const dailyViews = daily.map((r) => {
    const d = r.dimensionValues[0].value;
    return { date: d, label: `${Number(d.slice(6))} ${MONTHS[Number(d.slice(4, 6)) - 1]}`, value: num(r, 0) };
  });
  const aboveAvgDays = await buildAboveAvgAnalysis(token, propertyId, range, dailyViews);

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
    hourlyViews,
    prevDailyViews,
    home,
    organic,
    social,
    dailyPeaks,
    aboveAvgDays,
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
    aboveAvgDays: res.aboveAvgDays || [],
    hourlyViews: res.hourlyViews || [],
    prevDailyViews: res.prevDailyViews || [],
    home: res.home || null,
    organic: res.organic || null,
    social: res.social || null,
    sections: res.sections || [],
    topArticles: res.topArticles || [],
    audience: res.audience || null,
    sectionSummary: res.sectionSummary || null,
    septPartial: res.septPartial || null,
  };
}
