import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { getAccessToken, pool, parseHead, fetchHtml, techIssues, TECH_LABELS , buildFixes } from '../../lib/seoaudit';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SITES = { axxis: { site: 'https://revistaaxxis.com.co', gsc: 'GSC_AXXIS_URL', name: 'Revista AXXIS' }, diners: { site: 'https://revistadiners.com.co', gsc: 'GSC_DINERS_URL', name: 'Revista Diners' } };
const SITE_NAME = { axxis: 'Revista AXXIS', diners: 'Revista Diners' };
const CACHE = new Map();
const TTL = 30 * 60 * 1000;
const iso = (d) => d.toISOString().slice(0, 10);

// Revisión técnica de las páginas con más clics en Google en el periodo (no es un rastreo de todo el sitio)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const limit = Math.min(Number(url.searchParams.get('limit')) || 30, 60);
    const key = `${brand}|${range.start}|${range.end}|${limit}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

    const t0 = Date.now();
    const { site, gsc } = SITES[brand];
    const gscSite = process.env[gsc];
    const token = await getAccessToken();
    const lag = iso(new Date(Date.now() - 3 * 86400000));
    const endDate = range.end > lag ? lag : range.end;
    const startDate = range.start > endDate ? endDate : range.start;

    const rowsRes = await axios.post(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite)}/searchAnalytics/query`,
      { startDate, endDate, dimensions: ['page'], rowLimit: 200 },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const origin = site;
    const pages = (rowsRes.data.rows || [])
      .map((r) => ({ link: r.keys[0], clicks: r.clicks, impressions: r.impressions }))
      .filter((p) => p.link.startsWith(origin) && !p.link.includes('?') && !p.link.includes('#'))
      .slice(0, limit);

    const audited = await pool(pages, 8, async (p) => {
      const n = { link: p.link, path: new URL(p.link).pathname, clicks: p.clicks, impressions: p.impressions };
      const [page, ins] = await Promise.all([
        fetchHtml(p.link),
        Date.now() - t0 > 48000 ? Promise.resolve(null) : axios.post(
          'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
          { inspectionUrl: p.link, siteUrl: gscSite },
          { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 },
        ).catch(() => null),
      ]);
      if (page.html) Object.assign(n, parseHead(page.html));
      else { n.fetchError = page.error; n.title = ''; n.desc = ''; n.h1s = []; n.schema = []; n.robots = ''; n.ogImage = ''; n.canonical = ''; }
      if (ins) n.indexStatus = ins.data.inspectionResult?.indexStatusResult?.coverageState || null;
      n.issues = techIssues(n);
      return n;
    });

    const read = audited.filter((n) => !n.fetchError);
    const counts = {};
    read.forEach((n) => n.issues.forEach((k) => { (counts[k] = counts[k] || []).push({ path: n.path, link: n.link, clicks: n.clicks }); }));
    const data = {
      brand,
      range: { start: startDate, end: endDate },
      audited: audited.length,
      unread: audited.length - read.length,
      withIssues: read.filter((n) => n.issues.length).length,
      pages: read.map((n) => ({ path: n.path, link: n.link, clicks: n.clicks, issues: n.issues, title: n.h1s[0] || n.title, titleLen: n.title.length, descLen: n.desc.length, fixes: buildFixes(n, n.issues, SITE_NAME[brand]) })),
      issues: Object.entries(counts).map(([k, list]) => ({ key: k, label: TECH_LABELS[k], pages: list.length, examples: list.sort((a, b) => b.clicks - a.clicks).slice(0, 5) })).sort((a, b) => b.pages - a.pages),
      seconds: Math.round((Date.now() - t0) / 1000),
    };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('SEO tech API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
