import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const IDS = {
  axxis: { ig: 'META_AXXIS_PAGE_ID', fb: 'META_AXXIS_FB_PAGE_ID' },
  diners: { ig: 'META_DINERS_PAGE_ID', fb: 'META_DINERS_FB_PAGE_ID' },
};

// Temas por marca. Gana el primero que coincida; lo que no coincide va a "Otros".
const THEMES = {
  axxis: [
    ['Entrevista', /entrevista|conversamos|dialogamos|en palabras de|habla con|cuenta que/],
    ['Tendencia', /tendencia|trend|lo que viene|de moda|materiales|paleta|nuevas? coleccion|futuro del/],
    ['Arquitecto o estudio', /arquitect|estudio de|firma de|oficina de|disenador|diseñador|interiorista|pritzker|premio|maestro/],
    ['Obra, exposición o evento', /obra de|inaugur|apertura|exposicion|exposición|bienal|feria|muestra|galeria|galería|festival|evento|lanzamiento/],
    ['Proyecto', /proyecto|casa|vivienda|edificio|apartamento|residencia|museo|torre|hotel|interior|espacio|renovacion|renovación|restauracion|restauración|paisaj/],
  ],
  diners: [
    ['Entrevista', /entrevista|conversamos|dialogamos|en palabras de|habla con/],
    ['Receta o producto', /receta|prepara|ingredientes|maridaje|botella|licor|whisky|ron\b|regalo|producto|lanza\b|nueva carta/],
    ['Restaurante o chef', /restaurante|chef|cocina|menu|menú|plato|\bbar\b|cafe\b|café|gastronom|sumiller|vino|coctel|cóctel|panader|pizza|pasta|mesa/],
    ['Destino de viaje', /viaje|destino|hotel|playa|isla|resort|turismo|escapada|vuelo|ruta|ciudad|crucero/],
    ['Tendencia', /tendencia|trend|lo que viene|de moda|nuevo concepto/],
    ['Experiencia o evento', /evento|festival|experiencia|noche|invitacion|invitación|concierto|club|beneficio|lanzamiento|feria/],
  ],
};
const norm = (t) => (t || '').toLowerCase();
const classify = (brand, text) => {
  const t = norm(text);
  const hit = THEMES[brand].find(([, re]) => re.test(t));
  return hit ? hit[0] : 'Otros';
};
const iso = (d) => d.toISOString().slice(0, 10);
const startMonths = (end, back) => { const [y, m] = end.split('-').map(Number); const t = y * 12 + (m - 1) - back; return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}-01`; };

const CACHE = new Map();
const TTL = 20 * 60 * 1000;

async function paged(first, cap) {
  let res = await first;
  let rows = res.data.data || [];
  for (let i = 0; i < 4 && res.data.paging?.next && rows.length < cap; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    res = await axios.get(res.data.paging.next);
    rows = rows.concat(res.data.data || []);
  }
  return rows;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const range = resolveRange(url.searchParams);
    const brand = url.searchParams.get('brand') === 'diners' ? 'diners' : 'axxis';
    const key = `${brand}|${range.end}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true });

    const today = iso(new Date());
    const end = range.end > today ? today : range.end;
    const start = startMonths(end, 2); // 3 meses naturales terminando en el mes de fin
    const sec = (d, plus = 0) => Math.floor(Date.parse(`${d}T00:00:00Z`) / 1000) + plus * 86400;
    const token = process.env.META_ACCESS_TOKEN;
    const igId = process.env[IDS[brand].ig];
    const fbId = process.env[IDS[brand].fb];

    const acc = await axios.get('https://graph.facebook.com/v19.0/me/accounts', { params: { access_token: token } }).catch(() => ({ data: { data: [] } }));
    const pageToken = (acc.data.data || []).find((p) => p.id === fbId)?.access_token;

    const errors = [];
    const [igRows, fbRows] = await Promise.all([
      paged(axios.get(`https://graph.facebook.com/v19.0/${igId}/media`, { params: { fields: 'id,caption,media_product_type,permalink,timestamp,like_count,comments_count', since: sec(start), until: sec(end, 1), limit: 100, access_token: token } }), 400).catch((e) => { errors.push(`Instagram: ${e.response?.data?.error?.message || e.message}`); return []; }),
      pageToken ? paged(axios.get(`https://graph.facebook.com/v19.0/${fbId}/posts`, { params: { fields: 'id,message,created_time,permalink_url,shares,reactions.summary(true).limit(0),comments.summary(true).limit(0)', since: sec(start), until: sec(end, 1), limit: 100, access_token: pageToken } }), 500).catch((e) => { errors.push(`Facebook: ${e.response?.data?.error?.message || e.message}`); return []; }) : Promise.resolve([]),
    ]);

    const posts = [
      ...igRows.filter((m) => m.timestamp).map((m) => ({ net: 'ig', text: (m.caption || '').replace(/\s+/g, ' '), date: m.timestamp.slice(0, 10), link: m.permalink, inter: (m.like_count || 0) + (m.comments_count || 0) })),
      ...fbRows.map((p) => ({ net: 'fb', text: (p.message || '').replace(/\s+/g, ' '), date: (p.created_time || '').slice(0, 10), link: p.permalink_url, inter: (p.reactions?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) + (p.shares?.count || 0) })),
    ].filter((p) => p.date).map((p) => ({ ...p, theme: classify(brand, p.text) }));

    const names = [...THEMES[brand].map((t) => t[0]), 'Otros'];
    const build = (net) => {
      const list = posts.filter((p) => net === 'all' || p.net === net);
      return names.map((name) => {
        const g = list.filter((p) => p.theme === name);
        const total = g.reduce((a, p) => a + p.inter, 0);
        const top = g.slice().sort((a, b) => b.inter - a.inter)[0];
        return { name, posts: g.length, total, avg: g.length ? Math.round((total / g.length) * 10) / 10 : 0, top: top ? { link: top.link, text: top.text.slice(0, 120), inter: top.inter, net: top.net } : null };
      });
    };
    const others = posts.filter((p) => p.theme === 'Otros').sort((a, b) => b.inter - a.inter).slice(0, 8).map((p) => ({ text: p.text.slice(0, 110), inter: p.inter, net: p.net }));
    const data = {
      brand, range: { start, end }, total: posts.length, ig: igRows.length, fb: fbRows.length, errors,
      themes: { all: build('all'), ig: build('ig'), fb: build('fb') },
      others,
    };
    CACHE.set(key, { at: Date.now(), data });
    return Response.json(data);
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Social themes API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
