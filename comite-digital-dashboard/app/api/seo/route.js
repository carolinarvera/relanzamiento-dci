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


const BRAND_TOKENS = { axxis: ['axxis', 'axis', 'axsis'], diners: ['diners', 'dinners', 'diner s', 'dinner s'] };
const STOP = new Set(('a al algo ante antes como con contra cual cuales cuando de del desde donde el ella ellos en entre era es esta este esto estos fue ha hacer hay la las le les lo los mas mi mis muy no nos o para pero por que se ser si sin sobre su sus tambien te tu tus un una uno unos y ya ver top mejores mejor nuevo nueva nuevos nuevas 2020 2021 2022 2023 2024 2025 2026 2027 www com co net org https http revista').split(' '));

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const isBrand = (q, brand) => BRAND_TOKENS[brand].some((b) => norm(q).includes(b));
const isNavigational = (q) => /(^|\s)(www|http|https)(\s|$)|\.com|\.co\b/.test(q);

function buildTopics(rows) {
  const total = rows.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 });
  const avgCtr = total.i ? total.c / total.i : 0;
  const terms = new Map();
  rows.forEach((r) => {
    const words = norm(r.keys[0]).split(' ').filter((w) => w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w));
    const grams = new Set(words);
    for (let i = 0; i < words.length - 1; i += 1) grams.add(`${words[i]} ${words[i + 1]}`);
    grams.forEach((g) => {
      const t = terms.get(g) || { term: g, clicks: 0, impressions: 0, posWeighted: 0, queries: 0 };
      t.clicks += r.clicks; t.impressions += r.impressions; t.posWeighted += r.position * r.impressions; t.queries += 1;
      terms.set(g, t);
    });
  });
  const candidates = [...terms.values()]
    .filter((t) => t.impressions >= 300 && t.queries >= 3 && t.clicks / t.impressions > avgCtr)
    .map((t) => ({ term: t.term, clicks: t.clicks, impressions: t.impressions, ctr: t.clicks / t.impressions, position: t.posWeighted / t.impressions, queries: t.queries, vsAvg: t.clicks / t.impressions / avgCtr }))
    .sort((a, b) => b.clicks - a.clicks);
  const pruned = candidates.filter((c) => c.term.includes(' ') || !candidates.some((b) => b.term.includes(' ') && b.term.split(' ').includes(c.term) && b.clicks >= c.clicks * 0.6));
  const chosen = [];
  pruned.forEach((c) => {
    if (chosen.length >= 10) return;
    const covered = chosen.some((x) => (x.term.includes(c.term) && x.clicks >= c.clicks * 0.6) || (c.term.includes(x.term) && c.clicks >= x.clicks * 0.6 && false));
    if (!covered) chosen.push(c);
  });
  return { avgCtr, topics: chosen };
}

async function fetchTrends(matchSet) {
  try {
    const res = await axios.get('https://trends.google.com/trending/rss?geo=CO', { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000, responseType: 'text' });
    const items = [...res.data.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    const pick = (block, tag) => (block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)) || [])[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || null;
    const decode = (t) => (t || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    return items.slice(0, 20).map((b) => {
      const title = decode(pick(b, 'title'));
      const words = norm(title).split(' ').filter((w) => w.length >= 4 && !STOP.has(w));
      return {
        title,
        traffic: pick(b, 'ht:approx_traffic'),
        news: decode(pick(b, 'ht:news_item_title')),
        newsUrl: pick(b, 'ht:news_item_url'),
        source: decode(pick(b, 'ht:news_item_source')),
        matches: words.filter((w) => matchSet.has(w)),
      };
    });
  } catch (e) {
    return { error: e.message };
  }
}

async function query(token, siteUrl, body) {
  const res = await axios.post(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    body,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.rows || [];
}

const shape = (r, key) => ({ key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });

async function buildSite(token, siteUrl, range, brand) {
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

  const editorial = allQueries.filter((r) => !isBrand(r.keys[0], brand) && !isNavigational(r.keys[0]));
  const editorialTop = editorial.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 10).map((r) => shape(r, r.keys[0]));
  const opportunities = editorial
    .filter((r) => r.impressions >= 300 && r.position >= 8 && r.position <= 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .map((r) => shape(r, r.keys[0]));
  const { avgCtr, topics } = buildTopics(editorial);
  const matchSet = new Set();
  editorial.filter((r) => r.impressions >= 100).forEach((r) => norm(r.keys[0]).split(' ').forEach((w) => { if (w.length >= 4 && !STOP.has(w)) matchSet.add(w); }));

  return {
    editorialTop, opportunities, topics, topicsAvgCtr: avgCtr, editorialQueries: editorial.length,
    matchSet,
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
      buildSite(token, process.env.GSC_AXXIS_URL, range, 'axxis'),
      buildSite(token, process.env.GSC_DINERS_URL, range, 'diners'),
    ]);
    const [trendsAxxis, trendsDiners] = await Promise.all([fetchTrends(axxis.matchSet), fetchTrends(diners.matchSet)]);
    delete axxis.matchSet;
    delete diners.matchSet;
    axxis.trends = trendsAxxis;
    diners.trends = trendsDiners;
    return Response.json({ range, axxis, diners });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.response?.data?.error_description || error.message;
    console.error('SEO API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
