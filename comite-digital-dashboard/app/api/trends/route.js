import axios from 'axios';

export const dynamic = 'force-dynamic';

const TOPICS = {
  axxis: [
    { k: 'arquitectura', news: 'arquitectura (arquitecto OR edificio OR proyecto OR obra) Colombia' },
    { k: 'diseño de interiores', news: '"diseño de interiores" OR interiorismo Colombia' },
    { k: 'decoración', news: 'decoración hogar tendencias diseño' },
    { k: 'interiorismo', news: 'interiorismo OR "interior design" tendencias' },
    { k: 'proyectos inmobiliarios', news: '"proyectos inmobiliarios" OR "proyecto residencial" Colombia' },
    { k: 'proyectos arquitectónicos', news: '"proyecto arquitectónico" OR "concurso de arquitectura" OR "obra arquitectónica" Colombia' },
    { k: 'diseño', news: '"diseño industrial" OR "diseño de mobiliario" OR "feria de diseño" Colombia' },
    { k: 'paisajismo', news: 'paisajismo OR "arquitectura del paisaje" Colombia' },
    { k: 'arquitectura sostenible', news: '"arquitectura sostenible" OR "construcción sostenible" Colombia' },
    { k: 'casas de lujo', news: '"casas de lujo" OR "vivienda de lujo" Colombia' },
    { k: 'muebles de diseño', news: '"muebles de diseño" OR mobiliario diseño Colombia' },
    { k: 'urbanismo', news: 'urbanismo OR "planeación urbana" Bogotá OR Medellín' },
    { k: 'construcción', news: 'construcción vivienda Colombia Camacol' },
    { k: 'vivienda nueva', news: '"vivienda nueva" Bogotá OR Medellín OR Cali' },
  ],
  diners: [
    { k: 'restaurantes', news: 'restaurantes Bogotá apertura OR nuevo' },
    { k: 'gastronomía', news: 'gastronomía colombiana chef' },
    { k: 'viajes', news: 'viajes destinos Colombia turismo' },
    { k: 'vinos', news: 'vinos cata sommelier Colombia' },
    { k: 'moda', news: 'moda colombiana diseñadores' },
    { k: 'cultura', news: 'cultura Colombia libros exposición' },
    { k: 'arte', news: 'arte contemporáneo Colombia museo' },
    { k: 'hoteles', news: 'hoteles Colombia apertura lujo' },
    { k: 'destinos turísticos', news: 'destinos turísticos Colombia' },
    { k: 'cocteles', news: 'cocteles bar coctelería Bogotá' },
    { k: 'bienestar', news: 'bienestar spa Colombia' },
    { k: 'cine', news: 'cine estreno Colombia' },
  ],
};

const CACHE = new Map();
const TTL = 12 * 60 * 60 * 1000;

const decode = (t) => (t || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function fetchNews(query, days) {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${query} when:${Math.min(days, 30)}d`)}&hl=es-419&gl=CO&ceid=CO:es-419`;
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000, responseType: 'text' });
    const items = [...res.data.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    const seen = new Set();
    return items.map((it) => {
      const source = decode((it.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '');
      let title = decode((it.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
      return { title, source, url: (it.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || null, date: ((it.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '').slice(5, 16) };
    }).filter((n) => { const k = n.title.slice(0, 50); if (!n.title || seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  } catch {
    return [];
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
  const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 30, 7), 90);
  const key = `${brand}:${days}`;
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

  const list = TOPICS[brand];
  const results = [];
  for (let i = 0; i < list.length; i += 4) {
    // eslint-disable-next-line no-await-in-loop
    results.push(...(await Promise.all(list.slice(i, i + 4).map(async (t) => ({ keyword: t.k, news: await fetchNews(t.news, days) })))));
  }
  const withNews = results.filter((r) => r.news.length).length;
  const data = { brand, days, geo: 'CO', topics: results, failed: results.length - withNews };
  if (withNews > 0) CACHE.set(key, { at: Date.now(), data });
  return Response.json(data);
}
