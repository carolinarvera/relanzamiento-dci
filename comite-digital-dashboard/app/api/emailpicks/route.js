import axios from 'axios';
import { getAccessToken, runReport } from '../../lib/ga4';
import emailCopy from '../../lib/emailcopy.json';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Top 5 de notas web recientes para armar el email: interés del lector (vistas por día y tiempo de lectura en GA4)
// y potencial de apertura (qué temas y rasgos de asunto han funcionado en los envíos anteriores de HubSpot).
const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=900, stale-while-revalidate=3600' };
const CACHE = new Map();
const DAY = 86400000;
const SITE = { axxis: 'https://revistaaxxis.com.co', diners: 'https://revistadiners.com.co' };
const STOP = new Set('para como esta este estos estas desde entre sobre hacia donde cuando porque pero también conozca conoce nuestra revista'.split(' '));
const THEMES = [
  ['Coyuntura y servicio', /sismo|terremoto|emergencia|acopio|damnificad|ayudar/],
  ['Gastronomía', /restaurante|gastronom|comer|brunch|chef|cocina|cocteler|cafe|vino|comida|bistro|bar /],
  ['Viajes y destinos', /destino|viaje|playa|resort|hotel|termales|escapada|lugares para|cerca de bogota|fin de semana|planes/],
  ['Arquitectura y proyectos', /arquitectur|casa |edificio|colegio|estadio|hacienda|construir|vivienda|proyecto|paisaje|bosque|salmona|restauracion/],
  ['Diseño e interiorismo', /diseno|interiorismo|objetos|mobiliario|tendencias/],
  ['Decoración y hogar', /decoracion|apartamento|hogar|madera|navidad/],
  ['Cultura y entretenimiento', /serie|pelicula|streaming|musica|gira|exposicion|libro|poema|cine|teatro|netflix|macondo/],
  ['Sostenibilidad y memoria', /sostenib|memoria|materiales|jardin|reciclad/],
];
const PLACES = /bogota|colombia|medellin|cartagena|cali\b|barranquilla|caribe|chia|santa marta|guajira|choco|chapinero|candelaria/;

const decode = (t) => String(t || '').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&hellip;/g, '…').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const plain = (t) => decode(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const words = (t) => new Set(plain(t).replace(/[^a-z0-9 ]/g, ' ').split(' ').filter((w) => w.length >= 5 && !STOP.has(w)));
const themeOf = (t) => { const p = plain(t); const h = THEMES.find((x) => x[1].test(p)); return h ? h[0] : 'Otros temas'; };
const feats = (t) => ({ question: /[¿?]/.test(t), number: /\b\d+\b/.test(t), place: PLACES.test(plain(t)), short: decode(t).length <= 60 });
const pathKey = (u) => { try { return new URL(u, 'https://x').pathname.replace(/\/+$/, '').toLowerCase(); } catch { return String(u || '').toLowerCase(); } };
const pctRank = (arr, v) => (arr.length ? arr.filter((x) => x <= v).length / arr.length : 0);
const iso = (d) => d.toISOString().slice(0, 10);

const TAIL = new Set('de en que la el los las y a un una con por para del al se su sus lo e o'.split(' '));
const trimTail = (t) => { let w = t.replace(/[,;:\s]+$/, '').split(' '); while (w.length > 3 && TAIL.has(plain(w[w.length - 1]))) w.pop(); return w.join(' '); };
// Borrador de asunto: título completo si cabe en 60 caracteres; si no, la primera cláusula o un recorte sin palabras sueltas al final (revisar a mano)
function subjectFrom(title) {
  const t = decode(title).replace(/\s*[-|–]\s*Revista (AXXIS|Diners)\s*$/i, '');
  if (t.length <= 60) return t;
  const first = t.split(/[:;]/)[0];
  if (first.length >= 25 && first.length <= 60) return first;
  const cut = t.slice(0, 60); const sp = cut.lastIndexOf(' ');
  return trimTail(cut.slice(0, sp > 35 ? sp : 60));
}
function previewFrom(excerpt, title) {
  const base = decode(excerpt);
  const sentence = (base.split(/(?<=[.!?])\s/)[0] || base).trim();
  const useIt = sentence && plain(sentence) !== plain(title);
  const t = useIt ? sentence : base;
  if (t.length <= 90) return t;
  const c = t.slice(0, 90); const sp = c.lastIndexOf(' ');
  return `${c.slice(0, sp > 50 ? sp : 90).replace(/[,;:\s]+$/, '')}…`;
}

const NAME_STOP = new Set('Esta Este Estos Estas El La Los Las Un Una Unos Unas En Con Por Para De Del Al Se Su Sus Lo Es Son Fue Fueron Como Más Muy Pero También Cuando Donde Desde Hasta Entre Sobre Sin Ya Hay Han Ser Tiene Tienen Después Durante Además Así Allí Aquí Hoy Foto Fotografías Fotografía Arquitectura Diseño Proyecto Equipo Cortesía Conozca Descubra'.split(' '));
const CREDIT = /^(arquitectura|arquitectos?|dise[ñn]o|fotograf[ií]as?|fotos?|ubicaci[óo]n|construcci[óo]n|paisajismo|interiorismo|cortes[ií]a|área|area|año|equipo|texto|estructura|ingenier[ií]a|colaboradores?|iluminaci[óo]n|mobiliario|cliente)\s*[:\-]/i;

function articleText(html) {
  const clean = String(html || '').replace(/<figure[\s\S]*?<\/figure>/gi, ' ').replace(/<figcaption[\s\S]*?<\/figcaption>/gi, ' ').replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ');
  const paras = (clean.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).map((x) => decode(x)).filter((x) => x.length >= 60 && !CREDIT.test(x) && !/^(fotograf|cr[ée]ditos|siga|lea tambi|te puede interesar|conozca m[aá]s)/i.test(x));
  return paras;
}
function keywordsFrom(title, paras, theme) {
  const text = `${title}. ${paras.slice(0, 6).join(' ')}`;
  const counts = new Map();
  const re = /\b([A-ZÁÉÍÓÚÑ][\p{L}'’-]+(?:\s+(?:(?:de|del|la|los|las|y|da|do)\s+)?[A-ZÁÉÍÓÚÑ][\p{L}'’-]+){0,3})/gu;
  let m;
  while ((m = re.exec(text))) {
    let k = m[1].trim();
    const before = text.slice(Math.max(0, m.index - 3), m.index).trim();
    const sentenceStart = m.index === 0 || /[.!?¿¡"“]$/.test(before) || before === '';
    const parts = k.split(' ');
    if (NAME_STOP.has(parts[0])) { k = parts.slice(1).join(' '); if (!k) continue; }
    if (k.length < 4 || NAME_STOP.has(k)) continue;
    // una sola palabra al inicio de oración suele ser un verbo o conector, no un nombre propio
    if (sentenceStart && k.split(' ').length === 1) continue;
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const names = [...counts.entries()].filter(([k, c]) => k.includes(' ') || c >= 2 || plain(title).includes(plain(k))).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).map((x) => x[0]);
  const out = [];
  const add = (k) => { const n = plain(k); if (k && !out.some((o) => plain(o).includes(n) || n.includes(plain(o)))) out.push(k); };
  names.slice(0, 4).forEach(add);
  const place = (plain(text).match(PLACES) || [])[0];
  if (place) add(place.replace(/^./, (c) => c.toUpperCase()));
  const topic = { 'Arquitectura y proyectos': 'arquitectura colombiana', 'Diseño e interiorismo': 'diseño de interiores', 'Decoración y hogar': 'decoración del hogar', 'Gastronomía': 'gastronomía', 'Viajes y destinos': 'viajes', 'Cultura y entretenimiento': 'cultura', 'Sostenibilidad y memoria': 'arquitectura sostenible' }[theme];
  if (topic) add(topic);
  return out.slice(0, 6);
}
function photoText(paras, title, keywords) {
  const names = keywords.filter((k) => /^[A-ZÁÉÍÓÚÑ]/.test(k));
  const cands = [];
  paras.slice(0, 5).forEach((para, pi) => {
    para.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡“"])/).forEach((sn, si) => {
      const t = sn.trim();
      if (t.length < 60 || t.length > 200 || /^\(|le puede interesar|lea también|vea también/i.test(t)) return;
      if ((t.match(/\(/g) || []).length !== (t.match(/\)/g) || []).length) return;
      if ((t.match(/["“”]/g) || []).length % 2) return;
      if (/^(sin embargo|además|por otro lado|por eso|pero|esto|eso|ello|así|y|de ahí|allí|ahí|por ello|en ese|en esa|con esto)(?![\p{L}])/iu.test(t) || /^(lo anterior|esas?|esos|aquel|aquella|dicho|dicha|tal)(?![\p{L}])/iu.test(t)) return;
      if (/\b(nosotros|trabajamos|decidimos|pensamos|imaginamos)\b/i.test(t)) return;
      let sc = 0;
      names.forEach((k) => { if (t.includes(k)) sc += 2; });
      if (PLACES.test(plain(t))) sc += 1;
      if (/\d/.test(t)) sc += 1;
      sc -= pi * 0.3 + si * 0.1;
      cands.push({ t, sc });
    });
  });
  cands.sort((a, b) => b.sc - a.sc);
  // Sin una frase que nombre al protagonista o el lugar, el título de la nota es mejor texto que una frase genérica
  let t = cands[0] && cands[0].sc >= 1 ? cands[0].t : '';
  if (!t) { t = decode(title); }
  return /[.!?]$/.test(t) ? t : `${t}.`;
}
// El párrafo bajo la foto del email es la bajada (extracto) que ya escribió el editor, recortada en frase completa
function blockParagraph(excerpt, fallback) {
  const base = decode(excerpt).replace(/\s*\[…\]\s*$/, '').replace(/\s*(Leer más|Seguir leyendo)\s*»?\s*$/i, '').trim();
  const sents = base.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡“"])/).filter(Boolean);
  let t = '';
  for (const sn of sents) { if (`${t} ${sn}`.trim().length > 270) break; t = `${t} ${sn}`.trim(); }
  if (!t && sents[0]) {
    const c = sents[0].slice(0, 255); const i = Math.max(c.lastIndexOf(', '), c.lastIndexOf('; '));
    t = c.slice(0, i > 120 ? i : c.lastIndexOf(' ')).replace(/[,;:\s]+$/, '');
  }
  if (t.length < 100 && fallback) t = `${t} ${fallback}`.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}
// Título corto para el bloque del email (borrador): sin muletillas de arranque y en una sola cláusula
function blockTitle(title) {
  let t = decode(title).replace(/\s*[-|–]\s*Revista (AXXIS|Diners)\s*$/i, '');
  t = t.replace(/^(el diseño de|esta es|este es|así es|así será|estos son|estas son|conozca|descubra)\s+/i, '').replace(/^./, (x) => x.toUpperCase());
  const m = t.match(/^(?:una|un)\s+(.*?)\s+que se transformó en\s+(.*)$/i);
  if (m) t = `De ${m[1]} a ${m[2]}`;
  // se deja el título completo (hasta 95 caracteres) antes que cortarlo a mitad de frase
  if (t.length <= 95) return t;
  const first = t.split(/[:;]/)[0];
  if (first.length >= 20 && first.length <= 95) return first;
  const c = t.slice(0, 95); return trimTail(c.slice(0, c.lastIndexOf(' ')));
}

const ANAPHORA = /^(aquí|allí|acá|sin embargo|además|por otro lado|por eso|pero|esto|eso|ello|así|y|de ahí|allí|ahí|por ello|en ese|en esa|con esto|lo anterior|esas?|esos|aquel|aquella|dicho|dicha|tal)(?![\p{L}])/iu;
const cleanSentence = (t) => decode(t).replace(/\s*\([^)]{0,80}\)/g, '').replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
// Párrafo sugerido: 2 frases completas, 180 a 250 caracteres, primero el protagonista o lo nuevo, sin repetir el título ni invitar al clic (eso lo hace el botón)
function paragraphOptions(excerpt, paras, title, keywords) {
  const names = keywords.filter((k) => /^[A-ZÁÉÍÓÚÑ]/.test(k));
  const pool = [];
  const push = (raw, pi, si, bonus) => {
    const t = cleanSentence(raw);
    if (t.length < 50 || t.length > 235 || /^\(|le puede interesar|lea también|vea también/i.test(t) || ANAPHORA.test(t)) return;
    if ((t.match(/["“”«»]/g) || []).length % 2) return;
    if (/\b(nosotros|nuestr[oa]s?|trabajamos|decidimos|pensamos|imaginamos|recorrí|fui|soy|estoy|me|mi|mis|conmigo)\b/i.test(t)) return;
    let sc = bonus;
    names.forEach((k) => { if (t.includes(k)) sc += 2; });
    if (PLACES.test(plain(t))) sc += 1;
    if (/\d/.test(t)) sc += 1;
    const words = t.split(' ').length; if (words > 30) sc -= 1.5;
    sc -= pi * 0.25 + si * 0.1;
    pool.push({ t: /[.!?]$/.test(t) ? t : `${t}.`, sc, pi });
  };
  decode(excerpt).split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡“"])/).forEach((sn, si) => push(sn, 0, si, 2)); // la bajada del editor pesa más
  paras.slice(0, 5).forEach((para, pi) => para.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡“"])/).forEach((sn, si) => push(sn, pi + 1, si, 0)));
  const seen = new Set(); const uniq = pool.filter((x) => { const k = plain(x.t).slice(0, 40); if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => b.sc - a.sc);
  const hook = uniq[0];
  let main = hook ? hook.t : `${decode(title).replace(/[.!?]+$/, '')}.`;
  if (hook) {
    const second = uniq.find((x) => x !== hook && x.pi !== hook.pi && `${hook.t} ${x.t}`.length <= 250) || uniq.find((x) => x !== hook && `${hook.t} ${x.t}`.length <= 250);
    if (second && hook.t.length < 170) main = hook.pi <= second.pi ? `${hook.t} ${second.t}` : `${second.t} ${hook.t}`;
  }
  const alt = uniq.filter((x) => x.t.length >= 90 && x.t.length <= 160).sort((a, b) => b.sc - a.sc)[0]?.t || (main.length <= 160 ? main : '');
  const tw = words(title); const mw = words(main); let ov = 0; mw.forEach((w) => { if (tw.has(w)) ov += 1; });
  const sents = main.split(/(?<=[.!?])\s+/).filter(Boolean);
  const maxWords = Math.max(...sents.map((x) => x.split(' ').length));
  const checks = {
    largo: main.length >= 180 && main.length <= 250 ? 'ok' : main.length >= 140 && main.length <= 270 ? 'justo' : 'revisar',
    frases: sents.length <= 2 && maxWords <= 30 ? 'ok' : 'revisar',
    protagonista: names.some((k) => main.includes(k)) || PLACES.test(plain(main)) ? 'ok' : 'revisar',
    sinRepetirTitulo: tw.size && ov / Math.min(tw.size, mw.size || 1) < 0.6 ? 'ok' : 'revisar',
  };
  return { main, alt, checks };
}

const copyKey = (u) => String(u || '').replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
const CTA_LINE = { 'Arquitectura y proyectos': 'Conozca el proyecto y vea las fotos en la nota.', 'Diseño e interiorismo': 'Vea el diseño y los detalles en la nota.', 'Decoración y hogar': 'Vea el espacio y las ideas en la nota.', 'Gastronomía': 'Vea el lugar y cómo llegar en la nota.', 'Viajes y destinos': 'Vea el recorrido y cómo llegar en la nota.', 'Cultura y entretenimiento': 'Lea la historia completa en la nota.' };
// Párrafo para despertar el clic: una frase gancho con el protagonista o el lugar, un dato que complete y una invitación concreta
function teaserFrom(paras, title, keywords, theme) {
  const names = keywords.filter((k) => /^[A-ZÁÉÍÓÚÑ]/.test(k));
  const cands = [];
  paras.slice(0, 6).forEach((para, pi) => {
    para.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡“"])/).forEach((sn, si) => {
      const t = sn.trim();
      if (t.length < 50 || t.length > 190 || /^\(|le puede interesar|lea también|vea también/i.test(t)) return;
      if ((t.match(/\(/g) || []).length !== (t.match(/\)/g) || []).length) return;
      if ((t.match(/["“”]/g) || []).length % 2) return;
      if (/^(sin embargo|además|por otro lado|por eso|pero|esto|eso|ello|así|y|de ahí|allí|ahí|por ello|en ese|en esa|con esto)(?![\p{L}])/iu.test(t) || /^(lo anterior|esas?|esos|aquel|aquella|dicho|dicha|tal)(?![\p{L}])/iu.test(t)) return;
      if (/\b(nosotros|trabajamos|decidimos|pensamos|imaginamos)\b/i.test(t)) return;
      let sc = 0;
      names.forEach((k) => { if (t.includes(k)) sc += 2; });
      if (PLACES.test(plain(t))) sc += 1;
      if (/\d/.test(t)) sc += 1.5;
      sc -= pi * 0.25;
      cands.push({ t, sc, pi, si });
    });
  });
  cands.sort((a, b) => b.sc - a.sc);
  const hook = cands[0] && cands[0].sc >= 1 ? cands[0] : null;
  const detail = cands.find((c) => hook && c !== hook && c.pi !== hook.pi && c.sc >= 0.5) || cands.find((c) => hook && c !== hook && c.sc >= 0.5);
  const parts = [];
  if (hook) parts.push(hook.t); else parts.push(`${decode(title).replace(/[.!?]+$/, '')}.`);
  if (detail) parts.push(detail.t);
  let cta = CTA_LINE[theme] || 'Lea la nota completa.';
  let text = `${parts.join(' ')} ${cta}`;
  if (text.length > 330 && parts.length > 1) { parts.pop(); text = `${parts.join(' ')} ${cta}`; }
  return text;
}
const CTA = { 'Arquitectura y proyectos': 'Ver el proyecto', 'Diseño e interiorismo': 'Ver el diseño', 'Decoración y hogar': 'Ver el espacio', 'Gastronomía': 'Conocer el lugar', 'Viajes y destinos': 'Ver el destino', 'Cultura y entretenimiento': 'Leer la nota' };

async function enrich(a, th) {
  const r = await axios.get(`${a.siteOrigin}/wp-json/wp/v2/posts/${a.id}`, { params: { _fields: 'content' }, timeout: 15000 }).then((x) => x.data).catch(() => null);
  const paras = articleText(r?.content?.rendered);
  const kws = keywordsFrom(a.title, paras, th);
  const po = paragraphOptions(a.excerpt, paras, a.title, kws);
  return { paras, paragraph: po.main, paragraphAlt: po.alt, paragraphChecks: po.checks, blockTitle: blockTitle(a.title), teaser: teaserFrom(paras.length ? paras : [decode(a.excerpt)], a.title, keywordsFrom(a.title, paras, th), th), keywords: keywordsFrom(a.title, paras, th), text: photoText(paras.length ? paras : [decode(a.excerpt)], a.title, keywordsFrom(a.title, paras, th)) };
}

// Etiqueta corta de cada nota para armar el asunto de un email con varias noticias
function shortLabel(title, keywords) {
  const t = decode(title).replace(/\s*[-|–]\s*Revista (AXXIS|Diners)\s*$/i, '');
  const clean = (c) => trimTail(c.replace(/^(esta es|este es|así es|así será|estos son|estas son|conozca|descubra|esta|este|estos|estas|el|la|los|las|un|una)\s+/i, '').trim()).replace(/^./, (x) => x.toUpperCase());
  const GENERIC = /^(colombia|bogotá|bogota|medellín|medellin)$/i;
  // 1) sustantivo + nombre propio o lugar que aparece en el título (p. ej. "casa en Nocaima", "firma Albornoz Arquitectos")
  for (const k of (keywords || []).filter((x) => !GENERIC.test(x) && /^[A-ZÁÉÍÓÚÑ]/.test(x))) {
    const i = t.indexOf(k);
    if (i < 0) continue;
    const before = t.slice(0, i).trim().split(' ');
    let pre = before.slice(-2).join(' ');
    if (/^(que|de|del|la|el|y|en|para|con|por|se|su)$/i.test(before[before.length - 1] || '') && before.length > 2) pre = before.slice(-3).join(' ');
    const lab = clean(`${pre} ${k}`.trim());
    if (lab.length >= 10 && lab.length <= 40) return lab;
  }
  // 2) primera cláusula del título
  let c = t.split(/:|\s+(?:que|donde|cuyo|cuya|para|con|a partir|tras|en el que|en la que)\s+/i)[0].trim();
  c = clean(c);
  if (c.split(' ').length <= 2 || c.length < 14) c = clean(t.split(' ').slice(0, 6).join(' '));
  if (c.length > 38) { const k = c.slice(0, 38); c = clean(k.slice(0, k.lastIndexOf(' ') > 15 ? k.lastIndexOf(' ') : 38)); }
  return c;
}
function listJoin(a) { return a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} y ${a[a.length - 1]}`; }
function fit(parts, max, tail) {
  // quita elementos del final hasta que quepa en `max` caracteres
  for (let n = parts.length; n >= 1; n -= 1) { const t = n === 1 ? parts[0] + (tail || '') : `${listJoin(parts.slice(0, n))}${tail || ''}`; if (t.length <= max) return t; }
  return parts[0].slice(0, max);
}

// HubSpot limita las consultas por segundo: se consulta una vez por ventana para las dos revistas, con reintento y copia de respaldo
const EMAIL_RAW = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function emailWindow(origin, off) {
  const key = `w${off}`;
  const hit = EMAIL_RAW.get(key);
  if (hit && hit.data && Date.now() - hit.at < 30 * 60 * 1000) return hit.data;
  if (hit && hit.pending) return hit.pending;
  const end = new Date(Date.now() - DAY - off * DAY); const start = new Date(end.getTime() - 29 * DAY);
  const pending = (async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      // eslint-disable-next-line no-await-in-loop
      const r = await axios.get(`${origin}/api/emails`, { params: { start: iso(start), end: iso(end) }, timeout: 40000 }).then((x) => x.data).catch(() => null);
      const ok = r && !r.error && ((r.axxis?.emails || []).some((e) => e.sent > 0) || (r.diners?.emails || []).some((e) => e.sent > 0));
      if (ok) { EMAIL_RAW.set(key, { at: Date.now(), data: r }); return r; }
      // eslint-disable-next-line no-await-in-loop
      await sleep(4000);
    }
    return hit?.data || null; // última copia buena, aunque esté vieja
  })();
  EMAIL_RAW.set(key, { ...(hit || {}), pending });
  const out = await pending;
  const cur = EMAIL_RAW.get(key); if (cur) delete cur.pending;
  return out;
}
async function trainingEmails(origin, brand) {
  const parts = await Promise.all([0, 60].map((off) => emailWindow(origin, off)));
  const seen = new Set(); const out = [];
  parts.forEach((r) => { const p = r?.[brand] || {}; [...(p.emails || []), ...(p.prevEmails || [])].forEach((e) => { if (e.kind === 'batch' && e.sent >= 1000 && e.delivered > 0 && e.open < e.delivered && !seen.has(e.id)) { seen.add(e.id); out.push(e); } }); });
  return out;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const hit = CACHE.get(brand);
    if (hit && Date.now() - hit.at < 15 * 60 * 1000) return Response.json(hit.data, { headers: CORS });
    const now = Date.now(); const site = SITE[brand];
    const prop = brand === 'axxis' ? process.env.GA4_AXXIS_ID : process.env.GA4_DINERS_ID;
    const after = new Date(now - 5 * DAY).toISOString().slice(0, 19);

    const [wp, emails, token] = await Promise.all([
      axios.get(`${site}/wp-json/wp/v2/posts`, { params: { per_page: 100, after, _fields: 'id,link,title,date,excerpt' }, timeout: 20000 }).then((r) => r.data).catch(() => []),
      trainingEmails(url.origin, brand),
      getAccessToken(),
    ]);
    const rows = await runReport(token, prop, {
      dateRanges: [{ startDate: iso(new Date(now - 6 * DAY)), endDate: iso(new Date(now - DAY)) }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'userEngagementDuration' }, { name: 'activeUsers' }],
      limit: 5000,
    }).catch(() => []);
    const ga = new Map(rows.map((r) => [pathKey(r.dimensionValues[0].value), { views: Number(r.metricValues[0].value), eng: Number(r.metricValues[1].value), users: Number(r.metricValues[2].value) }]));

    // Aprendizaje de los envíos anteriores: tasa de clic por tema y rasgos de asunto
    const avg = (list, f) => (list.length ? list.reduce((a, e) => a + f(e), 0) / list.length : 0);
    const clickRate = (e) => e.click / e.delivered; const openRate = (e) => e.open / e.delivered;
    const allClick = avg(emails, clickRate), allOpen = avg(emails, openRate);
    const themeStat = {};
    emails.forEach((e) => { const k = themeOf(e.subject || e.name); (themeStat[k] = themeStat[k] || []).push(e); });
    const themeLift = (k) => { const l = themeStat[k]; return l && l.length >= 2 && allClick ? 0.5 * (avg(l, clickRate) / allClick) + 0.5 * (avg(l, openRate) / (allOpen || 1)) : 1; };
    const featLift = (key) => {
      const w = emails.filter((e) => feats(e.subject || e.name)[key]), wo = emails.filter((e) => !feats(e.subject || e.name)[key]);
      if (w.length < 3 || wo.length < 3 || !allClick) return { lift: 1, n: [w.length, wo.length] };
      return { lift: 0.5 * (avg(w, clickRate) / Math.max(avg(wo, clickRate), 1e-9)) + 0.5 * (avg(w, openRate) / Math.max(avg(wo, openRate), 1e-9)), n: [w.length, wo.length] };
    };
    const FL = { question: featLift('question'), number: featLift('number'), place: featLift('place'), short: featLift('short') };

    // Notas ya enviadas por email en los últimos 30 días (no repetir)
    const recentSubjects = emails.filter((e) => now - Date.parse(e.sentAt) < 30 * DAY).map((e) => words(e.subject || e.name));

    const cands = wp.map((a) => {
      const title = decode(a.title?.rendered); const k = pathKey(a.link); const g = ga.get(k) || { views: 0, eng: 0, users: 0 };
      const ageDays = Math.max(1, (now - Date.parse(a.date)) / DAY);
      return { id: a.id, title, url: a.link, published: a.date, excerpt: a.excerpt?.rendered || '', views: g.views, viewsPerDay: g.views / Math.min(ageDays, 5), engSec: g.users ? g.eng / g.users : 0, ageDays };
    }).filter((c) => c.views >= 20);
    const tw = (c) => words(c.title);
    const fresh = cands.filter((c) => !recentSubjects.some((sw) => { let n = 0; tw(c).forEach((w) => { if (sw.has(w)) n += 1; }); return n >= 2 && n / Math.max(tw(c).size, 1) >= 0.4; }));
    const vws = fresh.map((c) => c.views), eng = fresh.map((c) => c.engSec);
    // Orden por mayores vistas e interés del lector (segundos de lectura por usuario); sin potencial de apertura
    const scored = fresh.map((c) => {
      const f = feats(c.title), th = themeOf(c.title);
      const interest = 0.75 * pctRank(vws, c.views) + 0.25 * pctRank(eng, c.engSec);
      return { c, f, th, open: 1, openPct: 0, interest, score: interest };
    });
    scored.sort((a, b) => b.score - a.score);

    const top5 = scored.slice(0, 5);
    const extra = await Promise.all(top5.map((x) => enrich({ id: x.c.id, title: x.c.title, excerpt: x.c.excerpt, siteOrigin: site }, x.th)));
    const picks = top5.map((x, i) => {
      const ex = extra[i];
      const subject = subjectFrom(x.c.title); const preview = previewFrom(x.c.excerpt, x.c.title);
      const why = [];
      why.push(`${Math.round(x.c.views).toLocaleString('es-CO')} vistas en ${Math.max(1, Math.min(5, Math.round(x.c.ageDays)))} ${Math.round(x.c.ageDays) <= 1 ? 'día' : 'días'} (${Math.round(x.c.viewsPerDay).toLocaleString('es-CO')} por día)`);
      if (x.c.engSec) why.push(`${Math.round(x.c.engSec)} segundos de lectura por usuario`);
      return {
        rank: i + 1, title: x.c.title, url: x.c.url, published: x.c.published, theme: x.th, views: x.c.views, viewsPerDay: x.c.viewsPerDay, engSec: x.c.engSec,
        score: x.score, interest: x.interest, openPotential: x.openPct, why,
        headline: subject, headlineChars: subject.length, subject, subjectChars: subject.length, preview, previewChars: preview.length,
        paragraphSource: emailCopy[copyKey(x.c.url)] ? 'redactado' : 'automatico', paragraphWhy: emailCopy[copyKey(x.c.url)]?.why || '', writtenAt: emailCopy[copyKey(x.c.url)]?.writtenAt || null,
        keywords: ex.keywords, teaser: ex.teaser, teaserChars: ex.teaser.length, paragraph: emailCopy[copyKey(x.c.url)]?.paragraph || ex.paragraph, paragraphChars: (emailCopy[copyKey(x.c.url)]?.paragraph || ex.paragraph).length, paragraphAuto: ex.paragraph, paragraphAlt: ex.paragraphAlt, paragraphAltChars: (ex.paragraphAlt || '').length, paragraphChecks: ex.paragraphChecks, blockTitle: ex.blockTitle, blockTitleChars: ex.blockTitle.length, photoText: ex.text, photoTextChars: ex.text.length, button: CTA[x.th] || 'Leer la nota',
      };
    });
    // Mejor horario de envío según clic sobre entregados
    const slots = {};
    emails.forEach((e) => { const d = new Date(Date.parse(e.sentAt) - 5 * 3600000); const k = `${['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][d.getUTCDay()]} ${String(d.getUTCHours()).padStart(2, '0')}:00`; (slots[k] = slots[k] || []).push(e); });
    const bestSlot = Object.entries(slots).filter(([, l]) => l.length >= 2).map(([k, l]) => ({ slot: k, n: l.length, click: avg(l, clickRate) })).sort((a, b) => b.click - a.click)[0] || null;
    // Un solo email lleva varias notas: el asunto lleva la nota más fuerte al inicio y avisa que hay más; la vista previa suma el resto
    const labels = picks.map((p) => shortLabel(p.title, p.keywords));
    const brandName = brand === 'axxis' ? 'AXXIS' : 'Diners';
    const n = picks.length;
    const hasName = (txt) => picks.some((p) => p.keywords.some((k) => /^[A-ZÁÉÍÓÚÑ]/.test(k) && txt.includes(k))) || PLACES.test(plain(txt));
    // la etiqueta principal es la de la nota con nombre propio o lugar más claro entre las dos primeras
    const leadIdx = [0, 1].map((i) => ({ i, ok: hasName(labels[i] || ''), len: (labels[i] || '').length })).sort((a, b) => (b.ok - a.ok) || (a.len - b.len))[0].i;
    const L1 = labels[leadIdx];
    const checks = (txt) => ({
      largo: txt.length <= 50 ? 'ok' : txt.length <= 60 ? 'justo' : 'largo',
      inicio: !/^(esta semana|las |los |nuestra)/i.test(txt) ? 'ok' : 'revisar',
      especifico: hasName(txt) ? 'ok' : 'revisar',
      sinMayusculas: txt === txt.toUpperCase() ? 'revisar' : 'ok',
    });
    const mk = (text, why) => ({ text, chars: text.length, why, checks: checks(text) });
    const subjects = [
      mk(`${L1} y ${n - 1} historias más`, 'Lo más fuerte primero (nombre o lugar concreto) y aviso de que hay más: el asunto se lee completo en el celular'),
      mk(`${L1}, y ${n - 1} notas para su semana`, 'Variante para probar en A/B: mismo inicio, promesa de selección'),
      mk(`${brandName}: ${L1} y más`, 'Variante corta con la marca delante, útil si el remitente no es reconocido'),
    ];
    const previewList = fit(labels.filter((_, i) => i !== leadIdx).slice(0, 3), 76, '');
    const emailPreview = { text: `También: ${previewList}.`, chars: `También: ${previewList}.`.length };
    const bestSubjects = emails.filter((e) => e.subject || e.name).map((e) => ({ subject: e.subject || e.name, sentAt: e.sentAt, open: e.open / e.delivered, click: e.click / e.delivered, sent: e.sent })).sort((a, b) => b.open - a.open).slice(0, 3);
    const lower = (x) => x.replace(/^./, (c) => c.toLowerCase());
    const themesRank = Object.entries(picks.reduce((m, p) => { m[p.theme] = (m[p.theme] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
    const THEME_NOUN = { 'Arquitectura y proyectos': 'arquitectura', 'Diseño e interiorismo': 'diseño', 'Decoración y hogar': 'decoración', 'Gastronomía': 'gastronomía', 'Viajes y destinos': 'viajes', 'Cultura y entretenimiento': 'cultura', 'Sostenibilidad y memoria': 'sostenibilidad', 'Otros temas': 'actualidad' };
    const themeText = listJoin(themesRank.slice(0, 2).map((t) => THEME_NOUN[t] || lower(t)));
    const NUM = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco'];
    const GENERIC = /^(colombia|bogotá|bogota|medellín|medellin|cali|cartagena)$/i;
    const names = picks.map((p) => p.keywords.find((k) => /^[A-ZÁÉÍÓÚÑ]/.test(k) && !GENERIC.test(k) && k.length <= 28)).filter(Boolean);
    const two = themesRank.filter((t) => picks.filter((p) => p.theme === t).length >= 2).slice(0, 2);
    const themeTxt = listJoin((two.length ? two : themesRank.slice(0, 1)).map((t) => THEME_NOUN[t] || lower(t)));
    const intro = `En este envío reunimos ${picks.length === 5 ? 'cinco' : NUM[picks.length] || picks.length} historias de ${themeTxt} para descubrir esta semana, con lo más leído de ${brandName} en los últimos días. Cada nota trae su foto, un párrafo y el botón para leerla completa.`;
    const data = {
      brand, fetchedAt: new Date().toISOString(), picks, bestSlot, email: { subjects, preview: emailPreview, labels, lead: L1, bestSubjects, avgOpen: allOpen, intro, introChars: intro.length },
      basis: { articles: wp.length, withTraffic: cands.length, excludedAlreadySent: cands.length - fresh.length, trainingEmails: emails.length, avgClick: allClick, avgOpen: allOpen },
    };
    CACHE.set(brand, { at: Date.now(), data });
    return Response.json(data, { headers: CORS });
  } catch (e) {
    return Response.json({ error: e.response?.data?.error?.message || e.message, where: String(e.stack || '').split('\n')[1] }, { status: 502, headers: CORS });
  }
}
