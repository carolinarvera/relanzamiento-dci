import axios from 'axios';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; ComiteDigitalDashboard/1.0)' };
const TTL_MS = 30 * 60 * 1000;
const cache = {};
const WINDOWS = { '1d': '1d', '7d': '7d', '14d': '14d' };

const decode = (t) => String(t || '')
  .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const plain = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tag = (xml, name) => { const m = new RegExp(`<${name}[^>]*>(.*?)</${name}>`, 's').exec(xml); return m ? decode(m[1]).trim() : ''; };

// Categorías reales de cada sitio (WordPress): AXXIS = Arquitectura, Diseño, Decoración, Especiales.
// Diners = Cultura, Estilo de vida, Tendencias, Gastronomía, Viajes, Salud y Fitness, Tecnología, entre otras.
const CATS = [
  { key: 'arquitectura', label: 'Arquitectura, diseño y decoración', brands: ['axxis'], q: 'arquitectura OR diseño OR interiorismo OR decoración', re: /arquitect|diseno|interiorismo|decoracion|construccion|vivienda|inmobiliari|urbanismo|paisajismo|museo|estadio/ },
  { key: 'especiales', label: 'Coyuntura y especiales (sismos)', brands: ['axxis', 'diners'], q: 'sismo OR terremoto OR temblor Colombia', re: /sismo|terremoto|temblor|epicentro|damnificad|emergencia|acopio/ },
  { key: 'cultura', label: 'Cultura, cine, series y música', brands: ['diners'], q: 'cine OR series OR música OR exposición OR libros', re: /cine|pelicula|serie |series|musica|concierto|festival|artista|cantante|album|libro|exposicion|teatro|podcast|netflix|estreno|gira|actor|actriz|cultura/ },
  { key: 'gastro', label: 'Gastronomía', brands: ['diners'], q: 'restaurantes OR gastronomía OR chef OR cocina colombiana', re: /restaurante|gastronom|chef|cocina|comida|receta|vino|cocteler|cafe |brunch|lechona|50 best/ },
  { key: 'viajes', label: 'Viajes y turismo', brands: ['diners'], q: 'viajes OR turismo OR destinos OR hoteles', re: /viaje|turismo|destino|hotel|playa|aerolinea|vuelos|resort|escapada|vacaciones|aeropuerto/ },
  { key: 'estilo', label: 'Estilo de vida y tendencias (moda, lujo, belleza)', brands: ['diners'], q: 'moda OR lujo OR relojes OR joyería OR belleza', re: /moda|lujo|reloj|joyeria|belleza|desfile|maquillaje|perfume|cartier|rolex|tendencia/ },
  { key: 'salud', label: 'Salud y bienestar', brands: ['diners'], q: 'salud OR bienestar OR fitness OR nutrición', re: /salud|bienestar|fitness|nutricion|ejercicio|dieta|sueno|mental/ },
  { key: 'tecnologia', label: 'Tecnología', brands: ['diners'], q: 'tecnología OR inteligencia artificial OR gadgets', re: /tecnolog|inteligencia artificial|gadget|celular|openai|robot|apple|google/ },
];

async function fetchTrends() {
  const r = await axios.get('https://trends.google.com/trending/rss?geo=CO', { headers: UA, timeout: 15000, responseType: 'text' });
  const items = [...String(r.data).matchAll(/<item>(.*?)<\/item>/gs)].map((m) => m[1]);
  return items.map((it) => {
    const news = [...it.matchAll(/<ht:news_item>(.*?)<\/ht:news_item>/gs)].map((n) => ({
      title: tag(n[1], 'ht:news_item_title'), url: tag(n[1], 'ht:news_item_url'), source: tag(n[1], 'ht:news_item_source'),
    }));
    return { query: tag(it, 'title'), traffic: tag(it, 'ht:approx_traffic'), publishedAt: tag(it, 'pubDate'), news };
  });
}

function categorize(t, brand) {
  const hay = plain(`${t.query} ${t.news.map((n) => `${n.title} ${n.url.replace(/[-_/]/g, ' ')}`).join(' ')}`);
  return CATS.filter((c) => c.brands.includes(brand)).find((c) => c.re.test(hay)) || null;
}

async function fetchNews(cat, win) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${cat.q} when:${win}`)}&hl=es-419&gl=CO&ceid=CO:es-419`;
  const r = await axios.get(url, { headers: UA, timeout: 15000, responseType: 'text' });
  const items = [...String(r.data).matchAll(/<item>(.*?)<\/item>/gs)].map((m) => m[1]);
  const list = items.map((it) => {
    const full = tag(it, 'title');
    const source = tag(it, 'source');
    const title = source && full.endsWith(` - ${source}`) ? full.slice(0, -(source.length + 3)) : full;
    return { title, source, url: tag(it, 'link'), publishedAt: tag(it, 'pubDate') };
  });
  const seen = new Set();
  const uniq = list.filter((x) => { const k = plain(x.title).slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true; });
  return { key: cat.key, label: cat.label, total: uniq.length, items: uniq.slice(0, 5) };
}

export async function GET(request) {
  try {
    const win = WINDOWS[new URL(request.url).searchParams.get('window')] || '1d';
    if (cache[win] && Date.now() - cache[win].at < TTL_MS) return Response.json(cache[win].value);
    const [trends, ...news] = await Promise.all([fetchTrends(), ...CATS.map((c) => fetchNews(c, win).catch(() => ({ key: c.key, label: c.label, total: 0, items: [] })))]);
    const brands = {};
    ['axxis', 'diners'].forEach((brand) => {
      const matched = trends.map((t) => ({ ...t, category: categorize(t, brand) })).filter((t) => t.category).map((t) => ({ ...t, category: { key: t.category.key, label: t.category.label } }));
      brands[brand] = { filteredOut: trends.length - matched.length, trends: matched, news: news.filter((c) => CATS.find((x) => x.key === c.key).brands.includes(brand)) };
    });
    const value = { fetchedAt: new Date().toISOString(), window: win, totalTrends: trends.length, brands };
    cache[win] = { at: Date.now(), value };
    return Response.json(value);
  } catch (error) {
    console.error('Daily trends error:', error.message);
    return Response.json({ error: `Tendencias: ${error.message}` }, { status: 502 });
  }
}
