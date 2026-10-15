import axios from 'axios';
import { getAccessToken, runReport } from '../../lib/ga4';

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

const decode = (t) => String(t || '').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&hellip;/g, '…').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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

async function trainingEmails(origin, brand) {
  const end = new Date(Date.now() - DAY);
  const calls = [0, 60].map((off) => {
    const e = new Date(end.getTime() - off * DAY); const s = new Date(e.getTime() - 29 * DAY);
    return axios.get(`${origin}/api/emails`, { params: { start: iso(s), end: iso(e) }, timeout: 40000 }).then((r) => r.data[brand] || {}).catch(() => ({}));
  });
  const parts = await Promise.all(calls);
  const seen = new Set(); const out = [];
  parts.forEach((p) => [...(p.emails || []), ...(p.prevEmails || [])].forEach((e) => { if (e.kind === 'batch' && e.sent >= 1000 && e.delivered > 0 && e.open < e.delivered && !seen.has(e.id)) { seen.add(e.id); out.push(e); } }));
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
    const after = new Date(now - 21 * DAY).toISOString().slice(0, 19);

    const [wp, emails, token] = await Promise.all([
      axios.get(`${site}/wp-json/wp/v2/posts`, { params: { per_page: 100, after, _fields: 'id,link,title,date,excerpt' }, timeout: 20000 }).then((r) => r.data).catch(() => []),
      trainingEmails(url.origin, brand),
      getAccessToken(),
    ]);
    const rows = await runReport(token, prop, {
      dateRanges: [{ startDate: iso(new Date(now - 21 * DAY)), endDate: iso(new Date(now - DAY)) }],
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
      return { title, url: a.link, published: a.date, excerpt: a.excerpt?.rendered || '', views: g.views, viewsPerDay: g.views / Math.min(ageDays, 21), engSec: g.users ? g.eng / g.users : 0, ageDays };
    }).filter((c) => c.views >= 30);
    const tw = (c) => words(c.title);
    const fresh = cands.filter((c) => !recentSubjects.some((sw) => { let n = 0; tw(c).forEach((w) => { if (sw.has(w)) n += 1; }); return n >= 2 && n / Math.max(tw(c).size, 1) >= 0.4; }));
    const vpd = fresh.map((c) => c.viewsPerDay), eng = fresh.map((c) => c.engSec);
    const scored = fresh.map((c) => {
      const f = feats(c.title), th = themeOf(c.title);
      let open = themeLift(th);
      Object.keys(FL).forEach((k) => { if (f[k]) open *= Math.min(Math.max(FL[k].lift, 0.8), 1.25); });
      return { c, f, th, open, interest: 0.6 * pctRank(vpd, c.viewsPerDay) + 0.4 * pctRank(eng, c.engSec) };
    });
    const opens = scored.map((x) => x.open);
    scored.forEach((x) => { x.openPct = pctRank(opens, x.open); x.score = 0.55 * x.interest + 0.45 * x.openPct; });
    scored.sort((a, b) => b.score - a.score);

    const picks = scored.slice(0, 5).map((x, i) => {
      const subject = subjectFrom(x.c.title); const preview = previewFrom(x.c.excerpt, x.c.title);
      const why = [];
      why.push(`${Math.round(x.c.views).toLocaleString('es-CO')} vistas en ${Math.min(21, Math.round(x.c.ageDays))} días (${Math.round(x.c.viewsPerDay).toLocaleString('es-CO')} por día)`);
      if (x.c.engSec) why.push(`${Math.round(x.c.engSec)} segundos de lectura por usuario`);
      const tl = themeLift(x.th); if (themeStat[x.th] && themeStat[x.th].length >= 2) why.push(`tema "${x.th}": ${tl >= 1 ? '+' : ''}${Math.round((tl - 1) * 100)}% frente al promedio de tus envíos (${themeStat[x.th].length} envíos)`);
      ['place', 'number', 'question'].forEach((k) => { if (x.f[k] && FL[k].n[0] >= 3 && FL[k].lift > 1.1) why.push(`el asunto ${k === 'place' ? 'con lugar' : k === 'number' ? 'con número' : 'con pregunta'} rinde ${Math.round((FL[k].lift - 1) * 100)}% más en envíos anteriores`); });
      return {
        rank: i + 1, title: x.c.title, url: x.c.url, published: x.c.published, theme: x.th, views: x.c.views, viewsPerDay: x.c.viewsPerDay, engSec: x.c.engSec,
        score: x.score, interest: x.interest, openPotential: x.openPct, why,
        subject, subjectChars: subject.length, preview, previewChars: preview.length,
      };
    });
    // Mejor horario de envío según clic sobre entregados
    const slots = {};
    emails.forEach((e) => { const d = new Date(Date.parse(e.sentAt) - 5 * 3600000); const k = `${['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][d.getUTCDay()]} ${String(d.getUTCHours()).padStart(2, '0')}:00`; (slots[k] = slots[k] || []).push(e); });
    const bestSlot = Object.entries(slots).filter(([, l]) => l.length >= 2).map(([k, l]) => ({ slot: k, n: l.length, click: avg(l, clickRate) })).sort((a, b) => b.click - a.click)[0] || null;
    const data = {
      brand, fetchedAt: new Date().toISOString(), picks, bestSlot,
      basis: { articles: wp.length, withTraffic: cands.length, excludedAlreadySent: cands.length - fresh.length, trainingEmails: emails.length, avgClick: allClick, avgOpen: allOpen },
    };
    CACHE.set(brand, { at: Date.now(), data });
    return Response.json(data, { headers: CORS });
  } catch (e) {
    return Response.json({ error: e.response?.data?.error?.message || e.message }, { status: 502, headers: CORS });
  }
}
