import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';

const iso = (d) => d.toISOString().slice(0, 10);
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const BRAND_TOKENS = { axxis: ['axxis', 'axis', 'axsis'], diners: ['diners', 'dinners', 'diner s', 'dinner s'] };
const isBrand = (q, brand) => BRAND_TOKENS[brand].some((b) => norm(q).includes(b));
const isNavigational = (q) => /(^|\s)(www|http|https)(\s|$)|\.com|\.co\b/.test(q);
const SITES = { axxis: 'GSC_AXXIS_URL', diners: 'GSC_DINERS_URL' };
const PROPS = { axxis: 'GA4_AXXIS_ID', diners: 'GA4_DINERS_ID' };

const CACHE = new Map();
const TTL = 30 * 60 * 1000;

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

async function gsc(token, siteUrl, body) {
  const res = await axios.post(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.rows || [];
}

// hasta 50.000 filas por consulta (dos páginas de 25.000)
async function gscAll(token, siteUrl, body) {
  const first = await gsc(token, siteUrl, { ...body, rowLimit: 25000, startRow: 0 });
  if (first.length < 25000) return first;
  const second = await gsc(token, siteUrl, { ...body, rowLimit: 25000, startRow: 25000 });
  return first.concat(second);
}

async function ga4(token, propertyId, body) {
  const res = await axios.post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.rows || [];
}


const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
// mismo día, N meses atrás (si el día no existe, queda en el último del mes)
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

const pct = (cur, prev) => (prev ? cur / prev - 1 : null);
const totals = (rows) => {
  const clicks = rows.reduce((a, r) => a + r.clicks, 0);
  const impressions = rows.reduce((a, r) => a + r.impressions, 0);
  const posW = rows.reduce((a, r) => a + r.position * r.impressions, 0);
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: impressions ? posW / impressions : 0 };
};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const key = `${brand}|${range.start}|${range.end}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

    const siteUrl = process.env[SITES[brand]];
    const propertyId = process.env[PROPS[brand]];
    const token = await getAccessToken();

    const lag = iso(new Date(Date.now() - 3 * 86400000));
    const endDate = range.end > lag ? lag : range.end;
    const startDate = range.start > endDate ? endDate : range.start;
    const days = Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86400000) + 1;
    const prevEnd = iso(new Date(Date.parse(startDate) - 86400000));
    const prevStart = iso(new Date(Date.parse(startDate) - days * 86400000));

    const cur = { startDate, endDate };
    const prev = { startDate: prevStart, endDate: prevEnd };
    const origin = new URL(siteUrl.startsWith('sc-domain:') ? `https://${siteUrl.slice(10)}` : siteUrl).origin;

    const periods = [
      { key: 'cur', start: range.start, end: range.end },
      { key: 'prevMonth', start: shift(range.start, -1), end: shift(range.end, -1) },
      { key: 'prevYear', start: shift(range.start, -12), end: shift(range.end, -12) },
    ];
    const organicFilter = { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'Organic Search' } } };
    const comparePromise = Promise.all(periods.map((pd) => ga4(token, propertyId, {
      dateRanges: [{ startDate: pd.start, endDate: pd.end }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
      dimensionFilter: organicFilter,
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }).catch(() => []))).then((lists) => lists.map((rows, i) => {
      const byDate = {};
      rows.forEach((r) => { byDate[r.dimensionValues[0].value] = { views: Number(r.metricValues[0].value), sessions: Number(r.metricValues[1].value) }; });
      return { ...periods[i], label: labelRange(periods[i].start, periods[i].end), byDate };
    }));

    const organicTotals = ga4(token, propertyId, {
      dateRanges: [
        { startDate: range.start, endDate: range.end, name: 'cur' },
        { startDate: range.prevStart, endDate: range.prevEnd, name: 'prev' },
      ],
      metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'bounceRate' }],
      dimensionFilter: organicFilter,
    }).catch(() => []);

    const [qCur, qPrev, pCur, pPrev, daily, gaDaily, compared, orgTot] = await Promise.all([
      gscAll(token, siteUrl, { ...cur, dimensions: ['query'] }),
      gscAll(token, siteUrl, { ...prev, dimensions: ['query'] }),
      gsc(token, siteUrl, { ...cur, dimensions: ['page'], rowLimit: 1000 }),
      gsc(token, siteUrl, { ...prev, dimensions: ['page'], rowLimit: 1000 }),
      gsc(token, siteUrl, { ...cur, dimensions: ['date'], rowLimit: 100 }),
      ga4(token, propertyId, {
        dateRanges: [{ startDate: range.start, endDate: range.end }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
        dimensionFilter: { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { matchType: 'EXACT', value: 'Organic Search' } } },
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }).catch(() => []),
      comparePromise,
      organicTotals,
    ]);

    // ---- totales y marca vs sin marca ----
    const kpiCur = totals(qCur);
    const kpiPrev = totals(qPrev);
    const isNon = (r) => !isBrand(r.keys[0], brand) && !isNavigational(r.keys[0]);
    const nonCur = qCur.filter(isNon);
    const nonPrev = qPrev.filter(isNon);
    const nonClicks = nonCur.reduce((a, r) => a + r.clicks, 0);
    const brandClicks = qCur.filter((r) => isBrand(r.keys[0], brand)).reduce((a, r) => a + r.clicks, 0);

    // ---- palabras clave sin marca con comparación ----
    const prevMap = new Map(nonPrev.map((r) => [r.keys[0], r]));
    const merged = nonCur.map((r) => {
      const p = prevMap.get(r.keys[0]);
      return {
        key: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position,
        prevClicks: p ? p.clicks : 0, prevPosition: p ? p.position : null,
        deltaClicks: r.clicks - (p ? p.clicks : 0),
      };
    });
    const curMap = new Map(nonCur.map((r) => [r.keys[0], r]));
    const lost = nonPrev
      .filter((r) => !curMap.has(r.keys[0]))
      .map((r) => ({ key: r.keys[0], clicks: 0, impressions: 0, ctr: 0, position: null, prevClicks: r.clicks, prevPosition: r.position, deltaClicks: -r.clicks }));

    const keywords = merged.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 150);
    const winners = merged.filter((r) => r.deltaClicks > 0).sort((a, b) => b.deltaClicks - a.deltaClicks).slice(0, 10);
    const losers = merged.concat(lost).filter((r) => r.deltaClicks < 0).sort((a, b) => a.deltaClicks - b.deltaClicks).slice(0, 10);

    // ---- oportunidades: CTR objetivo = el que ya obtiene el sitio en posición 1-3 ----
    // los umbrales de volumen se ajustan a la duración del rango (base: 30 días)
    const scale = Math.max(days / 30, 0.2);
    const minImp = (base) => Math.max(Math.round(base * scale), 30);
    const ctrOf = (rows) => {
      const imp = rows.reduce((a, r) => a + r.impressions, 0);
      return imp ? rows.reduce((a, r) => a + r.clicks, 0) / imp : 0;
    };
    let top3 = nonCur.filter((r) => r.position <= 3 && r.impressions >= minImp(100));
    if (!top3.length) top3 = nonCur.filter((r) => r.position <= 3 && r.impressions >= 20);
    const targetCtr = ctrOf(top3);
    const oppAll = merged
      .filter((r) => r.impressions >= minImp(200) && r.position > 3.5 && r.position <= 20.5)
      .map((r) => ({ ...r, potentialClicks: Math.max(0, r.impressions * (targetCtr - r.ctr)), action: r.position <= 10.5 ? 'Mejorar título y descripción' : 'Reforzar contenido y enlaces internos' }))
      .filter((r) => r.potentialClicks >= 3)
      .sort((a, b) => b.potentialClicks - a.potentialClicks);
    const opportunities = oppAll.slice(0, 20);
    const newAll = merged
      .filter((r) => r.impressions >= minImp(300) && r.position > 20.5)
      .sort((a, b) => b.impressions - a.impressions);
    const newContent = newAll.slice(0, 10);
    const sumBy = (list, f) => list.reduce((a, r) => a + f(r), 0);
    const titleOpp = oppAll.filter((r) => r.position <= 10.5);
    const contentOpp = oppAll.filter((r) => r.position > 10.5);
    const lostAll = merged.concat(lost).filter((r) => r.deltaClicks < 0);
    const wonAll = merged.filter((r) => r.deltaClicks > 0);

    // ---- páginas ----
    const pPrevMap = new Map(pPrev.map((r) => [r.keys[0], r]));
    const pagesAll = pCur.map((r) => {
      const p = pPrevMap.get(r.keys[0]);
      return { key: r.keys[0].replace(origin, '') || '/', clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position, prevClicks: p ? p.clicks : 0, deltaClicks: r.clicks - (p ? p.clicks : 0) };
    });
    const pages = pagesAll.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 15);
    const pageLosersAll = pagesAll.filter((r) => r.deltaClicks < 0 && r.prevClicks >= 10).sort((a, b) => a.deltaClicks - b.deltaClicks);
    const pageLosers = pageLosersAll.slice(0, 8);

    // ---- series diarias ----
    const series = daily.map((r) => ({ date: r.keys[0], label: `${Number(r.keys[0].slice(8))} ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][Number(r.keys[0].slice(5, 7)) - 1]}`, clics: r.clicks, impresiones: r.impressions, posicion: r.position }));
    const gaSeries = {};
    gaDaily.forEach((r) => { gaSeries[r.dimensionValues[0].value] = { sessions: Number(r.metricValues[0].value), views: Number(r.metricValues[1].value) }; });
    series.forEach((s) => { const g = gaSeries[s.date.replace(/-/g, '')]; s.sesionesOrganicas = g ? g.sessions : null; });
    const orgSessions = Object.values(gaSeries).reduce((a, g) => a + g.sessions, 0);

    const dayCount = Math.round((Date.parse(range.end) - Date.parse(range.start)) / 86400000) + 1;
    const addDays = (d, n) => iso(new Date(Date.parse(d) + n * 86400000)).replace(/-/g, '');
    const compare = {
      periods: compared.map((c) => {
        const vals = Object.values(c.byDate);
        return { key: c.key, label: c.label, start: c.start, end: c.end, views: vals.reduce((a, v) => a + v.views, 0), sessions: vals.reduce((a, v) => a + v.sessions, 0), hasData: vals.length > 0 };
      }),
      points: Array.from({ length: dayCount }, (_, i) => {
        const pt = { day: i + 1 };
        compared.forEach((c) => {
          const v = c.byDate[addDays(c.start, i)];
          pt[`${c.key}Views`] = v ? v.views : null;
          pt[`${c.key}Sessions`] = v ? v.sessions : null;
        });
        return pt;
      }),
    };

    const oc = orgTot.find((r) => r.dimensionValues?.some((v) => v.value === 'cur'));
    const op = orgTot.find((r) => r.dimensionValues?.some((v) => v.value === 'prev'));
    const g = (row, i) => (row ? Number(row.metricValues[i].value) : null);
    const organic = oc ? {
      views: g(oc, 0), viewsChange: op ? pct(g(oc, 0), g(op, 0)) : null,
      sessions: g(oc, 1), sessionsChange: op ? pct(g(oc, 1), g(op, 1)) : null,
      bounceRate: g(oc, 2), bounceRateChange: op ? pct(g(oc, 2), g(op, 2)) : null,
    } : null;
    const summary = {
      lost: { count: lostAll.length, clicks: -sumBy(lostAll, (r) => r.deltaClicks), pages: pageLosersAll.length, pageClicks: -sumBy(pageLosersAll, (r) => r.deltaClicks) },
      won: { count: wonAll.length, clicks: sumBy(wonAll, (r) => r.deltaClicks) },
      titles: { count: titleOpp.length, potential: Math.round(sumBy(titleOpp, (r) => r.potentialClicks)) },
      content: { count: contentOpp.length, potential: Math.round(sumBy(contentOpp, (r) => r.potentialClicks)) },
      newNotes: { count: newAll.length, impressions: sumBy(newAll, (r) => r.impressions) },
    };

    const data = {
      organic, summary,
      compare,
      range: { ...range, gscStart: startDate, gscEnd: endDate, gscPrevStart: prevStart, gscPrevEnd: prevEnd },
      brand,
      kpis: {
        clicks: kpiCur.clicks, clicksChange: pct(kpiCur.clicks, kpiPrev.clicks),
        impressions: kpiCur.impressions, impressionsChange: pct(kpiCur.impressions, kpiPrev.impressions),
        ctr: kpiCur.ctr, ctrDiff: kpiPrev.ctr ? kpiCur.ctr - kpiPrev.ctr : null,
        position: kpiCur.position, positionChange: kpiPrev.position ? kpiCur.position / kpiPrev.position - 1 : null,
        organicSessions: orgSessions,
        brandShare: kpiCur.clicks ? brandClicks / kpiCur.clicks : 0,
        nonBrandClicks: nonClicks, brandClicks,
        nonBrandQueries: nonCur.length,
      },
      targetCtr,
      series,
      keywords, winners, losers, opportunities, newContent, pages, pageLosers,
      truncated: qCur.length >= 50000,
    };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.response?.data?.error_description || error.message;
    console.error('SEO tools API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
