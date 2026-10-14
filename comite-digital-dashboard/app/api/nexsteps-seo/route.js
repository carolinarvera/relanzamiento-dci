export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' };
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; NexstepsCheck/1.0)' };
const SITES = { axxis: 'https://revistaaxxis.com.co', diners: 'https://revistadiners.com.co' };

// Títulos que el plan de acción (calendario SEO) pide cambiar. Se compara el <title> en vivo contra el título actual y el propuesto.
const ITEMS = [
  { tab: 'axxis', key: 'Semana 1 · Torres del Parque', path: '/arquitectura/las-torres-del-parque-salmona/', old: 'Las Torres del Parque de Rogelio Salmona: arquitectura que sorprende', next: 'Torres del Parque, Bogotá: la obra de Rogelio Salmona' },
  { tab: 'axxis', key: 'Semana 1 · Cefe Chapinero', path: '/arquitectura/cefe-edificio-chapinero-bogota/', old: 'El CEFE de Chapinero es un parque vertical para todos los bogotanos', next: 'CEFE Chapinero: el parque vertical de Bogotá' },
  { tab: 'axxis', key: 'Semana 2 · Proyectos icónicos (Parque Central Bavaria)', path: '/arquitectura/diseno-parque-central-bavaria/', old: 'Parque Central Bavaria, la obra que transformó el centro de Bogotá', next: 'Parque Central Bavaria: de 4 manzanas planeadas, se construyeron 2' },
  { tab: 'axxis', key: 'Semana 3 · Congreso (hoteles de Cartagena)', path: '/arquitectura/mejores-hoteles-de-cartagena/', old: '7 hoteles en cartagena están entre los mejores del mundo', next: 'Mejores hoteles en Cartagena: 7 entre los mejores del mundo' },
  { tab: 'diners', key: 'Semana 1 · Betty la fea', path: '/cultura/cine-y-tv/betty-la-fea-tercera-temporada/', old: 'Betty, la Fea: lo que trae la tercera temporada de la serie', next: 'Betty, la fea: la historia continúa, tercera temporada' },
  { tab: 'diners', key: 'Semana 1 · Hechizo de amor', path: '/cultura/cine-y-tv/hechizodeamor-la-magia-continua/', old: '"Hechizo de amor: la magia continúa" vuelve al cine', next: 'Hechizo de amor: la magia continúa llegó a los cines de Colombia' },
  { tab: 'diners', key: 'Semana 1 · Tim Curry', path: '/cultura/cine-y-tv/tim-curry/', old: 'Tim Curry: tres películas para recordarlo en sus distintas facetas', next: 'Tim Curry: 3 películas para recordarlo, de Rocky Horror a Clue' },
  { tab: 'diners', key: 'Semana 1 · Escapadas (Brunch en Bogotá)', path: '/gastronomia/donde-comer/mejores-brunch-en-bogota-2026/', old: 'Mejores Brunch en Bogotá 2026: Londo Bistró y La Cesta Familiares', next: 'Brunch en Bogotá: los mejores lugares para un domingo (2026)' },
  { tab: 'diners', key: 'Semana 2 · Restaurantes por ciudad (Bucaramanga)', path: '/estilo-de-vida/los-mejores-restaurantes-bucaramanga/', old: 'Los mejores restaurantes de Bucaramanga - Revista Diners', next: 'Restaurantes en Bucaramanga: dónde comer en la ciudad bonita' },
  { tab: 'diners', key: 'Semana 2 a 4 · Caribe (Guachaca)', path: '/estilo-de-vida/guachaca-santa-marta/', old: 'Guachaca: 7 razones para visitar este paraíso', next: 'Guachaca (Santa Marta): 7 razones para visitar y cómo llegar' },
  { tab: 'diners', key: 'Semana 3 · Agenda cultural (Enanitos Verdes)', path: '/cultura/los-enanitos-verdes-historia/', old: 'Los Enanitos Verdes: historia, legado y 5 canciones icónicas del rock en español', next: 'Los Enanitos Verdes: historia y 5 canciones icónicas' },
];

const decode = (t) => String(t || '').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'");
const norm = (t) => decode(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/revista (axxis|diners)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const grams = (t) => { const w = norm(t).split(' ').filter(Boolean); const g = new Set(); for (let i = 0; i < w.length - 1; i += 1) g.add(`${w[i]} ${w[i + 1]}`); if (!g.size && w.length) g.add(w[0]); return g; };
// Similitud por pares de palabras consecutivas: detecta también cambios solo de orden.
const sim = (a, b) => { const x = grams(a); const y = grams(b); const inter = [...x].filter((w) => y.has(w)).length; return x.size + y.size ? inter / (x.size + y.size - inter) : 0; };

export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }

export async function GET() {
  const out = await Promise.all(ITEMS.map(async (it) => {
    const link = `${SITES[it.tab]}${it.path}`;
    try {
      const r = await fetch(link, { headers: UA, redirect: 'follow', cache: 'no-store' });
      const h = await r.text();
      const title = decode((h.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '').trim();
      const desc = decode((h.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '').trim();
      const modified = (h.match(/article:modified_time"\s+content="([^"]*)"/i) || [])[1] || null;
      let status = 'pendiente';
      let text = 'Sin cambios: el título sigue igual al del plan.';
      if (sim(title, it.next) >= 0.7) { status = 'aplicado'; text = 'Aplicado: el título en el sitio coincide con el propuesto.'; }
      else if (sim(title, it.old) < 0.7) { status = 'cambiado'; text = 'Título cambiado, distinto al propuesto: revisar si cumple la fórmula del plan.'; }
      else if (modified && Date.now() - Date.parse(modified) < 10 * 86400000) { status = 'editada'; text = 'Nota editada recientemente, pero el título sigue igual al del plan.'; }
      return { ...it, link, liveTitle: title, description: desc, modified, status, text, http: r.status };
    } catch (e) {
      return { ...it, link, status: 'error', text: `No se pudo leer la nota (${e.message}).`, liveTitle: null, modified: null };
    }
  }));
  return Response.json({ checkedAt: new Date().toISOString(), items: out }, { headers: CORS });
}
