import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { toks, unesc, getAccessToken, pool, parseHead, analyzeContent, fetchHtml, techIssues } from '../../lib/seoaudit';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SITES = { axxis: { site: 'https://revistaaxxis.com.co', gsc: 'GSC_AXXIS_URL' }, diners: { site: 'https://revistadiners.com.co', gsc: 'GSC_DINERS_URL' } };
const CACHE = new Map();
const TTL = 30 * 60 * 1000;
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => iso(new Date(Date.parse(s) + n * 86400000));

function evaluate(n) {
  const errors = []; const warns = [];
  if (n.fetchError) {
    // contenido sí se evalúa; lo que depende del HTML publicado queda sin verificar
    if (n.words < 300) errors.push(`Texto corto (${n.words} palabras)`);
    else if (n.words < 600) warns.push(`Texto de ${n.words} palabras (ideal 600 o más)`);
    if (n.imgs && n.imgsAlt / n.imgs < 0.8) errors.push(`Alt en ${n.imgsAlt} de ${n.imgs} imágenes`);
    if (n.internal < 3) warns.push(`${n.internal} enlace(s) interno(s) (ideal 3 o más)`);
    warns.push('No se pudo leer la página publicada: title, descripción y schema sin verificar');
    n.coverage = null; n.mainQuery = null; n.errors = errors; n.warns = warns;
    n.level = errors.length ? 'rojo' : 'amarillo';
    return n;
  }
  const tl = n.title.length;
  if (!n.title) errors.push('Sin etiqueta title');
  else if (tl < 25) errors.push(`Title corto (${tl})`);
  else if (tl > 65) warns.push(`Title largo (${tl}, ideal hasta 60)`);
  if (!n.desc) errors.push('Sin meta description');
  else if (n.desc.length > 165) warns.push(`Descripción larga (${n.desc.length}, ideal hasta 155)`);
  else if (n.desc.length < 70) warns.push(`Descripción corta (${n.desc.length})`);
  if (n.h1s.length !== 1) errors.push(`${n.h1s.length} etiquetas H1`);
  if (n.canonical && n.canonical.replace(/\/$/, '') !== n.link.replace(/\/$/, '')) errors.push('Canonical distinto a la URL');
  if (/noindex/i.test(n.robots)) errors.push('Marcada como noindex');
  if (!n.ogImage) errors.push('Sin imagen para redes (og:image)');
  if (!n.schema.some((t) => ['NewsArticle', 'Article', 'BlogPosting'].includes(t))) errors.push('Sin schema de artículo');
  if (n.words < 300) errors.push(`Texto corto (${n.words} palabras)`);
  else if (n.words < 600) warns.push(`Texto de ${n.words} palabras (ideal 600 o más)`);
  if (n.words >= 600 && n.h2 < 2) warns.push(`Solo ${n.h2} subtítulo(s) H2 en ${n.words} palabras`);
  if (!n.imgs) warns.push('Sin imágenes en el texto');
  else if (n.imgsAlt / n.imgs < 0.8) errors.push(`Alt en ${n.imgsAlt} de ${n.imgs} imágenes`);
  if (n.internal < 3) warns.push(`${n.internal} enlace(s) interno(s) (ideal 3 o más)`);
  const slug = n.path.replace(/\/$/, '').split('/').pop() || '';
  if (slug.length > 75) warns.push(`URL larga (${slug.length})`);
  const kt = [...new Set(toks(n.title))].slice(0, 5);
  n.coverage = null;
  if (kt.length) {
    const cov = (txt) => { const s = new Set(toks(txt)); return kt.filter((w) => s.has(w)).length / kt.length; };
    n.coverage = { slug: cov(slug.replace(/-/g, ' ')), desc: cov(n.desc), h1: cov(n.h1s.join(' ')), inicio: cov(n.first100) };
    if (n.coverage.inicio < 0.4) warns.push('El título y el inicio del texto comparten pocas palabras');
    if (n.coverage.slug < 0.4) warns.push('La URL no refleja el tema del título');
    if (n.coverage.desc < 0.4) warns.push('La descripción no retoma los términos del título');
  }
  const status = String(n.indexStatus || '');
  if (n.indexStatus && !status.startsWith('Submitted and indexed') && !status.startsWith('Indexed')) (n.ageDays >= 2 ? errors : warns).push(`Indexación: ${status}`);
  if (n.impressions === 0 && n.ageDays >= 5) warns.push(`Sin impresiones tras ${n.ageDays} días`);
  // palabra clave principal: la consulta con más impresiones en Google
  const q = (n.queries || []).filter((x) => x.impressions >= 8 && !/site:/.test(x.query)).sort((a, b) => b.impressions - a.impressions)[0];
  n.mainQuery = null;
  if (q) {
    const qt = toks(q.query);
    const has = (txt) => { const s = new Set(toks(txt)); return qt.length ? qt.every((w) => s.has(w)) : true; };
    n.mainQuery = { query: q.query, impressions: q.impressions, clicks: q.clicks, position: q.position, inTitle: has(n.title), inSlug: has(slug.replace(/-/g, ' ')), inDesc: has(n.desc) };
    if (!n.mainQuery.inTitle) warns.push(`La consulta que más trae tráfico ("${q.query}") no está en el título`);
  }
  n.errors = errors; n.warns = warns;
  n.level = errors.length ? 'rojo' : warns.length ? 'amarillo' : 'verde';
  return n;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const key = `${brand}|${range.start}|${range.end}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

    const t0 = Date.now();
    const { site, gsc } = SITES[brand];
    const gscSite = process.env[gsc];
    const host = site.replace('https://', '');
    const today = iso(new Date());
    const end = range.end > today ? today : range.end;

    // ---- notas publicadas en el periodo ----
    let posts = [];
    for (let page = 1; page <= 8; page += 1) {
      let res = null;
      for (let attempt = 0; attempt < 2 && !res; attempt += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          res = await axios.get(`${site}/wp-json/wp/v2/posts`, {
            params: { after: `${range.start}T00:00:00`, before: `${addDays(end, 1)}T00:00:00`, per_page: 20, page, _fields: 'id,date,link,title,content' },
            timeout: 30000, validateStatus: () => true,
          });
        } catch (e) { res = null; }
      }
      if (!res || res.status !== 200 || !Array.isArray(res.data)) break;
      posts = posts.concat(res.data);
      if (res.data.length < 20) break;
    }
    const total = posts.length;
    posts = posts.slice(0, 60);

    const token = await getAccessToken();
    const lag = iso(new Date(Date.now() - 3 * 86400000));
    const gscEnd = end > lag ? lag : end;

    // una sola cola: cada nota lee su página, consulta Search Console y su indexación
    const notes = await pool(posts, brand === 'diners' ? 12 : 10, async (p) => {
      const link = p.link;
      const path = new URL(link).pathname;
      const date = p.date.slice(0, 10);
      const n = { id: p.id, link, path, date, ageDays: Math.round((Date.parse(today) - Date.parse(date)) / 86400000), titleWp: unesc(String(p.title?.rendered || '').replace(/<[^>]+>/g, '')) };
      const [page, gscRes, insRes] = await Promise.all([
        fetchHtml(link),
        n.date > gscEnd ? Promise.resolve(null) : axios.post(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite)}/searchAnalytics/query`,
          { startDate: n.date, endDate: gscEnd, dimensions: ['query'], dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: n.link }] }], rowLimit: 10 },
          { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 },
        ).catch(() => null),
        Date.now() - t0 > 48000 ? Promise.resolve(null) : axios.post(
          'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
          { inspectionUrl: link, siteUrl: gscSite },
          { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 },
        ).catch(() => null),
      ]);
      if (page.html) Object.assign(n, parseHead(page.html));
      else { n.fetchError = page.error; n.title = ''; n.desc = ''; n.h1s = []; n.schema = []; n.robots = ''; n.ogImage = ''; n.canonical = ''; }
      Object.assign(n, analyzeContent(String(p.content?.rendered || ''), host));
      n.queries = ((gscRes && gscRes.data.rows) || []).map((x) => ({ query: x.keys[0], clicks: x.clicks, impressions: x.impressions, position: Math.round(x.position * 10) / 10 }));
      n.impressions = n.queries.reduce((a2, x) => a2 + x.impressions, 0);
      n.clicks = n.queries.reduce((a2, x) => a2 + x.clicks, 0);
      if (insRes) n.indexStatus = insRes.data.inspectionResult?.indexStatusResult?.coverageState || 'Sin dato';
      return n;
    });

    const rows = notes.map(evaluate).sort((a, b) => b.errors.length * 10 + b.warns.length - (a.errors.length * 10 + a.warns.length));
    const N = rows.length;
    const c = (f) => rows.filter(f).length;
    const read = rows.filter((r) => !r.fetchError);
    const cr = (f) => read.filter(f).length;
    const okTitle = (r) => r.title && r.title.length >= 25 && r.title.length <= 65;
    const withQ = rows.filter((r) => r.mainQuery);
    const criteria = [
      { key: 'title', label: 'Title entre 25 y 60 caracteres', standard: 'Google corta cerca de 60', ok: cr((r) => r.title && r.title.length >= 25 && r.title.length <= 65), total: read.length },
      { key: 'desc', label: 'Descripción entre 70 y 155 caracteres', standard: 'Más larga se corta en Google', ok: cr((r) => r.desc && r.desc.length >= 70 && r.desc.length <= 165), total: read.length },
      { key: 'h1', label: 'Un solo H1', standard: 'Uno por página', ok: cr((r) => r.h1s.length === 1), total: read.length },
      { key: 'h2', label: 'Subtítulos H2 (textos de 600 palabras o más)', standard: 'Al menos 2 para ordenar el texto', ok: c((r) => r.words >= 600 && r.h2 >= 2), total: c((r) => r.words >= 600) },
      { key: 'words', label: 'Texto de 600 palabras o más', standard: 'Profundidad editorial', ok: c((r) => r.words >= 600), total: N },
      { key: 'alt', label: 'Imágenes con alt en 80% o más', standard: 'Accesibilidad y búsqueda de imágenes', ok: c((r) => r.imgs && r.imgsAlt / r.imgs >= 0.8), total: N },
      { key: 'internal', label: '3 o más enlaces internos', standard: 'Distribuye autoridad y sube vistas por sesión', ok: c((r) => r.internal >= 3), total: N },
      { key: 'schema', label: 'Schema de artículo', standard: 'Datos estructurados', ok: cr((r) => r.schema.some((t) => ['NewsArticle', 'Article', 'BlogPosting'].includes(t))), total: read.length },
      { key: 'og', label: 'Imagen para redes (og:image)', standard: 'Vista previa al compartir', ok: cr((r) => !!r.ogImage), total: read.length },
      { key: 'index', label: 'Indexada en Google', standard: 'Inspección de URL de Search Console', ok: c((r) => /^(Submitted and indexed|Indexed)/.test(String(r.indexStatus || ''))), total: c((r) => r.indexStatus) },
      { key: 'kw', label: 'Consulta principal dentro del título y la URL', standard: 'Solo notas con 8 o más impresiones', ok: withQ.filter((r) => r.mainQuery.inTitle && r.mainQuery.inSlug).length, total: withQ.length },
    ];
    const data = {
      brand, range: { start: range.start, end, label: range.label },
      total, audited: N, unread: N - read.length,
      levels: { rojo: c((r) => r.level === 'rojo'), amarillo: c((r) => r.level === 'amarillo'), verde: c((r) => r.level === 'verde') },
      criteria,
      notes: rows.map((r) => ({
        link: r.link, path: r.path, title: r.titleWp, date: r.date, ageDays: r.ageDays, level: r.level,
        words: r.words, titleLen: r.title.length, descLen: r.desc.length, h2: r.h2, imgs: r.imgs, imgsAlt: r.imgsAlt, internal: r.internal,
        indexStatus: r.indexStatus || null, impressions: r.impressions, clicks: r.clicks, mainQuery: r.mainQuery,
        errors: r.errors, warns: r.warns, fetchError: r.fetchError || null, tech: techIssues(r),
      })),
      seconds: Math.round((Date.now() - t0) / 1000),
    };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('SEO quality API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
