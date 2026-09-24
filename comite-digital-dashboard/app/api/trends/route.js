import googleTrends from 'google-trends-api';

export const dynamic = 'force-dynamic';

const KEYWORDS = {
  axxis: [
    'arquitectura', 'diseño de interiores', 'decoración', 'interiorismo', 'proyectos inmobiliarios',
    'proyectos arquitectónicos', 'diseño', 'paisajismo', 'arquitectura sostenible', 'casas de lujo',
    'muebles de diseño', 'urbanismo', 'construcción', 'vivienda nueva',
  ],
  diners: [
    'restaurantes', 'gastronomía', 'viajes', 'vinos', 'moda', 'cultura', 'arte', 'hoteles',
    'destinos turísticos', 'cocteles', 'bienestar', 'cine',
  ],
};

const CACHE = new Map();
const TTL = 6 * 60 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function related(keyword, startTime, attempt = 0) {
  try {
    const raw = await googleTrends.relatedQueries({ keyword, geo: 'CO', hl: 'es', startTime });
    const lists = JSON.parse(raw).default.rankedList;
    const clean = (l) => (l?.rankedKeyword || []).slice(0, 6).map((k) => ({ query: k.query, value: k.value, label: k.formattedValue }));
    return { keyword, top: clean(lists[0]), rising: clean(lists[1]) };
  } catch (e) {
    if (attempt < 1) { await sleep(1200); return related(keyword, startTime, attempt + 1); }
    return { keyword, error: String(e.message || e).slice(0, 120), top: [], rising: [] };
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
  const list = KEYWORDS[brand];
  const results = [];
  for (let i = 0; i < list.length; i += 3) {
    // eslint-disable-next-line no-await-in-loop
    results.push(...(await Promise.all(list.slice(i, i + 3).map((k) => related(k, startTime)))));
  }
  const failed = results.filter((r) => r.error).length;
  const data = { brand, days, geo: 'CO', topics: results, failed };
  if (failed < results.length) CACHE.set(key, { at: Date.now(), data });
  return Response.json(data);
}
