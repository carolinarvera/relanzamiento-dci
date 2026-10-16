import axios from 'axios';

export const STOP = new Set('a al algo ante como con contra cual cuando de del desde donde el ella en entre es esta este esto fue ha hay la las le lo los mas me mi muy no o para pero por que se si sin sobre su sus te tu un una uno y ya ver hoy asi estos estas han son ser cuales'.split(' '));
export const toks = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w) && w.length > 2);
export const unesc = (t) => (t || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
export const stripTags = (h) => unesc(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

export async function getAccessToken() {
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

export async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const k = i; i += 1;
      // eslint-disable-next-line no-await-in-loop
      out[k] = await fn(items[k], k);
    }
  }));
  return out;
}

export function attrs(tag) {
  const o = {};
  tag.replace(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"|([a-zA-Z:-]+)\s*=\s*'([^']*)'/g, (_, a, b, c, d) => { o[(a || c).toLowerCase()] = unesc(b ?? d); return ''; });
  return o;
}

export function parseHead(html) {
  const head = html.slice(0, html.search(/<\/head>/i) > 0 ? html.search(/<\/head>/i) : 60000);
  const title = unesc((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  const meta = {};
  (head.match(/<meta\s[^>]*>/gi) || []).forEach((m) => { const a = attrs(m); const k = (a.name || a.property || '').toLowerCase(); if (k && a.content !== undefined) meta[k] = a.content; });
  const canon = (head.match(/<link\s[^>]*rel=["']canonical["'][^>]*>/i) || [])[0];
  const canonical = canon ? attrs(canon).href || '' : '';
  const h1s = (html.match(/<h1[\s\S]*?<\/h1>/gi) || []).map(stripTags).filter(Boolean);
  const types = new Set();
  (html.match(/<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || []).forEach((blk) => {
    try {
      const j = JSON.parse(blk.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, ''));
      const nodes = Array.isArray(j) ? j : (j['@graph'] || [j]);
      nodes.forEach((n) => { const t = n['@type']; (Array.isArray(t) ? t : [t]).forEach((x) => x && types.add(x)); });
    } catch { /* json-ld inválido */ }
  });
  return { title, desc: (meta.description || '').trim(), robots: meta.robots || '', ogImage: meta['og:image'] || '', twitter: meta['twitter:card'] || '', canonical, h1s, schema: [...types] };
}

export function analyzeContent(html, host) {
  const text = stripTags(html);
  const words = text ? text.split(' ').length : 0;
  const imgs = (html.match(/<img\s[^>]*>/gi) || []).map((t) => attrs(t));
  const links = (html.match(/<a\s[^>]*href\s*=\s*["'][^"']+["'][^>]*>/gi) || []).map((t) => attrs(t).href).filter((h) => h && !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('tel:'));
  const internal = links.filter((h) => h.startsWith('/') || h.includes(host)).length;
  return {
    words,
    h2: (html.match(/<h2[\s>]/gi) || []).length,
    imgs: imgs.length,
    imgsAlt: imgs.filter((a) => (a.alt || '').trim()).length,
    internal,
    external: links.filter((h) => h.startsWith('http') && !h.includes(host)).length,
    first100: text.split(' ').slice(0, 100).join(' '),
    noAlt: imgs.filter((a) => !(a.alt || '').trim() && a.src).slice(0, 4).map((a) => a.src),
    firstImg: (imgs.find((a) => a.src) || {}).src || '',
  };
}


export async function fetchHtml(link) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const r = await axios.get(link, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; comite-digital-dashboard)' }, responseType: 'text', transformResponse: (x) => x });
      return { html: r.data };
    } catch (e) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, 1200 * (attempt + 1)));
      if (attempt === 2) return { error: e.message };
    }
  }
  return { error: 'sin respuesta' };
}

// Controles técnicos comunes (HTML publicado + indexación). Devuelve claves de problema.
export const TECH_LABELS = {
  h1_missing: 'Sin H1',
  h1_multiple: 'Más de un H1',
  canonical_missing: 'Sin canonical',
  canonical_diff: 'Canonical distinto a la URL',
  noindex: 'Marcada como noindex',
  title_missing: 'Sin etiqueta title',
  title_long: 'Title de más de 60 caracteres',
  title_short: 'Title corto (menos de 25)',
  desc_missing: 'Sin meta description',
  desc_long: 'Descripción de más de 155 caracteres',
  desc_short: 'Descripción corta (menos de 70)',
  og_missing: 'Sin imagen para redes (og:image)',
  schema_missing: 'Sin schema de artículo o página',
  not_indexed: 'No indexada en Google',
};
export function techIssues(n) {
  const out = [];
  if (n.fetchError) return out;
  if (n.h1s.length === 0) out.push('h1_missing'); else if (n.h1s.length > 1) out.push('h1_multiple');
  if (!n.canonical) out.push('canonical_missing');
  else if (n.canonical.replace(/\/$/, '') !== n.link.replace(/\/$/, '')) out.push('canonical_diff');
  if (/noindex/i.test(n.robots)) out.push('noindex');
  if (!n.title) out.push('title_missing'); else if (n.title.length > 65) out.push('title_long'); else if (n.title.length < 25) out.push('title_short');
  if (!n.desc) out.push('desc_missing'); else if (n.desc.length > 165) out.push('desc_long'); else if (n.desc.length < 70) out.push('desc_short');
  if (!n.ogImage) out.push('og_missing');
  if (!n.schema.length) out.push('schema_missing');
  const st = String(n.indexStatus || '');
  if (n.indexStatus && !/^(Submitted and indexed|Indexed)/.test(st)) out.push('not_indexed');
  return out;
}


// ---- textos sugeridos para corregir (se construyen con el contenido real de la nota) ----
const cutWords = (t, max) => {
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const i = cut.lastIndexOf(' ');
  let out = cut.slice(0, i > max * 0.6 ? i : max).replace(/[\s,;:\-–—|]+$/, '');
  const dangling = /\s+(y|e|o|u|de|del|la|el|los|las|en|con|para|por|un|una|que|se|su|sus|al|a|como|más|mas)$/i;
  while (dangling.test(out)) out = out.replace(dangling, '').replace(/[\s,;:\-–—|]+$/, '');
  return out;
};

export function suggestTitle(title, h1, siteName) {
  let t = (title || '').trim();
  const suffix = new RegExp(`\\s*[-–—|·]\\s*(${siteName}|Revista[^-–—|]*)$`, 'i');
  const base = t.replace(suffix, '').trim();
  if (base && base.length >= 25 && base.length <= 60) return base;
  if (base.length > 60) {
    const parts = base.split(/\s*[:|–—]\s*/);
    if (parts[0].length >= 25 && parts[0].length <= 60) return parts[0];
    return cutWords(base, 60);
  }
  const h = (h1 || '').trim();
  if (h && h.length >= 25) return cutWords(h, 60);
  return `${base || h} | ${siteName}`.slice(0, 60);
}

export function suggestDesc(desc, n) {
  const d = (desc || '').trim();
  if (d.length > 155) {
    const sentence = d.match(/^[^.!?]{70,155}[.!?]/);
    if (sentence) return sentence[0];
    return `${cutWords(d, 152)}.`;
  }
  const src = (n.first100 || '').trim() || d;
  if (!src) return '';
  const sentence = src.match(/^[^.!?]{70,155}[.!?]/);
  return sentence ? sentence[0] : `${cutWords(src, 152)}.`;
}

const altFromSrc = (src, title) => {
  const f = decodeURIComponent((src.split('/').pop() || '').replace(/\.[a-z0-9]+$/i, '')).replace(/-\d+x\d+$/, '').replace(/[-_]+/g, ' ').trim();
  return f ? `${f.charAt(0).toUpperCase()}${f.slice(1)}${title ? ` - ${cutWords(title, 38).replace(/\s+(y|e|o|u|de|del|la|el|los|las|en|con|para|por|un|una)$/i, '')}` : ''}` : (title || '');
};

export function buildFixes(n, issues, siteName) {
  const fx = {};
  if (issues.includes('title_long') || issues.includes('title_short') || issues.includes('title_missing')) {
    fx.title = { current: n.title || '', suggested: suggestTitle(n.title, (n.h1s || [])[0], siteName) };
  }
  if (issues.includes('desc_long') || issues.includes('desc_short') || issues.includes('desc_missing')) {
    fx.desc = { current: n.desc || '', suggested: suggestDesc(n.desc, n) };
  }
  if (issues.includes('alt_low') && (n.noAlt || []).length) {
    fx.alt = n.noAlt.map((src) => ({ src: src.split('/').pop(), suggested: altFromSrc(src, n.titleWp || (n.h1s || [])[0] || n.title) }));
  }
  if (issues.includes('h1_missing')) fx.h1 = { current: '', suggested: n.titleWp || n.title || '' };
  if (issues.includes('og_missing') && n.firstImg) fx.og = { current: '', suggested: n.firstImg };
  if (issues.includes('canonical_missing') || issues.includes('canonical_diff')) fx.canonical = { current: n.canonical || '', suggested: n.link };
  return fx;
}
