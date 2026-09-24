import axios from 'axios';
import googleTrends from 'google-trends-api';

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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function related(keyword, startTime, attempt = 0) {
  try {
    const raw = await googleTrends.relatedQueries({ keyword, geo: 'CO', hl: 'es', startTime });
    const lists = JSON.parse(raw).default.rankedList;
    const clean = (l) => (l?.rankedKeyword || []).slice(0, 6).map((k) => ({ query: k.query, value: k.value, label: k.formattedValue }));
    return { keyword, top: clean(lists[0]), rising: clean(lists[1]) };
  } catch (e) {
    const blocked = /is not valid JSON|<HTML|<html/i.test(String(e.message || e));
    if (!blocked && attempt < 1) { await sleep(1500); return related(keyword, startTime, attempt + 1); }
    return { keyword, blocked, error: blocked ? 'Google bloqueó temporalmente las consultas (demasiadas solicitudes)' : String(e.message || e).slice(0, 120), top: [], rising: [] };
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
  const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 30, 7), 90);
  const key = `${brand}:${days}`;
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

  const startTime = new Date(Date.now() - days * 86400000);
  const list = TOPICS[brand];
  const results = [];
  for (const t of list) {
    // Trends se consulta de a una y con pausa para evitar el bloqueo de Google; las noticias no tienen ese límite.
    const rel = await related(t.k, startTime);
    results.push({ ...rel, news: await fetchNews(t.news, days) });
    if (rel.blocked) {
      // ya bloqueado: completar el resto solo con noticias
      const rest = list.slice(results.length);
      results.push(...(await Promise.all(rest.map(async (r) => ({ keyword: r.k, blocked: true, error: rel.error, top: [], rising: [], news: await fetchNews(r.news, days) })))));
      break;
    }
    await sleep(900);
  }
  const failed = results.filter((r) => r.error).length;
  const data = { brand, days, geo: 'CO', topics: results, failed };
  if (failed < results.length) CACHE.set(key, { at: Date.now(), data });
  return Response.json(data);
}
