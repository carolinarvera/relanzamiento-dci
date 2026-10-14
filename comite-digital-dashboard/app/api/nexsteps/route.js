import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { getAccessToken, runReport } from '../../lib/ga4';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Indicadores del plan de acción (revistas-nexsteps). Mismas definiciones para cualquier periodo:
// sesiones orgánicas/día, % Paid Social, rebote, vistas por sesión, clics de marca / clics totales (Search Console),
// sesiones de email/día, clics de Discover/día y campañas de Meta con gasto.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Cache-Control': 's-maxage=1200, stale-while-revalidate=3600' };
const iso = (d) => d.toISOString().slice(0, 10);
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const BRAND_WORDS = { axxis: ['axxis', 'axis', 'axsis'], diners: ['diners', 'dinners', 'diner s', 'dinner s'] };
const BRAND_RE = { axxis: /a+x+i+s/, diners: /din+ers?/ };
const CACHE = new Map();

export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }

const gsc = async (token, site, body) => (await axios.post(
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, body, { headers: { Authorization: `Bearer ${token}` } },
)).data.rows || [];

async function metaCampaigns(start, end) {
  const out = { axxis: 0, diners: 0 };
  const t = process.env.META_ACCESS_TOKEN;
  const acc = (await axios.get('https://graph.facebook.com/v19.0/me/adaccounts', { params: { fields: 'id', limit: 50, access_token: t } })).data.data || [];
  await Promise.all(acc.map(async (a) => {
    let res = await axios.get(`https://graph.facebook.com/v19.0/${a.id}/insights`, { params: { level: 'campaign', fields: 'campaign_name,spend', time_range: JSON.stringify({ since: start, until: end }), limit: 500, access_token: t } }).catch(() => null);
    for (let i = 0; res && i < 6; i += 1) {
      (res.data.data || []).forEach((r) => {
        if (Number(r.spend) <= 0) return;
        const n = (r.campaign_name || '').toLowerCase();
        if (BRAND_RE.axxis.test(n)) out.axxis += 1; else if (BRAND_RE.diners.test(n)) out.diners += 1;
      });
      if (!res.data.paging?.next) break;
      // eslint-disable-next-line no-await-in-loop
      res = await axios.get(res.data.paging.next).catch(() => null);
    }
  }));
  return out;
}

export async function GET(request) {
  try {
    const u = new URL(request.url);
    const now = new Date();
    const period = u.searchParams.get('period');
    let sp = u.searchParams;
    if (period === 'last30') {
      const endD = new Date(now.getTime() - 86400000);
      sp = new URLSearchParams({ start: iso(new Date(endD.getTime() - 29 * 86400000)), end: iso(endD) });
    } else if (period === 'current') {
      sp = new URLSearchParams({ start: iso(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))), end: iso(now) });
    }
    const range = resolveRange(sp);
    const key = `${range.start}|${range.end}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < 20 * 60 * 1000) return Response.json(hit.data, { headers: CORS });
    const token = await getAccessToken();
    const lag = iso(new Date(Date.now() - 3 * 86400000));
    const gscEnd = range.end > lag ? lag : range.end;
    const gscStart = range.start > gscEnd ? gscEnd : range.start;
    const gscDays = Math.round((Date.parse(gscEnd) - Date.parse(gscStart)) / 86400000) + 1;
    const yday = iso(new Date(Date.now() - 86400000));
    const gaEnd = range.end > yday ? yday : range.end;
    const gaStart = range.start > gaEnd ? gaEnd : range.start;
    const days = Math.round((Date.parse(gaEnd) - Date.parse(gaStart)) / 86400000) + 1;
    const dr = [{ startDate: gaStart, endDate: gaEnd }];
    const baseStart = iso(new Date(Date.parse(gaStart) - 28 * 86400000));
    const meta = await metaCampaigns(range.start, range.end).catch(() => ({ axxis: null, diners: null }));
    const one = async (brand) => {
      const prop = brand === 'axxis' ? process.env.GA4_AXXIS_ID : process.env.GA4_DINERS_ID;
      const site = brand === 'axxis' ? process.env.GSC_AXXIS_URL : process.env.GSC_DINERS_URL;
      const [ch, kp, tot, qs, disc] = await Promise.all([
        runReport(token, prop, { dateRanges: dr, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], limit: 50 }),
        runReport(token, prop, { dateRanges: [{ startDate: baseStart, endDate: gaEnd }], dimensions: [{ name: 'date' }], metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'bounceRate' }], limit: 200 }),
        gsc(token, site, { startDate: gscStart, endDate: gscEnd }),
        gsc(token, site, { startDate: gscStart, endDate: gscEnd, dimensions: ['query'], rowLimit: 25000 }),
        gsc(token, site, { startDate: gscStart, endDate: gscEnd, type: 'discover', dimensions: ['date'], rowLimit: 1000 }).catch(() => []),
      ]);
      const sess = (n) => ch.filter((r) => r.dimensionValues[0].value === n).reduce((a, r) => a + Number(r.metricValues[0].value), 0);
      const totS = ch.reduce((a, r) => a + Number(r.metricValues[0].value), 0);
      const median = (a) => { const v = a.slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : 0; };
      const daily = kp.map((r) => ({ d: r.dimensionValues[0].value, s: Number(r.metricValues[0].value), v: Number(r.metricValues[1].value), b: Number(r.metricValues[2].value) }));
      daily.sort((x, y) => (x.d < y.d ? -1 : 1));
      const base = daily.filter((x) => x.d < gaStart.replace(/-/g, '') && x.s > 0);
      const baseVps = median(base.map((x) => x.v / x.s));
      const baseBounce = median(base.map((x) => x.b));
      const inRange = daily.filter((x) => x.d >= gaStart.replace(/-/g, '') && x.s > 0);
      // Día anómalo: vistas por sesión >35% sobre lo normal con rebote <75% de lo normal, o >2x lo normal (señal de etiquetado de GA4 duplicado)
      const bad = (x) => baseVps && ((x.v / x.s > baseVps * 1.35 && x.b < baseBounce * 0.75) || x.v / x.s > baseVps * 2);
      const clean = inRange.filter((x) => !bad(x));
      // Sin al menos 3 días limpios no se reporta: la cifra sería del etiquetado duplicado, no de la audiencia.
      const useRows = clean.length >= 3 ? clean : [];
      const cs = useRows.reduce((a, x) => a + x.s, 0);
      const vpsClean = cs ? useRows.reduce((a, x) => a + x.v, 0) / cs : null;
      const bounceClean = cs ? useRows.reduce((a, x) => a + x.b * x.s, 0) / cs : null;
      const firstBad = inRange.find(bad)?.d;
      const totalClicks = tot[0]?.clicks || 0;
      const brandClicks = qs.filter((r) => BRAND_WORDS[brand].some((w) => norm(r.keys[0]).includes(w))).reduce((a, r) => a + r.clicks, 0);
      return {
        orgPerDay: sess('Organic Search') / days,
        paidSocialShare: totS ? sess('Paid Social') / totS : null,
        bounce: bounceClean,
        viewsPerSession: vpsClean,
        ga4Quality: { excludedDays: inRange.length - clean.length, totalDays: inRange.length, anomalyFrom: firstBad ? `${firstBad.slice(0, 4)}-${firstBad.slice(4, 6)}-${firstBad.slice(6)}` : null, baseVps, baseBounce },
        brandClickShare: totalClicks ? brandClicks / totalClicks : null,
        emailPerDay: sess('Email') / days,
        discoverPerDay: disc.reduce((a, r) => a + r.clicks, 0) / gscDays,
        metaCampaigns: meta[brand],
        sessions: totS,
      };
    };
    const [axxis, diners] = await Promise.all([one('axxis'), one('diners')]);
    const data = { range: { start: range.start, end: range.end, label: range.label, days }, gaRange: { start: gaStart, end: gaEnd }, gscRange: { start: gscStart, end: gscEnd }, axxis, diners };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data, { headers: CORS });
  } catch (error) {
    return Response.json({ error: error.response?.data?.error?.message || error.message }, { status: 502, headers: CORS });
  }
}
