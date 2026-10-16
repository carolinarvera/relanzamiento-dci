'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area, ReferenceDot, ReferenceLine } from 'recharts';

const CHANNEL_GROUPS = [
  { name: 'Pauta', color: '#d84315', channels: ['Paid Social', 'Paid Search', 'Paid Other', 'Paid Video', 'Paid Shopping', 'Display', 'Cross-network'] },
  { name: 'Orgánico', color: '#2e7d32', channels: ['Organic Search', 'Organic Social', 'Organic Video', 'Organic Shopping'] },
  { name: 'Directo', color: '#1a4fb3', channels: ['Direct'] },
  { name: 'Email', color: '#6a1b9a', channels: ['Email'] },
  { name: 'Referido', color: '#00838f', channels: ['Referral', 'Affiliates'] },
  { name: 'Asistentes de IA', color: '#f9a825', channels: ['AI Assistant'] },
];

function groupChannels(all) {
  const known = new Set(CHANNEL_GROUPS.flatMap((g) => g.channels));
  const sum = (items, key) => items.reduce((x, c) => x + (c[key] || 0), 0);
  return [...CHANNEL_GROUPS, { name: 'No asignado / otros', color: '#757575', channels: null }]
    .map((g) => {
      const items = all.filter((c) => (g.channels ? g.channels.includes(c.name) : !known.has(c.name)));
      return {
        ...g, items,
        sessions: sum(items, 'sessions'), views: sum(items, 'views'), users: sum(items, 'users'),
        pct: sum(items, 'pct'), prevPct: sum(items, 'prevPct'), prevViews: sum(items, 'prevViews'),
      };
    })
    .filter((g) => g.items.length > 0);
}


const plain = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const CONTENT_THEMES = [
  { key: 'coyuntura', label: 'Coyuntura y servicio (sismo, ayuda)', re: /sismo|terremoto|emergencia|acopio|damnificad|edificaciones|danos en su vivienda|seguridad de su vivienda|evaluar inmuebles/ },
  { key: 'gastro', label: 'Gastronomía y restaurantes', re: /restaurante|gastronom|comer|lechona|brunch|chef|cocina|cocteler|cafe|vino|50 best|comida|speakeasy|bar oculto/ },
  { key: 'viajes', label: 'Viajes y destinos', re: /destino|viaje|playa|resort|hotel|italia|termales|escapada|beach|cabo de la vela|lugares para|cerca de bogota|fin de semana/ },
  { key: 'arquitectura', label: 'Arquitectura y proyectos', re: /arquitectur|casa |edificio|colegio|estadio|hacienda|construir|vivienda|proyecto|paisaje|bosque|rancheria|neoclasic|restauro|restauracion/ },
  { key: 'diseno', label: 'Diseño e interiorismo', re: /diseno|interiorismo|objetos|mobiliario|espacios atemporales|tendencias/ },
  { key: 'decoracion', label: 'Decoración y hogar', re: /decoracion|apartamento|hogar|madera/ },
  { key: 'cultura', label: 'Cultura y entretenimiento', re: /serie|pelicula|streaming|musica|gira|exposicion|libro|poema|cine|kafka|macondo|cien anos|biopic|arjona|teatro|cicatriz/ },
  { key: 'sostenibilidad', label: 'Sostenibilidad y memoria', re: /sostenib|memoria|materiales|verde|jardin|viento|nativo|reciclad/ },
];

function themeShares(items) {
  const acc = {};
  let total = 0;
  items.forEach((it) => {
    const txt = plain(it.text);
    const hit = CONTENT_THEMES.filter((t) => t.re.test(txt));
    const w = Math.max(it.weight || 0, 0);
    if (!w) return;
    total += w;
    if (!hit.length) { acc.otros = (acc.otros || 0) + w; return; }
    hit.forEach((t) => { acc[t.key] = (acc[t.key] || 0) + w / hit.length; });
  });
  const out = {};
  Object.keys(acc).forEach((k) => { out[k] = total ? acc[k] / total : 0; });
  return { shares: out, n: items.length, total };
}

function titlePatterns(titles) {
  const t = titles.filter(Boolean);
  const n = t.length || 1;
  const count = (re) => t.filter((x) => re.test(plain(x))).length;
  return {
    n: t.length,
    list: count(/\b\d+\b|\b(siete|cinco|diez|seis|ocho|nueve|veinte|veintidos)\b/),
    howto: count(/claves|como |guia|consejos|que hacer|por que/),
    question: t.filter((x) => /^\s*¿/.test(x)).length,
    local: count(/bogota|colombia|medellin|cartagena|la guajira|choco|chia/),
    pct: (c) => Math.round((c / n) * 100),
  };
}

const MIN_PAGE_VIEWS = 90;

// Se descartan envíos de prueba: menos de 10 enviados o 100% de apertura.
const isRealEmail = (e) => e.sent >= 10 && !(e.delivered > 0 && e.open >= e.delivered);

const CHANNEL_SHORT = {
  'Organic Search': 'Búsqueda', 'Organic Social': 'Redes', 'Organic Video': 'Video', 'Organic Shopping': 'Shopping',
  'Paid Social': 'Meta', 'Paid Search': 'Google Ads', 'Paid Other': 'Otros', 'Paid Video': 'YouTube', 'Paid Shopping': 'Shopping',
  Display: 'Display', 'Cross-network': 'Cross-network', Referral: 'Referido', Affiliates: 'Afiliados',
};

function groupChannelsByViews(all) {
  const tv = all.reduce((a, c) => a + (c.views || 0), 0);
  const tpv = all.reduce((a, c) => a + (c.prevViews || 0), 0);
  return groupChannels(all.map((c) => ({ ...c, pct: tv ? (c.views || 0) / tv : 0, prevPct: tpv ? (c.prevViews || 0) / tpv : 0 })));
}

const norm2 = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const isoDate = (d) => d.toISOString().slice(0, 10);

function presetOptions() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const opts = [
    { label: 'Mes actual (hasta hoy)', value: `${isoDate(new Date(Date.UTC(y, now.getUTCMonth(), 1)))}|${isoDate(now)}` },
    { label: 'Últimos 30 días', value: `${isoDate(new Date(now.getTime() - 29 * 86400000))}|${isoDate(now)}` },
    { label: 'Últimos 7 días', value: `${isoDate(new Date(now.getTime() - 6 * 86400000))}|${isoDate(now)}` },
    { label: 'Últimos 3 meses cerrados', value: `${isoDate(new Date(Date.UTC(y, now.getUTCMonth() - 3, 1)))}|${isoDate(new Date(Date.UTC(y, now.getUTCMonth(), 0)))}` },
  ];
  for (let m = now.getUTCMonth() - 1; m >= 0; m -= 1) {
    opts.push({ label: `${MONTH_NAMES[m]} ${y}`, value: `${isoDate(new Date(Date.UTC(y, m, 1)))}|${isoDate(new Date(Date.UTC(y, m + 1, 0)))}` });
  }
  return opts;
}


const THEMES = {
  axxis: {
    ink: '#231815', accent: '#E4612B', accent2: '#F0A184', highlight: '#8A3A12',
    soft: '#F2F4F3', page: '#F2F4F3', line: '#E4E4E4', text: '#4B5153',
    headFont: "'Manrope', system-ui, sans-serif", bodyFont: "'Rubik', system-ui, sans-serif", logo: '/axxis.svg',
  },
  diners: {
    ink: '#101010', accent: '#9B1712', accent2: '#C9706C', highlight: '#692B2B',
    soft: '#F7F3F1', page: '#F7F3F1', line: '#EAEAEA', text: '#383935',
    headFont: "'Playfair Display', Georgia, serif", bodyFont: "'Montserrat', system-ui, sans-serif", logo: '/diners.svg',
  },
};

const WIDE_APIS = ['ga4', 'meta', 'emailtraffic'];
const spanDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000) + 1;
// Insights de contenido necesita al menos 30 días de datos
function wideRange(r) {
  const now = new Date();
  const base = r || { start: isoDate(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))), end: isoDate(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0))) };
  if (spanDays(base.start, base.end) >= 30) return r;
  const end = base.end > isoDate(now) ? isoDate(now) : base.end;
  return { start: isoDate(new Date(Date.parse(end) - 29 * 86400000)), end };
}

const SECTIONS = [
  { key: 'resumen', label: 'Resumen', apis: ['ga4', 'meta', 'pauta', 'seo', 'emails'] },
  { key: 'web', label: 'Web', apis: ['ga4', 'gsc'] },
  { key: 'seo', label: 'SEO', apis: ['seo', 'ga4', 'meta', 'emailtraffic', 'dailytrends'] },
  { key: 'redes', label: 'Redes sociales', apis: ['meta'] },
  { key: 'pauta', label: 'Pauta', apis: ['pauta'] },
  { key: 'emails', label: 'Emails', apis: ['emails', 'emailtraffic'] },
];
const CHANNEL_COLORS = {
  'Búsqueda orgánica': { bg: '#e6f4ea', fg: '#1e6b34' },
  'Social pagado': { bg: '#ede7f6', fg: '#4527a0' },
  'Social orgánico': { bg: '#e0f2f1', fg: '#00695c' },
  Directo: { bg: '#eceff1', fg: '#37474f' },
  Referido: { bg: '#fff3e0', fg: '#a35a00' },
  Email: { bg: '#fce4ec', fg: '#ad1457' },
  default: { bg: '#eee', fg: '#444' },
};
const API_NAMES = { gsc: 'Search Console', ga4: 'GA4', meta: 'Meta', seo: 'SEO', pauta: 'Pauta', emails: 'Emails', emailtraffic: 'Tráfico de email', dailytrends: 'Tendencias del día' };

function AiQueries({ brand, pages, range, accent }) {
  const [d, setD] = useState(null);
  const paths = (pages || []).slice(0, 8).map((x) => x.path).filter(Boolean);
  const key = `${brand}|${range ? `${range.start}|${range.end}` : ''}|${paths.join('|')}`;
  useEffect(() => {
    if (!paths.length) return undefined;
    let off = false;
    setD(null);
    const qs = range ? `&start=${range.start}&end=${range.end}` : '';
    fetch(`/api/aiqueries?brand=${brand}&paths=${encodeURIComponent(paths.join('|'))}${qs}`)
      .then((r) => r.json()).then((j) => { if (!off) setD(j); }).catch((e) => { if (!off) setD({ error: e.message }); });
    return () => { off = true; };
  }, [key]); // eslint-disable-line
  const th = { padding: '6px', textAlign: 'right', fontSize: '11px', color: '#666', textTransform: 'uppercase' };
  const td = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'right', fontSize: '12px' };
  return (
    <div style={{ marginTop: '22px', borderTop: '1px solid #eee', paddingTop: '14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Palabras de búsqueda asociadas a las páginas que llegan desde IA</div>
      <div style={{ fontSize: '12px', color: '#777', margin: '4px 0 8px', lineHeight: 1.5 }}>ChatGPT, Gemini y el resto no comparten lo que escribió la persona (GA4 solo registra el asistente, no la pregunta). Lo más cercano y verificable son las consultas de Google que llevan a esas mismas páginas: indican con qué palabras se busca ese tema.</div>
      {!paths.length ? <div style={{ fontSize: '12px', color: '#888' }}>Sin páginas de destino de IA en este periodo.</div>
        : !d ? <div style={{ fontSize: '12px', color: '#888' }}>Consultando Search Console…</div>
        : d.error ? <div style={{ fontSize: '12px', color: '#b71c1c' }}>No se pudo consultar: {d.error}</div>
        : !d.queries.length ? <div style={{ fontSize: '12px', color: '#888' }}>Search Console no devolvió consultas para esas páginas en este periodo.</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f0f0f0' }}><th style={{ ...th, textAlign: 'left' }}>Consulta</th><th style={th}>Clics</th><th style={th}>Impresiones</th><th style={th}>Posición</th><th style={th}>Páginas IA</th></tr></thead>
            <tbody>
              {d.queries.map((q) => (
                <tr key={q.query}>
                  <td style={{ ...td, textAlign: 'left', fontWeight: 600, overflowWrap: 'anywhere' }}>{q.query}</td>
                  <td style={{ ...td, fontWeight: 800, color: accent }}>{q.clicks.toLocaleString('es-CO')}</td>
                  <td style={td}>{q.impressions.toLocaleString('es-CO')}</td>
                  <td style={td}>{q.position != null ? q.position.toFixed(1).replace('.', ',') : '\u2014'}</td>
                  <td style={td}>{q.pages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({ gsc: {}, ga4: {}, meta: {}, seo: {}, pauta: {}, emails: {}, emailtraffic: {}, dailytrends: {} });
  const [errorsBy, setErrorsBy] = useState({});
  const [loadedKey, setLoadedKey] = useState({});
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState('web');
  const [activeTab, setActiveTab] = useState('axxis');
  const [range, setRange] = useState(null);
  const [maxDate, setMaxDate] = useState('');
  const [presets, setPresets] = useState([]);
  useEffect(() => {
    setMaxDate(new Date().toISOString().slice(0, 10));
    setPresets(presetOptions());
  }, []);
  const [draft, setDraft] = useState({ start: '', end: '' });
  const [trends, setTrends] = useState(null);
  const [trendDays, setTrendDays] = useState(30);
  const [newsWin, setNewsWin] = useState('1d');
  const [pautaObj, setPautaObj] = useState('trafico');
  const [seoIdeasOpen, setSeoIdeasOpen] = useState(true);
  const [newsByWin, setNewsByWin] = useState({});
  const [traficoOpen, setTraficoOpen] = useState(false);
  const [seoTools, setSeoTools] = useState(null);
  const [seoHealth, setSeoHealth] = useState(null);
  const [seoQuality, setSeoQuality] = useState(null);
  const [seoTech, setSeoTech] = useState(null);
  const [techSel, setTechSel] = useState('title_long');
  const [kwSearch, setKwSearch] = useState('');
  const [kwSort, setKwSort] = useState('clicks');
  const [cmpMetric, setCmpMetric] = useState('views');
  const [trafico, setTrafico] = useState(null);
  const [campDeep, setCampDeep] = useState({});
  const [campOpenIds, setCampOpenIds] = useState({});
  const loadCampaignDeep = (id) => {
    setCampDeep((s) => ({ ...s, [id]: 'loading' }));
    const qs = range ? `&start=${range.start}&end=${range.end}` : '';
    fetch(`/api/pauta-campaign?campaignId=${id}${qs}`)
      .then((r) => r.json())
      .then((j) => setCampDeep((s) => ({ ...s, [id]: j })))
      .catch((e) => setCampDeep((s) => ({ ...s, [id]: { error: e.message } })));
  };
  const toggleCampaignDeep = (id) => {
    setCampOpenIds((s) => ({ ...s, [id]: !s[id] }));
    if (!campDeep[id]) loadCampaignDeep(id);
  };
  const rangeKey = range ? `${range.start}|${range.end}` : 'default';
  const sectionDef = SECTIONS.find((x) => x.key === section);
  const effRangeFor = (api) => (section === 'seo' && WIDE_APIS.includes(api) ? wideRange(range) : range);
  const keyFor = (api) => { const r = effRangeFor(api); return r ? `${r.start}|${r.end}` : 'default'; };
  const ready = sectionDef.apis.every((a) => loadedKey[a] === keyFor(a));

  // Las tendencias deben estar al día aunque la pestaña quede abierta días: se refrescan cada 15 min y al volver a la pestaña.
  useEffect(() => {
    if (section !== 'seo') return undefined;
    const refresh = () => {
      fetch('/api/dailytrends?window=1d', { cache: 'no-store' })
        .then((r) => r.json())
        .then((j) => { if (!j.error) { setData((d) => ({ ...d, dailytrends: j })); setNewsByWin({}); } })
        .catch(() => {});
    };
    const onVis = () => { if (document.visibilityState === 'visible') refresh(); };
    const t = setInterval(refresh, 15 * 60 * 1000);
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, [section]);

  useEffect(() => {
    if (section !== 'seo' || newsWin === '1d' || newsByWin[newsWin]) return undefined;
    let cancelled = false;
    fetch(`/api/dailytrends?window=${newsWin}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => { if (!cancelled && !j.error) setNewsByWin((m) => ({ ...m, [newsWin]: j })); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [section, newsWin]); // eslint-disable-line

  useEffect(() => {
    if (section !== 'seo') return undefined;
    let cancelled = false;
    setTrends(null);
    fetch(`/api/trends?brand=${activeTab}&days=${trendDays}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setTrends(j); })
      .catch((e) => { if (!cancelled) setTrends({ error: e.message }); });
    return () => { cancelled = true; };
  }, [activeTab, trendDays, section]);

  useEffect(() => {
    if (section !== 'seo') return undefined;
    let cancelled = false;
    setSeoQuality(null);
    setSeoTech(null);
    const qs = range ? `&start=${range.start}&end=${range.end}` : '';
    fetch(`/api/seo-quality?brand=${activeTab}${qs}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setSeoQuality(j); })
      .catch((e) => { if (!cancelled) setSeoQuality({ error: e.message }); });
    fetch(`/api/seo-tech?brand=${activeTab}${qs}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setSeoTech(j); })
      .catch((e) => { if (!cancelled) setSeoTech({ error: e.message }); });
    return () => { cancelled = true; };
  }, [section, activeTab, rangeKey]);

  useEffect(() => {
    if (section !== 'seo') return undefined;
    let cancelled = false;
    setSeoHealth(null);
    const qs = range ? `&start=${range.start}&end=${range.end}` : '';
    fetch(`/api/seo-health?brand=${activeTab}${qs}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setSeoHealth(j); })
      .catch((e) => { if (!cancelled) setSeoHealth({ error: e.message }); });
    return () => { cancelled = true; };
  }, [section, activeTab, rangeKey]);

  useEffect(() => {
    if (section !== 'seo') return undefined;
    let cancelled = false;
    setSeoTools(null);
    const qs = range ? `&start=${range.start}&end=${range.end}` : '';
    fetch(`/api/seo-tools?brand=${activeTab}${qs}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setSeoTools(j); })
      .catch((e) => { if (!cancelled) setSeoTools({ error: e.message }); });
    return () => { cancelled = true; };
  }, [section, activeTab, rangeKey]);

  useEffect(() => {
    if (section !== 'pauta' || !traficoOpen) return undefined;
    let cancelled = false;
    setTrafico(null);
    const qs = range ? `&start=${range.start}&end=${range.end}` : '';
    fetch(`/api/pauta-trafico?brand=${activeTab}${qs}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setTrafico(j); })
      .catch((e) => { if (!cancelled) setTrafico({ error: e.message }); });
    return () => { cancelled = true; };
  }, [section, traficoOpen, activeTab, rangeKey]);

  useEffect(() => {
    let cancelled = false;
    const loadApi = async (api, force) => {
      const effRange = effRangeFor(api);
      const apiKey = keyFor(api);
      if (!force && loadedKey[api] === apiKey) return;
      const mock = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mock') === '1';
      const qs = [effRange && `start=${effRange.start}&end=${effRange.end}`, mock && 'mock=1'].filter(Boolean).join('&');
      try {
        const r = await fetch(`/api/${api}${qs ? `?${qs}` : ''}`, api === 'pauta' ? {} : { cache: 'no-store' });
        const j = await r.json();
        if (cancelled) return;
        if (!r.ok) {
          setErrorsBy((e) => ({ ...e, [api]: [`${API_NAMES[api]}: ${j.error || `HTTP ${r.status}`}`] }));
          setData((d) => ({ ...d, [api]: {} }));
        } else {
          const extra = (j.errors || []).map((e) => `${API_NAMES[api]} ${e}`);
          setErrorsBy((e) => ({ ...e, [api]: extra }));
          setData((d) => ({ ...d, [api]: j }));
        }
        setLoadedKey((k) => ({ ...k, [api]: apiKey }));
      } catch (e) {
        if (cancelled) return;
        setErrorsBy((er) => ({ ...er, [api]: [`${API_NAMES[api]}: ${e.message}`] }));
        setLoadedKey((k) => ({ ...k, [api]: apiKey }));
      }
    };
    const run = async (force) => {
      setLoading(true);
      await Promise.all(sectionDef.apis.map((a) => loadApi(a, force)));
      if (!cancelled) setLoading(false);
    };
    run(false);
    const interval = setInterval(() => run(true), 300000); // refresca solo la sección activa cada 5 min
    return () => { cancelled = true; clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, section]);

  const T = THEMES[activeTab];

  useEffect(() => { document.body.style.background = T.page; }, [activeTab]); // eslint-disable-line

  const styles = {
    container: { maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: T.bodyFont, color: T.text, minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: T.ink, fontFamily: T.headFont },
    tabs: { display: 'flex', gap: '10px' },
    tabBtn: (active) => ({
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: active ? T.accent : '#ddd',
      color: active ? 'white' : '#333',
      fontWeight: active ? 'bold' : 'normal',
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    cardTitle: { fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '8px' },
    cardValue: { fontSize: '28px', fontWeight: 'bold', color: T.accent },
    cardSubtext: { fontSize: '12px', color: '#999', marginTop: '8px' },
    section: { marginBottom: '40px' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: T.ink, marginBottom: '15px', fontFamily: T.headFont },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { backgroundColor: '#f0f0f0', padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#666' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
    change: (positive) => ({ fontSize: '12px', marginTop: '8px', color: positive ? '#2e7d32' : '#c62828', fontWeight: '600' }),
  };

  const renderReturning = (R, title = 'Nuevos vs recurrentes') => {
    if (!R) return null;
    const bar = (label, pct, color) => (
      <div key={label} style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>{label}</span><strong>{(pct * 100).toFixed(pct < 0.1 ? 1 : 0)}%</strong>
        </div>
        <div style={{ background: T.soft, borderRadius: '4px', height: '8px', marginTop: '3px' }}>
          <div style={{ width: `${Math.min(pct, 1) * 100}%`, background: color, height: '8px', borderRadius: '4px' }} />
        </div>
      </div>
    );
    const pp = (cur, prev) => {
      if (prev === undefined || prev === null) return null;
      const d = (cur - prev) * 100;
      return <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 700, color: d >= 0 ? '#2e7d32' : '#c62828' }}>{d >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(d).toFixed(1)} pp</span>;
    };
    return (
      <div style={styles.card}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={{ display: 'flex', gap: '18px', marginTop: '10px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: T.accent }}>{(R.newPct * 100).toFixed(0)}%</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Nuevos{pp(R.newPct, R.prevNewPct)}</div>
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#333' }}>{(R.returningPct * 100).toFixed(0)}%</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Recurrentes{pp(R.returningPct, R.prevReturningPct)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginTop: '10px', background: '#ddd' }}>
          <div style={{ width: `${R.newPct * 100}%`, background: T.accent }} />
          <div style={{ width: `${R.returningPct * 100}%`, background: '#333' }} />
        </div>
        {R.frequency?.length > 0 ? (
          <>
            <div style={{ ...styles.cardTitle, marginTop: '16px' }}>Frecuencia de visita</div>
            {R.frequency.map((x) => bar(x.label, x.pct, '#333'))}
          </>
        ) : R.perUser ? (() => {
          const mx = Math.max(R.perUser.new, R.perUser.returning, 0.0001);
          const row = (label, v, prev, color) => (
            <div key={label} style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>{label}</span>
                <span><strong>{v.toFixed(2)}</strong> sesiones{prev ? <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 700, color: v >= prev ? '#2e7d32' : '#c62828' }}>{v >= prev ? '\u25B2' : '\u25BC'} {Math.abs((v / prev - 1) * 100).toFixed(1)}%</span> : null}</span>
              </div>
              <div style={{ background: T.soft, borderRadius: '4px', height: '8px', marginTop: '3px' }}>
                <div style={{ width: `${(v / mx) * 100}%`, background: color, height: '8px', borderRadius: '4px' }} />
              </div>
              {prev ? <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Mes anterior {prev.toFixed(2)}</div> : null}
            </div>
          );
          return (
            <>
              <div style={{ ...styles.cardTitle, marginTop: '16px' }}>Frecuencia: sesiones por usuario</div>
              {row('Nuevos', R.perUser.new, R.perUser.prevNew, T.accent)}
              {row('Recurrentes', R.perUser.returning, R.perUser.prevReturning, '#333')}
            </>
          );
        })() : null}
      </div>
    );
  };

  const renderChange = (value, lowerIsBetter = false, prevText = null) => {
    if (value === null || value === undefined) return null;
    const positive = value >= 0;
    const good = lowerIsBetter ? !positive : positive;
    const arrow = positive ? '↑' : '↓';
    return (
      <>
        <div style={styles.change(good)}>{arrow} {(Math.abs(value) * 100).toFixed(1)}% vs mes anterior</div>
        {prevText !== null && prevText !== undefined && <div style={styles.cardSubtext}>Mes anterior: <strong>{prevText}</strong></div>}
      </>
    );
  };
  const prevFrom = (cur, change, fmt) => (cur === undefined || cur === null || change === undefined || change === null || change <= -1 || !Number.isFinite(Number(cur)) ? null : (fmt || ((v) => Math.round(v).toLocaleString('es-CO')))(Number(cur) / (1 + change)));
  const durSec = (t) => (typeof t === 'string' ? t.split(':').reduce((a, x) => a * 60 + Number(x), 0) : null);
  const fmtHMS = (sec) => [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), Math.round(sec % 60)].map((n) => String(n).padStart(2, '0')).join(':');
  const pctFmt = (d) => (v) => `${(v * 100).toFixed(d)}%`;

  const renderUsersRow = (g) => {
          const R = g.returning;
          const prevUsers = g.usersChange != null && g.usersChange > -1 ? g.users / (1 + g.usersChange) : null;
          const prevNew = g.newUsersChange != null && g.newUsersChange > -1 ? g.newUsers / (1 + g.newUsersChange) : null;
          const recur = g.users != null && g.newUsers != null ? Math.max(g.users - g.newUsers, 0) : null;
          const prevRecur = prevUsers != null && prevNew != null ? Math.max(prevUsers - prevNew, 0) : null;
          const recurChange = recur !== null && prevRecur ? recur / prevRecur - 1 : null;
          const segmentExtras = (channels, dur, durLabel) => (
            <>
              {channels?.length > 0 && (() => {
                const groupsN = CHANNEL_GROUPS.map((cg) => ({ ...cg, sessions: channels.filter((c) => cg.channels.includes(c.name)).reduce((a, c) => a + c.sessions, 0) }));
                const known = new Set(CHANNEL_GROUPS.flatMap((cg) => cg.channels));
                const other = channels.filter((c) => !known.has(c.name)).reduce((a, c) => a + c.sessions, 0);
                if (other) groupsN.push({ name: 'Otros', color: '#757575', sessions: other });
                const total = groupsN.reduce((a, x) => a + x.sessions, 0);
                const top = groupsN.slice().sort((x, y) => y.sessions - x.sessions)[0];
                if (!total || !top || !top.sessions) return null;
                return (
                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                    <div style={styles.cardTitle}>Principal fuente de tráfico</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: top.color }}>{top.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>{((top.sessions / total) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={styles.cardSubtext}>de las sesiones de este grupo</div>
                  </div>
                );
              })()}
              {dur?.sec != null && (
                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <div style={styles.cardTitle}>{durLabel}</div>
                  <div style={{ ...styles.cardValue, fontSize: '24px' }}>{fmtHMS(dur.sec)}</div>
                  {dur.prevSec ? renderChange(dur.sec / dur.prevSec - 1, false, fmtHMS(dur.prevSec)) : null}
                </div>
              )}
            </>
          );
          if (g.newUsers == null && !R && recur === null) return null;
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr)', gap: '20px', alignItems: 'stretch', marginTop: '20px' }}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Usuarios nuevos</div>
                <div style={styles.cardValue}>{nf(g.newUsers)}</div>
                {renderChange(g.newUsersChange, false, prevFrom(g.newUsers, g.newUsersChange))}
                {segmentExtras(g.newChannels, g.newDuration, 'Duración media de nuevos')}
              </div>
              {renderReturning(R) || <div />}
              <div style={styles.card}>
                <div style={styles.cardTitle}>Usuarios recurrentes</div>
                <div style={styles.cardValue}>{nf(recur)}</div>
                {renderChange(recurChange, false, prevRecur != null ? Math.round(prevRecur).toLocaleString('es-CO') : null)}
                {segmentExtras(g.returningChannels, g.returningDuration, 'Duración media de recurrentes')}
              </div>
            </div>
          );
  };

  const renderPP = (cur, prev) => {
    if (prev === null || prev === undefined) return null;
    const diff = (cur - prev) * 100;
    return <div style={styles.change(diff >= 0)}>{diff >= 0 ? '\u2191' : '\u2193'} {Math.abs(diff).toFixed(2)} pp vs periodo anterior</div>;
  };

  const fmtMin = (sec) => {
    const t = Math.round(sec || 0);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')} min`;
  };

  const formatCompact = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  const axxisData = {
    gsc: data.gsc?.axxis || {},
    ga4: data.ga4?.axxis || {},
    meta: data.meta?.axxis || {},
    seo: data.seo?.axxis || null,
    emails: data.emails?.axxis || null,
    emailtraffic: data.emailtraffic?.axxis || null,
  };

  const dinersData = {
    gsc: data.gsc?.diners || {},
    ga4: data.ga4?.diners || {},
    meta: data.meta?.diners || {},
    seo: data.seo?.diners || null,
    emails: data.emails?.diners || null,
    emailtraffic: data.emailtraffic?.diners || null,
  };

  const current = activeTab === 'axxis' ? axxisData : dinersData;

  const dailyList = current.ga4?.dailyViews || [];
  const dailyAvg = dailyList.length ? dailyList.reduce((a, d) => a + d.value, 0) / dailyList.length : 0;
  const dailyThreshold = dailyAvg * 1.15;
  const aboveAvg = dailyList.filter((d) => d.value > dailyThreshold);
  const rangeLabel = (section === 'seo' && data.seo?.range?.label) || data.ga4?.range?.label || data.gsc?.range?.label || data.seo?.range?.label || data.meta?.range?.label || data.pauta?.range?.label || '';
  const insightsLabel = data.ga4?.range?.label || rangeLabel;

  // Piezas de la pestaña SEO (solo se usan allí)
  const seoUi = (() => {
    const cell = { padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px' };
    const num = { ...cell, textAlign: 'right' };
    const head = { padding: '8px', textAlign: 'right', fontSize: '11px', color: '#666', textTransform: 'uppercase' };
    const dash = '—';
    const dClicks = (v) => (v === 0 ? <span style={{ color: '#999' }}>0</span> : <span style={{ color: v > 0 ? '#2e7d32' : '#b71c1c', fontWeight: 700 }}>{v > 0 ? '+' : ''}{nf(v)}</span>);
    const dPos = (cur, prev) => {
      if (prev === null || prev === undefined || cur === null) return <span style={{ color: '#999' }}>nueva</span>;
      const d = cur - prev;
      if (Math.abs(d) < 0.05) return <span style={{ color: '#999' }}>=</span>;
      return <span style={{ color: d < 0 ? '#2e7d32' : '#b71c1c', fontWeight: 700 }}>{d < 0 ? '↑' : '↓'} {Math.abs(d).toFixed(1)}</span>;
    };
    const kwTable = (rows, opts = {}) => (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
          <thead>
            <tr style={{ background: T.soft }}>
              <th style={{ ...head, textAlign: 'left' }}>Palabra</th>
              <th style={head}>Clics</th>
              <th style={head}>Vs anterior</th>
              <th style={head}>Impresiones</th>
              <th style={head}>CTR</th>
              <th style={head}>Posición</th>
              <th style={head}>Cambio pos.</th>
              {opts.potential && <th style={head}>Clics potenciales</th>}
              {opts.potential && <th style={{ ...head, textAlign: 'left' }}>Qué hacer</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, k) => (
              <tr key={r.key}>
                <td style={{ ...cell, wordBreak: 'break-word' }}><span style={{ color: '#999' }}>{k + 1}.</span> {r.key}</td>
                <td style={num}><strong>{nf(r.clicks)}</strong></td>
                <td style={num}>{dClicks(r.deltaClicks)}</td>
                <td style={num}>{nf(r.impressions)}</td>
                <td style={num}>{(r.ctr * 100).toFixed(1)}%</td>
                <td style={num}>{r.position === null ? dash : r.position.toFixed(1)}</td>
                <td style={num}>{dPos(r.position, r.prevPosition)}</td>
                {opts.potential && <td style={{ ...num, fontWeight: 700, color: T.accent }}>+{nf(Math.round(r.potentialClicks))}</td>}
                {opts.potential && <td style={cell}>{r.action}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    const step = (n, title, text) => (
      <div style={{ margin: '34px 0 12px' }}>
        <div style={{ fontFamily: T.headFont, fontSize: '17px', fontWeight: 800, color: T.ink }}>{n ? <span style={{ color: T.accent }}>{n}. </span> : null}{title}</div>
        {text && <div style={{ ...styles.cardSubtext, marginTop: '2px' }}>{text}</div>}
      </div>
    );
    const prevLine = (label, value) => (value === null || value === undefined ? null : <div style={{ fontSize: '11px', color: '#8a8a8a', marginTop: '3px' }}>{label}: <strong style={{ fontWeight: 700 }}>{value}</strong></div>);
    const fmtDur = (sec) => (sec === null || sec === undefined ? null : `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')} min`);
    return { cell, num, head, dash, dClicks, dPos, kwTable, step, prevLine, fmtDur };
  })();
  const nf = (v) => (v === undefined || v === null ? '\u2014' : Number(v).toLocaleString('es-CO'));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={T.logo} alt={activeTab} style={{ height: '30px' }} />
          <h1 style={styles.title}>Comité Digital Dashboard</h1>
        </div>
        <div style={styles.tabs}>
          <button style={styles.tabBtn(activeTab === 'axxis')} onClick={() => setActiveTab('axxis')}>AXXIS</button>
          <button style={styles.tabBtn(activeTab === 'diners')} onClick={() => setActiveTab('diners')}>DINERS</button>
        </div>
      </div>

      <div style={{ ...styles.card, display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <strong style={{ fontSize: '13px' }}>Periodo del informe:</strong>
        <select
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          value=""
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            if (v === 'default') { setRange(null); setDraft({ start: '', end: '' }); return; }
            const [a, b] = v.split('|');
            setRange({ start: a, end: b });
            setDraft({ start: a, end: b });
          }}
        >
          <option value="">Atajos…</option>
          <option value="default">Último mes cerrado (por defecto)</option>
          {presets.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" value={draft.start || data.ga4?.range?.start || ''} max={maxDate || undefined} onChange={(e) => setDraft({ ...draft, start: e.target.value, end: draft.end || data.ga4?.range?.end || '' })} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <span>a</span>
        <input type="date" value={draft.end || data.ga4?.range?.end || ''} max={maxDate || undefined} onChange={(e) => setDraft({ ...draft, end: e.target.value, start: draft.start || data.ga4?.range?.start || '' })} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button
          style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', background: T.accent, color: 'white', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => { if (draft.start && draft.end && draft.start <= draft.end) setRange({ start: draft.start, end: draft.end }); }}
        >Aplicar</button>
        <span style={{ fontSize: '13px', color: '#666' }}>{loading ? 'Actualizando…' : `Mostrando: ${rangeLabel}`} · variación vs periodo anterior equivalente</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        {SECTIONS.map((x) => (
          <button
            key={x.key}
            onClick={() => setSection(x.key)}
            style={{ padding: '10px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: section === x.key ? 700 : 500, color: section === x.key ? T.accent : '#555', borderBottom: section === x.key ? '3px solid #0066cc' : '3px solid transparent', marginBottom: '-2px' }}
          >
            {x.label}
          </button>
        ))}
      </div>

      {Object.values(errorsBy).flat().length > 0 && (
        <div style={{ background: '#fdecea', color: '#b71c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
          <strong>Fuentes con error (sin datos de ejemplo, solo datos reales):</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>{Object.values(errorsBy).flat().map((e, k) => <li key={k}>{e}</li>)}</ul>
        </div>
      )}

      {ready && section === 'web' && (
      <>
      {/* GA4 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Informe Web</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Vistas</div>
            <div style={styles.cardValue}>{nf(current.ga4?.pageviews)}</div>
            {renderChange(current.ga4?.pageviewsChange, false, prevFrom(current.ga4?.pageviews, current.ga4?.pageviewsChange))}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Sesiones</div>
            <div style={styles.cardValue}>{nf(current.ga4?.sessions)}</div>
            {renderChange(current.ga4?.sessionsChange, false, prevFrom(current.ga4?.sessions, current.ga4?.sessionsChange))}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Total de Usuarios</div>
            <div style={styles.cardValue}>{nf(current.ga4?.users)}</div>
            {renderChange(current.ga4?.usersChange, false, prevFrom(current.ga4?.users, current.ga4?.usersChange))}
          </div>
        </div>

        {current.ga4?.monthlyHistory?.length > 0 && (
          <div style={{ ...styles.card, marginTop: '20px' }}>
            <div style={styles.cardTitle}>Tráfico total de la página web</div>
            <div style={{ width: '100%', height: 360, marginTop: '12px' }}>
              <ResponsiveContainer>
                <BarChart data={current.ga4.monthlyHistory} margin={{ top: 30, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                  <Legend />
                  <Bar dataKey="vistas" name="Vistas" fill={T.accent} legendType="square">
                    {current.ga4.monthlyHistory.map((entry, i) => (
                      <Cell key={`vis-${i}`} fill={i === current.ga4.monthlyHistory.length - 1 ? T.highlight : T.accent} />
                    ))}
                    <LabelList dataKey="vistas" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: T.accent }} />
                  </Bar>
                  <Bar dataKey="sesiones" name="Sesiones" fill="#333333" legendType="square">
                    {current.ga4.monthlyHistory.map((entry, i) => (
                      <Cell key={`ses-${i}`} fill={i === current.ga4.monthlyHistory.length - 1 ? '#000000' : '#333333'} />
                    ))}
                    <LabelList dataKey="sesiones" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#333' }} />
                  </Bar>
                  <Bar dataKey="usuarios" name="Total de usuarios" fill="#999999" legendType="square">
                    {current.ga4.monthlyHistory.map((entry, i) => (
                      <Cell key={`usu-${i}`} fill={i === current.ga4.monthlyHistory.length - 1 ? '#555555' : '#999999'} />
                    ))}
                    <LabelList dataKey="usuarios" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#999' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.cardSubtext}>El último mes ({current.ga4.monthlyHistory[current.ga4.monthlyHistory.length - 1]?.month}) se destaca en color más oscuro</div>
          </div>
        )}

        {renderUsersRow({ ...current.ga4, returning: current.ga4?.audience?.returning, newChannels: current.ga4?.audience?.newChannels, newDuration: current.ga4?.audience?.newDuration, returningChannels: current.ga4?.audience?.returningChannels, returningDuration: current.ga4?.audience?.returningDuration })}

        <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '20px 0 10px' }}>Tráfico orgánico (búsqueda) · {rangeLabel}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '20px' }}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Vistas de búsqueda orgánica (Google)</div>
            <div style={styles.cardValue}>{nf(current.ga4?.organic?.views)}</div>
            {renderChange(current.ga4?.organic?.viewsChange, false, prevFrom(current.ga4?.organic?.views, current.ga4?.organic?.viewsChange))}
            <div style={styles.cardSubtext}>GA4 · grupo de canal Organic Search</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Posición promedio</div>
            <div style={styles.cardValue}>{current.gsc?.position ? current.gsc.position.toFixed(1) : '\u2014'}</div>
            {current.gsc?.prev?.position ? renderChange(current.gsc.position / current.gsc.prev.position - 1, true, current.gsc.prev.position.toFixed(1)) : null}
            <div style={styles.cardSubtext}>Search Console · menor es mejor</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Porcentaje de Interacciones</div>
            <div style={styles.cardValue}>{current.ga4?.engagementRate ? (current.ga4.engagementRate * 100).toFixed(2) : 0}%</div>
            {renderChange(current.ga4?.engagementRateChange, false, prevFrom(current.ga4?.engagementRate, current.ga4?.engagementRateChange, pctFmt(2)))}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Duración Media Sesión</div>
            <div style={styles.cardValue}>{current.ga4?.avgSessionDuration || '00:00:00'}</div>
            {renderChange(current.ga4?.avgSessionDurationChange, false, prevFrom(durSec(current.ga4?.avgSessionDuration), current.ga4?.avgSessionDurationChange, fmtHMS))}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Porcentaje de Rebote</div>
            <div style={styles.cardValue}>{current.ga4?.bounceRate ? (current.ga4.bounceRate * 100).toFixed(0) : 0}%</div>
            {renderChange(current.ga4?.bounceRateChange, true, prevFrom(current.ga4?.bounceRate, current.ga4?.bounceRateChange, pctFmt(0)))}<div style={styles.cardSubtext}>menor es mejor</div>
          </div>
        </div>

            {current.ga4.audience && (
              <div style={{ marginTop: '30px' }}>
                <h2 style={styles.sectionTitle}>Fuentes de tráfico</h2>
                {(() => {
                  const groups = groupChannelsByViews(current.ga4.audience.channels).filter((g) => g.pct > 0).sort((a, b) => b.views - a.views);
                  const chip = (v) => (v === null || v === undefined || !Number.isFinite(v) ? null : (
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px', marginLeft: '6px', background: v >= 0 ? '#e3f4e6' : '#fbe4e4', color: v >= 0 ? '#2e7d32' : '#b71c1c' }}>
                      {v >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(v * 100).toFixed(v > 1 ? 0 : 1)}%
                    </span>
                  ));
                  const rel = (cur, prev) => (prev ? cur / prev - 1 : null);
                  return (
                    <div style={{ ...styles.card, marginBottom: '20px', background: '#f3f1ee' }}>
                      <div style={{ display: 'flex', height: '44px', borderRadius: '22px', overflow: 'hidden', background: '#ddd' }}>
                        {groups.map((g) => (
                          <div key={g.name} title={`${g.name} ${(g.pct * 100).toFixed(1)}%`} style={{ width: `${g.pct * 100}%`, background: g.color }} />
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`, gap: '18px', marginTop: '16px' }}>
                        {groups.map((g) => (
                          <div key={g.name} style={{ borderTop: `3px solid ${g.color}`, paddingTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '30px', fontWeight: 800, color: '#111' }}>{nf(g.views)}</span>
                              {chip(rel(g.views, g.prevViews))}
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: T.ink }}>{g.name}</div>
                            <div style={{ fontSize: '13px', color: '#333', marginTop: '4px' }}>
                              <strong>{(g.pct * 100).toFixed(g.pct < 0.1 ? 1 : 0)}%</strong> de las vistas
                              {Number.isFinite(g.prevPct) && g.prevPct > 0 && (() => {
                                const d = (g.pct - g.prevPct) * 100;
                                return (
                                  <>
                                    <span style={{ marginLeft: '6px', fontSize: '12px', fontWeight: 700, color: d >= 0 ? '#2e7d32' : '#c62828' }}>{d >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(d).toFixed(1)} pp</span>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Periodo anterior {(g.prevPct * 100).toFixed(g.prevPct < 0.1 ? 1 : 0)}%</div>
                                  </>
                                );
                              })()}
                            </div>
                            {g.items.length > 1 && (
                              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                                {g.items.slice().sort((x, y) => y.views - x.views).map((c, n) => (
                                  <span key={c.name}>{n > 0 ? ' · ' : ''}{CHANNEL_SHORT[c.name] || c.name} <strong>{nf(c.views)}</strong></span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div style={styles.cardSubtext}>Vistas de página por tipo de fuente y su participación; variaciones vs el periodo anterior equivalente.</div>
                    </div>
                  );
                })()}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
                  {current.ga4.audience.ai?.sources?.length > 0 && (() => {
                    const A = current.ga4.audience;
                    const ai = A.ai;
                    const aiCh = (A.channels || []).find((c) => c.name === 'AI Assistant');
                    const totV = (A.channels || []).reduce((x, c) => x + (c.views || 0), 0);
                    const chg = aiCh && aiCh.prevViews ? aiCh.views / aiCh.prevViews - 1 : null;
                    const topSrc = ai.sources.slice().sort((x, y) => y.views - x.views)[0];
                    const srcTotal = ai.sources.reduce((x, c) => x + c.views, 0);
                    const secMap = {};
                    (ai.pages || []).forEach((pg) => { const sec = (pg.path.split('/')[1] || 'inicio').replace(/-/g, ' '); secMap[sec] = (secMap[sec] || 0) + pg.sessions; });
                    const secTotal = Object.values(secMap).reduce((x, v) => x + v, 0);
                    const secs = Object.entries(secMap).sort((x, y) => y[1] - x[1]).slice(0, 5);
                    const Q = ai.quality;
                    const qRows = [['Tráfico de asistentes de IA', Q?.ai], ['Búsqueda orgánica', Q?.organic], ['Todo el sitio', Q?.site]].filter((r) => r[1]);
                    const kpi = (title, value, sub) => (
                      <div style={{ background: '#f7f5f2', borderRadius: '8px', padding: '12px 14px' }}>
                        <div style={styles.cardTitle}>{title}</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: T.accent }}>{value}</div>
                        {sub}
                      </div>
                    );
                    return (
                      <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
                        <div style={styles.cardTitle}>Asistentes de IA que envían tráfico</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginTop: '10px' }}>
                          {aiCh && kpi('Vistas desde IA', nf(aiCh.views), <>{renderChange(chg, false, aiCh.prevViews ? nf(aiCh.prevViews) : null)}</>)}
                          {aiCh && totV > 0 && kpi('Peso sobre las vistas del sitio', `${((aiCh.views / totV) * 100).toFixed(2)}%`, <div style={styles.cardSubtext}>{nf(aiCh.sessions)} sesiones · {nf(aiCh.users)} usuarios</div>)}
                          {topSrc && kpi('Asistente principal', topSrc.name, <div style={styles.cardSubtext}>{srcTotal ? ((topSrc.views / srcTotal) * 100).toFixed(0) : 0}% de las vistas de IA</div>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginTop: '18px', alignItems: 'start' }}>
                          <div>
                            <div style={styles.cardTitle}>Calidad del tráfico</div>
                            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '6px' }}>
                              <thead>
                                <tr style={{ background: '#f0f0f0' }}>
                                  <th style={{ padding: '6px', textAlign: 'left' }}>Origen</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>Duración</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>Rebote</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>Interacción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {qRows.map(([label, q], k) => (
                                  <tr key={label} style={{ fontWeight: k === 0 ? 700 : 400 }}>
                                    <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>{label}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{fmtHMS(q.sec)}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{(q.bounce * 100).toFixed(0)}%</td>
                                    <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{(q.engagement * 100).toFixed(0)}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div style={styles.cardSubtext}>Rebote menor y duración mayor que la búsqueda indican tráfico más comprometido.</div>
                          </div>
                          <div>
                            <div style={styles.cardTitle}>Por asistente</div>
                            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '6px' }}>
                              <thead>
                                <tr style={{ background: '#f0f0f0' }}>
                                  <th style={{ padding: '6px', textAlign: 'left' }}>Asistente</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>Vistas</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>% de IA</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>Sesiones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ai.sources.slice().sort((x, y) => y.views - x.views).map((a) => (
                                  <tr key={a.name}>
                                    <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>{a.name}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(a.views)}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{srcTotal ? ((a.views / srcTotal) * 100).toFixed(0) : 0}%</td>
                                    <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(a.sessions)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <div style={styles.cardTitle}>Secciones que más cita la IA</div>
                            {secs.map(([name, v], k) => (
                              <div key={name} style={{ marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', textTransform: 'capitalize' }}><span>{name}</span><strong>{secTotal ? ((v / secTotal) * 100).toFixed(0) : 0}%</strong></div>
                                <div style={{ background: T.soft, borderRadius: '4px', height: '8px', marginTop: '3px' }}>
                                  <div style={{ width: `${secTotal ? (v / secTotal) * 100 : 0}%`, background: k === 0 ? T.highlight : T.accent, height: '8px', borderRadius: '4px' }} />
                                </div>
                              </div>
                            ))}
                            {ai.pages?.length > 0 && (
                              <>
                                <div style={{ ...styles.cardTitle, marginTop: '14px' }}>Artículos a los que llegan (sesiones)</div>
                                <ol style={{ fontSize: '12px', paddingLeft: '18px', margin: '6px 0 0' }}>
                                  {ai.pages.slice(0, 5).map((pg) => (
                                    <li key={pg.path} style={{ marginBottom: '4px', overflowWrap: 'anywhere' }}>{pg.title || pg.path} <strong>· {nf(pg.sessions)}</strong></li>
                                  ))}
                                </ol>
                              </>
                            )}
                          </div>
                        </div>
                        <AiQueries brand={activeTab} pages={ai.pages} range={range} accent={T.accent} />
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

        {current.ga4?.dailyViews?.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <div style={{ ...styles.card, padding: '28px', borderTop: `4px solid ${T.accent}`, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
              <div style={{ ...styles.cardTitle, fontSize: '18px', color: '#222' }}>Visitas diarias: agosto y septiembre</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Se destacan los {aboveAvg.length} días por encima de {Math.round(dailyThreshold).toLocaleString('es-CO')} vistas/día (promedio + 15%)</div>
              <div style={{ width: '100%', height: 460, marginTop: '16px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={current.ga4.dailyViews} margin={{ top: 30, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={6} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                      <Area type="monotone" dataKey="value" name="Vistas" stroke={T.accent} strokeDasharray="2 3" strokeWidth={3} fill={T.accent} fillOpacity={0.12} />
                      <ReferenceLine x="1 sep" stroke="#0000cc" strokeWidth={2} />
                      <ReferenceLine y={dailyThreshold} stroke="#888" strokeDasharray="6 4"
                        label={{ value: `Umbral ${Math.round(dailyThreshold).toLocaleString('es-CO')}`, position: 'insideBottomRight', fontSize: 12, fill: '#666' }} />
                      {aboveAvg.map((d) => (
                        <ReferenceDot key={d.label} x={d.label} y={d.value} r={6} fill={T.highlight} stroke="#fff"
                          label={{ value: d.value.toLocaleString('es-CO'), position: 'top', fontSize: 12, fontWeight: 700, fill: '#222' }} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </div>
            <div style={{ ...styles.card, marginTop: '20px' }}>
              <div style={styles.cardTitle}>Días por encima del promedio: qué se leyó, de dónde llegó y cuándo</div>
              <div style={{ overflowX: 'auto', marginTop: '12px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '760px' }}>
                  <thead>
                    <tr>
                      {['Día', 'Vistas', 'Dispositivo', 'Horas pico', 'Páginas más leídas (vistas · tiempo de lectura · origen de tráfico)'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...(current.ga4.aboveAvgDays || [])].sort((x, y) => y.views - x.views).map((d) => (
                      <tr key={d.label} style={{ verticalAlign: 'top' }}>
                        <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', fontWeight: 700, whiteSpace: 'nowrap' }}>{d.label}</td>
                        <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', fontWeight: 700 }}>{nf(d.views)}</td>
                        <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>
                          {d.devices.map((c) => <div key={c.name}>{c.name} <strong>{(c.share * 100).toFixed(0)}%</strong></div>)}
                        </td>
                        <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>
                          {d.hours.map((h) => <div key={h.hour}>{h.hour} <strong>· {nf(h.views)}</strong></div>)}
                        </td>
                        <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', width: '58%' }}>
                          {d.pages.map((pg) => (
                            <div key={pg.path} style={{ marginBottom: '8px', padding: '6px 10px', borderLeft: `4px solid ${T.accent}`, background: '#faf7f2', borderRadius: '0 6px 6px 0' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: T.text, overflowWrap: 'anywhere' }}>{pg.path}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                                <span style={{ background: T.accent, color: '#fff', fontWeight: 700, fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{nf(pg.views)} vistas</span>
                                <span style={{ background: '#222', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{fmtMin(pg.readSec)} lectura</span>
                                {pg.channels.filter((c) => c.name !== 'Referido').slice(0, 1).map((c) => {
                                  const col = CHANNEL_COLORS[c.name] || CHANNEL_COLORS.default;
                                  return <span key={c.name} style={{ background: col.bg, color: col.fg, fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{c.name} {(c.share * 100).toFixed(0)}%</span>;
                                })}
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.cardSubtext}>Días con más de {Math.round(dailyThreshold).toLocaleString('es-CO')} vistas (promedio {Math.round(dailyAvg).toLocaleString('es-CO')} + 15%) · Tiempo de lectura = tiempo de interacción promedio por usuario activo (GA4) · Horas en la zona horaria de GA4</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div>
                {current.ga4.septPartial && (
                  <>
                    <div style={{ ...styles.cardTitle, margin: '20px 0 10px' }}>Cifras actuales del {current.ga4.septPartial.range}</div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Vistas</div>
                      <div style={styles.cardValue}>{current.ga4.septPartial.views.toLocaleString('es-CO')}</div>
                      {renderChange(current.ga4.septPartial.viewsChange, false, prevFrom(current.ga4.septPartial.views, current.ga4.septPartial.viewsChange))}
                    </div>
                    <div style={{ ...styles.card, marginTop: '12px' }}>
                      <div style={styles.cardTitle}>Total de usuarios</div>
                      <div style={styles.cardValue}>{current.ga4.septPartial.users.toLocaleString('es-CO')}</div>
                      {renderChange(current.ga4.septPartial.usersChange, false, prevFrom(current.ga4.septPartial.users, current.ga4.septPartial.usersChange))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {current.ga4.sections?.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h2 style={styles.sectionTitle}>Vistas por sección ({rangeLabel})</h2>
                {current.ga4.sections.map((sec) => (
                  <Fragment key={sec.slug}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ ...styles.card, padding: '10px 16px', display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={styles.cardTitle}>{sec.label}</div>
                      <div style={{ ...styles.cardValue, fontSize: '24px' }}>{nf(sec.views)}</div>
                      {renderChange(sec.change, false, prevFrom(sec.views, sec.change))}
                    </div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Vistas {sec.label}{sec.peak ? ` · pico ${sec.peak.value.toLocaleString('es-CO')} (${sec.peak.label})` : ''}</div>
                      <div style={{ width: '100%', height: 200, marginTop: '12px' }}>
                        <ResponsiveContainer>
                          <AreaChart data={sec.daily} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={7} />
                            <YAxis tick={{ fontSize: 10 }} width={34} />
                            <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                            <Area type="monotone" dataKey="value" name="Vistas" stroke={T.accent} strokeWidth={2} fill={T.accent} fillOpacity={0.08} />
                            {sec.peak && <ReferenceDot x={sec.peak.label} y={sec.peak.value} r={5} fill="#d32f2f" stroke="#fff" />}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    </div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Ruta de página · Vistas</div>
                      <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '8px' }}>
                        <tbody>
                          {sec.topPages.map((pg, k) => (
                            <tr key={pg.path}>
                              <td style={{ padding: '6px 4px', borderBottom: '1px solid #eee', color: '#888', width: '20px' }}>{k + 1}.</td>
                              <td style={{ padding: '6px 4px', borderBottom: '1px solid #eee', wordBreak: 'break-all' }}>{pg.path}</td>
                              <td style={{ padding: '6px 4px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{nf(pg.views)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {(() => {
                      const WD = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                      const acc = WD.map((name) => ({ name, sum: 0, n: 0 }));
                      (sec.daily || []).forEach((d) => {
                        if (!d.date) return;
                        const wd = (new Date(Date.UTC(+d.date.slice(0, 4), +d.date.slice(4, 6) - 1, +d.date.slice(6))).getUTCDay() + 6) % 7;
                        acc[wd].sum += d.value; acc[wd].n += 1;
                      });
                      const charts = [
                        { key: 'hora', title: 'por hora del día', data: sec.hourly.map((h) => ({ label: h.hour, value: h.value })), interval: 2, labels: false },
                        { key: 'dia', title: 'por día de la semana (promedio)', data: acc.map((x) => ({ label: x.name, value: x.n ? Math.round(x.sum / x.n) : 0 })), interval: 0, labels: true },
                      ];
                      return (
                        <div style={{ position: 'relative', alignSelf: 'stretch', minHeight: '340px' }}>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {charts.map((c) => {
                            const top = c.data.reduce((b, h) => (!b || h.value > b.value ? h : b), null);
                            return (
                              <div key={c.key} style={{ ...styles.card, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 16px' }}>
                                <div style={styles.cardTitle}>Vistas {sec.label} {c.title}{top && top.value > 0 ? ` · pico ${top.label}` : ''}</div>
                                <div style={{ width: '100%', flex: 1, minHeight: 0, marginTop: '4px' }}>
                                  <ResponsiveContainer>
                                    <BarChart data={c.data} margin={{ top: 14, right: 10, left: 0, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={c.interval} />
                                      <YAxis tick={{ fontSize: 10 }} width={34} />
                                      <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                                      <Bar dataKey="value" name={c.key === 'hora' ? 'Vistas' : 'Vistas promedio'} fill={T.accent}>
                                        {c.data.map((h) => <Cell key={h.label} fill={top && h.value === top.value && top.value > 0 ? T.highlight : T.accent} />)}
                                        {c.labels && <LabelList dataKey="value" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#444' }} />}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        </div>
                      );
                    })()}
                  </div>
                  {(aboveAvg.some((d) => (sec.topPageByDay?.[d.label]?.views || 0) >= MIN_PAGE_VIEWS) || (sec.topPagesByDay?.[sec.peak?.label] || []).some((x) => x.views >= MIN_PAGE_VIEWS)) && (
                    <div style={{ ...styles.card, marginBottom: '30px' }}>
                      <div style={styles.cardTitle}>Página #1 de cada día destacado · {sec.label}</div>
                      <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '640px' }}>
                          <thead>
                            <tr>
                              {['Fecha', 'Página', 'Vistas · tiempo de lectura · origen de tráfico', 'Hora pico'].map((h) => (
                                <th key={h} style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const WDN = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                              const dow = (date) => (date ? WDN[new Date(Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6))).getUTCDay()] : '');
                              const td = { padding: '8px 6px', borderBottom: '1px solid #eee' };
                              const cells = (pg) => {
                                const ch = (pg.channels || []).filter((c) => c.name !== 'Referido')[0];
                                const col = ch ? (CHANNEL_COLORS[ch.name] || CHANNEL_COLORS.default) : null;
                                return [
                                  <td key="p" style={{ ...td, fontWeight: 700, color: T.text, overflowWrap: 'anywhere' }}>{pg.path}</td>,
                                  <td key="m" style={td}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                      <span style={{ background: T.accent, color: '#fff', fontWeight: 700, fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{nf(pg.views)} vistas</span>
                                      <span style={{ background: '#222', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{fmtMin(pg.readSec)} lectura</span>
                                      {ch && <span style={{ background: col.bg, color: col.fg, fontWeight: 600, fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>{ch.name} {(ch.share * 100).toFixed(0)}%</span>}
                                    </div>
                                  </td>,
                                  <td key="h" style={{ ...td, fontWeight: 700 }}>{pg.peakHour || '\u2014'}</td>,
                                ];
                              };
                              const rows = [];
                              const peakLabel = sec.peak?.label;
                              const peakList = peakLabel ? (sec.topPagesByDay?.[peakLabel] || []).filter((x) => x.views >= MIN_PAGE_VIEWS) : null;
                              if (peakList?.length) {
                                peakList.forEach((pg, k) => rows.push(
                                  <tr key={`peak-${k}`} style={{ background: '#fff6ee' }}>
                                    {k === 0 && (
                                      <td rowSpan={peakList.length} style={{ ...td, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: 700 }}>{peakLabel}</div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>{dow(sec.peak.date)}</div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>sitio {nf((dailyList.find((x) => x.label === peakLabel) || {}).value)}</div>
                                        <span style={{ display: 'inline-block', marginTop: '4px', background: T.highlight, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>DÍA PICO · TOP {peakList.length}</span>
                                      </td>
                                    )}
                                    {cells(pg)}
                                  </tr>
                                ));
                              }
                              aboveAvg
                                .filter((d) => d.label !== peakLabel && sec.topPageByDay?.[d.label] && sec.topPageByDay[d.label].views >= MIN_PAGE_VIEWS)
                                .sort((x, y) => sec.topPageByDay[y.label].views - sec.topPageByDay[x.label].views)
                                .forEach((d) => rows.push(
                                  <tr key={d.label}>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                                      <div style={{ fontWeight: 700 }}>{d.label}</div>
                                      <div style={{ fontSize: '11px', color: '#888' }}>{dow(d.date)}</div>
                                      <div style={{ fontSize: '11px', color: '#888' }}>sitio {nf(d.value)}</div>
                                    </td>
                                    {cells(sec.topPageByDay[d.label])}
                                  </tr>
                                ));
                              return rows;
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  </Fragment>
                ))}
              </div>
            )}



          </div>
        )}
        {(current.ga4?.hourlyViews?.some((h) => h.vistas > 0) || current.ga4?.dailyViews?.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginTop: '30px', alignItems: 'start' }}>
            {current.ga4?.hourlyViews?.some((h) => h.vistas > 0) && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>
                  Tráfico por hora del día · {rangeLabel}
                  {(() => { const top = current.ga4.hourlyViews.reduce((b, h) => (!b || h.vistas > b.vistas ? h : b), null); return top ? ` · pico ${top.hour}` : ''; })()}
                </div>
                <div style={{ width: '100%', height: 300, marginTop: '12px' }}>
                  <ResponsiveContainer>
                    <BarChart data={current.ga4.hourlyViews} margin={{ top: 30, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                      <Legend />
                      <Bar dataKey="vistas" name="Vistas" fill={T.accent} legendType="square">
                        {current.ga4.hourlyViews.map((h) => {
                          const max = Math.max(...current.ga4.hourlyViews.map((x) => x.vistas));
                          return <Cell key={h.hour} fill={h.vistas === max ? T.highlight : T.accent} />;
                        })}
                      </Bar>
                      <Bar dataKey="vistasPrev" name="Vistas mes anterior" fill="#c9c2b8" legendType="square" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={styles.cardSubtext}>Hora del día en la zona horaria de la propiedad de GA4. La hora con más vistas se destaca en naranja.</div>
              </div>
            )}
            {current.ga4?.dailyViews?.length > 0 && (() => {
              const WD = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
              const acc = WD.map((name) => ({ label: name.slice(0, 3), sum: 0, n: 0 }));
              const accPrev = WD.map(() => ({ sum: 0, n: 0 }));
              const fill = (list, target) => list.forEach((d) => {
                if (!d.date) return;
                const wd = (new Date(Date.UTC(+d.date.slice(0, 4), +d.date.slice(4, 6) - 1, +d.date.slice(6))).getUTCDay() + 6) % 7;
                target[wd].sum += d.value; target[wd].n += 1;
              });
              fill(current.ga4.dailyViews, acc);
              fill(current.ga4.prevDailyViews || [], accPrev);
              const data = acc.map((x, i) => ({ label: x.label, full: WD[i], value: x.n ? Math.round(x.sum / x.n) : 0, prev: accPrev[i].n ? Math.round(accPrev[i].sum / accPrev[i].n) : 0 }));
              const max = Math.max(...data.map((x) => x.value));
              const top = data.find((x) => x.value === max);
              return (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Tráfico por día de la semana · {rangeLabel} · pico {top?.full}</div>
                  <div style={{ width: '100%', height: 300, marginTop: '12px' }}>
                    <ResponsiveContainer>
                      <BarChart data={data} margin={{ top: 30, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                        <Bar dataKey="value" name="Vistas promedio por día" fill={T.accent} legendType="square">
                          {data.map((x) => <Cell key={x.label} fill={x.value === max ? T.highlight : T.accent} />)}
                          <LabelList dataKey="value" position="top" formatter={formatCompact} style={{ fontSize: 11, fill: '#444' }} />
                        </Bar>
                        <Bar dataKey="prev" name="Mes anterior" fill="#c9c2b8" legendType="square">
                          <LabelList dataKey="prev" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#999' }} />
                        </Bar>
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={styles.cardSubtext}>Promedio de vistas por día según el día de la semana. El día con más vistas se destaca en naranja. En gris, el mes anterior.</div>
                </div>
              );
            })()}
          </div>
        )}
        {current.ga4?.home && (() => {
          const h = current.ga4.home;
          const g = current.gsc?.home;
          const rel = (cur, prev) => (prev ? cur / prev - 1 : null);
          const WD = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
          const acc = WD.map((label) => ({ label, sum: 0, n: 0 }));
          h.daily.forEach((d) => {
            const wd = (new Date(Date.UTC(+d.date.slice(0, 4), +d.date.slice(4, 6) - 1, +d.date.slice(6))).getUTCDay() + 6) % 7;
            acc[wd].sum += d.value; acc[wd].n += 1;
          });
          const week = acc.map((x) => ({ label: x.label, value: x.n ? Math.round(x.sum / x.n) : 0 }));
          const maxHour = Math.max(...h.hourly.map((x) => x.value));
          const maxWeek = Math.max(...week.map((x) => x.value));
          const groups = groupChannelsByViews(h.channels.map((c) => ({ ...c, sessions: 0, users: 0 }))).filter((x) => x.pct > 0).sort((a, b) => b.views - a.views);
          const box = { ...styles.card };
          return (
            <div style={{ marginTop: '40px' }}>
              <h2 style={styles.sectionTitle}>Home · página de inicio ({rangeLabel})</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
                <div style={box}><div style={styles.cardTitle}>Vistas del home</div><div style={styles.cardValue}>{nf(h.views)}</div>{renderChange(h.viewsChange)}<div style={styles.cardSubtext}>Mes anterior: <strong>{nf(h.viewsPrev)}</strong></div></div>
                <div style={box}><div style={styles.cardTitle}>Usuarios</div><div style={styles.cardValue}>{nf(h.users)}</div>{renderChange(h.usersChange)}<div style={styles.cardSubtext}>Mes anterior: <strong>{nf(h.usersPrev)}</strong></div></div>
                <div style={box}><div style={styles.cardTitle}>Tiempo de lectura</div><div style={styles.cardValue}>{fmtMin(h.readSec)}</div>{renderChange(h.readChange)}<div style={styles.cardSubtext}>Mes anterior: <strong>{fmtMin(h.readSecPrev)}</strong></div></div>
                <div style={box}><div style={styles.cardTitle}>Porcentaje de rebote</div><div style={styles.cardValue}>{(h.bounceRate * 100).toFixed(0)}%</div>{renderChange(h.bounceRateChange, true)}<div style={styles.cardSubtext}>Mes anterior: <strong>{(h.bounceRatePrev * 100).toFixed(0)}%</strong> · menor es mejor</div></div>
              </div>
              {renderUsersRow({ users: h.users, usersChange: h.usersChange, newUsers: h.newUsers, newUsersChange: h.newUsersChange, returning: h.returning, newChannels: h.newChannels, newDuration: h.newDuration, returningChannels: h.returningChannels, returningDuration: h.returningDuration })}
              {g && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginTop: '20px' }}>
                  <div style={box}><div style={styles.cardTitle}>Clics en Google (home)</div><div style={styles.cardValue}>{nf(g.clicks)}</div>{g.prev ? renderChange(rel(g.clicks, g.prev.clicks)) : null}{g.prev && <div style={styles.cardSubtext}>Mes anterior: <strong>{nf(g.prev.clicks)}</strong></div>}</div>
                  <div style={box}><div style={styles.cardTitle}>Impresiones (home)</div><div style={styles.cardValue}>{nf(g.impressions)}</div>{g.prev ? renderChange(rel(g.impressions, g.prev.impressions)) : null}{g.prev && <div style={styles.cardSubtext}>Mes anterior: <strong>{nf(g.prev.impressions)}</strong></div>}</div>
                  <div style={box}><div style={styles.cardTitle}>CTR (home)</div><div style={styles.cardValue}>{(g.ctr * 100).toFixed(1)}%</div>{g.prev ? renderChange(rel(g.ctr, g.prev.ctr)) : null}{g.prev && <div style={styles.cardSubtext}>Mes anterior: <strong>{(g.prev.ctr * 100).toFixed(1)}%</strong></div>}</div>
                  <div style={box}><div style={styles.cardTitle}>Posición promedio (home)</div><div style={styles.cardValue}>{g.position ? g.position.toFixed(1) : '\u2014'}</div>{g.prev?.position ? renderChange(rel(g.position, g.prev.position), true) : null}<div style={styles.cardSubtext}>{g.prev?.position ? <>Mes anterior: <strong>{g.prev.position.toFixed(1)}</strong> · </> : null}menor es mejor</div></div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={box}>
                  <div style={styles.cardTitle}>Vistas del home por día{h.peak ? ` · pico ${nf(h.peak.value)} (${h.peak.label})` : ''}</div>
                  <div style={{ width: '100%', height: 220, marginTop: '12px' }}>
                    <ResponsiveContainer>
                      <AreaChart data={h.daily} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={7} />
                        <YAxis tick={{ fontSize: 10 }} width={34} />
                        <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                        <Area type="monotone" dataKey="value" name="Vistas" stroke={T.accent} strokeWidth={2} fill={T.accent} fillOpacity={0.1} />
                        {h.peak && <ReferenceDot x={h.peak.label} y={h.peak.value} r={5} fill="#d32f2f" stroke="#fff" />}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={box}>
                  <div style={styles.cardTitle}>Vistas del home por hora del día</div>
                  <div style={{ width: '100%', height: 220, marginTop: '12px' }}>
                    <ResponsiveContainer>
                      <BarChart data={h.hourly} margin={{ top: 14, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                        <YAxis tick={{ fontSize: 10 }} width={34} />
                        <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                        <Bar dataKey="value" name="Vistas" fill={T.accent}>
                          {h.hourly.map((x) => <Cell key={x.hour} fill={x.value === maxHour && maxHour > 0 ? T.highlight : T.accent} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={box}>
                  <div style={styles.cardTitle}>Vistas del home por día de la semana (promedio)</div>
                  <div style={{ width: '100%', height: 220, marginTop: '12px' }}>
                    <ResponsiveContainer>
                      <BarChart data={week} margin={{ top: 18, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                        <YAxis tick={{ fontSize: 10 }} width={34} />
                        <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                        <Bar dataKey="value" name="Vistas promedio" fill={T.accent}>
                          {week.map((x) => <Cell key={x.label} fill={x.value === maxWeek && maxWeek > 0 ? T.highlight : T.accent} />)}
                          <LabelList dataKey="value" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#444' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px', alignItems: 'start', marginTop: '30px' }}>
              {groups.length > 0 ? (
                <div>
                  <div style={{ ...styles.cardTitle, fontSize: '14px', marginBottom: '10px' }}>Fuentes de tráfico · solo home · {rangeLabel}</div>
                  <div style={{ ...styles.card, background: '#f3f1ee' }}>
                    <div style={{ display: 'flex', height: '44px', borderRadius: '22px', overflow: 'hidden', background: '#ddd' }}>
                      {groups.map((x) => (
                        <div key={x.name} title={`${x.name} ${(x.pct * 100).toFixed(1)}%`} style={{ width: `${x.pct * 100}%`, background: x.color }} />
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`, gap: '18px', marginTop: '16px' }}>
                      {groups.map((x) => {
                        const vc = rel(x.views, x.prevViews);
                        const pp = x.prevPct > 0 ? (x.pct - x.prevPct) * 100 : null;
                        return (
                          <div key={x.name} style={{ borderTop: `3px solid ${x.color}`, paddingTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '30px', fontWeight: 800, color: '#111' }}>{nf(x.views)}</span>
                              {vc !== null && Number.isFinite(vc) && (
                                <span style={{ fontSize: '12px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px', marginLeft: '6px', background: vc >= 0 ? '#e3f4e6' : '#fbe4e4', color: vc >= 0 ? '#2e7d32' : '#c62828' }}>{vc >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(vc * 100).toFixed(1)}%</span>
                              )}
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: T.ink }}>{x.name}</div>
                            <div style={{ fontSize: '13px', color: '#333', marginTop: '4px' }}>
                              <strong>{(x.pct * 100).toFixed(x.pct < 0.1 ? 1 : 0)}%</strong> de las vistas
                              {pp !== null && <span style={{ marginLeft: '6px', fontSize: '12px', fontWeight: 700, color: pp >= 0 ? '#2e7d32' : '#c62828' }}>{pp >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(pp).toFixed(1)} pp</span>}
                            </div>
                            {pp !== null && <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Periodo anterior {(x.prevPct * 100).toFixed(x.prevPct < 0.1 ? 1 : 0)}%</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={styles.cardSubtext}>Vistas de página del home por tipo de fuente y su participación; variaciones vs el periodo anterior equivalente.</div>
                  </div>
                </div>
              ) : <div />}
              </div>
            </div>
          );
        })()}

            {current.ga4.audience && (
              <div style={{ marginTop: '30px' }}>
                <h2 style={styles.sectionTitle}>Datos demográficos relevantes</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
                  <div style={styles.card}>
                    <div style={styles.cardTitle}>Sexo y edad lectores</div>
                    {current.ga4.audience.gender.length > 0 ? (
                      <div style={{ margin: '10px 0', fontSize: '24px', fontWeight: 700 }}>
                        {current.ga4.audience.gender.map((g) => (
                          <div key={g.name} style={{ color: g.name === 'female' ? T.accent : '#222' }}>
                            {g.name === 'female' ? 'Mujeres' : g.name === 'male' ? 'Hombres' : g.name} {(g.pct * 100).toFixed(1)}%
                          </div>
                        ))}
                      </div>
                    ) : <div style={styles.cardSubtext}>Sin datos de sexo (GA4 los omite cuando son muy pocos usuarios)</div>}
                    {current.ga4.audience.ageGender?.length > 0 ? (
                      <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                          <BarChart data={current.ga4.audience.ageGender} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                            <Legend />
                            <Bar dataKey="mujeres" name="Mujeres" fill={T.accent}>
                              <LabelList dataKey="mujeres" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 10, fill: T.accent }} />
                            </Bar>
                            <Bar dataKey="hombres" name="Hombres" fill="#333333">
                              <LabelList dataKey="hombres" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 10, fill: '#333' }} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : <div style={styles.cardSubtext}>Sin datos de edad</div>}
                  </div>
                </div>
                {(() => {
                  const A = current.ga4.audience;
                  
                  const bar = (label, pct, color, extra, dec) => (
                    <div key={label} style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>{label}</span><span><strong>{(pct * 100).toFixed(dec ?? (pct < 0.1 ? 1 : 0))}%</strong>{extra}</span>
                      </div>
                      <div style={{ background: T.soft, borderRadius: '4px', height: '8px', marginTop: '3px' }}>
                        <div style={{ width: `${Math.min(pct, 1) * 100}%`, background: color, height: '8px', borderRadius: '4px' }} />
                      </div>
                    </div>
                  );
                  const pp = (cur, prev) => {
                    if (prev === undefined || prev === null) return null;
                    const d = (cur - prev) * 100;
                    return <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 700, color: d >= 0 ? '#2e7d32' : '#c62828' }}>{d >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(d).toFixed(1)} pp</span>;
                  };
                  return (
                    <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px', alignItems: 'stretch', marginTop: '20px' }}>
                      {[
                        { title: 'País', list: A.countries },
                        { title: 'Departamento de Colombia', list: A.regions },
                        { title: 'Ciudad', list: current.ga4.audience.cities },
                      ].filter((g) => g.list?.length > 0).map((g) => (
                        <div key={g.title} style={styles.card}>
                          <div style={styles.cardTitle}>{g.title}</div>
                          {g.list.slice(0, 5).map((x, k) => bar(x.name, x.pct, k === 0 ? T.highlight : T.accent, null, 1))}
                          {Array.from({ length: Math.max(0, 5 - g.list.length) }, (_, k) => (
                            <div key={`pad-${k}`} aria-hidden="true" style={{ marginTop: '10px', visibility: 'hidden' }}>
                              <div style={{ fontSize: '13px' }}>&nbsp;</div>
                              <div style={{ height: '8px', marginTop: '3px' }} />
                            </div>
                          ))}
                          <div style={styles.cardSubtext}>% de los usuarios · escala 0 a 100%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px', alignItems: 'stretch', marginTop: '20px' }}>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Dispositivos usados para conectarse</div>
                      {current.ga4.audience.devices.map((d) => {
                        const diff = d.prevPct === null || d.prevPct === undefined ? null : (d.pct - d.prevPct) * 100;
                        return (
                          <div key={d.name} style={{ marginTop: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13px', textTransform: 'capitalize' }}>
                              <span>{d.name}</span>
                              <span>
                                <strong>{(d.pct * 100).toFixed(1)}%</strong>
                                {diff !== null && (
                                  <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'none', color: diff >= 0 ? '#2e7d32' : '#c62828' }}>
                                    {diff >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(diff).toFixed(1)} pp
                                  </span>
                                )}
                              </span>
                            </div>
                            <div style={{ background: T.soft, borderRadius: '4px', height: '10px', marginTop: '3px' }}>
                              <div style={{ width: `${d.pct * 100}%`, background: T.accent2, height: '10px', borderRadius: '4px' }} />
                            </div>
                            {d.prevPct !== null && d.prevPct !== undefined && (
                              <>
                                <div style={{ background: T.soft, borderRadius: '4px', height: '6px', marginTop: '3px' }}>
                                  <div style={{ width: `${d.prevPct * 100}%`, background: '#c9c2b8', height: '6px', borderRadius: '4px' }} />
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Periodo anterior {(d.prevPct * 100).toFixed(1)}%</div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                      {A.os?.length > 0 && (
                        <div style={styles.card}>
                          <div style={styles.cardTitle}>Sistema operativo</div>
                          {A.os.map((x, k) => bar(x.name, x.pct, k === 0 ? T.highlight : T.accent, pp(x.pct, x.prevPct)))}
                        </div>
                      )}
                      {A.brands?.length > 0 && (
                        <div style={styles.card}>
                          <div style={styles.cardTitle}>Marca del dispositivo</div>
                          {A.brands.map((x) => bar(x.name, x.pct, '#333'))}
                        </div>
                      )}
                    </div>
                      {A.interestsBySegment?.rows?.length > 0 && (() => {
                        const M = A.interestsBySegment;
                        const ageLabels = M.segments.slice(2);
                        const genderData = M.rows.map((r) => ({ name: r.name, Mujeres: r.values[0], Hombres: r.values[1] }));
                        const generalData = (A.interests || []).map((x) => ({ name: x.name, value: x.pct }));
                        const allVals = [...M.rows.flatMap((r) => r.values), ...generalData.map((x) => x.value)];
                        const top = Math.ceil(Math.max(...allVals) * 20) / 20;
                        const step = top <= 0.2 ? 0.05 : 0.1;
                        const domain = [0, top];
                        const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => Math.round(i * step * 100) / 100);
                        const labelTick = (props) => {
                          const { x, y, payload } = props;
                          const [parent, leaf] = String(payload.value).split(' › ');
                          return (
                            <text x={x - 8} y={y} textAnchor="end" fill="#555">
                              {leaf ? (
                                <>
                                  <tspan x={x - 8} dy="-3" fontSize="10" fill="#888">{parent}</tspan>
                                  <tspan x={x - 8} dy="13" fontSize="11.5" fontWeight="600">{leaf}</tspan>
                                </>
                              ) : <tspan x={x - 8} dy="4" fontSize="11.5" fontWeight="600">{parent}</tspan>}
                            </text>
                          );
                        };
                        const pctF = (v) => `${(v * 100).toFixed(0)}%`;
                        const axisProps = { type: 'number', domain, ticks, tickFormatter: pctF, tick: { fontSize: 10 } };
                        const lab = { position: 'right', formatter: pctF, style: { fontSize: 10, fill: '#444' } };
                        const chartMargin = { top: 5, right: 36, left: 0, bottom: 0 };
                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px', alignItems: 'stretch', marginTop: '20px' }}>
                            {generalData.length > 0 && (
                              <div style={styles.card}>
                                <div style={styles.cardTitle}>Intereses de los lectores</div>
                                <div style={{ width: '100%', height: 360, marginTop: '8px' }}>
                                  <ResponsiveContainer>
                                    <BarChart data={generalData} layout="vertical" margin={chartMargin} barCategoryGap="30%">
                                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                      <XAxis {...axisProps} />
                                      <YAxis type="category" dataKey="name" width={215} tick={labelTick} />
                                      <Tooltip formatter={(v) => pctF(v)} />
                                      <Bar dataKey="value" name="Usuarios con el interés">
                                        {generalData.map((x, k) => <Cell key={x.name} fill={k === 0 ? T.highlight : T.accent} />)}
                                        <LabelList dataKey="value" {...lab} />
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                {A.interestsCoverage != null && <div style={{ ...styles.cardSubtext, minHeight: '36px' }}>Categorías de intereses de Google (algunas en inglés). GA4 las asigna al {(A.interestsCoverage * 100).toFixed(0)}% de los usuarios; un usuario puede tener varios.</div>}
                              </div>
                            )}
                            <div style={styles.card}>
                              <div style={styles.cardTitle}>Intereses por género</div>
                              <div style={{ width: '100%', height: 360, marginTop: '8px' }}>
                                <ResponsiveContainer>
                                  <BarChart data={genderData} layout="vertical" margin={chartMargin} barGap={2} barCategoryGap="22%">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis {...axisProps} />
                                    <YAxis type="category" dataKey="name" width={215} tick={labelTick} />
                                    <Tooltip formatter={(v) => pctF(v)} />
                                    <Legend />
                                    <Bar dataKey="Mujeres" fill={T.accent}><LabelList dataKey="Mujeres" {...lab} /></Bar>
                                    <Bar dataKey="Hombres" fill="#333333"><LabelList dataKey="Hombres" {...lab} /></Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                              <div style={{ ...styles.cardSubtext, minHeight: '36px' }}>% de los hombres y de las mujeres con ese interés; cada grupo se mide sobre sus propios usuarios.</div>
                            </div>
                            <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
                              <div style={styles.cardTitle}>Intereses por edad · el rango más fuerte de cada interés en naranja oscuro</div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px 24px', marginTop: '10px' }}>
                                {M.rows.map((r) => {
                                  const data = ageLabels.map((label, k) => ({ label, value: r.values[2 + k] }));
                                  const max = Math.max(...data.map((d) => d.value));
                                  return (
                                    <div key={r.name}>
                                      <div style={{ fontSize: '13px', fontWeight: 700, color: T.text }}>{r.name}</div>
                                      <div style={{ width: '100%', height: 170 }}>
                                        <ResponsiveContainer>
                                          <BarChart data={data} layout="vertical" margin={chartMargin} barCategoryGap="25%">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis {...axisProps} />
                                            <YAxis type="category" dataKey="label" width={40} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(v) => pctF(v)} />
                                            <Bar dataKey="value" name="% del rango">
                                              {data.map((d) => <Cell key={d.label} fill={d.value === max ? T.highlight : T.accent} />)}
                                              <LabelList dataKey="value" {...lab} />
                                            </Bar>
                                          </BarChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div style={styles.cardSubtext}>% de los usuarios de cada grupo con ese interés. Los usuarios sin género o edad detectados por GA4 no se incluyen. Las tres pastillas usan la misma escala (0 a {(top * 100).toFixed(0)}%).</div>
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  );
                })()}
              </div>
            )}
      </div>

      </>
      )}

      {ready && section === 'seo' && (
      <>
      {/* Primero: tráfico orgánico por día vs mes anterior vs año anterior */}
      {(() => {
        const { dash } = seoUi;
        if (!seoTools) return <div style={{ ...styles.card, textAlign: 'center', padding: '30px', color: '#555', marginBottom: '20px' }}>Cargando la estrategia SEO…</div>;
        if (seoTools.error) return <div style={{ ...styles.card, color: '#b71c1c', marginBottom: '20px' }}>No se pudieron cargar las herramientas SEO: {seoTools.error}</div>;
        return (
          <div style={{ ...styles.section, marginBottom: '20px' }}>
            {seoTools.compare && (() => {
              const cp = seoTools.compare;
              const metricKey = cmpMetric === 'sessions' ? 'Sessions' : 'Views';
              const [pc, pm, py] = cp.periods;
              const val = (pd) => (cmpMetric === 'sessions' ? pd.sessions : pd.views);
              const COL = { cur: T.accent, prevMonth: '#1f6fb2', prevYear: '#6b6b6b' };
              const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
              const dayLabel = (start, i) => { const d = new Date(Date.parse(start) + i * 86400000); return `${d.getUTCDate()} ${MES[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
              const pts = cp.points.map((pt, i) => ({ ...pt, label: dayLabel(pc.start, i).slice(0, -5), curDate: dayLabel(pc.start, i), prevMonthDate: dayLabel(pm.start, i), prevYearDate: dayLabel(py.start, i) }));
              const showDots = pts.length <= 31;
              const Tip = ({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0].payload;
                const items = [['cur', 'Periodo actual'], ['prevMonth', 'Mes anterior'], ['prevYear', 'Año anterior']];
                return (
                  <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    <div style={{ fontWeight: 800, marginBottom: '6px' }}>Día {row.day} del periodo</div>
                    {items.map(([kk, nm]) => (kk === 'prevYear' && !py.hasData ? null : (
                      <div key={kk} style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginTop: '3px' }}>
                        <span style={{ width: '10px', height: '10px', background: COL[kk], display: 'inline-block', borderRadius: '2px' }} />
                        <span style={{ color: '#666' }}>{nm} ({row[`${kk}Date`]})</span>
                        <strong style={{ marginLeft: 'auto' }}>{row[`${kk}${metricKey}`] === null ? dash : row[`${kk}${metricKey}`].toLocaleString('es-CO')}</strong>
                      </div>
                    )))}
                  </div>
                );
              };
              return (
                <div style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <div style={styles.cardTitle}>Tráfico orgánico por día: periodo actual vs mes anterior vs año anterior</div>
                    <select value={cmpMetric} onChange={(e) => setCmpMetric(e.target.value)} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}>
                      <option value="views">Vistas</option>
                      <option value="sessions">Sesiones</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', margin: '14px 0' }}>
                    {[[pc, 'cur', 'Periodo actual', 'línea gruesa con puntos'], [pm, 'prevMonth', 'Mismo rango, mes anterior', 'línea azul'], [py, 'prevYear', 'Mismo rango, año anterior', 'línea gris punteada']].map(([pd, kk, title, hint]) => (
                      <div key={kk} style={{ borderLeft: `5px solid ${COL[kk]}`, paddingLeft: '10px' }}>
                        <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>{title} <span style={{ textTransform: 'none', color: '#999' }}>({hint})</span></div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{pd.label}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800 }}>{pd.hasData ? nf(val(pd)) : 'sin datos'}</div>
                        {kk !== 'cur' && pd.hasData && val(pd) > 0 && renderChange(val(pc) / val(pd) - 1)}
                      </div>
                    ))}
                  </div>
                  <div style={{ width: '100%', height: 360 }}>
                    <ResponsiveContainer>
                      <LineChart data={pts} margin={{ top: 10, right: 16, left: 0, bottom: 6 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={18} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v.toLocaleString('es-CO')} width={56} />
                        <Tooltip content={<Tip />} />
                        <Legend verticalAlign="top" height={30} />
                        {py.hasData && <Line type="monotone" dataKey={`prevYear${metricKey}`} name="Año anterior" stroke={COL.prevYear} strokeWidth={2.5} strokeDasharray="6 4" dot={false} connectNulls />}
                        <Line type="monotone" dataKey={`prevMonth${metricKey}`} name="Mes anterior" stroke={COL.prevMonth} strokeWidth={2.5} dot={false} connectNulls />
                        <Line type="monotone" dataKey={`cur${metricKey}`} name="Periodo actual" stroke={COL.cur} strokeWidth={4} dot={showDots ? { r: 3.5, fill: COL.cur } : false} activeDot={{ r: 6 }} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={styles.cardSubtext}>Canal Organic Search de GA4, alineado por día del periodo. El eje inferior muestra las fechas del periodo actual; al pasar el cursor ves la fecha de cada línea. {py.hasData ? '' : 'GA4 no tiene datos del año anterior para esta propiedad. '}Desde el 8 de octubre de 2026 las vistas están infladas por eventos page_view duplicados: para comparar contra periodos anteriores usa Sesiones.</div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* Salud técnica (periodo en revisión) */}
      {(() => {
        const H = seoHealth;
        const base = activeTab === 'axxis' ? 'https://revistaaxxis.com.co' : 'https://revistadiners.com.co';
        const wrap = (children) => (
          <div style={{ ...styles.section, marginBottom: '10px' }}>
            <h2 style={styles.sectionTitle}>Salud técnica · {rangeLabel}</h2>
            {children}
          </div>
        );
        if (!H) return wrap(<div style={{ ...styles.card, textAlign: 'center', padding: '30px', color: '#555' }}>Calculando la salud técnica del sitio…</div>);
        if (H.error) return wrap(<div style={{ ...styles.card, color: '#b71c1c' }}>No se pudo calcular la salud técnica: {H.error}</div>);
        const C = { created: T.ink, createdErr: '#c62828', total: '#8a8a8a', fixed: '#2e7d32', pending: T.accent };
        const kpis = [
          { color: C.created, label: 'Páginas nuevas creadas', value: H.published, sub: 'publicadas en el periodo' },
          { color: C.createdErr, label: 'Nuevas creadas con error', value: H.createdWithError, sub: 'de esas, ya dieron error' },
          { color: C.total, label: 'Total de páginas con error', value: H.totalAll, sub: 'todas, últimos 12 meses' },
          { color: C.fixed, label: 'Arregladas en el periodo', value: H.fixedPeriod, sub: 'tenían error y ya cargan bien' },
          { color: C.pending, label: 'Pendientes por arreglar', value: H.pending, sub: 'totales, sin confirmar arreglo' },
        ];
        const chartPeriod = [
          { name: 'Nuevas creadas', value: H.published, fill: C.created },
          { name: 'Nuevas con error', value: H.createdWithError, fill: C.createdErr },
        ];
        const chartTotal = [
          { name: 'Total con error', value: H.totalAll, fill: C.total },
          { name: 'Arregladas', value: H.fixedPeriod, fill: C.fixed },
          { name: 'Pendientes', value: H.pending, fill: C.pending },
        ];
        const th = { padding: '8px', fontSize: '11px', color: '#666', textTransform: 'uppercase', position: 'sticky', top: 0, background: T.soft };
        const td = { padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px' };
        const pathCell = (pth, extra) => (
          <td style={{ ...td, wordBreak: 'break-all' }}>
            <a href={`${base}${pth}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 600 }}>{pth}</a>
            {extra ? <div style={{ color: '#888', marginTop: '2px' }}>{extra}</div> : null}
          </td>
        );
        const listCard = (title, color, count, note, headers, rows) => (
          <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
            <div style={{ ...styles.cardTitle, color }}>{title} ({nf(count)})</div>
            {rows.length ? (
              <div style={{ maxHeight: '420px', overflowY: 'auto', marginTop: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{headers.map((h, i) => <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </table>
              </div>
            ) : <div style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 600, marginTop: '10px' }}>Ninguna en este periodo.</div>}
            <div style={styles.cardSubtext}>{note}</div>
          </div>
        );
        return wrap(
          <>
            <div style={{ ...styles.card, borderTop: '4px solid #c62828' }}>
              <div style={styles.cardSubtext}>Páginas que dan "Page Not Found" según GA4 (título de página con "Not Found", "404" o "no encontrada"). Todo es del sitio de {activeTab === 'axxis' ? 'AXXIS' : 'Diners'}.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', margin: '16px 0' }}>
                {kpis.map((k) => (
                  <div key={k.label} style={{ borderLeft: `5px solid ${k.color}`, paddingLeft: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>{k.label}</div>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#111', lineHeight: 1.15 }}>{nf(k.value)}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)', gap: '24px' }}>
                <div>
                  <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Páginas creadas en el periodo en revisión</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartPeriod} margin={{ top: 22, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} allowDecimals={false} />
                      <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartPeriod.map((e) => <Cell key={e.name} fill={e.fill} />)}
                        <LabelList dataKey="value" position="top" formatter={(v) => v.toLocaleString('es-CO')} style={{ fontSize: 12, fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Acumulado: todas las páginas con error</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartTotal} margin={{ top: 22, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} allowDecimals={false} />
                      <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartTotal.map((e) => <Cell key={e.name} fill={e.fill} />)}
                        <LabelList dataKey="value" position="top" formatter={(v) => v.toLocaleString('es-CO')} style={{ fontSize: 12, fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={styles.cardSubtext}>
                Las dos escalas van separadas porque el acumulado es miles de veces mayor que lo del periodo. Las arregladas van en el acumulado porque descuentan del total de páginas con error. Cómo se mide cada barra:
                nuevas creadas = notas publicadas entre el {H.range.start} y el {H.range.end}; nuevas con error = de esas, las que registraron visitas con error en el mismo periodo;
                total con error = rutas con error en los últimos 12 meses (desde {H.windows.allFrom}); arregladas = tenían error antes del periodo y en el periodo recibieron visitas con título normal;
                pendientes = rutas con error en los 12 meses que no se han visto cargando bien en los últimos 90 días (desde {H.windows.working90From}).
                Los pendientes incluyen páginas antiguas que ya casi nadie visita, así que es una cota alta: {nf(H.pendingStillErroring)} de ellas siguen dando error en este periodo.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '20px', marginTop: '20px', alignItems: 'start' }}>
              {listCard('Páginas nuevas con error en este periodo', C.createdErr, H.createdWithError,
                'Notas publicadas en el periodo que ya recibieron visitas con error. Revisar el enlace con el que se compartieron o si se vieron antes de publicarse.',
                ['Ruta', 'Vistas con error'],
                H.createdWithErrorPages.map((p) => (
                  <tr key={p.path}>{pathCell(p.path, p.title)}<td style={{ ...td, textAlign: 'right', fontWeight: 800, color: '#c62828' }}>{nf(p.views)}</td></tr>
                )))}
              {listCard('Páginas arregladas este periodo', C.fixed, H.fixedPeriod,
                'Tenían error antes del periodo y ahora cargan bien. Se ordena por las vistas con error que tenían antes.',
                ['Ruta', 'Antes (error)', 'Ahora (ok)'],
                H.fixedPeriodPages.map((p) => (
                  <tr key={p.path}>{pathCell(p.path)}<td style={{ ...td, textAlign: 'right', color: '#c62828', fontWeight: 700 }}>{nf(p.viewsBefore)}</td><td style={{ ...td, textAlign: 'right', color: '#2e7d32', fontWeight: 700 }}>{nf(p.viewsNow)}</td></tr>
                )))}
              {listCard('Páginas con errores pendientes', C.pending, H.pending,
                `Se muestran las 100 con más vistas con error en el periodo (primero) y en los últimos 12 meses. ${nf(H.pendingStillErroring)} siguen dando error este periodo: son las que el equipo web debería corregir primero (redirigir o restaurar).`,
                ['Ruta', 'Vistas periodo', 'Vistas 12 meses'],
                H.pendingPages.map((p) => (
                  <tr key={p.path}>{pathCell(p.path)}<td style={{ ...td, textAlign: 'right', fontWeight: 800, color: p.viewsPeriod ? '#c62828' : '#999' }}>{nf(p.viewsPeriod)}</td><td style={{ ...td, textAlign: 'right' }}>{nf(p.views)}</td></tr>
                )))}
            </div>
          </>
        );
      })()}

      {/* Buenas prácticas técnicas de SEO */}
      {(() => {
        const Q = seoQuality;
        const Tt = seoTech;
        const KEYS = [
          ['h1_missing', 'Sin H1'], ['h1_multiple', 'Más de un H1'], ['canonical_missing', 'Sin canonical'], ['canonical_diff', 'Canonical distinto a la URL'],
          ['noindex', 'Marcada como noindex'], ['not_indexed', 'No indexada en Google'], ['schema_missing', 'Sin schema'], ['og_missing', 'Sin imagen para redes (og:image)'],
          ['title_missing', 'Sin title'], ['title_long', 'Title de más de 60 caracteres'], ['title_short', 'Title corto (menos de 25)'],
          ['alt_low', 'Imágenes sin texto alt (menos del 80% con alt)'], ['desc_missing', 'Sin meta description'], ['desc_long', 'Descripción de más de 155 caracteres'], ['desc_short', 'Descripción corta (menos de 70)'],
        ];
        const wrap = (children) => (
          <div style={{ ...styles.section, marginBottom: '10px' }}>
            <h2 style={styles.sectionTitle}>Buenas prácticas técnicas de SEO · {rangeLabel}</h2>
            {children}
          </div>
        );
        if (!Q || !Tt) return wrap(<div style={{ ...styles.card, textAlign: 'center', padding: '24px', color: '#555' }}>Revisando el HTML de las notas nuevas y de las páginas con más clics… puede tardar hasta un minuto.</div>);
        if (Q.error && Tt.error) return wrap(<div style={{ ...styles.card, color: '#b71c1c' }}>No se pudo hacer la revisión técnica: {Q.error}</div>);
        // universo: notas nuevas + páginas con más clics (sin duplicar)
        const uni = new Map();
        (Q.notes || []).forEach((n) => { if (!n.fetchError) uni.set(n.path, { path: n.path, link: n.link, title: n.title, titleLen: n.titleLen, descLen: n.descLen, fixes: n.fixes || {}, imgs: n.imgs, imgsAlt: n.imgsAlt, issues: [...(n.tech || []), ...(n.imgs && n.imgsAlt / n.imgs < 0.8 ? ['alt_low'] : [])], scope: 'nueva' }); });
        (Tt.pages || []).forEach((n) => { const prev = uni.get(n.path); if (prev) { prev.issues = [...new Set([...prev.issues, ...n.issues])]; prev.fixes = { ...(n.fixes || {}), ...prev.fixes }; } else uni.set(n.path, { path: n.path, link: n.link, title: n.title, titleLen: n.titleLen, descLen: n.descLen, fixes: n.fixes || {}, issues: n.issues, scope: 'top' }); });
        const N = uni.size;
        const rows = KEYS.map(([k, label]) => {
          const list = [...uni.values()].filter((u) => u.issues.includes(k));
          return { key: k, label, count: list.length, list, examples: list.slice(0, 3) };
        });
        const sorted = rows.slice().sort((a, b) => b.count - a.count);
        const base = activeTab === 'axxis' ? 'https://revistaaxxis.com.co' : 'https://revistadiners.com.co';
        const chart = sorted.map((r) => ({ name: r.label, value: r.count, fill: r.count === 0 ? '#2e7d32' : (/^(Imágenes sin|Sin H1|Más de un H1|Sin canonical|Canonical|Marcada|No indexada|Sin title|Sin meta)/.test(r.label) ? '#c62828' : T.accent) }));
        const clean = [...uni.values()].filter((u) => !u.issues.length).length;
        return wrap(
          <div style={{ ...styles.card, borderTop: `4px solid ${T.ink}` }}>
            <div style={styles.cardSubtext}>
              Se revisa el HTML publicado de {nf(N)} páginas: las notas nuevas del periodo ({nf(Q.audited || 0)}) y las {nf(Tt.audited || 0)} páginas con más clics en Google. No es un rastreo de todo el sitio.
              {' '}{nf(clean)} de {nf(N)} no tienen ningún problema técnico. Verde = ninguna página afectada; rojo = problema grave (indexación, H1, canonical, title o descripción ausentes); naranja = ajuste de longitud o datos estructurados.
            </div>
            <div style={{ width: '100%', height: Math.max(260, chart.length * 28), marginTop: '12px' }}>
              <ResponsiveContainer>
                <BarChart data={chart} layout="vertical" margin={{ top: 4, right: 40, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={11} domain={[0, Math.max(N, 1)]} />
                  <YAxis type="category" dataKey="name" width={230} fontSize={11} />
                  <Tooltip formatter={(v) => `${v} de ${N} páginas`} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} minPointSize={2}>
                    {chart.map((e) => <Cell key={e.name} fill={e.fill} />)}
                    <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ overflowX: 'auto', marginTop: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                <thead>
                  <tr style={{ background: T.soft }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Problema</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Páginas</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Ejemplos</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.key}>
                      <td style={{ padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px', fontWeight: 600 }}>{r.label}</td>
                      <td style={{ padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px', textAlign: 'right', fontWeight: 800, color: r.count ? '#c62828' : '#2e7d32' }}>{r.count ? `${nf(r.count)} de ${nf(N)}` : '0 ✓'}</td>
                      <td style={{ padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px', wordBreak: 'break-all' }}>
                        {r.examples.length ? r.examples.map((e, i) => <span key={e.path}>{i ? ' · ' : ''}<a href={`${base}${e.path}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{e.path.length > 46 ? `${e.path.slice(0, 46)}…` : e.path}</a></span>) : <span style={{ color: '#999' }}>ninguna</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(() => {
              const SUG = {
                title_long: (u) => `Acortar el title${u.titleLen ? ` de ${u.titleLen} a 60 caracteres o menos` : ''}; dejar la palabra clave al inicio.`,
                title_short: () => 'Ampliar el title a 25 caracteres o más con la palabra clave principal.',
                title_missing: () => 'Agregar un title con la palabra clave principal.',
                desc_long: (u) => `Reescribir la descripción${u.descLen ? ` de ${u.descLen} a 155 caracteres o menos` : ''}.`,
                desc_short: () => 'Ampliar la descripción a 70 caracteres o más, con gancho y palabra clave.',
                desc_missing: () => 'Escribir la meta description (70 a 155 caracteres).',
                alt_low: (u) => `Agregar texto alt descriptivo a las imágenes${u.imgs ? ` (${u.imgsAlt} de ${u.imgs} tienen alt)` : ''}.`,
                h1_missing: () => 'Agregar un H1 con el título de la nota.',
                h1_multiple: () => 'Dejar un solo H1; los demás pasan a H2.',
                canonical_missing: () => 'Agregar la etiqueta canonical apuntando a la URL de la nota.',
                canonical_diff: () => 'Revisar el canonical: apunta a una URL distinta a la de la nota.',
                noindex: () => 'Quitar noindex si la nota debe aparecer en Google.',
                not_indexed: () => 'Pedir indexación en Search Console y revisar enlaces internos hacia la nota.',
                schema_missing: () => 'Agregar schema Article (plugin SEO).',
                og_missing: () => 'Definir la imagen para redes (og:image).',
              };
              const cur = sorted.find((r) => r.key === techSel) || sorted[0];
              return (
                <div style={{ marginTop: '16px' }}>
                  <div style={styles.cardTitle}>Qué ajustar, por tipo de problema</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                    {sorted.filter((r) => r.count > 0).map((r) => (
                      <button key={r.key} type="button" onClick={() => setTechSel(r.key)} style={{ cursor: 'pointer', border: `1px solid ${T.accent}`, borderRadius: '14px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, background: cur.key === r.key ? T.accent : '#fff', color: cur.key === r.key ? '#fff' : T.ink }}>
                        {r.label} · {r.count}
                      </button>
                    ))}
                  </div>
                  <div style={{ maxHeight: '420px', overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                      <thead><tr style={{ background: T.soft }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Nota</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Texto actual</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Texto sugerido (propuesta automática, revisar antes de pegar)</th>
                      </tr></thead>
                      <tbody>
                        {cur.list.map((u) => {
                          const FK = { title_long: 'title', title_short: 'title', title_missing: 'title', desc_long: 'desc', desc_short: 'desc', desc_missing: 'desc', alt_low: 'alt', h1_missing: 'h1', og_missing: 'og', canonical_missing: 'canonical', canonical_diff: 'canonical' }[cur.key];
                          const fx = FK ? (u.fixes || {})[FK] : null;
                          const td2 = { padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px', verticalAlign: 'top' };
                          const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) { /* sin portapapeles */ } };
                          return (
                            <tr key={u.path}>
                              <td style={{ ...td2, wordBreak: 'break-all', minWidth: '200px' }}><a href={`${base}${u.path}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 600 }}>{u.title || u.path}</a></td>
                              <td style={{ ...td2, minWidth: '240px', color: '#666' }}>
                                {Array.isArray(fx) ? fx.map((a) => <div key={a.src}>{a.src} <span style={{ color: '#c62828' }}>(sin alt)</span></div>) : fx ? (<>{fx.current || <em>vacío</em>}{FK === 'title' || FK === 'desc' ? <div style={{ color: '#999' }}>{fx.current.length} caracteres</div> : null}</>) : '\u2014'}
                              </td>
                              <td style={{ ...td2, minWidth: '260px' }}>
                                {Array.isArray(fx) ? fx.map((a) => <div key={a.src}>{a.suggested}</div>) : fx && fx.suggested ? (<><span style={{ fontWeight: 600 }}>{fx.suggested}</span>{FK === 'title' || FK === 'desc' ? <div style={{ color: '#2e7d32' }}>{fx.suggested.length} caracteres</div> : null}<button type="button" onClick={() => copy(fx.suggested)} style={{ marginTop: '4px', cursor: 'pointer', border: `1px solid ${T.accent}`, background: '#fff', borderRadius: '10px', fontSize: '11px', padding: '1px 8px' }}>Copiar</button></>) : <span style={{ color: '#999' }}>Sin texto sugerido disponible</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
            {(Q.unread > 0 || Tt.unread > 0) && <div style={styles.cardSubtext}>No se pudo leer {nf((Q.unread || 0) + (Tt.unread || 0))} página(s) publicada(s); quedan fuera del conteo.</div>}
          </div>
        );
      })()}

      {/* Calidad SEO de notas nuevas */}
      {(() => {
        const Q = seoQuality;
        const wrap = (children) => (
          <div style={{ ...styles.section, marginBottom: '10px' }}>
            <h2 style={styles.sectionTitle}>Calidad SEO de notas nuevas · {rangeLabel}</h2>
            {children}
          </div>
        );
        if (!Q) return wrap(<div style={{ ...styles.card, textAlign: 'center', padding: '24px', color: '#555' }}>Revisando las notas publicadas en el periodo…</div>);
        if (Q.error) return wrap(<div style={{ ...styles.card, color: '#b71c1c' }}>No se pudo revisar la calidad de las notas: {Q.error}</div>);
        const base = activeTab === 'axxis' ? 'https://revistaaxxis.com.co' : 'https://revistadiners.com.co';
        const LV = { rojo: '#c62828', amarillo: '#f9a825', verde: '#2e7d32' };
        const th = { padding: '8px', fontSize: '11px', color: '#666', textTransform: 'uppercase', position: 'sticky', top: 0, background: T.soft, whiteSpace: 'nowrap' };
        const td = { padding: '8px', borderBottom: `1px solid ${T.line}`, fontSize: '12px', verticalAlign: 'top' };
        const chip = (txt, color, key) => <span key={key} style={{ display: 'inline-block', margin: '2px 4px 2px 0', padding: '2px 7px', borderRadius: '10px', fontSize: '11px', background: `${color}1f`, color, fontWeight: 600 }}>{txt}</span>;
        return wrap(
          <>
            <div style={{ ...styles.card, borderTop: `4px solid ${T.accent}` }}>
              <div style={styles.cardSubtext}>
                {nf(Q.total)} notas publicadas del {Q.range.start} al {Q.range.end}{Q.total > Q.audited ? ` (se revisan las ${nf(Q.audited)} primeras)` : ''}. Se lee el HTML publicado de cada una y se cruza con Search Console (impresiones, consulta principal e indexación). La palabra clave objetivo de cada nota no está disponible por API; se usa la consulta que más impresiones le trae.
              </div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', margin: '14px 0' }}>
                {[['rojo', 'Con errores que corregir'], ['amarillo', 'Solo con ajustes'], ['verde', 'Sin observaciones']].map(([k, label]) => (
                  <div key={k} style={{ borderLeft: `5px solid ${LV[k]}`, paddingLeft: '10px' }}>
                    <div style={{ fontSize: '30px', fontWeight: 800, lineHeight: 1.1 }}>{nf(Q.levels[k])}</div>
                    <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Cuántas notas cumplen cada criterio</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px', marginTop: '6px' }}>
                  <tbody>
                    {Q.criteria.map((c) => {
                      const pct = c.total ? c.ok / c.total : 0;
                      const col = pct >= 0.8 ? '#2e7d32' : pct >= 0.5 ? '#f9a825' : '#c62828';
                      return (
                        <tr key={c.key}>
                          <td style={{ ...td, width: '38%', fontWeight: 600 }}>{c.label}</td>
                          <td style={{ ...td, width: '30%' }}>
                            <div style={{ background: '#eee', borderRadius: '4px', height: '10px' }}><div style={{ width: `${pct * 100}%`, background: col, height: '10px', borderRadius: '4px' }} /></div>
                          </td>
                          <td style={{ ...td, textAlign: 'right', fontWeight: 800, color: col, whiteSpace: 'nowrap' }}>{nf(c.ok)} de {nf(c.total)}</td>
                          <td style={{ ...td, color: '#888' }}>{c.standard}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ ...styles.card, marginTop: '20px' }}>
              <div style={styles.cardTitle}>Detalle por nota (las de más observaciones primero)</div>
              <div style={{ maxHeight: '560px', overflow: 'auto', marginTop: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
                  <thead>
                    <tr>
                      <th style={{ ...th, textAlign: 'left' }}>Nota</th>
                      <th style={th}>Días</th>
                      <th style={th}>Palabras</th>
                      <th style={th}>Title</th>
                      <th style={th}>Desc.</th>
                      <th style={th}>Alt</th>
                      <th style={th}>Enl. int.</th>
                      <th style={th}>Impresiones</th>
                      <th style={{ ...th, textAlign: 'left' }}>Consulta principal</th>
                      <th style={{ ...th, textAlign: 'left' }}>Qué revisar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Q.notes.map((n) => (
                      <tr key={n.link}>
                        <td style={{ ...td, minWidth: '230px' }}>
                          <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: LV[n.level], marginRight: '6px' }} />
                          <a href={n.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 700 }}>{n.title}</a>
                          <div style={{ color: '#999', wordBreak: 'break-all' }}>{n.path}</div>
                        </td>
                        <td style={{ ...td, textAlign: 'right' }}>{n.ageDays}</td>
                        <td style={{ ...td, textAlign: 'right', color: n.words < 300 ? '#c62828' : n.words < 600 ? '#b26a00' : undefined }}>{nf(n.words)}</td>
                        <td style={{ ...td, textAlign: 'right', color: n.titleLen > 65 || n.titleLen < 25 ? '#b26a00' : undefined }}>{n.titleLen || '—'}</td>
                        <td style={{ ...td, textAlign: 'right', color: n.descLen > 165 || n.descLen < 70 ? '#b26a00' : undefined }}>{n.descLen || '—'}</td>
                        <td style={{ ...td, textAlign: 'right', color: n.imgs && n.imgsAlt / n.imgs < 0.8 ? '#c62828' : undefined }}>{n.imgsAlt}/{n.imgs}</td>
                        <td style={{ ...td, textAlign: 'right', color: n.internal < 3 ? '#b26a00' : undefined }}>{n.internal}</td>
                        <td style={{ ...td, textAlign: 'right' }}>{nf(n.impressions)}</td>
                        <td style={{ ...td, minWidth: '160px' }}>{n.mainQuery ? (<><div style={{ fontWeight: 600 }}>{n.mainQuery.query}</div><div style={{ color: '#888' }}>{nf(n.mainQuery.impressions)} impr. · pos. {n.mainQuery.position}{n.mainQuery.inTitle && n.mainQuery.inSlug ? ' · en título y URL' : ''}</div></>) : <span style={{ color: '#999' }}>sin datos aún</span>}</td>
                        <td style={{ ...td, minWidth: '300px' }}>
                          {n.errors.map((e, i) => chip(e, '#c62828', `e${i}`))}
                          {n.warns.map((w, i) => chip(w, '#b26a00', `w${i}`))}
                          {!n.errors.length && !n.warns.length && <span style={{ color: '#2e7d32', fontWeight: 700 }}>Sin observaciones</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.cardSubtext}>Estándares: title hasta 60 caracteres, descripción de 70 a 155, un H1, texto de 600 palabras o más con subtítulos H2, alt en las imágenes, 3 o más enlaces internos, schema de artículo, canonical propio e indexación.</div>
            </div>
          </>
        );
      })()}

      {/* Tráfico orgánico por día + 1. Resultado del mes */}
      {(() => {
        const { dash, step, prevLine, fmtDur } = seoUi;
        if (!seoTools || seoTools.error) return null;
        const k = seoTools.kpis;
        const r = seoTools.range;
        const O = seoTools.organic;
        return (
          <div style={{ ...styles.section, marginBottom: '20px' }}>

            {step(1, 'Resultado del mes', `Comparado con ${r.gscPrevStart} a ${r.gscPrevEnd}. Search Console tiene unos 3 días de retraso, por eso el rango (${r.gscStart} a ${r.gscEnd}) termina antes de hoy. Debajo de cada cifra va el valor del periodo anterior.`)}
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Clics orgánicos</div>
                <div style={styles.cardValue}>{nf(k.clicks)}</div>
                {renderChange(k.clicksChange)}
                {prevLine('Periodo anterior', nf(k.clicksPrev))}
                <div style={styles.cardSubtext}>{(k.brandShare * 100).toFixed(0)}% por búsquedas de marca</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Impresiones</div>
                <div style={styles.cardValue}>{nf(k.impressions)}</div>
                {renderChange(k.impressionsChange)}
                {prevLine('Periodo anterior', nf(k.impressionsPrev))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CTR</div>
                <div style={styles.cardValue}>{(k.ctr * 100).toFixed(2)}%</div>
                {k.ctrDiff !== null && renderPP(k.ctr, k.ctr - k.ctrDiff)}
                {prevLine('Periodo anterior', k.ctrPrev === null ? null : `${(k.ctrPrev * 100).toFixed(2)}%`)}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Posición promedio</div>
                <div style={styles.cardValue}>{k.position.toFixed(1)}</div>
                {renderChange(k.positionChange, true)}
                {prevLine('Periodo anterior', k.positionPrev === null ? null : k.positionPrev.toFixed(1))}
                <div style={styles.cardSubtext}>bajar es mejor (verde)</div>
              </div>
            </div>
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Vistas orgánicas</div>
                <div style={styles.cardValue}>{O ? nf(O.views) : dash}</div>
                {O && renderChange(O.viewsChange)}
                {O && prevLine('Periodo anterior', nf(O.viewsPrev))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Sesiones orgánicas</div>
                <div style={styles.cardValue}>{O ? nf(O.sessions) : dash}</div>
                {O && renderChange(O.sessionsChange)}
                {O && prevLine('Periodo anterior', nf(O.sessionsPrev))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Rebote orgánico</div>
                <div style={styles.cardValue}>{O ? `${(O.bounceRate * 100).toFixed(1)}%` : dash}</div>
                {O && renderChange(O.bounceRateChange, true)}
                {O && prevLine('Periodo anterior', O.bounceRatePrev === null ? null : `${(O.bounceRatePrev * 100).toFixed(1)}%`)}
                <div style={styles.cardSubtext}>bajar es mejor (verde)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Tiempo de lectura (orgánico)</div>
                <div style={styles.cardValue}>{O && O.avgDuration !== null ? fmtDur(O.avgDuration) : dash}</div>
                {O && renderChange(O.avgDurationChange)}
                {O && prevLine('Periodo anterior', fmtDur(O.avgDurationPrev))}
              </div>
            </div>
            <div style={styles.cardSubtext}>Vistas, sesiones, rebote y lectura son de GA4 (canal Organic Search). Desde el 8 de octubre de 2026 las vistas y el rebote están distorsionados por eventos page_view duplicados; para decidir usa sesiones y clics.</div>
          </div>
        );
      })()}

      {/* Insights de contenido y tendencias del día (insumo editorial) */}
      <div style={{ margin: '30px 0 16px', paddingTop: '20px', borderTop: '2px dashed #ccc' }}>
        <button onClick={() => setSeoIdeasOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#666' }}>{seoIdeasOpen ? '▾' : '▸'} Ideas de contenido (no es KPI de resultado, es insumo para el equipo editorial)</span>
        </button>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Tendencias de búsqueda del día y noticias del sector, para inspirar qué publicar. No mide desempeño.</div>
      </div>

      {/* Insights de contenido (parte de Ideas de contenido) */}
      {seoIdeasOpen && (() => {
        const G = current.ga4 || {};
        const ET = current.emailtraffic;
        const MT = current.meta || {};
        const seen = {};
        (G.topArticles || []).forEach((a) => { seen[a.path] = { text: `${a.title || ''} ${a.path.replace(/[-_/]/g, ' ')}`, weight: a.views }; });
        (G.sections || []).forEach((sec) => (sec.topPages || []).forEach((pg) => { if (!seen[pg.path]) seen[pg.path] = { text: pg.path.replace(/[-_/]/g, ' '), weight: pg.views }; }));
        const webItems = Object.values(seen);
        const emailItems = (ET?.articles || []).map((a) => ({ text: `${a.title || ''} ${a.path.replace(/[-_/]/g, ' ')}`, weight: a.views }));
        const igPosts = MT.instagram?.detail?.topPosts || [];
        const fbPosts = MT.facebook?.detail?.topPosts || [];
        const igItems = igPosts.map((p) => ({ text: p.caption, weight: p.interactions }));
        const fbItems = fbPosts.map((p) => ({ text: p.caption, weight: (p.clicks || 0) + (p.interactions || 0) }));
        const srcs = [
          { key: 'web', label: 'Web (páginas más vistas)', short: 'Web', items: webItems },
          { key: 'email', label: 'Email', short: 'Email', items: emailItems },
          { key: 'ig', label: 'Instagram', short: 'Instagram', items: igItems },
          { key: 'fb', label: 'Facebook', short: 'Facebook', items: fbItems },
        ].map((x) => ({ ...x, ...themeShares(x.items) })).filter((x) => x.n >= 3 && x.total > 0);
        if (srcs.length < 2) return null;
        const sh = (src, key) => (src.shares[key] || 0);
        const rows = CONTENT_THEMES.map((t) => ({ ...t, avg: srcs.reduce((a, x) => a + sh(x, t.key), 0) / srcs.length }))
          .filter((t) => srcs.some((x) => sh(x, t.key) >= 0.03))
          .sort((a, b) => b.avg - a.avg);
        const pctS = (v) => `${Math.round(v * 100)}%`;
        const byKey = (k) => srcs.find((x) => x.key === k);
        const web = byKey('web');
        const social = srcs.filter((x) => x.key === 'ig' || x.key === 'fb');
        const insights = [];
        const recos = [];
        const cross = rows.filter((t) => srcs.filter((x) => sh(x, t.key) >= 0.2).length >= 2);
        cross.slice(0, 2).forEach((t) => insights.push({ tag: 'Tema cruzado', color: '#8e44ad', text: `${t.label} gana en varios canales a la vez: ${srcs.map((x) => `${x.short} ${pctS(sh(x, t.key))}`).join(', ')}. Es el tema con demanda más confirmada.` }));
        if (web && social.length) {
          rows.forEach((t) => {
            const soc = social.reduce((a, x) => a + sh(x, t.key), 0) / social.length;
            const w = sh(web, t.key);
            if (soc - w >= 0.25) {
              insights.push({ tag: 'Web vs Redes', color: '#2980b9', text: `${t.label} pesa ${pctS(soc)} en lo mejor de redes pero solo ${pctS(w)} en las páginas más vistas de la web: hay interés que la web no está aprovechando.` });
              recos.push(`Llevar a la web lo que ya funciona en redes: publicar notas de ${t.label.toLowerCase()} con enlace desde las publicaciones que hoy dan más interacciones.`);
            } else if (w - soc >= 0.25) {
              insights.push({ tag: 'Web vs Redes', color: '#2980b9', text: `${t.label} domina la web (${pctS(w)}) y casi no aparece entre lo mejor de redes (${pctS(soc)}): conviene probarlo como carrusel o reel.` });
              recos.push(`Convertir los artículos más leídos de ${t.label.toLowerCase()} en carruseles de Instagram con enlace a la nota.`);
            }
          });
        }
        const types = {};
        igPosts.forEach((p) => { const k = p.type || 'Otro'; (types[k] = types[k] || []).push(p); });
        const typeList = Object.entries(types).map(([k, l]) => ({ k, n: l.length, avg: l.reduce((a, p) => a + (p.interactions || 0), 0) / l.length, saved: l.reduce((a, p) => a + (p.saved || 0), 0) / l.length })).sort((a, b) => b.avg - a.avg);
        if (typeList.length && igPosts.length >= 3) {
          const t0 = typeList[0];
          insights.push({ tag: 'Formato IG', color: '#c0392b', text: `En las ${igPosts.length} mejores publicaciones de Instagram predomina el formato ${typeList.slice().sort((a, b) => b.n - a.n)[0].k.toLowerCase()} (${typeList.slice().sort((a, b) => b.n - a.n)[0].n} de ${igPosts.length}). ${t0.k} promedia ${Math.round(t0.avg).toLocaleString('es-CO')} interacciones y ${Math.round(t0.saved).toLocaleString('es-CO')} guardados por publicación.` });
        }
        const bestIg = igPosts.slice().sort((a, b) => (b.interactions || 0) - (a.interactions || 0))[0];
        if (bestIg) insights.push({ tag: 'Mejor post IG', color: '#d35400', text: `"${String(bestIg.caption || '').replace(/\s+/g, ' ').slice(0, 90)}…": ${nf(bestIg.interactions)} interacciones, ${nf(bestIg.saved)} guardados y ${nf(bestIg.shares)} compartidos.` });
        const bestFb = fbPosts.slice().sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];
        if (bestFb && bestFb.clicks) insights.push({ tag: 'Mejor post FB', color: '#1f618d', text: `"${String(bestFb.caption || '').replace(/\s+/g, ' ').slice(0, 80)}…" llevó más tráfico a la web: ${nf(bestFb.clicks)} clics en el enlace.` });
        const titles = [...(G.topArticles || []).map((a) => a.title), ...(ET?.articles || []).map((a) => a.title)].filter(Boolean);
        const pat = titlePatterns(titles);
        if (pat.n >= 4) insights.push({ tag: 'Títulos', color: '#16a085', text: `En los ${pat.n} títulos más leídos (web y email): ${pat.pct(pat.list)}% usan lista o número, ${pat.pct(pat.howto)}% son guías o claves y ${pat.pct(pat.local)}% mencionan un lugar concreto de Colombia.` });
        if (rows[0]) recos.unshift(`Armar una serie recurrente de ${rows[0].label.toLowerCase()}: es el tema con mejor desempeño combinado (${srcs.map((x) => `${x.short} ${pctS(sh(x, rows[0].key))}`).join(', ')}).`);
        const coy = rows.find((t) => t.key === 'coyuntura' && srcs.some((x) => sh(x, 'coyuntura') >= 0.15));
        if (coy) recos.push('Mantener un paquete de contenido de servicio para la coyuntura (guías de qué hacer, dónde ayudar): rinde en web, email y redes cuando hay una emergencia.');
        if (pat.n >= 4 && pat.list + pat.howto >= pat.n / 2) recos.push('Usar títulos con número o promesa concreta ("10 destinos…", "Claves para…") en los temas de servicio y guías locales.');
        const cell = (v) => ({ padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: v >= 0.2 ? 800 : 500, color: v >= 0.35 ? '#fff' : '#222', background: v > 0 ? `rgba(216, 67, 21, ${Math.min(0.08 + v * 1.4, 0.9)})` : 'transparent' });
        return (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ ...styles.cardTitle, fontSize: '14px' }}>Insights de contenido · qué crear · {insightsLabel}</div>
            <div style={styles.cardSubtext}>Usa mínimo los últimos 30 días. Cruza las páginas más vistas de la web, los artículos más leídos desde email y las mejores publicaciones de Instagram y Facebook de {activeTab === 'axxis' ? 'AXXIS' : 'Diners'}. Cada canal pesa según su medida: vistas (web y email), interacciones (Instagram) y clics más interacciones (Facebook).</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '24px', marginTop: '14px', alignItems: 'start' }}>
              <div>
                <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Temas por canal (% del desempeño de cada canal)</div>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '6px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>Tema</th>
                      {srcs.map((x) => <th key={x.key} style={{ padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{x.short}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((t) => (
                      <tr key={t.key}>
                        <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', fontWeight: 700 }}>{t.label}</td>
                        {srcs.map((x) => <td key={x.key} style={cell(sh(x, t.key))}>{sh(x, t.key) >= 0.01 ? pctS(sh(x, t.key)) : '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.cardSubtext}>Un artículo puede sumar a más de un tema. Base: {srcs.map((x) => `${x.short} ${x.n}`).join(', ')} elementos.</div>
              </div>
              <div>
                <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Lo que dicen los datos</div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {insights.slice(0, 6).map((ins, k) => (
                    <div key={k} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#fafafa', borderLeft: `3px solid ${ins.color}`, borderRadius: '4px', padding: '8px 10px' }}>
                      <span style={{ flexShrink: 0, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#fff', background: ins.color, borderRadius: '10px', padding: '2px 8px', letterSpacing: '0.3px' }}>{ins.tag}</span>
                      <span style={{ fontSize: '13px', lineHeight: 1.5 }}>{ins.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {recos.length > 0 && (
              <div style={{ marginTop: '16px', background: '#f5f1e6', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Qué crear</div>
                <ol style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: 1.6 }}>{recos.slice(0, 5).map((t, k) => <li key={k} style={{ marginBottom: '4px' }}>{t}</li>)}</ol>
              </div>
            )}
          </div>
        );
      })()}
      {seoIdeasOpen && seoTools?.newContent?.length > 0 && (() => {
        const { cell, num, head } = seoUi;
        return (
          <div>
            {seoTools?.newContent?.length > 0 && (
              <div style={{ ...styles.card, marginBottom: '20px' }}>
                <div style={styles.cardTitle}>Notas por escribir: mucha demanda y posición mayor a 20</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                  <thead>
                    <tr style={{ background: '#f4f6fb' }}>
                      <th style={{ ...head, textAlign: 'left' }}>Palabra</th>
                      <th style={head}>Impresiones</th>
                      <th style={head}>Posición</th>
                      <th style={head}>Clics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seoTools.newContent.map((r, k) => (
                      <tr key={r.key}>
                        <td style={{ ...cell, wordBreak: 'break-word' }}><span style={{ color: '#999' }}>{k + 1}.</span> {r.key}</td>
                        <td style={num}><strong>{nf(r.impressions)}</strong></td>
                        <td style={num}>{r.position.toFixed(1)}</td>
                        <td style={num}>{nf(r.clicks)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.cardSubtext}>Google ya te muestra en estas búsquedas pero muy abajo. Una nota específica para cada una suele rendir más que reforzar una genérica.</div>
              </div>
            )}
          </div>
        );
      })()}
      {seoIdeasOpen && (() => {
        const Dall = data.dailytrends;
        const winData = newsWin === '1d' ? Dall : (newsByWin[newsWin] || null);
        const D = Dall?.brands?.[activeTab] ? { ...Dall.brands[activeTab], fetchedAt: Dall.fetchedAt, totalTrends: Dall.totalTrends, news: winData?.brands?.[activeTab]?.news || null } : null;
        const WIN_LABEL = { '1d': 'últimas 24 horas', '7d': 'últimos 7 días', '14d': 'últimos 14 días' };
        if (!Dall || Dall.error || !D) return null;
        const ago = (iso) => {
          const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
          if (!Number.isFinite(m) || m < 0) return '';
          if (m < 60) return `hace ${m} min`;
          return m < 1440 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} d`;
        };
        return (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ ...styles.cardTitle, fontSize: '14px' }}>Tendencias del día en Colombia · categorías de {activeTab === 'axxis' ? 'AXXIS' : 'Diners'}</div>

            {D.trends.length > 0 && (
              <>
                <div style={{ ...styles.cardTitle, fontSize: '11px', marginTop: '16px' }}>Búsquedas en tendencia hoy relacionadas</div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '6px' }}>
                <thead>
                  <tr>{['Búsqueda', 'Categoría', 'Búsquedas', 'Titular relacionado'].map((h, k) => <th key={h} style={{ textAlign: k === 2 ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {D.trends.map((t) => (
                    <tr key={t.query}>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', fontWeight: 700, textTransform: 'capitalize' }}>{t.query}</td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>{t.category.label}</td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 700 }}>{t.traffic}</td>
                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>{t.news[0] ? <a href={t.news[0].url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{t.news[0].title} <span style={{ color: '#888' }}>· {t.news[0].source}</span></a> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
              <div style={{ ...styles.cardTitle, fontSize: '11px', margin: 0 }}>Qué se está publicando en cada categoría</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[['1d', '24 horas'], ['7d', '7 días']].map(([k, label]) => (
                  <button key={k} onClick={() => setNewsWin(k)} style={{ padding: '4px 12px', fontSize: '12px', border: 'none', cursor: 'pointer', borderRadius: '12px', fontWeight: 700, background: newsWin === k ? T.accent : '#e5e5e5', color: newsWin === k ? '#fff' : '#444' }}>{label}</button>
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{WIN_LABEL[newsWin]}</span>
            </div>
            {!D.news ? (
              <div style={{ fontSize: '13px', color: '#555', marginTop: '10px' }}>Cargando noticias de los {WIN_LABEL[newsWin]}…</div>
            ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(() => { const n = D.news.filter((c) => c.items.length > 0).length; return n === 4 ? 2 : Math.min(3, Math.max(1, n)); })()}, minmax(0, 1fr))`, gap: '18px', marginTop: '8px', alignItems: 'start' }}>
              {D.news.filter((c) => c.items.length > 0).map((c) => (
                <div key={c.key}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: T.accent }}>{c.label} <span style={{ color: '#888', fontWeight: 500 }}>· {c.total}{c.total >= 100 ? '+' : ''} notas</span></div>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '12px', lineHeight: 1.5 }}>
                    {c.items.slice(0, 5).map((n) => (
                      <li key={n.url} style={{ marginBottom: '4px' }}>
                        <a href={n.url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{n.title}</a>
                        <span style={{ color: '#888' }}> · {n.source}{n.publishedAt ? ` · ${ago(n.publishedAt)}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            )}
            <div style={styles.cardSubtext}>Fuentes: Google Trends (búsquedas en tendencia de Colombia) y Google Noticias (por categoría). El número de notas indica cuánta cobertura hay en el periodo elegido, hasta 100. Las búsquedas en tendencia siempre son las de hoy. Solo se muestran notas de los últimos 7 días, de la más reciente a la más vieja. Se actualiza cada 15 minutos{D.fetchedAt ? ` · última consulta ${new Date(D.fetchedAt).toLocaleString('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : ''}.</div>
          </div>
        );
      })()}


      {/* Páginas orgánicas, palabras clave, optimizar y 2. Plan de acción */}
      {(() => {
        const { cell, num, head, dash, dClicks, kwTable, step } = seoUi;
        if (!seoTools || seoTools.error) return null;
        const k = seoTools.kpis;
        const S = seoTools.summary;
        const seo = current.seo;
        const err = seo?.errorPages;
        const q = norm2(kwSearch);
        const sorted = (seoTools.keywords || [])
          .filter((r) => !q || norm2(r.key).includes(q))
          .slice()
          .sort((a, b) => (kwSort === 'delta' ? b.deltaClicks - a.deltaClicks : kwSort === 'impressions' ? b.impressions - a.impressions : kwSort === 'position' ? a.position - b.position : b.clicks - a.clicks))
          .slice(0, 50);
        const plan = [
          { color: '#b71c1c', title: 'Proteger', big: nf(S.lost.count), unit: 'palabras perdieron clics', impact: `-${nf(S.lost.clicks)} clics · ${nf(S.lost.pages)} páginas con caída (-${nf(S.lost.pageClicks)} clics)`, how: 'Se mide: clics recuperados de estas palabras y páginas.' },
          { color: '#2e7d32', title: 'Aprovechar', big: nf(S.won.count), unit: 'palabras ganaron clics', impact: `+${nf(S.won.clicks)} clics`, how: 'Se mide: notas nuevas del mismo tema y su aporte de clics.' },
          { color: T.accent, title: 'Optimizar títulos', big: nf(S.titles.count), unit: 'palabras en posición 4 a 10', impact: `+${nf(S.titles.potential)} clics potenciales`, how: `Se mide: CTR de estas palabras hacia ${(seoTools.targetCtr * 100).toFixed(1)}%.` },
          { color: T.accent, title: 'Reforzar contenido', big: nf(S.content.count), unit: 'palabras en posición 11 a 20', impact: `+${nf(S.content.potential)} clics potenciales`, how: 'Se mide: palabras que pasan a la primera página.' },
          { color: T.ink, title: 'Crear notas', big: nf(S.newNotes.count), unit: 'ideas con demanda y posición > 20', impact: `${nf(S.newNotes.impressions)} impresiones sin capturar`, how: 'Se mide: notas publicadas y clics que traen en 30 días.' },
          { color: '#6d4c41', title: 'Salud técnica', big: seoHealth && !seoHealth.error ? nf(seoHealth.pending) : dash, unit: 'páginas con error pendientes', impact: seoHealth && !seoHealth.error ? `${nf(seoHealth.fixedPeriod)} arregladas · ${nf(seoHealth.createdWithError)} nuevas con error · ${nf(seoHealth.pendingStillErroring)} siguen dando error` : 'sin datos', how: 'Se mide: pendientes que siguen dando error en el periodo.' },
        ];
        return (
          <div style={{ ...styles.section, marginBottom: '20px' }}>
            {step(null, 'Páginas orgánicas con más visitas', 'Visitas = sesiones que entran por búsqueda orgánica (GA4), con su cambio frente al periodo anterior. Clics, impresiones y posición vienen de Search Console.')}
            <div style={styles.card}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}>
                  <thead>
                    <tr style={{ background: T.soft }}>
                      <th style={{ ...head, textAlign: 'left' }}>Página</th>
                      <th style={head}>Visitas</th>
                      <th style={head}>Vs anterior</th>
                      <th style={head}>Clics Google</th>
                      <th style={head}>Impresiones</th>
                      <th style={head}>Posición</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(seoTools.pagesOrganic || []).map((pg, i) => (
                      <tr key={pg.key}>
                        <td style={{ ...cell, wordBreak: 'break-all' }}><span style={{ color: '#999' }}>{i + 1}.</span> {pg.key}</td>
                        <td style={num}><strong>{nf(pg.sessions)}</strong></td>
                        <td style={num}>{dClicks(pg.deltaSessions)}</td>
                        <td style={num}>{pg.clicks === null ? dash : nf(pg.clicks)}</td>
                        <td style={num}>{pg.impressions === null ? dash : nf(pg.impressions)}</td>
                        <td style={num}>{pg.position === null ? dash : pg.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {step(null, 'Palabras clave que más generaron tráfico', 'Explorador: busca un tema, ordena por clics, crecimiento, impresiones o posición. Excluye consultas de marca y de tipo URL.')}
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <div style={styles.cardTitle}>{nf(k.nonBrandQueries)} consultas sin marca</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input value={kwSearch} onChange={(e) => setKwSearch(e.target.value)} placeholder="Buscar palabra o tema" style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }} />
                  <select value={kwSort} onChange={(e) => setKwSort(e.target.value)} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}>
                    <option value="clicks">Ordenar por clics</option>
                    <option value="delta">Ordenar por mayor crecimiento</option>
                    <option value="impressions">Ordenar por impresiones</option>
                    <option value="position">Ordenar por mejor posición</option>
                  </select>
                </div>
              </div>
              {kwTable(sorted)}
              <div style={styles.cardSubtext}>Top 50 del filtro. "Vs anterior" = clics del periodo menos clics del periodo anterior.</div>
            </div>

            {step(null, 'Optimizar: palabras en posición 4 a 20', 'Ordenadas por clics potenciales. En posición 4 a 10 el trabajo es título y descripción; en 11 a 20, contenido y enlaces internos.')}
            <div style={styles.card}>
              {seoTools.opportunities.length ? kwTable(seoTools.opportunities, { potential: true }) : <div style={styles.cardSubtext}>Sin oportunidades con volumen suficiente.</div>}
              <div style={styles.cardSubtext}>Clics potenciales = impresiones x (CTR que ya logras en posición 1 a 3, {(seoTools.targetCtr * 100).toFixed(1)}%, menos el CTR actual de la palabra). Es una estimación.</div>
            </div>

            {step(2, 'Plan de acción del mes', 'Seis frentes con su tamaño y cómo se mide el avance. Las palabras que suben o caen se ven en el explorador.')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
              {plan.map((pl) => (
                <div key={pl.title} style={{ ...styles.card, borderTop: `4px solid ${pl.color}` }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: pl.color }}>{pl.title}</div>
                  <div style={{ fontSize: '30px', fontWeight: 800, color: '#111', lineHeight: 1.1, marginTop: '6px' }}>{pl.big}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{pl.unit}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>{pl.impact}</div>
                  <div style={{ ...styles.cardSubtext, marginTop: '6px' }}>{pl.how}</div>
                </div>
              ))}
            </div>
            {seoTools.truncated && <div style={styles.cardSubtext}>Search Console devolvió el máximo de 50.000 consultas; la lista es una muestra de las más relevantes.</div>}
          </div>
        );
      })()}
      </>
      )}

      {ready && section === 'redes' && (
      <>
      {/* Facebook */}
      {(() => {
        const fb = current.meta?.facebook?.detail;
        if (!fb) return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Facebook</h2>
            <div style={styles.card}><div style={styles.cardSubtext}>Sin datos de Facebook (revisa los avisos de error arriba)</div></div>
          </div>
        );
        const pie = [
          { name: 'Espectadores', value: fb.viewers, fill: '#666666' },
          { name: 'Reacciones', value: fb.reactions, fill: '#bbbbbb' },
          { name: 'Visualizaciones', value: fb.views, fill: T.accent2 },
        ];
        const pieTotal = pie.reduce((x, y) => x + y.value, 0);
        const kpis = [
          ['Visualizaciones', fb.views, fb.viewsChange],
          ['Reacciones', fb.reactions, fb.reactionsChange],
          ['Espectadores', fb.viewers, fb.viewersChange],
          ['Visitas al perfil', fb.profileViews, fb.profileViewsChange],
        ];
        return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Facebook · {rangeLabel}</h2>
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Aporte de FB al tráfico</div>
                <div style={styles.cardValue}>{current.ga4?.social ? `${(current.ga4.social.facebook.share * 100).toFixed(2)}%` : '\u2014'}</div>
                {renderChange(current.ga4?.social?.facebook?.shareChange, false, prevFrom(current.ga4?.social?.facebook?.share, current.ga4?.social?.facebook?.shareChange, pctFmt(2)))}
                <div style={styles.cardSubtext}>% de sesiones del sitio desde Facebook (GA4)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Nuevos seguidores</div>
                <div style={styles.cardValue}>{nf(fb.newFollowers)}</div>
                {renderChange(fb.newFollowersChange, false, prevFrom(fb.newFollowers, fb.newFollowersChange))}
                <div style={styles.cardSubtext}>brutos; dejaron de seguir: {nf(fb.unfollows)}</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(fb.viewers)}</div>
                {renderChange(fb.viewersChange, false, prevFrom(fb.viewers, fb.viewersChange))}
                <div style={styles.cardSubtext}>espectadores únicos</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Engagement</div>
                <div style={styles.cardValue}>{(fb.engagementRate * 100).toFixed(2)}%</div>
                {renderPP(fb.engagementRate, fb.prevEngagementRate)}
                <div style={styles.cardSubtext}>reacciones / visualizaciones</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Seguidores</div>
                <div style={styles.cardValue}>{nf(fb.followers)}</div>
                <div style={{ marginTop: '16px' }}>
                  {kpis.map(([label, value, change]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                      <span style={{ fontSize: '13px', color: '#555', textTransform: 'uppercase' }}>{label}</span>
                      <span><strong style={{ fontSize: '18px' }}>{nf(value)}</strong> {change !== null && change !== undefined && (
                        <span style={{ fontSize: '12px', fontWeight: 600, color: change >= 0 ? '#2e7d32' : '#c62828' }}>{change >= 0 ? '\u2191' : '\u2193'} {(Math.abs(change) * 100).toFixed(1)}%</span>
                      )}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '26px', fontWeight: 700 }}>{(fb.engagementRate * 100).toFixed(1)}%</span> <span style={{ fontSize: '13px' }}>Tasa de engagement</span>
                  <div style={styles.cardSubtext}>reacciones / visualizaciones</div>
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Interacciones</div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pie} dataKey="value" nameKey="name" outerRadius="80%" label={(e) => `${(e.value / pieTotal * 100).toFixed(1)}%`}>
                        {pie.map((x) => <Cell key={x.name} fill={x.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {fb.topPosts?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ ...styles.cardTitle, fontSize: '14px' }}>Las 5 publicaciones con mejor desempeño · {rangeLabel} (reacciones + comentarios + compartidos)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '10px' }}>
                  {fb.topPosts.map((post, k) => (
                    <div key={post.id} style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                      {post.image && <img src={post.image} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />}
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>#{k + 1} · {post.type} · {post.date}</div>
                        <div style={{ fontSize: '13px', margin: '6px 0 10px', minHeight: '54px' }}>{post.caption}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                          <span>Interacciones <strong>{nf(post.interactions)}</strong></span>
                          <span>Espectadores <strong>{nf(post.viewers)}</strong></span>
                          <span>Vistas <strong>{nf(post.views)}</strong></span>
                          <span>Clics <strong>{nf(post.clicks)}</strong></span>
                          <span>Reacciones <strong>{nf(post.reactions)}</strong></span>
                          <span>Comentarios <strong>{nf(post.comments)}</strong></span>
                          <span>Compartidos <strong>{nf(post.shares)}</strong></span>
                        </div>
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: T.accent }}>Ver en Facebook</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {fb.bottomPosts?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ ...styles.cardTitle, fontSize: '14px' }}>Las 3 publicaciones con menor desempeño · {rangeLabel} (reacciones + comentarios + compartidos)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '10px' }}>
                  {fb.bottomPosts.map((post, k) => (
                    <div key={post.id} style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                      {post.image && <img src={post.image} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />}
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>#{k + 1} · {post.type} · {post.date}</div>
                        <div style={{ fontSize: '13px', margin: '6px 0 10px', minHeight: '54px' }}>{post.caption}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                          <span>Interacciones <strong>{nf(post.interactions)}</strong></span>
                          <span>Espectadores <strong>{nf(post.viewers)}</strong></span>
                          <span>Vistas <strong>{nf(post.views)}</strong></span>
                          <span>Clics <strong>{nf(post.clicks)}</strong></span>
                          <span>Reacciones <strong>{nf(post.reactions)}</strong></span>
                          <span>Comentarios <strong>{nf(post.comments)}</strong></span>
                          <span>Compartidos <strong>{nf(post.shares)}</strong></span>
                        </div>
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: T.accent }}>Ver en Facebook</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {fb.cities?.length > 0 && (
              <div style={{ ...styles.card, marginTop: '20px' }}>
                <div style={styles.cardTitle}>Distribución geográfica de seguidores</div>
                <div style={{ width: '100%', height: 320, marginTop: '12px' }}>
                  <ResponsiveContainer>
                    <BarChart data={fb.cities} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                      <Bar dataKey="pct" name="Seguidores" fill="#000000">
                        <LabelList dataKey="pct" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 11 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            <div style={{ ...styles.cardSubtext, marginTop: '8px' }}>Meta no entrega sexo ni edad de los seguidores de páginas de Facebook por API; esos datos se muestran para Instagram.</div>
          </div>
        );
      })()}

      {/* Instagram */}
      {(() => {
        const ig = current.meta?.instagram;
        const d = ig?.detail;
        return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Instagram</h2>
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Seguidores</div>
                <div style={styles.cardValue}>{nf(d?.followers)}</div>
                <div style={styles.cardSubtext}>total actual</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Aporte de IG al tráfico</div>
                <div style={styles.cardValue}>{current.ga4?.social ? `${(current.ga4.social.instagram.share * 100).toFixed(2)}%` : '\u2014'}</div>
                {renderChange(current.ga4?.social?.instagram?.shareChange, false, prevFrom(current.ga4?.social?.instagram?.share, current.ga4?.social?.instagram?.shareChange, pctFmt(2)))}
                <div style={styles.cardSubtext}>% de sesiones del sitio desde Instagram (GA4)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Nuevos seguidores</div>
                <div style={styles.cardValue}>{nf(d?.period?.newFollowers)}</div>
                {renderChange(d?.period?.newFollowersChange, false, prevFrom(d?.period?.newFollowers, d?.period?.newFollowersChange))}
                <div style={styles.cardSubtext}>netos en el periodo (máx. 30 días)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(d?.period?.reach ?? ig?.reach)}</div>
                {renderChange(d?.period?.reachChange, false, prevFrom(d?.period?.reach ?? ig?.reach, d?.period?.reachChange))}
                <div style={styles.cardSubtext}>{rangeLabel}</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Engagement</div>
                <div style={styles.cardValue}>{d?.period ? `${(d.period.engagementRate * 100).toFixed(1)}%` : '\u2014'}</div>
                {d?.period ? renderPP(d.period.engagementRate, d.period.prevEngagementRate) : null}
                <div style={styles.cardSubtext}>interacciones / alcance</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Interacciones</div>
                <div style={styles.cardValue}>{nf(ig?.engagement)}</div>
                <div style={styles.cardSubtext}>{rangeLabel}</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Visitas al perfil</div>
                <div style={styles.cardValue}>{nf(ig?.impressions)}</div>
                <div style={styles.cardSubtext}>{rangeLabel}</div>
              </div>
            </div>
            {d?.topPosts?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ ...styles.cardTitle, fontSize: '14px' }}>Las 5 publicaciones con mejor desempeño · {rangeLabel} (por interacciones)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '10px' }}>
                  {d.topPosts.map((post, k) => (
                    <div key={post.id} style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                      {post.image && <img src={post.image} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />}
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>#{k + 1} · {post.type} · {post.date}</div>
                        <div style={{ fontSize: '13px', margin: '6px 0 10px', minHeight: '54px' }}>{post.caption}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                          <span>Interacciones <strong>{nf(post.interactions)}</strong></span>
                          <span>Alcance <strong>{nf(post.reach)}</strong></span>
                          <span>Vistas <strong>{nf(post.views)}</strong></span>
                          <span>Me gusta <strong>{nf(post.likes)}</strong></span>
                          <span>Comentarios <strong>{nf(post.comments)}</strong></span>
                          <span>Guardados <strong>{nf(post.saved)}</strong></span>
                          <span>Compartidos <strong>{nf(post.shares)}</strong></span>
                        </div>
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: T.accent }}>Ver en Instagram</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {d?.bottomPosts?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ ...styles.cardTitle, fontSize: '14px' }}>Las 3 publicaciones con menor desempeño · {rangeLabel} (por interacciones)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '10px' }}>
                  {d.bottomPosts.map((post, k) => (
                    <div key={post.id} style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                      {post.image && <img src={post.image} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />}
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>#{k + 1} · {post.type} · {post.date}</div>
                        <div style={{ fontSize: '13px', margin: '6px 0 10px', minHeight: '54px' }}>{post.caption}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                          <span>Interacciones <strong>{nf(post.interactions)}</strong></span>
                          <span>Alcance <strong>{nf(post.reach)}</strong></span>
                          <span>Vistas <strong>{nf(post.views)}</strong></span>
                          <span>Me gusta <strong>{nf(post.likes)}</strong></span>
                          <span>Comentarios <strong>{nf(post.comments)}</strong></span>
                          <span>Guardados <strong>{nf(post.saved)}</strong></span>
                          <span>Compartidos <strong>{nf(post.shares)}</strong></span>
                        </div>
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: T.accent }}>Ver en Instagram</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {d && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Sexo y edad de seguidores</div>
                  <div style={{ margin: '10px 0', fontSize: '22px', fontWeight: 700 }}>
                    <span style={{ color: T.accent }}>Mujeres {(d.women * 100).toFixed(1)}%</span> - Hombres {(d.men * 100).toFixed(1)}%
                  </div>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={d.ageGender} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                        <Legend />
                        <Bar dataKey="mujeres" name="Mujeres" fill={T.accent}>
                          <LabelList dataKey="mujeres" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 10, fill: T.accent }} />
                        </Bar>
                        <Bar dataKey="hombres" name="Hombres" fill="#333333">
                          <LabelList dataKey="hombres" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 10, fill: '#333' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Distribución geográfica</div>
                  <div style={{ width: '100%', height: 320, marginTop: '12px' }}>
                    <ResponsiveContainer>
                      <BarChart data={d.cities} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                        <Bar dataKey="pct" name="Seguidores" fill="#000000">
                          <LabelList dataKey="pct" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 11 }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      </>
      )}

      {ready && section === 'resumen' && (() => {
        const ga = current.ga4 || {};
        const hist = ga.monthlyHistory || [];
        const n = hist.length;
        const lastChange = n > 1 && hist[n - 2].vistas ? hist[n - 1].vistas / hist[n - 2].vistas - 1 : null;
        const secs = ga.sections || [];
        const topSec = secs.slice().sort((x, y) => y.views - x.views)[0];
        const growth = secs.filter((x) => x !== topSec && x.change !== null && x.change !== undefined).sort((x, y) => y.change - x.change)[0];
        const art = ga.topArticles?.[0];
        const rawGroups = ga.audience?.channels ? groupChannels(ga.audience.channels).filter((g) => g.pct > 0) : [];
        const orgG = rawGroups.find((g) => g.name === 'Orgánico');
        const dirG = rawGroups.find((g) => g.name === 'Directo');
        const orgMerged = orgG || dirG ? {
          name: 'Orgánico', color: (orgG || dirG).color, items: [...(orgG?.items || []), ...(dirG?.items || [])],
          sessions: (orgG?.sessions || 0) + (dirG?.sessions || 0), views: (orgG?.views || 0) + (dirG?.views || 0), users: (orgG?.users || 0) + (dirG?.users || 0),
          pct: (orgG?.pct || 0) + (dirG?.pct || 0), prevPct: (orgG?.prevPct || 0) + (dirG?.prevPct || 0), prevViews: (orgG?.prevViews || 0) + (dirG?.prevViews || 0),
          note: 'incluye tráfico directo',
        } : null;
        const groups = [...(orgMerged ? [orgMerged] : []), ...rawGroups.filter((g) => g.name !== 'Orgánico' && g.name !== 'Directo')].sort((a, b) => b.pct - a.pct);
        const meta = current.meta || {};
        const ig = meta.instagram?.detail;
        const fb = meta.facebook?.detail;
        const pauta = data.pauta?.brands?.[activeTab];
        const cop = (v) => `$ ${Math.round(v).toLocaleString('es-CO')}`;
        const kTxt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`);
        const chip = (v) => (v === null || v === undefined || !Number.isFinite(v) ? null : (
          <span style={{ fontSize: '12px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px', marginLeft: '6px', background: v >= 0 ? '#e3f4e6' : '#fbe4e4', color: v >= 0 ? '#2e7d32' : '#b71c1c' }}>
            {v >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(v * 100).toFixed(Math.abs(v) >= 1 ? 0 : 1)}%
          </span>
        ));
        const rel = (cur, prev) => (prev ? cur / prev - 1 : null);
        const clientTotal = pauta?.cliente?.totals?.spend || 0;
        const ownTotal = pauta?.propia?.totals?.spend || 0;
        const clientShare = clientTotal + ownTotal ? clientTotal / (clientTotal + ownTotal) : 0;
        const brandName = activeTab === 'axxis' ? 'AXXIS' : 'Diners';
        const kpi = (label, value, change) => (
          <div>
            <div style={{ fontSize: '11px', color: '#555', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{value}{change}</div>
          </div>
        );
        const postCard = (post, icon, kind) => post && (
          <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '10px', marginTop: '12px', padding: '8px', border: '1px solid #e3e6ee', borderRadius: '8px', textDecoration: 'none', color: '#222', background: '#fff' }}>
            {post.image && <img src={post.image} alt="" referrerPolicy="no-referrer" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px' }} />}
            <div style={{ fontSize: '12px' }}>
              <div style={{ fontWeight: 600 }}>{post.caption.slice(0, 90)}{post.caption.length > 90 ? '\u2026' : ''}</div>
              <div style={{ color: '#777', marginTop: '4px' }}>{kind} · {post.date} · {nf(post.interactions)} interacciones</div>
            </div>
          </a>
        );
        const pctC = (v) => (v === null || v === undefined || !Number.isFinite(v) ? null : `${v >= 0 ? '+' : ''}${(v * 100).toFixed(Math.abs(v) >= 1 ? 0 : 1)}%`);
        const num0 = (v) => Math.round(v).toLocaleString('es-CO');
        const pc = (v, d = 0) => `${(v * 100).toFixed(d)}%`;
        const seoB = current.seo || {};
        const emailsB = (current.emails?.emails || []).filter(isRealEmail);
        const chs = ga.audience?.channels || [];
        const totSess = chs.reduce((a, c) => a + (c.sessions || 0), 0);
        const paidSess = chs.filter((c) => /^Paid|Cross-network|Display/.test(c.name)).reduce((a, c) => a + (c.sessions || 0), 0);
        const paidShare = totSess ? paidSess / totSess : 0;
        const camps = (pauta?.campaigns || []).filter((c) => c.ga4 && c.ga4.sessions >= 50);
        const badCamps = camps.filter((c) => c.ga4.bounceRate > 0.65);
        const badSess = badCamps.reduce((a, c) => a + c.ga4.sessions, 0);
        const campSess = camps.reduce((a, c) => a + c.ga4.sessions, 0);
        const orgBounce = ga.organic?.bounceRate;
        const paidBounce = campSess ? camps.reduce((a, c) => a + c.ga4.bounceRate * c.ga4.sessions, 0) / campSess : null;
        const durChange = ga.avgSessionDurationChange;
        const bounce = ga.bounceRate;
        const arts = (ga.topArticles || []).slice(0, 3);

        // Acción 1: tiempo de lectura y calidad del tráfico
        const a1 = [];
        a1.push({ head: 'Diagnóstico', text: `Tiempo por sesión ${ga.avgSessionDuration || '—'}${durChange != null ? ` (${pctC(durChange)} vs periodo anterior)` : ''}, rebote ${bounce != null ? pc(bounce) : '—'}${ga.bounceRateChange != null ? ` (${pctC(ga.bounceRateChange)})` : ''}${orgBounce != null && paidBounce != null ? `. El tráfico orgánico rebota ${pc(orgBounce)} y el de pauta ${pc(paidBounce)}` : ''}.` });
        if (badCamps.length) a1.push({ head: 'Pauta que baja la lectura', text: `${badCamps.length} de ${camps.length} campañas con tráfico medido en GA4 tienen rebote mayor a 65% y concentran ${pc(campSess ? badSess / campSess : 0)} de las sesiones de pauta (${num0(badSess)}). Pausarlas o cambiar el creativo/landing antes de seguir invirtiendo (detalle en Pauta, columna "Apagar campaña").` });
        else if (paidShare > 0.4) a1.push({ head: 'Dependencia de pauta', text: `La pauta aporta ${pc(paidShare)} de las sesiones: medir su rebote por campaña en la pestaña Pauta.` });
        if (arts.length) a1.push({ head: 'Dónde está la lectura', text: `Los artículos más leídos (${arts.map((x) => `"${String(x.title || x.path).slice(0, 48)}" ${num0(x.views)}`).join('; ')}) son la puerta de entrada: enlazar 2 notas relacionadas dentro de cada uno y cerrar con una serie del mismo tema para alargar la sesión.` });

        // Acción 2: fuentes de tráfico
        const a2 = [];
        const oChg = ga.organic?.viewsChange;
        const opp = (seoB.opportunities || []).slice(0, 3);
        if (oChg != null && oChg < -0.05) a2.push({ head: 'Orgánico en caída', text: `Las vistas orgánicas bajaron ${pc(Math.abs(oChg))}.${opp.length ? ` Hay consultas con demanda en posición 8-20 que se pueden empujar a la primera página: ${opp.map((o) => `"${o.key}" (${num0(o.impressions)} impresiones, posición ${o.position.toFixed(1).replace('.', ',')})`).join('; ')}. Actualizar o crear la nota que responda cada una.` : ''}` });
        else if (opp.length) a2.push({ head: 'SEO con demanda sin capturar', text: `Consultas en posición 8-20 con muchas impresiones: ${opp.map((o) => `"${o.key}" (${num0(o.impressions)} impresiones, posición ${o.position.toFixed(1).replace('.', ',')})`).join('; ')}. Llevarlas a la primera página con una nota nueva o actualizada.` });
        const er = seoB.errorPages;
        if (er && er.total > 0) { const tp = er.pages?.[0]; a2.push({ head: 'Páginas con error', text: `${num0(er.total)} vistas cayeron en "Page Not Found"${er.prevTotal ? ` (${pctC(er.total / er.prevTotal - 1)} vs periodo anterior)` : ''}.${tp ? ` La principal es ${tp.path} (${num0(tp.views)} vistas): redirigir o corregir el enlace.` : ''}` }); }
        if (emailsB.length) {
          const sent = emailsB.reduce((a, x) => a + x.sent, 0);
          const clicks = emailsB.reduce((a, x) => a + x.click, 0);
          const best = (emailsB.filter((x) => x.sent >= 1000).length ? emailsB.filter((x) => x.sent >= 1000) : emailsB).slice().sort((x, y) => y.click / (y.sent || 1) - x.click / (x.sent || 1))[0];
          a2.push({ head: 'Email', text: `${emailsB.length} envíos reales y ${num0(sent)} correos enviados dejaron ${num0(clicks)} clics (${pc(sent ? clicks / sent : 0, 1)} de lo enviado). Mejor envío: "${String(best.subject || best.name).slice(0, 60)}" con ${pc(best.click / (best.sent || 1), 1)} de clic: replicar ese asunto y tema, y poner el enlace principal en el primer bloque.` });
        }
        if (paidShare > 0.5) a2.push({ head: 'Mezcla de canales', text: `${pc(paidShare)} de las sesiones vienen de pauta: cada punto que crezca el orgánico (búsqueda + directo) reduce esa dependencia.` });
        if (!a2.length) a2.push({ head: 'Mantener', text: 'Sin alertas en fuentes de tráfico este periodo: sostener la mezcla actual.' });

        // Acción 3: redes sociales
        const a3 = [];
        const igEng = ig?.period?.engagementRate;
        const igEngPrev = ig?.period?.prevEngagementRate;
        const igTop = ig?.topPosts || [];
        const topType = igTop.length ? Object.entries(igTop.reduce((m, x) => { m[x.type] = (m[x.type] || 0) + 1; return m; }, {})).sort((x, y) => y[1] - x[1])[0] : null;
        if (igEng != null) a3.push({ head: 'Instagram', text: `Alcance ${ig?.period?.reachChange != null ? pctC(ig.period.reachChange) : ''} y engagement ${pc(igEng, 1)}${igEngPrev != null ? ` (antes ${pc(igEngPrev, 1)})` : ''}.${igEngPrev != null && igEng < igEngPrev ? ' El alcance crece pero la interacción por alcance baja: publicar menos piezas genéricas y más de los temas que ya lideran.' : ''}${topType ? ` ${topType[1]} de las ${igTop.length} mejores publicaciones son ${String(topType[0]).toLowerCase()}: priorizar ese formato.` : ''}` });
        const sIg = ga.social?.instagram; const sFb = ga.social?.facebook;
        if (sIg && sFb && sIg.sessions > 0 && sFb.sessions > 0) a3.push({ head: 'Tráfico a la web', text: `Facebook lleva ${(sFb.sessions / sIg.sessions).toFixed(1).replace('.', ',')} veces más sesiones a la web que Instagram (${num0(sFb.sessions)} vs ${num0(sIg.sessions)}). Mantener el enlace a la nota en cada publicación de Facebook y en Instagram usar historias con enlace y el enlace de la bio.` });
        const fbTop = fb?.topPosts?.[0];
        if (fbTop && fbTop.clicks) a3.push({ head: 'Mejor publicación de Facebook', text: `"${String(fbTop.caption || '').slice(0, 70)}…" llevó ${num0(fbTop.clicks)} clics a la web: usar su formato y su tema como plantilla.` });
        if (!a3.length) a3.push({ head: 'Sin datos', text: 'No hay datos suficientes de redes para recomendar.' });

        // Por qué cambiaron las vistas
        const viewsCur = groups.reduce((a, g) => a + g.views, 0);
        const viewsPrev = groups.reduce((a, g) => a + (g.prevViews || 0), 0);
        const viewsDelta = viewsCur - viewsPrev;
        const viewsPct = viewsPrev ? viewsCur / viewsPrev - 1 : null;
        const CH_ES = { 'Organic Search': 'Búsqueda orgánica', Direct: 'Directo', 'Organic Social': 'Redes orgánico', 'Paid Social': 'Pauta Meta', 'Paid Search': 'Pauta Google', Email: 'Email', Referral: 'Referido', 'AI Assistant': 'Asistentes de IA', Unassigned: 'No asignado', 'Cross-network': 'Cross-network', 'Paid Shopping': 'Pauta Shopping', 'Paid Other': 'Pauta otros', Display: 'Display', Affiliates: 'Afiliados', 'Organic Video': 'Video orgánico' };
        const chDelta = (ga.audience?.channels || []).map((c) => ({ name: CH_ES[c.name] || c.name, delta: (c.views || 0) - (c.prevViews || 0), cur: c.views || 0, prev: c.prevViews || 0 })).filter((x) => x.cur || x.prev).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
        const secDelta = secs.filter((x) => x.change !== null && x.change !== undefined && x.change > -1).map((x) => { const prev = x.views / (1 + x.change); return { name: x.label, delta: x.views - prev, cur: x.views, prev }; }).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
        const sessCh = ga.sessionsChange;
        const pvCh = ga.pageviewsChange;
        const ppsCur = ga.sessions ? ga.pageviews / ga.sessions : null;
        const ppsPrev = sessCh != null && pvCh != null && ga.sessions && ga.pageviews ? (ga.pageviews / (1 + pvCh)) / (ga.sessions / (1 + sessCh)) : null;
        const ppsCh = ppsCur && ppsPrev ? ppsCur / ppsPrev - 1 : null;
        const dCur = ga.dailyViews || [];
        const dPrev = ga.prevDailyViews || [];
        const WDN = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
        const wdOf = (ymd) => (ymd ? WDN[new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6))).getUTCDay()] : '');
        const dayDiffs = dCur.map((d, i) => ({ label: `${d.label} (${wdOf(d.date)})`, prevLabel: dPrev[i] ? `${Number(dPrev[i].date.slice(6))}/${dPrev[i].date.slice(4, 6)} (${wdOf(dPrev[i].date)})` : '', cur: d.value, prev: dPrev[i]?.value, delta: dPrev[i] ? d.value - dPrev[i].value : null })).filter((d) => d.delta !== null);
        const contamPrev = dPrev.filter((d) => d.date >= '20260722' && d.date <= '20260811');
        const cleanPrev = dPrev.filter((d) => d.date >= '20260812');
        const cleanAvgPrev = cleanPrev.length >= 5 ? cleanPrev.reduce((a, d) => a + d.value, 0) / cleanPrev.length : null;
        const avgCur = dCur.length ? dCur.reduce((a, d) => a + d.value, 0) / dCur.length : null;
        const cleanCh = cleanAvgPrev && avgCur ? avgCur / cleanAvgPrev - 1 : null;
        const worstDays = dayDiffs.slice().sort((x, y) => x.delta - y.delta).slice(0, 3);
        const bestDays = dayDiffs.slice().sort((x, y) => y.delta - x.delta).slice(0, 3);
        const up = viewsDelta >= 0;
        const maxAbs = (list) => Math.max(1, ...list.map((x) => Math.abs(x.delta)));
        const sgn = (v) => `${v >= 0 ? '+' : '\u2212'}${num0(Math.abs(v))}`;
        const bars = (list, color) => {
          const m = maxAbs(list);
          return list.slice(0, 6).map((x) => (
            <div key={x.name} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 130px', gap: '8px', alignItems: 'center', fontSize: '12px', marginBottom: '5px' }}>
              <div style={{ fontWeight: 600 }}>{x.name}</div>
              <div style={{ display: 'flex', height: '14px', background: '#eee', borderRadius: '3px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: x.delta >= 0 ? '50%' : `${50 - (Math.abs(x.delta) / m) * 50}%`, width: `${(Math.abs(x.delta) / m) * 50}%`, height: '100%', background: x.delta >= 0 ? '#2e7d32' : '#c62828', borderRadius: '3px' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: '#999' }} />
              </div>
              <div style={{ textAlign: 'right', fontWeight: 700, color: x.delta >= 0 ? '#2e7d32' : '#c62828' }}>{sgn(x.delta)}{x.prev ? ` (${pctC(x.cur / x.prev - 1)})` : ''}</div>
            </div>
          ));
        };
        const topCh = chDelta[0];
        const secondCh = chDelta[1];
        const topSecD = secDelta[0];
        const readTxt = [
          `Las vistas ${up ? 'subieron' : 'bajaron'} ${viewsPct != null ? pc(Math.abs(viewsPct), 1) : ''} (${sgn(viewsDelta)} vistas frente al periodo anterior).`,
          topCh ? `El canal que más explica el cambio es ${topCh.name} (${sgn(topCh.delta)}${topCh.prev ? `, ${pctC(topCh.cur / topCh.prev - 1)}` : ''})${secondCh && Math.sign(secondCh.delta) !== Math.sign(topCh.delta) ? `, compensado en parte por ${secondCh.name} (${sgn(secondCh.delta)})` : secondCh ? ` y luego ${secondCh.name} (${sgn(secondCh.delta)})` : ''}.` : '',
          topSecD ? `Por sección, ${topSecD.name} movió ${sgn(topSecD.delta)} vistas.` : '',
          sessCh != null && ppsCh != null ? `En volumen vs profundidad: las sesiones ${sessCh >= 0 ? 'subieron' : 'bajaron'} ${pc(Math.abs(sessCh), 1)} y las páginas por sesión ${ppsCh >= 0 ? 'subieron' : 'bajaron'} ${pc(Math.abs(ppsCh), 1)} (${ppsCur.toFixed(2).replace('.', ',')} ahora).` : '',
        ].filter(Boolean).join(' ');
        const actionBox = (n, title, items) => (
          <div style={{ ...styles.card, background: '#f3f1ee', borderLeft: '4px solid #d84315' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#d84315', textTransform: 'uppercase' }}>Acción estratégica {n}: <span style={{ color: '#222' }}>{title}</span></div>
            <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: 1.55 }}>
              {items.map((it, k) => <li key={k} style={{ marginBottom: '5px' }}><strong>{it.head}:</strong> {it.text}</li>)}
            </ul>
          </div>
        );
        return (
          <div style={styles.section}>
            <h2 style={{ ...styles.sectionTitle, color: T.ink }}>CIFRAS DIGITALES · {brandName} · {rangeLabel}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={styles.cardTitle}>Vistas y usuarios por mes</div>
                  {n > 0 && <div style={{ fontSize: '22px', fontWeight: 800 }}>{nf(hist[n - 1].vistas)}{chip(lastChange)}</div>}
                </div>
                <div style={{ width: '100%', height: 260, marginTop: '8px' }}>
                  <ResponsiveContainer>
                    <LineChart data={hist} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                      <Legend />
                      <Line type="monotone" dataKey="vistas" name="Vistas" stroke={T.accent} strokeWidth={2} dot>
                        <LabelList dataKey="vistas" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: T.accent }} />
                      </Line>
                      <Line type="monotone" dataKey="usuarios" name="Usuarios" stroke="#999999" strokeWidth={2} dot>
                        <LabelList dataKey="usuarios" position="bottom" formatter={formatCompact} style={{ fontSize: 10, fill: '#888' }} />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px', alignContent: 'start' }}>
                <div style={{ ...styles.card, background: T.soft }}>
                  {topSec ? (
                    <>
                      <div><strong style={{ fontSize: '20px', color: T.ink }}>{topSec.label}</strong> <span style={{ fontSize: '12px', color: '#555' }}>Sección con mayor interés</span></div>
                      <div style={{ fontSize: '14px', marginTop: '6px' }}>Aporta <strong>{ga.pageviews ? ((topSec.views / ga.pageviews) * 100).toFixed(0) : '\u2014'}% del tráfico</strong></div>
                      {growth && <div style={{ fontSize: '14px', marginTop: '6px' }}>{growth.label} {chip(growth.change)} <span style={{ color: '#555' }}>vs periodo anterior</span></div>}
                    </>
                  ) : <div style={styles.cardSubtext}>Sin datos de secciones</div>}
                </div>
                <div style={{ ...styles.card, background: T.soft }}>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>Artículo más leído:</div>
                  {art ? (
                    <>
                      <div style={{ fontSize: '14px', margin: '6px 0' }}>{art.title || art.path}</div>
                      <div style={{ color: '#2e7d32', fontWeight: 800 }}>{kTxt(art.views)} visitas</div>
                    </>
                  ) : <div style={styles.cardSubtext}>Sin datos</div>}
                </div>
                {actionBox(1, 'Tiempo de lectura y calidad del tráfico', a1)}
              </div>
            </div>

            {viewsPrev > 0 && (
              <div style={{ ...styles.card, marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: T.ink }}>¿Por qué {up ? 'subieron' : 'bajaron'} las vistas?</div>
                  <div style={{ fontSize: '14px' }}>{num0(viewsPrev)} → <strong>{num0(viewsCur)}</strong> {chip(viewsPct)}</div>
                </div>
                <div style={{ fontSize: '14px', lineHeight: 1.6, margin: '10px 0 14px', background: '#f7f7f9', padding: '10px 12px', borderRadius: '6px' }}>{readTxt}</div>
                {contamPrev.length > 0 && (
                  <div style={{ background: '#fff8e1', borderLeft: '4px solid #f9a825', padding: '10px 12px', borderRadius: '4px', fontSize: '13px', lineHeight: 1.55, marginBottom: '14px' }}>
                    <strong>Ojo con la base de comparación:</strong> {contamPrev.length} de {dPrev.length} días del periodo anterior (hasta el 11 de agosto) tienen el tag de GA4 mezclado entre AXXIS y Diners, lo que infló esas vistas. Parte de la caída es efecto de esa base, no pérdida real de audiencia.
                    {cleanAvgPrev && avgCur ? <> Comparación limpia (solo desde el 12 de agosto, promedio diario): <strong>{num0(cleanAvgPrev)}</strong> → <strong>{num0(avgCur)}</strong> {chip(cleanCh)} vistas por día.</> : null}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                  <div>
                    <div style={styles.cardTitle}>Aporte de cada canal al cambio (vistas)</div>
                    <div style={{ marginTop: '8px' }}>{bars(chDelta)}</div>
                    <div style={styles.cardSubtext}>Diferencia de vistas por canal frente al periodo anterior equivalente. El orgánico se muestra abierto en búsqueda, directo y redes.</div>
                  </div>
                  <div>
                    <div style={styles.cardTitle}>Aporte de cada sección al cambio (vistas)</div>
                    <div style={{ marginTop: '8px' }}>{secDelta.length ? bars(secDelta) : <div style={styles.cardSubtext}>Sin datos de secciones.</div>}</div>
                    <div style={styles.cardSubtext}>Las secciones suman solo una parte de las vistas; el resto es home y otras páginas.</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
                  <div style={{ background: '#f3f1ee', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Volumen: sesiones</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{nf(ga.sessions)}{chip(sessCh)}</div>
                  </div>
                  <div style={{ background: '#f3f1ee', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Profundidad: páginas por sesión</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{ppsCur ? ppsCur.toFixed(2).replace('.', ',') : '\u2014'}{chip(ppsCh)}</div>
                  </div>
                  <div style={{ background: '#fbe9e7', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Días con mayor caída vs periodo anterior</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>{worstDays.filter((d) => d.delta < 0).map((d) => <div key={d.label}>{d.label} vs {d.prevLabel}: <strong style={{ color: '#c62828' }}>{sgn(d.delta)}</strong></div>)}{!worstDays.some((d) => d.delta < 0) && 'Ninguno'}</div>
                  </div>
                  <div style={{ background: '#e8f5e9', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Días con mayor alza vs periodo anterior</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>{bestDays.filter((d) => d.delta > 0).map((d) => <div key={d.label}>{d.label} vs {d.prevLabel}: <strong style={{ color: '#2e7d32' }}>{sgn(d.delta)}</strong></div>)}{!bestDays.some((d) => d.delta > 0) && 'Ninguno'}</div>
                  </div>
                </div>
              </div>
            )}

            {groups.length > 0 && (
              <div style={{ ...styles.card, marginTop: '20px', background: '#f3f1ee' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: T.ink, marginBottom: '12px' }}>Fuentes de tráfico</div>
                <div style={{ display: 'flex', height: '40px', borderRadius: '20px', overflow: 'hidden', background: '#ddd' }}>
                  {groups.map((g) => <div key={g.name} title={`${g.name} ${(g.pct * 100).toFixed(1)}%`} style={{ width: `${g.pct * 100}%`, background: g.color }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '18px', marginTop: '14px' }}>
                  {groups.map((g) => (
                    <div key={g.name} style={{ borderTop: `3px solid ${g.color}`, paddingTop: '8px' }}>
                      <div><span style={{ fontSize: '30px', fontWeight: 800 }}>{(g.pct * 100).toFixed(g.pct < 0.1 ? 1 : 0)}%</span>{chip(g.prevPct ? g.pct / g.prevPct - 1 : null)}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: T.ink }}>{g.name}{g.note ? <span style={{ fontSize: '11px', fontWeight: 400, color: '#777' }}> ({g.note})</span> : null}</div>
                      <div style={{ fontSize: '13px' }}>Visitas <strong>{nf(g.views)}</strong>{chip(g.prevViews ? g.views / g.prevViews - 1 : null)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px' }}>{actionBox(2, 'Fuentes de tráfico', a2)}</div>
              </div>
            )}

            <div style={{ ...styles.card, marginTop: '20px' }}>
              {pauta ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#2e7d32', lineHeight: 1.1 }}>{(clientShare * 100).toFixed(0)}% de la inversión fue pagada por los clientes comerciales</div>
                    <div style={{ fontSize: '14px', marginTop: '6px' }}>que pautaron en {brandName} en el mes · {cop(clientTotal)} de {cop(clientTotal + ownTotal)}</div>
                  </div>
                  <div>
                    <div style={styles.cardTitle}>Clientes que pautaron en {brandName}</div>
                    <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '13px' }}>
                      {(pauta.clients || []).map((c) => <li key={c.name} style={{ marginBottom: '4px' }}>{c.name} <span style={{ color: '#888' }}>· {cop(c.spend)} · {c.campaigns} campañas</span></li>)}
                    </ul>
                  </div>
                </div>
              ) : <div style={styles.cardSubtext}>Sin datos de pauta (revisa los avisos de error).</div>}
            </div>

            <div style={{ ...styles.card, marginTop: '20px', background: '#f7f7f9' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: T.ink, marginBottom: '12px' }}>Redes <span style={{ fontWeight: 400 }}>sociales</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline' }}>
                    <div><span style={{ fontSize: '26px', fontWeight: 800 }}>{nf(ig?.followers)}</span> <span style={{ fontSize: '15px' }}>Seguidores Instagram</span></div>
                    <div><span style={{ fontSize: '12px', color: '#555' }}>Aporte de IG al tráfico </span><strong style={{ fontSize: '20px', color: '#2e7d32' }}>{ga.social ? `${(ga.social.instagram.share * 100).toFixed(2)}%` : '\u2014'}</strong>{chip(ga.social?.instagram?.shareChange)}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#eeece8', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                    {kpi('Nuevos seguidores', nf(ig?.period?.newFollowers), chip(ig?.period?.newFollowersChange))}
                    {kpi('Alcance', nf(ig?.period?.reach), chip(ig?.period?.reachChange))}
                    {kpi('Engagement', ig?.period ? `${(ig.period.engagementRate * 100).toFixed(1)}%` : '\u2014', ig?.period?.prevEngagementRate != null ? chip(ig.period.engagementRate - ig.period.prevEngagementRate) : null)}
                  </div>
                  {postCard(ig?.topPosts?.[0], 'ig', 'Instagram · mejor publicación')}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline' }}>
                    <div><span style={{ fontSize: '26px', fontWeight: 800 }}>{nf(fb?.followers)}</span> <span style={{ fontSize: '15px' }}>Seguidores Facebook</span></div>
                    <div><span style={{ fontSize: '12px', color: '#555' }}>Aporte de FB al tráfico </span><strong style={{ fontSize: '20px', color: '#2e7d32' }}>{ga.social ? `${(ga.social.facebook.share * 100).toFixed(2)}%` : '\u2014'}</strong>{chip(ga.social?.facebook?.shareChange)}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#eeece8', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                    {kpi('Nuevos seguidores', nf(fb?.newFollowers), chip(fb?.newFollowersChange))}
                    {kpi('Espectadores', nf(fb?.viewers), chip(fb?.viewersChange))}
                    {kpi('Engagement', fb ? `${(fb.engagementRate * 100).toFixed(2)}%` : '\u2014', fb?.prevEngagementRate != null ? chip(fb.engagementRate - fb.prevEngagementRate) : null)}
                  </div>
                  {postCard(fb?.topPosts?.[0], 'fb', 'Facebook · mejor publicación')}
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>{actionBox(3, 'Redes sociales', a3)}</div>
            </div>
          </div>
        );
      })()}

      {ready && section === 'pauta' && (
      <>
      {/* Informe de gestión · Pauta (resumen para comité) */}
      {data.pauta?.brands?.[activeTab] && (() => {
        const brandName = activeTab === 'axxis' ? 'AXXIS' : 'Diners';
        const b = data.pauta.brands[activeTab];
        const cop = (v) => `$ ${Math.round(v).toLocaleString('es-CO')}`;
        const rel = (cur, prev) => (prev ? cur / prev - 1 : null);
        const totalBrand = b.totals.spend;
        const clientBrand = b.cliente.totals.spend;
        const ownBrand = b.propia.totals.spend;
        const clientShare = totalBrand ? clientBrand / totalBrand : 0;
        const CLIENT = T.accent;
        const OWN = T.ink;

        const list = b.campaigns || [];
        const isAO = (c) => /seguidores|always\s*on|trueplay/i.test(c.name) && !/agosto|julio|septiembre|junio|octubre|mayo/i.test(c.name);
        const isFollow = (c) => /seguidores/i.test(c.name);
        const isEditorial = (c) => /editorial/i.test(c.name) && !isAO(c);
        const aoTrafico = list.filter((c) => isAO(c) && !isFollow(c));
        const aoSeguidores = list.filter((c) => isAO(c) && isFollow(c));
        const editorial = list.filter(isEditorial).filter((c) => c.linkClicks > 0);
        const rankedEditorial = editorial.slice().sort((x, y) => (x.spend / x.linkClicks) - (y.spend / y.linkClicks));
        const worstEditorial = rankedEditorial.filter((c) => c.running !== false).slice(-5).reverse();
        const byPlatform = (grp, re) => grp.filter((c) => re.test(c.name));
        const editorialFB = byPlatform(rankedEditorial, /facebook/i);
        const editorialIG = byPlatform(rankedEditorial, /instagram/i);
        const bestEditorialFB = editorialFB.slice(0, 5);
        const bestEditorialIG = editorialIG.slice(0, 5);

        const agg = (grp) => {
          const spend = grp.reduce((a, c) => a + c.spend, 0);
          const impressions = grp.reduce((a, c) => a + (c.impressions || 0), 0);
          const reach = grp.reduce((a, c) => a + (c.reach || 0), 0);
          const linkClicks = grp.reduce((a, c) => a + (c.linkClicks || 0), 0);
          return {
            impressions, reach,
            ctr: impressions ? (linkClicks / impressions) * 100 : null,
            cpm: impressions ? (spend / impressions) * 1000 : null,
            cpc: linkClicks ? spend / linkClicks : null,
          };
        };

        const pillRow = (grp, withPrev) => {
          const m = agg(grp);
          return (
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Impresiones</div>
                <div style={styles.cardValue}>{nf(m.impressions)}</div>
                {withPrev && renderChange(rel(b.totals.impressions, b.prevTotals.impressions), false, nf(b.prevTotals.impressions))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(m.reach)}</div>
                {withPrev && renderChange(rel(b.totals.reach, b.prevTotals.reach), false, nf(b.prevTotals.reach))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CTR (enlace)</div>
                <div style={styles.cardValue}>{m.ctr == null ? '—' : `${m.ctr.toFixed(2)}%`}</div>
                {withPrev && renderPP(b.totals.ctr, b.prevTotals.impressions ? b.prevTotals.linkClicks / b.prevTotals.impressions : null)}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CPM</div>
                <div style={styles.cardValue}>{m.cpm == null ? '—' : cop(m.cpm)}</div>
                {withPrev && renderChange(rel(b.totals.cpm, b.prevTotals.cpm), true, cop(b.prevTotals.cpm))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CPC</div>
                <div style={styles.cardValue}>{m.cpc == null ? '—' : cop(m.cpc)}</div>
                {withPrev && renderChange(rel(b.totals.cpc, b.prevTotals.cpc), true, cop(b.prevTotals.cpc))}
              </div>
            </div>
          );
        };

        const miniTable = (grp, title, subtext, totalsGrp) => {
          const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
          const tot = totalsGrp ? agg(totalsGrp) : null;
          const totSpend = totalsGrp ? totalsGrp.reduce((a, c) => a + c.spend, 0) : 0;
          return (
            <div style={{ ...styles.card, marginBottom: '4px' }}>
              <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>{title}</div>
              {subtext && <div style={styles.cardSubtext}>{subtext}</div>}
              {!grp.length ? <div style={{ fontSize: '13px', color: '#555', marginTop: '10px' }}>Sin campañas para mostrar.</div> : (
                <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '760px' }}>
                    <thead>
                      <tr>{['Campaña', 'Fecha de creación', 'Inversión', '% inv.', 'Impresiones', 'Alcance', 'Clics enlace', 'CTR', 'CPC'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {grp.map((c) => (
                        <tr key={c.id || c.name}>
                          <td style={{ ...td, textAlign: 'left', maxWidth: '320px', overflowWrap: 'anywhere', fontWeight: 600 }}>{c.name}</td>
                          <td style={td}>{c.createdTime || '—'}</td>
                          <td style={td}>{cop(c.spend)}</td>
                          <td style={td}>{((c.spendShare || 0) * 100).toFixed(2)}%</td>
                          <td style={td}>{nf(c.impressions)}</td>
                          <td style={td}>{nf(c.reach)}</td>
                          <td style={td}>{nf(c.linkClicks)}</td>
                          <td style={td}>{c.impressions ? `${((c.linkClicks / c.impressions) * 100).toFixed(2)}%` : '—'}</td>
                          <td style={{ ...td, fontWeight: 700 }}>{c.linkClicks ? cop(c.spend / c.linkClicks) : '—'}</td>
                        </tr>
                      ))}
                      {tot && (
                        <tr style={{ background: T.soft }}>
                          <td style={{ ...td, textAlign: 'left', fontWeight: 800 }}>Total de todas las campañas editoriales de este grupo ({totalsGrp.length}), no solo el top 5</td>
                          <td style={td}>—</td>
                          <td style={{ ...td, fontWeight: 800 }}>{cop(totSpend)}</td>
                          <td style={td}>—</td>
                          <td style={{ ...td, fontWeight: 800 }}>{nf(tot.impressions)}</td>
                          <td style={{ ...td, fontWeight: 800 }}>{nf(tot.reach)}</td>
                          <td style={td}>—</td>
                          <td style={{ ...td, fontWeight: 800 }}>{tot.ctr == null ? '—' : `${tot.ctr.toFixed(2)}%`}</td>
                          <td style={{ ...td, fontWeight: 800 }}>{tot.cpc == null ? '—' : cop(tot.cpc)} {tot.cpm != null && <span style={{ fontWeight: 400, color: '#666' }}>· CPM {cop(tot.cpm)}</span>}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        };

        const gaQuality = (grp) => {
          const withGa = grp.filter((c) => c.ga4 && c.ga4.sessions >= 10);
          const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
          return (
            <div style={{ ...styles.card, marginBottom: '4px' }}>
              <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>Calidad de tráfico por campaña, validado en GA4 (solo editorial) · {rangeLabel}</div>
              <div style={styles.cardSubtext}>Sesiones por campaña (Paid Social en GA4, cruzado por nombre), rebote y % de sesiones "motivadas" (proxy de lectura de más de una página). Solo campañas con 10+ sesiones en GA4.</div>
              {!withGa.length ? <div style={{ fontSize: '13px', color: '#555', marginTop: '10px' }}>Sin cruce de GA4 disponible para estas campañas.</div> : (
                <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '760px' }}>
                    <thead>
                      <tr>{['Campaña', 'Fecha de creación', 'Sesiones (GA4)', 'Rebote', '% sesiones +1 página (proxy)', 'Páginas / sesión', 'Apagar campaña'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {withGa.map((c) => {
                        const br = c.ga4.bounceRate;
                        const decision = br > 0.65 ? 'SÍ' : br >= 0.45 ? 'Optimizar' : 'NO';
                        const decColor = { SÍ: '#c62828', Optimizar: '#f9a825', NO: '#2e7d32' }[decision];
                        const decBg = { SÍ: '#fdecea', Optimizar: '#fff8e1', NO: '#eef7ee' }[decision];
                        return (
                          <tr key={c.id || c.name}>
                            <td style={{ ...td, textAlign: 'left', maxWidth: '320px', overflowWrap: 'anywhere', fontWeight: 600 }}>{c.name}</td>
                            <td style={td}>{c.createdTime || '—'}</td>
                            <td style={td}>{nf(c.ga4.sessions)}</td>
                            <td style={{ ...td, fontWeight: 700, color: c.ga4.bounceRate > 0.6 ? '#c62828' : '#222' }}>{(c.ga4.bounceRate * 100).toFixed(1)}%</td>
                            <td style={{ ...td, fontWeight: 700 }}>{(c.ga4.engagementRate * 100).toFixed(1)}%</td>
                            <td style={td}>{c.ga4.pagesPerSession.toFixed(2)}</td>
                            <td style={td}><span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '10px', fontWeight: 800, fontSize: '11px', color: decColor, background: decBg }}>{decision}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={styles.cardSubtext}>Apagar campaña: SÍ = rebote mayor a 65% (tráfico que no lee nada). Optimizar = rebote entre 45% y 65% (revisar creativo o landing antes de decidir). NO = rebote menor a 45% (tráfico de calidad, mantener).</div>
            </div>
          );
        };

        const campaignDeepDive = (c) => {
          const open = !!campOpenIds[c.id];
          const d = campDeep[c.id];
          const dateFmt = (s) => { const [, mo, da] = s.split('-'); return `${da}/${mo}`; };
          return (
            <div key={c.id} style={{ marginBottom: '4px' }}>
              <button onClick={() => toggleCampaignDeep(c.id)} style={{ marginTop: '2px', padding: '8px 14px', border: `1px solid ${T.accent}`, borderRadius: '4px', background: open ? T.accent : '#fff', color: open ? '#fff' : T.accent, fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                {open ? 'Ocultar' : 'Ver'} detalle completo de "{c.name}" (rendimiento, demográficos, conjuntos de anuncios y anuncios)
              </button>
              {open && (
                d === 'loading' ? <div style={{ ...styles.card, textAlign: 'center', padding: '24px', color: '#555' }}>Cargando detalle de la campaña…</div>
                : d?.error ? <div style={{ ...styles.card, color: '#b71c1c' }}>No se pudo cargar: {d.error}</div>
                : !d ? null : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                    {/* Resumen del rendimiento */}
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Resumen del rendimiento · {c.name}</div>
                      <div style={{ display: 'flex', gap: '30px', margin: '10px 0' }}>
                        <div><div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase' }}>Impresiones</div><div style={{ fontSize: '26px', fontWeight: 800 }}>{nf(d.totals.impressions)}</div></div>
                        <div><div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase' }}>Alcance</div><div style={{ fontSize: '26px', fontWeight: 800 }}>{nf(d.totals.reach)}</div></div>
                        <div><div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase' }}>CPC</div><div style={{ fontSize: '26px', fontWeight: 800 }}>{d.totals.cpc == null ? '—' : cop(d.totals.cpc)}</div></div>
                      </div>
                      {d.daily.length > 0 && (
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={d.daily.map((r) => ({ ...r, label: dateFmt(r.date) }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" fontSize={11} interval="preserveStartEnd" />
                            <YAxis fontSize={11} />
                            <Tooltip formatter={(v) => nf(v)} />
                            <Area type="monotone" dataKey="impressions" name="Impresiones" stroke={T.accent} fill={T.accent} fillOpacity={0.25} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    {/* Distribución por sexo y edad */}
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Distribución por sexo y edad</div>
                      {(() => {
                        const ages = [...new Set(d.demographics.rows.map((r) => r.age))].sort();
                        const chartData = ages.map((age) => {
                          const row = { age };
                          d.demographics.rows.filter((r) => r.age === age).forEach((r) => { row[r.genderLabel] = r.reach; });
                          return row;
                        });
                        const m = d.demographics.byGenderTotal.male || 0;
                        const f = d.demographics.byGenderTotal.female || 0;
                        const totR = d.demographics.totalReach || (m + f);
                        const spendOf = (g) => d.demographics.rows.filter((r) => r.gender === g).reduce((a, r) => a + r.spend, 0);
                        const resultsOf = (g) => d.demographics.rows.filter((r) => r.gender === g).reduce((a, r) => a + r.results, 0);
                        const cprOf = (g) => { const rs = resultsOf(g); return rs ? spendOf(g) / rs : null; };
                        return (
                          <>
                            {chartData.length > 0 && (
                              <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                  <XAxis dataKey="age" fontSize={11} />
                                  <YAxis fontSize={11} />
                                  <Tooltip formatter={(v) => nf(v)} />
                                  <Legend />
                                  <Bar dataKey="Hombres" fill="#5b3fd6" />
                                  <Bar dataKey="Mujeres" fill={T.accent2 || '#2bbfae'} />
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                            <div style={{ display: 'flex', gap: '30px', marginTop: '10px', fontSize: '13px' }}>
                              <div><strong>Hombres</strong> {totR ? ((m / totR) * 100).toFixed(0) : 0}% ({nf(m)}){cprOf('male') != null && <div style={{ color: '#666', fontSize: '12px' }}>Costo por resultado: {cop(cprOf('male'))}</div>}</div>
                              <div><strong>Mujeres</strong> {totR ? ((f / totR) * 100).toFixed(0) : 0}% ({nf(f)}){cprOf('female') != null && <div style={{ color: '#666', fontSize: '12px' }}>Costo por resultado: {cop(cprOf('female'))}</div>}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Conjuntos de anuncios y segmentación */}
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Conjuntos de anuncios y segmentación</div>
                      {!d.adsets.length ? <div style={styles.cardSubtext}>Sin conjuntos de anuncios.</div> : (
                        <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '760px' }}>
                            <thead>
                              <tr>{['Conjunto de anuncios', 'Estado', 'Edad', 'Género', 'Ubicación', 'Intereses'].map((h, k) => <th key={h} style={{ textAlign: k ? 'left' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                              {d.adsets.map((a) => (
                                <tr key={a.id}>
                                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', fontWeight: 600, maxWidth: '260px', overflowWrap: 'anywhere' }}>{a.name}</td>
                                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>{a.status}</td>
                                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>{a.ageMin ?? '—'}{a.ageMax ? `-${a.ageMax}` : ''}</td>
                                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>{a.genders}</td>
                                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>{a.geo || '—'}</td>
                                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', maxWidth: '260px', overflowWrap: 'anywhere' }}>{a.interests?.length ? a.interests.join(', ') : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Rendimiento por anuncio */}
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Rendimiento por anuncio</div>
                      {!d.ads.length ? <div style={styles.cardSubtext}>Sin anuncios con datos en este periodo.</div> : (() => {
                        const withClicks = d.ads.filter((a) => a.linkClicks > 0);
                        const avgCpc = withClicks.length ? withClicks.reduce((a, x) => a + x.spend, 0) / withClicks.reduce((a, x) => a + x.linkClicks, 0) : null;
                        const perfColor = (ad) => {
                          if (!avgCpc || !ad.linkClicks) return null;
                          const ratio = ad.cpc / avgCpc;
                          if (ratio <= 0.9) return '#2e7d32';
                          if (ratio <= 1.3) return '#f9a825';
                          return '#c62828';
                        };
                        const perfBg = { '#2e7d32': '#eef7ee', '#f9a825': '#fff8e1', '#c62828': '#fdecea' };
                        return (
                        <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', minWidth: '1400px' }}>
                            <thead>
                              <tr>{['Anuncio', 'Impresiones', 'Alcance', 'Frecuencia', 'CPM', 'CPC', 'Clics en enlace', 'Visitas a la página de destino', 'Visitas al perfil', 'Seguimientos de Instagram', 'Reproducciones 3 s', 'Tiempo prom. reproducción', 'Retención 25/50/75/100%'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '7px 5px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                              {d.ads.map((ad) => {
                                const dash = '—';
                                const pct = (v) => (v === null || v === undefined ? dash : `${(v * 100).toFixed(1)}%`);
                                const color = perfColor(ad);
                                const tdd = { padding: '7px 5px', borderBottom: '1px solid #eee', textAlign: 'right' };
                                return (
                                  <tr key={ad.id} style={{ background: color ? perfBg[color] : 'transparent', borderLeft: color ? `4px solid ${color}` : '4px solid transparent' }}>
                                    <td style={{ ...tdd, textAlign: 'left', maxWidth: '220px', overflowWrap: 'anywhere', fontWeight: 600 }}>{ad.name}</td>
                                    <td style={tdd}>{nf(ad.impressions)}</td>
                                    <td style={tdd}>{nf(ad.reach)}</td>
                                    <td style={tdd}>{ad.frequency ? ad.frequency.toFixed(2) : dash}</td>
                                    <td style={tdd}>{ad.impressions ? cop(ad.cpm) : dash}</td>
                                    <td style={{ ...tdd, fontWeight: 800, color: color || 'inherit' }}>{ad.linkClicks ? cop(ad.cpc) : dash}</td>
                                    <td style={tdd}>{nf(ad.linkClicks)}</td>
                                    <td style={tdd}>{ad.landingPageViews === null ? dash : nf(ad.landingPageViews)}</td>
                                    <td style={tdd}>{ad.profileVisits === null ? dash : nf(ad.profileVisits)}</td>
                                    <td style={tdd}>{ad.igFollows === null ? dash : nf(ad.igFollows)}</td>
                                    <td style={tdd}>{ad.videoViews3s === null ? dash : nf(ad.videoViews3s)}</td>
                                    <td style={tdd}>{ad.avgWatchSeconds === null ? dash : `${ad.avgWatchSeconds.toFixed(1)} s`}</td>
                                    <td style={tdd}>{ad.videoViews3s ? `${pct(ad.retention.p25)} · ${pct(ad.retention.p50)} · ${pct(ad.retention.p75)} · ${pct(ad.retention.p100)}` : dash}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        );
                      })()}
                      <div style={styles.cardSubtext}>Verde: CPC ≤ 0,9x el promedio de los anuncios de esta campaña. Amarillo: 0,9x-1,3x (requiere ajuste). Rojo: más de 1,3x (peor performance). Campos de video (reproducciones 3 s, tiempo promedio, retención) solo existen en anuncios de video. "—" significa que Meta no devolvió ese dato para el anuncio.</div>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        };

        return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Informe de gestión · Pauta · {brandName} · {rangeLabel}</h2>

            {/* Fila 1 */}
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Inversión total {brandName}</div>
                <div style={styles.cardValue}>{cop(totalBrand)}</div>
                {renderChange(rel(totalBrand, b.prevTotals.spend), false, cop(b.prevTotals.spend))}
              </div>
              <div style={{ ...styles.card, borderTop: `4px solid ${OWN}` }}>
                <div style={styles.cardTitle}>Pauta propia</div>
                <div style={styles.cardValue}>{cop(ownBrand)}</div>
                {renderChange(rel(ownBrand, b.propia.prevTotals.spend), false, cop(b.propia.prevTotals.spend))}
                <div style={styles.cardSubtext}>{((1 - clientShare) * 100).toFixed(1)}% de la inversión · la asume Gamma</div>
              </div>
              <div style={{ ...styles.card, borderTop: `4px solid ${CLIENT}` }}>
                <div style={styles.cardTitle}>Pauta de clientes</div>
                <div style={styles.cardValue}>{cop(clientBrand)}</div>
                {renderChange(rel(clientBrand, b.cliente.prevTotals.spend), false, cop(b.cliente.prevTotals.spend))}
                <div style={styles.cardSubtext}>{(clientShare * 100).toFixed(1)}% de la inversión · la pagan los clientes</div>
              </div>
            </div>

            {/* Fila 2 */}
            <div style={{ ...styles.card, marginTop: '4px' }}>
              <div style={styles.cardTitle}>Revista {brandName} · inversión en Meta: clientes vs propia</div>
              <div style={{ display: 'flex', height: '26px', borderRadius: '13px', overflow: 'hidden', background: '#eee', margin: '12px 0' }}>
                <div title={`Clientes ${cop(clientBrand)}`} style={{ width: `${totalBrand ? (clientBrand / totalBrand) * 100 : 0}%`, background: CLIENT }} />
                <div title={`Propia ${cop(ownBrand)}`} style={{ width: `${totalBrand ? (ownBrand / totalBrand) * 100 : 0}%`, background: OWN }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: CLIENT, marginRight: '6px' }} />Clientes: <strong>{totalBrand ? ((clientBrand / totalBrand) * 100).toFixed(1) : '0.0'}%</strong></span>
                <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: OWN, marginRight: '6px' }} />Propia: <strong>{totalBrand ? ((ownBrand / totalBrand) * 100).toFixed(1) : '0.0'}%</strong></span>
              </div>
            </div>

            {/* Fila 3: pastillas generales */}
            {pillRow(list, true)}

            {/* Fila 4: top 5 mejor rendimiento (editorial) */}
            {miniTable(bestEditorialIG, 'Top 5 campañas con mejor rendimiento · Instagram (solo editorial)', 'Ordenadas por menor costo por clic en enlace. Solo campañas editoriales (excluye content de clientes y always on).', editorialIG)}
            {miniTable(bestEditorialFB, 'Top 5 campañas con mejor rendimiento · Facebook (solo editorial)', 'Ordenadas por menor costo por clic en enlace. Solo campañas editoriales (excluye content de clientes y always on).', editorialFB)}

            {/* Fila 6: top 5 peor rendimiento (editorial) */}
            {miniTable(worstEditorial, 'Top 5 campañas con peor rendimiento (solo editorial)', 'Ordenadas por mayor costo por clic en enlace. Solo campañas editoriales activas hoy (no pausadas ni con fecha de fin vencida).')}

            {/* Fila 7: calidad GA4 (editorial) */}
            {gaQuality(editorial)}

            {/* Recomendados para sumar a Always on tráfico */}
            {(() => {
              const reco = [
                ...bestEditorialIG.map((c) => ({ ...c, platform: 'Instagram' })),
                ...bestEditorialFB.map((c) => ({ ...c, platform: 'Facebook' })),
              ].sort((a, b) => (a.spend / a.linkClicks) - (b.spend / b.linkClicks));
              const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
              return (
                <div style={{ ...styles.card, marginBottom: '4px', borderTop: `4px solid ${T.accent}` }}>
                  <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>Anuncios editoriales recomendados para sumar a "Always on tráfico" (IG + FB)</div>
                  <div style={styles.cardSubtext}>Son los editoriales con mejor costo por clic del mes (de los Top 5 IG y Top 5 FB de arriba). En vez de crear un ad set nuevo por cada uno, la recomendación es meterlos como anuncios rotando dentro del mismo ad set consolidado de tráfico always on, para no perder el historial de aprendizaje.</div>
                  {!reco.length ? <div style={{ fontSize: '13px', color: '#555', marginTop: '10px' }}>Sin candidatos editoriales este periodo.</div> : (
                    <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                      <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '780px' }}>
                        <thead>
                          <tr>{['Campaña', 'Plataforma', 'Fecha de creación', 'Impresiones', 'Alcance', 'CTR', 'CPC', 'Clics en enlace'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {reco.map((c) => (
                            <tr key={c.id || c.name}>
                              <td style={{ ...td, textAlign: 'left', maxWidth: '340px', overflowWrap: 'anywhere', fontWeight: 600 }}>{c.name}</td>
                              <td style={{ ...td, textAlign: 'right' }}>{c.platform}</td>
                              <td style={td}>{c.createdTime || '—'}</td>
                              <td style={td}>{nf(c.impressions)}</td>
                              <td style={td}>{nf(c.reach)}</td>
                              <td style={td}>{c.impressions ? `${((c.linkClicks / c.impressions) * 100).toFixed(2)}%` : '—'}</td>
                              <td style={{ ...td, fontWeight: 800, color: '#2e7d32' }}>{cop(c.spend / c.linkClicks)}</td>
                              <td style={td}>{nf(c.linkClicks)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Fila 8: rendimiento always on tráfico */}
            {miniTable(aoTrafico, 'Rendimiento de campaña · Always on tráfico')}
            {aoTrafico.map((c) => campaignDeepDive(c))}

            {/* Fila 9: pastillas always on tráfico */}
            {pillRow(aoTrafico, false)}

            {/* Fila 10: rendimiento always on seguidores */}
            {miniTable(aoSeguidores, 'Rendimiento de campaña · Always on seguidores')}
            {aoSeguidores.map((c) => campaignDeepDive(c))}

            {/* Fila 11: pastillas always on seguidores */}
            {pillRow(aoSeguidores, false)}
          </div>
        );
      })()}

      <div style={{ margin: '40px 0 16px', paddingTop: '20px', borderTop: '2px dashed #ccc' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#666' }}>Detalle de soporte (no es parte del informe de gestión)</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Todo lo de aquí en adelante es material de respaldo para auditar el dato. Vamos decidiendo juntos qué pastillas se eliminan.</div>
      </div>

      {/* Always on vs resto */}
      {data.pauta?.brands && (() => {
        const brandsP = data.pauta.brands;
        const all = Object.keys(brandsP).flatMap((b) => (brandsP[b].campaigns || []).map((c) => ({ ...c, brandKey: b })));
        const totS = all.reduce((a, c) => a + c.spend, 0);
        const totPrevS = all.reduce((a, c) => a + (c.prevSpend || 0), 0);
        if (!all.length || !totS) return null;
        const isAO = (c) => /seguidores|always\s*on|trueplay/i.test(c.name) && !/agosto|julio|septiembre|junio|octubre|mayo/i.test(c.name);
        const isFollow = (c) => /seguidores/i.test(c.name);
        const groups = [
          { k: 'seg', t: 'Always on · Seguidores', list: all.filter((c) => isAO(c) && isFollow(c)) },
          { k: 'tra', t: 'Always on · Tráfico', list: all.filter((c) => isAO(c) && !isFollow(c)) },
          { k: 'res', t: 'Resto de campañas', list: all.filter((c) => !isAO(c)) },
        ];
        const avg = (() => { const l = all.reduce((a, c) => a + c.linkClicks, 0); return l ? totS / l : 0; })();
        const agg = (list) => {
          const s = list.reduce((a, c) => a + c.spend, 0);
          const ps = list.reduce((a, c) => a + (c.prevSpend || 0), 0);
          const lc = list.reduce((a, c) => a + c.linkClicks, 0);
          const im = list.reduce((a, c) => a + (c.impressions || 0), 0);
          const rc = list.reduce((a, c) => a + (c.reach || 0), 0);
          const rs = list.reduce((a, c) => a + (c.results || 0), 0);
          return { n: list.length, share: s / totS, prevShare: totPrevS ? ps / totPrevS : null, lc, clickShare: 0, cpcRatio: lc && avg ? s / lc / avg : null, ctr: im ? (lc / im) * 100 : null, cpmRatio: null, im, rc, rs, s };
        };
        const rows = groups.map((g) => ({ ...g, m: agg(g.list) }));
        const totLc = rows.reduce((a, r) => a + r.m.lc, 0);
        const totIm = rows.reduce((a, r) => a + r.m.im, 0);
        const cpmAvg = totIm ? totS / totIm : 0;
        rows.forEach((r) => { r.m.clickShare = totLc ? r.m.lc / totLc : 0; r.m.cpmRatio = r.m.im && cpmAvg ? r.m.s / r.m.im / cpmAvg : null; });
        const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
        const fmtDelta = (cur, prev) => (prev == null ? '' : `${(cur - prev) >= 0 ? '+' : ''}${((cur - prev) * 100).toFixed(1)} pts vs mes anterior (${(prev * 100).toFixed(1)}%)`);
        const ao = rows.slice(0, 2).reduce((a, r) => a + r.m.share, 0);
        const aoClicks = rows.slice(0, 2).reduce((a, r) => a + r.m.clickShare, 0);
        return (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>Always on (Seguidores y Tráfico permanente) vs resto de campañas · {rangeLabel}</div>
            <div style={styles.cardSubtext}>Always on: campañas permanentes de Seguidores, Tráfico always on y tráfico al home (trueplay). Resto: campañas mensuales de contenido y de clientes. Costo por clic y CPM se muestran frente al promedio de la cuenta (1,0x = promedio).</div>
            <div style={{ overflowX: 'auto', marginTop: '8px' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '760px' }}>
                <thead>
                  <tr>{['Grupo', 'Campañas', '% de la inversión', 'vs mes anterior', '% de clics en enlace', 'Costo por clic vs promedio', 'CTR', 'CPM vs promedio', 'Alcance'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.k}>
                      <td style={{ ...td, textAlign: 'left', fontWeight: 700 }}>{r.t}</td>
                      <td style={td}>{r.m.n}</td>
                      <td style={{ ...td, fontWeight: 800 }}>{(r.m.share * 100).toFixed(1)}%</td>
                      <td style={{ ...td, fontSize: '11px', color: '#666' }}>{r.m.prevShare == null ? '—' : fmtDelta(r.m.share, r.m.prevShare)}</td>
                      <td style={td}>{(r.m.clickShare * 100).toFixed(1)}%</td>
                      <td style={{ ...td, fontWeight: 800, color: r.m.cpcRatio > 1.5 ? '#c62828' : r.m.cpcRatio != null && r.m.cpcRatio < 0.9 ? '#2e7d32' : '#222' }}>{r.m.cpcRatio == null ? '—' : `${r.m.cpcRatio.toFixed(1)}x`}</td>
                      <td style={td}>{r.m.ctr == null ? '—' : `${r.m.ctr.toFixed(2)}%`}</td>
                      <td style={td}>{r.m.cpmRatio == null ? '—' : `${r.m.cpmRatio.toFixed(1)}x`}</td>
                      <td style={td}>{nf(r.m.rc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: 1.6 }}>
              Las campañas always on consumen <strong>{(ao * 100).toFixed(1)}%</strong> de la inversión y traen <strong>{(aoClicks * 100).toFixed(1)}%</strong> de los clics en enlace. Las de Seguidores buscan interacciones, no clics, por eso su costo por clic no es comparable con el de tráfico.
            </div>
          </div>
        );
      })()}

      {/* Campañas con peor costo por clic */}
      {data.pauta?.brands && (() => {
        const brandsP = data.pauta.brands;
        const all = Object.keys(brandsP).flatMap((b) => (brandsP[b].campaigns || []).map((c) => ({ ...c, brandKey: b })));
        if (!all.length) return null;
        const totS = all.reduce((a, c) => a + c.spend, 0);
        const totL = all.reduce((a, c) => a + c.linkClicks, 0);
        if (!totS || !totL) return null;
        const avg = totS / totL;
        const OBJ = { OUTCOME_TRAFFIC: 'Tráfico', OUTCOME_AWARENESS: 'Alcance', OUTCOME_ENGAGEMENT: 'Interacciones', OUTCOME_SALES: 'Ventas', OUTCOME_LEADS: 'Clientes potenciales' };
        const pool = all.filter((c) => (pautaObj === 'trafico' ? c.objective === 'OUTCOME_TRAFFIC' : true) && c.spend >= totS * 0.003);
        const ranked = pool.map((c) => ({ ...c, ratio: c.linkClicks ? c.spend / c.linkClicks / avg : Infinity, over: (c.spend - c.linkClicks * avg) / totS }))
          .sort((a, b) => (b.ratio === a.ratio ? b.spend - a.spend : b.ratio - a.ratio));
        const worst = ranked.slice(0, 10);
        const worstSpend = worst.reduce((a, c) => a + c.spend, 0);
        const worstClicks = worst.reduce((a, c) => a + c.linkClicks, 0);
        const bName = { axxis: 'AXXIS', diners: 'Diners', gamma: 'Gamma', otras: 'Otras' };
        const poolSpend = pool.reduce((a, c) => a + c.spend, 0);
        const poolClicks = pool.reduce((a, c) => a + c.linkClicks, 0);
        const btn = (k, t) => (
          <button onClick={() => setPautaObj(k)} style={{ padding: '4px 12px', fontSize: '12px', border: 'none', cursor: 'pointer', borderRadius: '12px', fontWeight: 700, background: pautaObj === k ? T.accent : '#e5e5e5', color: pautaObj === k ? '#fff' : '#444' }}>{t}</button>
        );
        return (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>Las 10 campañas con costo por clic en enlace más alto · {rangeLabel}</div>
              <div style={{ display: 'flex', gap: '6px' }}>{btn('trafico', 'Solo tráfico')}{btn('todas', 'Todos los objetivos')}</div>
            </div>
            <div style={styles.cardSubtext}>Costo por clic en enlace de cada campaña frente al promedio de toda la cuenta (100% de la inversión de las marcas y clientes). 1,0x es el promedio; 2,0x significa que cada clic cuesta el doble. Solo campañas con al menos 0,3% de la inversión de la cuenta.</div>
            {worst.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#555', marginTop: '10px' }}>No hay campañas con inversión suficiente para comparar.</div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '820px' }}>
                    <thead>
                      <tr>{['#', 'Campaña', 'Fecha de creación', 'Marca', 'Línea', 'Objetivo', '% de la inversión', 'Clics en enlace', 'Costo por clic vs promedio', 'Sobrecosto (% de la inversión)'].map((h, k) => <th key={h} style={{ textAlign: k > 5 ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {worst.map((c, k) => {
                        const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
                        return (
                          <tr key={c.id || c.name} style={{ background: k === 0 ? '#fff6ee' : 'transparent' }}>
                            <td style={{ ...td, textAlign: 'left', fontWeight: 800, color: k < 3 ? '#c62828' : '#888' }}>{k + 1}</td>
                            <td style={{ ...td, textAlign: 'left', maxWidth: '360px', overflowWrap: 'anywhere', fontWeight: 600 }}>{c.name}</td>
                            <td style={{ ...td, textAlign: 'left' }}>{c.createdTime || '—'}</td>
                            <td style={{ ...td, textAlign: 'left' }}>{bName[c.brandKey] || c.brandKey}</td>
                            <td style={{ ...td, textAlign: 'left', textTransform: 'capitalize' }}>{c.payer}</td>
                            <td style={{ ...td, textAlign: 'left' }}>{OBJ[c.objective] || c.objective}</td>
                            <td style={td}>{((c.spend / totS) * 100).toFixed(2)}%</td>
                            <td style={td}>{nf(c.linkClicks)}</td>
                            <td style={{ ...td, fontWeight: 800, color: '#c62828' }}>{Number.isFinite(c.ratio) ? `${c.ratio.toFixed(1)}x` : 'Sin clics'}</td>
                            <td style={{ ...td, color: c.over > 0 ? '#c62828' : '#222' }}>{c.over > 0 ? `${(c.over * 100).toFixed(2)}%` : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: 1.6 }}>
                  Estas 10 campañas concentran <strong>{poolSpend ? ((worstSpend / poolSpend) * 100).toFixed(1) : 0}%</strong> de la inversión {pautaObj === 'trafico' ? 'de tráfico' : 'analizada'} y traen <strong>{poolClicks ? ((worstClicks / poolClicks) * 100).toFixed(1) : 0}%</strong> de los clics en enlace.
                  {pautaObj === 'todas' ? ' Con todos los objetivos, las campañas de alcance o interacciones salen caras en clics porque no buscan clics en enlace; por eso "Solo tráfico" es la comparación justa.' : ''}
                </div>
                <div style={styles.cardSubtext}>Sobrecosto = lo que se pagó por encima de lo que costarían esos mismos clics al promedio de la cuenta, como % de la inversión total de la cuenta. Por confidencialidad se muestran solo valores relativos.</div>
              </>
            )}
          </div>
        );
      })()}

      {/* Calidad de tráfico por campaña (GA4) */}
      {data.pauta?.brands?.[activeTab]?.campaigns && (() => {
        const brandP = data.pauta.brands[activeTab];
        if (brandP.ga4Error) {
          return (
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>Calidad de tráfico por campaña (GA4)</div>
              <div style={{ fontSize: '13px', color: '#c62828', marginTop: '8px' }}>No se pudo cruzar con GA4: {brandP.ga4Error}</div>
            </div>
          );
        }
        const withGa = (brandP.campaigns || []).filter((c) => c.ga4 && c.ga4.sessions >= 20);
        if (!withGa.length) return null;
        const ranked = withGa.slice().sort((a, b) => b.ga4.sessions - a.ga4.sessions).slice(0, 15);
        const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
        return (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: 0 }}>Calidad de tráfico por campaña, validado en GA4 · {rangeLabel}</div>
            <div style={styles.cardSubtext}>Sesiones que llegaron por cada campaña (canal Paid Social en GA4, cruzado por nombre de campaña), su rebote y el % de sesiones "motivadas" (10s+, con conversión o 2+ páginas vistas) como proxy de lectura de más de una página. Solo campañas con 20+ sesiones registradas en GA4. Si una campaña no aparece aquí, GA4 no le atribuyó sesiones con ese nombre exacto (puede deberse a UTMs distintos o tráfico muy bajo).</div>
            <div style={{ overflowX: 'auto', marginTop: '8px' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '760px' }}>
                <thead>
                  <tr>{['Campaña', 'Fecha de creación', 'Clics en enlace (Meta)', 'Sesiones (GA4)', 'Rebote', '% sesiones +1 página (proxy)', 'Páginas / sesión'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ranked.map((c) => (
                    <tr key={c.id || c.name}>
                      <td style={{ ...td, textAlign: 'left', maxWidth: '340px', overflowWrap: 'anywhere', fontWeight: 600 }}>{c.name}</td>
                      <td style={td}>{c.createdTime || '—'}</td>
                      <td style={td}>{nf(c.linkClicks)}</td>
                      <td style={td}>{nf(c.ga4.sessions)}</td>
                      <td style={{ ...td, fontWeight: 700, color: c.ga4.bounceRate > 0.6 ? '#c62828' : '#222' }}>{(c.ga4.bounceRate * 100).toFixed(1)}%</td>
                      <td style={{ ...td, fontWeight: 700 }}>{(c.ga4.engagementRate * 100).toFixed(1)}%</td>
                      <td style={td}>{c.ga4.pagesPerSession.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.cardSubtext}>GA4 no reporta directamente "% de sesiones con más de una página vista"; usamos engagementRate (sesiones motivadas) como el proxy más cercano disponible en la API estándar.</div>
          </div>
        );
      })()}

      {/* Informe de pauta */}
      {data.pauta?.brands && (() => {
        const brandKey = activeTab;
        const brandName = activeTab === 'axxis' ? 'AXXIS' : 'Diners';
        const b = data.pauta.brands[brandKey];
        if (!b) return null;
        const cop = (v) => `$ ${Math.round(v).toLocaleString('es-CO')}`;
        const rel = (cur, prev) => (prev ? cur / prev - 1 : null);
        const cell = { padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px' };
        const num = { ...cell, textAlign: 'right' };
        const head = { padding: '8px', textAlign: 'right', fontSize: '11px', color: '#666', textTransform: 'uppercase' };
        const CLIENT = T.accent;
        const OWN = T.ink;
        const totalBrand = b.totals.spend;
        const clientBrand = b.cliente.totals.spend;
        const ownBrand = b.propia.totals.spend;
        const clientShare = totalBrand ? clientBrand / totalBrand : 0;

        const campaignTable = (list, limit) => (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: T.soft }}>
                  <th style={{ ...head, textAlign: 'left' }}>Campaña</th>
                  <th style={{ ...head, textAlign: 'left' }}>Fecha de creación</th>
                  <th style={{ ...head, textAlign: 'left' }}>Resultado</th>
                  <th style={head}>Inversión</th>
                  <th style={head}>% inv.</th>
                  <th style={head}>Impresiones</th>
                  <th style={head}>Alcance</th>
                  <th style={head}>Clics enlace</th>
                  <th style={head}>CTR</th>
                  <th style={head}>CPC</th>
                  <th style={head}>Resultados</th>
                  <th style={head}>Costo / resultado</th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, limit).map((c) => (
                  <tr key={c.id}>
                    <td style={{ ...cell, maxWidth: '280px' }}>{c.name}</td>
                    <td style={{ ...cell, textAlign: 'left' }}>{c.createdTime || '—'}</td>
                    <td style={cell}>{c.resultLabel}</td>
                    <td style={num}><strong>{cop(c.spend)}</strong></td>
                    <td style={num}>{(c.spendShare * 100).toFixed(1)}%</td>
                    <td style={num}>{nf(c.impressions)}</td>
                    <td style={num}>{nf(c.reach)}</td>
                    <td style={num}>{nf(c.linkClicks)}</td>
                    <td style={num}>{(c.ctr * 100).toFixed(2)}%</td>
                    <td style={num}>{c.linkClicks ? cop(c.cpc) : '\u2014'}</td>
                    <td style={num}>{nf(c.results)}</td>
                    <td style={num}>{c.costPerResult ? cop(c.costPerResult) : '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        const kpis = (grp) => {
          const t = grp.totals;
          const pt = grp.prevTotals;
          return (
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Inversión</div>
                <div style={styles.cardValue}>{cop(t.spend)}</div>
                {renderChange(rel(t.spend, pt.spend), false, cop(pt.spend))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Impresiones</div>
                <div style={styles.cardValue}>{nf(t.impressions)}</div>
                {renderChange(rel(t.impressions, pt.impressions), false, nf(pt.impressions))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(t.reach)}</div>
                {renderChange(rel(t.reach, pt.reach), false, nf(pt.reach))}
                <div style={styles.cardSubtext}>suma por campaña</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Clics en enlace</div>
                <div style={styles.cardValue}>{nf(t.linkClicks)}</div>
                {renderChange(rel(t.linkClicks, pt.linkClicks), false, nf(pt.linkClicks))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CTR (enlace)</div>
                <div style={styles.cardValue}>{(t.ctr * 100).toFixed(2)}%</div>
                {renderPP(t.ctr, pt.impressions ? pt.linkClicks / pt.impressions : null)}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CPC</div>
                <div style={styles.cardValue}>{t.linkClicks ? cop(t.cpc) : '\u2014'}</div>
                {renderChange(rel(t.cpc, pt.cpc), true, cop(pt.cpc))}
                <div style={styles.cardSubtext}>menor es mejor</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CPM</div>
                <div style={styles.cardValue}>{t.impressions ? cop(t.cpm) : '\u2014'}</div>
                {renderChange(rel(t.cpm, pt.cpm), true, cop(pt.cpm))}
                <div style={styles.cardSubtext}>menor es mejor</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Campañas con gasto</div>
                <div style={styles.cardValue}>{nf(t.campaigns)}</div>
                {renderChange(rel(t.campaigns, pt.campaigns), false, nf(pt.campaigns))}
              </div>
            </div>
          );
        };

        return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Informe de pauta · {brandName} · {rangeLabel}</h2>

            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '0 0 10px' }}>Quién financia la inversión en Meta</div>
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Inversión total {brandName}</div>
                <div style={styles.cardValue}>{cop(totalBrand)}</div>
                {renderChange(rel(totalBrand, b.prevTotals.spend), false, cop(b.prevTotals.spend))}
              </div>
              <div style={{ ...styles.card, borderTop: `4px solid ${CLIENT}` }}>
                <div style={styles.cardTitle}>Pauta de clientes (content, feria)</div>
                <div style={styles.cardValue}>{cop(clientBrand)}</div>
                {renderChange(rel(clientBrand, b.cliente.prevTotals.spend), false, cop(b.cliente.prevTotals.spend))}
                <div style={styles.cardSubtext}>{(clientShare * 100).toFixed(1)}% de la inversión de {brandName} · la pagan los clientes</div>
              </div>
              <div style={{ ...styles.card, borderTop: `4px solid ${OWN}` }}>
                <div style={styles.cardTitle}>Pauta propia (contenido general)</div>
                <div style={styles.cardValue}>{cop(ownBrand)}</div>
                {renderChange(rel(ownBrand, b.propia.prevTotals.spend), false, cop(b.propia.prevTotals.spend))}
                <div style={styles.cardSubtext}>{((1 - clientShare) * 100).toFixed(1)}% de la inversión de {brandName} · la asume Gamma</div>
              </div>
            </div>

            {(() => {
              const nm = brandName;
              const tt = totalBrand;
              const cs = clientBrand;
              const os = ownBrand;
              return (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Revista {nm} · inversión en Meta: clientes vs propia</div>
                  <div style={{ display: 'flex', height: '26px', borderRadius: '13px', overflow: 'hidden', background: '#eee', margin: '12px 0' }}>
                    <div title={`Clientes ${cop(cs)}`} style={{ width: `${tt ? (cs / tt) * 100 : 0}%`, background: CLIENT }} />
                    <div title={`Propia ${cop(os)}`} style={{ width: `${tt ? (os / tt) * 100 : 0}%`, background: OWN }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: CLIENT, marginRight: '6px' }} />Clientes (content, feria): <strong>{tt ? ((cs / tt) * 100).toFixed(1) : '0.0'}%</strong></span>
                    <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: OWN, marginRight: '6px' }} />Propia (general): <strong>{tt ? ((os / tt) * 100).toFixed(1) : '0.0'}%</strong></span>
                  </div>
                </div>
              );
            })()}

            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '30px 0 10px', color: CLIENT }}>Pauta de clientes · {brandName} (campañas con "content" o "feria" en el nombre)</div>
            {kpis(b.cliente)}
            <div style={styles.card}>
              <div style={styles.cardTitle}>Campañas de clientes por inversión (Top 15)</div>
              {b.cliente.campaigns.length ? campaignTable(b.cliente.campaigns, 15) : <div style={styles.cardSubtext}>Sin campañas de clientes en este periodo.</div>}
            </div>

            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '30px 0 10px', color: OWN }}>Pauta propia · {brandName} (contenido general, sin "content" ni "feria")</div>
            {kpis(b.propia)}
            <div style={styles.card}>
              <div style={styles.cardTitle}>Campañas propias por inversión (Top 15)</div>
              {campaignTable(b.propia.campaigns, 15)}
              <div style={styles.cardSubtext}>La marca se detecta por el nombre de la campaña y el tipo (cliente o propia) por las palabras "{(data.pauta.clientKeywords || []).join('", "')}". Si un cliente usa otra denominación, dímela y la agrego. "Resultado" depende del objetivo. Cuentas de anuncios de Meta: {data.pauta.accounts.join(', ')}.</div>
            </div>

            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '40px 0 10px', color: T.ink }}>Detalle de campañas de tráfico · {brandName}</div>
            {!traficoOpen ? (
              <div style={styles.card}>
                <div style={styles.cardSubtext}>Muestra los 10 anuncios de campañas de tráfico con más inversión: imagen, texto y métricas de comportamiento. Se carga aparte para no agotar el cupo de la API de Meta Ads.</div>
                <button onClick={() => setTraficoOpen(true)} style={{ marginTop: '12px', padding: '10px 18px', border: 'none', borderRadius: '4px', background: T.accent, color: 'white', fontWeight: 600, cursor: 'pointer' }}>Cargar detalle de anuncios</button>
              </div>
            ) : !trafico ? (
              <div style={{ ...styles.card, textAlign: 'center', padding: '30px', color: '#555' }}>Cargando anuncios…</div>
            ) : trafico.error ? (
              <div style={{ ...styles.card, color: '#b71c1c' }}>No se pudo cargar el detalle: {trafico.error}</div>
            ) : !trafico.ads?.length ? (
              <div style={styles.card}><div style={styles.cardSubtext}>Sin campañas de tráfico de {brandName} con gasto en este periodo.</div></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                {trafico.ads.map((ad) => {
                  const dash = '\u2014';
                  const m = (label, value) => (
                    <div style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{value}</div>
                    </div>
                  );
                  const pct = (v) => (v === null || v === undefined ? dash : `${(v * 100).toFixed(1)}%`);
                  return (
                    <div key={ad.id} style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                      {ad.image ? <img src={ad.image} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} /> : <div style={{ height: '120px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>Sin vista previa</div>}
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#777' }}>{ad.campaign} · {ad.isVideo ? 'Video' : 'Imagen'} · Inversión {cop(ad.spend)}</div>
                        {ad.headline && <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px' }}>{ad.headline}</div>}
                        <div style={{ fontSize: '13px', margin: '6px 0 12px', color: '#333', maxHeight: '90px', overflow: 'hidden' }}>{ad.text || <span style={{ color: '#999' }}>Sin texto descriptivo disponible</span>}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px' }}>
                          {m('Impresiones', nf(ad.impressions))}
                          {m('Alcance', nf(ad.reach))}
                          {m('Frecuencia', ad.frequency ? ad.frequency.toFixed(2) : dash)}
                          {m('CPM', ad.impressions ? cop(ad.cpm) : dash)}
                          {m('CPC', ad.linkClicks ? cop(ad.cpc) : dash)}
                          {m('Clics en enlace', nf(ad.linkClicks))}
                          {m('Visitas a la página de destino', ad.landingPageViews === null ? dash : nf(ad.landingPageViews))}
                          {m('Visitas al perfil', ad.profileVisits === null ? dash : nf(ad.profileVisits))}
                          {m('Seguimientos de Instagram', ad.igFollows === null ? dash : nf(ad.igFollows))}
                          {m('Reproducciones 3 s', ad.videoViews3s === null ? dash : nf(ad.videoViews3s))}
                          {m('Tiempo prom. reproducción', ad.avgWatchSeconds === null ? dash : `${ad.avgWatchSeconds.toFixed(1)} s`)}
                          {m('Retención 25/50/75/100%', ad.videoViews3s ? `${pct(ad.retention.p25)} · ${pct(ad.retention.p50)} · ${pct(ad.retention.p75)} · ${pct(ad.retention.p100)}` : dash)}
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', marginBottom: '4px' }}>Edad del público (% del alcance)</div>
                          {ad.age?.length ? ad.age.map((a) => (
                            <div key={a.age} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', marginBottom: '3px' }}>
                              <span style={{ width: '38px' }}>{a.age}</span>
                              <div style={{ flex: 1, background: T.soft, borderRadius: '3px', height: '10px' }}><div style={{ width: `${a.pct * 100}%`, background: T.accent2, height: '10px', borderRadius: '3px' }} /></div>
                              <span style={{ width: '38px', textAlign: 'right' }}>{(a.pct * 100).toFixed(1)}%</span>
                            </div>
                          )) : <span style={{ fontSize: '11px', color: '#999' }}>Sin datos de edad</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {trafico?.ads?.length > 0 && <div style={styles.cardSubtext}>Los campos de video (reproducciones 3 s, tiempo promedio, retención) solo existen en anuncios de video. "{'\u2014'}" significa que Meta no devolvió ese dato para el anuncio (por ejemplo visitas al perfil o seguimientos de Instagram, que solo aparecen en campañas con ese objetivo).</div>}
          </div>
        );
      })()}
      </>
      )}

      {ready && section === 'emails' && (() => {
        const E = current.emails;
        const TR = current.emailtraffic;
        const norm = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const rel0 = (a, b) => (b ? a / b - 1 : null);
        const trafficBlock = TR ? (() => {
          const share = TR.siteViews ? TR.views / TR.siteViews : 0;
          const prevShare = TR.prevSiteViews ? TR.prevViews / TR.prevSiteViews : null;
          const ppd = prevShare !== null ? (share - prevShare) * 100 : null;
          const sendLabels = new Set((E?.emails || []).filter((e) => isRealEmail(e) && e.sentAt).map((e) => { const d = new Date(e.sentAt); return `${d.getUTCDate()} ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][d.getUTCMonth()]}`; }));
          const maxDaily = Math.max(0, ...(TR.daily || []).map((d) => d.value));
          const campTotal = (TR.campaigns || []).reduce((a, c) => a + c.views, 0);
          return (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Vistas web desde email</div>
                  <div style={styles.cardValue}>{nf(TR.views)}</div>
                  {renderChange(rel0(TR.views, TR.prevViews), false, nf(TR.prevViews))}
                </div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Peso sobre las vistas del sitio</div>
                  <div style={styles.cardValue}>{(share * 100).toFixed(2)}%</div>
                  {ppd !== null && <div style={styles.change(ppd >= 0)}>{ppd >= 0 ? '\u2191' : '\u2193'} {Math.abs(ppd).toFixed(2)} pp vs mes anterior</div>}
                  {prevShare !== null && <div style={styles.cardSubtext}>Mes anterior: <strong>{(prevShare * 100).toFixed(2)}%</strong></div>}
                </div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Sesiones desde email</div>
                  <div style={styles.cardValue}>{nf(TR.sessions)}</div>
                  {renderChange(rel0(TR.sessions, TR.prevSessions), false, nf(TR.prevSessions))}
                </div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Usuarios desde email</div>
                  <div style={styles.cardValue}>{nf(TR.users)}</div>
                  {renderChange(rel0(TR.users, TR.prevUsers), false, nf(TR.prevUsers))}
                </div>
              </div>

              {((TR.byHour || []).length > 0 || (E?.emails || []).length > 0) && (() => {
                const DOWL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                const DOWF = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                const bog = (iso) => new Date(new Date(iso).getTime() - 5 * 3600000);
                const byDow = TR.byDow || [];
                const byHour = TR.byHour || [];
                const maxD = Math.max(0, ...byDow.map((d) => d.value));
                const maxH = Math.max(0, ...byHour.map((h) => h.value));
                const avgD = byDow.length ? byDow.reduce((a, d) => a + d.value, 0) / byDow.length : 0;
                const bestDay = byDow.find((d) => d.value === maxD);
                let bestWin = null;
                for (let i = 0; i + 2 < byHour.length; i += 1) {
                  const sum = byHour[i].value + byHour[i + 1].value + byHour[i + 2].value;
                  if (!bestWin || sum > bestWin.sum) bestWin = { i, sum };
                }
                const totalH = byHour.reduce((a, h) => a + h.value, 0);
                const sends = [...(E?.emails || []), ...(E?.prevEmails || [])].filter((e) => e.kind !== 'automated' && isRealEmail(e) && e.sentAt);
                const perDay = DOWL.map((label, d) => {
                  const l = sends.filter((e) => bog(e.sentAt).getUTCDay() === d);
                  const del = l.reduce((a, e) => a + e.delivered, 0);
                  const op = l.reduce((a, e) => a + e.open, 0);
                  const cl = l.reduce((a, e) => a + e.click, 0);
                  return { label, n: l.length, open: del ? op / del : 0, click: del ? cl / del : 0, ctor: op ? cl / op : 0 };
                });
                const order = [1, 2, 3, 4, 5, 6, 0].map((d) => perDay[d]);
                const reliable = order.filter((d) => d.n >= 2);
                const bestOpen = reliable.slice().sort((x, y) => y.open - x.open)[0];
                const bestClick = reliable.slice().sort((x, y) => y.click - x.click)[0];
                const BUCKETS = [['Mañana (05:00 a 11:59)', 5, 11], ['Tarde (12:00 a 17:59)', 12, 17], ['Noche (18:00 a 23:59)', 18, 23], ['Madrugada (00:00 a 04:59)', 0, 4]];
                const perBucket = BUCKETS.map(([label, lo, hi]) => {
                  const l = sends.filter((e) => { const h = bog(e.sentAt).getUTCHours(); return h >= lo && h <= hi; });
                  const del = l.reduce((a, e) => a + e.delivered, 0);
                  const op = l.reduce((a, e) => a + e.open, 0);
                  const cl = l.reduce((a, e) => a + e.click, 0);
                  return { label, lo, n: l.length, open: del ? op / del : 0, click: del ? cl / del : 0, ctor: op ? cl / op : 0 };
                }).filter((b) => b.n > 0);
                const bkReliable = perBucket.filter((b) => b.n >= 2);
                const bestBkOpen = bkReliable.slice().sort((x, y) => y.open - x.open)[0];
                const bestBkClick = bkReliable.slice().sort((x, y) => y.click - x.click)[0];
                const hh = (h) => `${String(h).padStart(2, '0')}:00`;
                const tips = [];
                if (bestDay && maxD) tips.push(`El ${DOWF[DOWL.indexOf(bestDay.label)]} es el día en que más vistas web llegan desde email: ${nf(maxD)} por día en promedio, ${avgD ? Math.round((maxD / avgD - 1) * 100) : 0}% sobre el promedio de la semana.`);
                if (bestWin && totalH) tips.push(`La franja de mayor lectura es de ${hh(bestWin.i)} a ${hh(bestWin.i + 3)}: concentra ${Math.round((bestWin.sum / totalH) * 100)}% de las vistas desde email.`);
                if (bestOpen) tips.push(`Por día de envío, los ${DOWF[DOWL.indexOf(bestOpen.label)]} tienen la mejor apertura (${(bestOpen.open * 100).toFixed(1)}%, ${bestOpen.n} envíos)${bestClick && bestClick.label !== bestOpen.label ? ` y los ${DOWF[DOWL.indexOf(bestClick.label)]} los mejores clics (${(bestClick.click * 100).toFixed(2)}%)` : bestClick ? ` y también los mejores clics (${(bestClick.click * 100).toFixed(2)}%)` : ''}.`);
                if (perBucket.length > 1) tips.push(`Los envíos salen en ${perBucket.length} franjas (${perBucket.map((b) => `${b.label.split(' ')[0].toLowerCase()}: ${b.n}`).join(', ')}). ${bestBkOpen ? `La franja de ${bestBkOpen.label.split(' ')[0].toLowerCase()} logra la mejor apertura (${(bestBkOpen.open * 100).toFixed(1)}%)` : 'Aún hay pocos envíos por franja para comparar'}${bestBkClick && bestBkOpen ? (bestBkClick.label === bestBkOpen.label ? ' y también los mejores clics.' : ` y la de ${bestBkClick.label.split(' ')[0].toLowerCase()} los mejores clics (${(bestBkClick.click * 100).toFixed(2)}%).`) : '.'}`);
                else if (perBucket.length === 1 && bestWin) tips.push(`Todos los envíos salen en la franja de ${perBucket[0].label.split(' ')[0].toLowerCase()}, mientras la lectura llega sobre todo de ${hh(bestWin.i)} a ${hh(bestWin.i + 3)}. Conviene probar otra franja.`);
                if (!reliable.length && sends.length) tips.push('Aún hay pocos envíos por día de la semana para comparar aperturas: cada día necesita al menos 2 envíos.');
                return (
                  <>
                    <div style={{ ...styles.card, marginTop: '20px', background: '#f5f1e6' }}>
                      <div style={styles.cardTitle}>Mejores días y horas para enviar</div>
                      <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: 1.6 }}>{tips.map((t, k) => <li key={k}>{t}</li>)}</ul>
                      <div style={styles.cardSubtext}>Lectura y llegada a la web: GA4, canal Email, {rangeLabel} y el periodo anterior juntos. Apertura y clics: HubSpot, por día de envío, horario Colombia. Es una guía: con pocos envíos por día conviene probar antes de fijar un horario.</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px', marginTop: '20px' }}>
                      {byDow.length > 0 && (
                        <div style={styles.card}>
                          <div style={styles.cardTitle}>Vistas web desde email por día de la semana (promedio por día)</div>
                          <div style={{ width: '100%', height: 260, marginTop: '12px' }}>
                            <ResponsiveContainer>
                              <BarChart data={byDow} margin={{ top: 22, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 10 }} width={40} />
                                <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                                <Bar dataKey="value" name="Vistas por día">
                                  {byDow.map((d) => <Cell key={d.label} fill={d.value === maxD ? T.highlight : T.accent} />)}
                                  <LabelList dataKey="value" position="top" formatter={(v) => nf(v)} style={{ fontSize: 10, fill: '#444' }} />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                      {byHour.length > 0 && (
                        <div style={styles.card}>
                          <div style={styles.cardTitle}>Vistas web desde email por hora del día</div>
                          <div style={{ width: '100%', height: 260, marginTop: '12px' }}>
                            <ResponsiveContainer>
                              <BarChart data={byHour} margin={{ top: 22, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                                <YAxis tick={{ fontSize: 10 }} width={40} />
                                <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                                <Bar dataKey="value" name="Vistas">
                                  {byHour.map((h) => <Cell key={h.hour} fill={h.value === maxH && maxH > 0 ? T.highlight : T.accent} />)}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                    {sends.length > 0 && (
                      <div style={{ ...styles.card, marginTop: '20px' }}>
                        <div style={styles.cardTitle}>Rendimiento de los envíos por día de envío</div>
                        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '8px' }}>
                          <thead>
                            <tr>{['Día', 'Envíos', 'Apertura', 'Clics', 'CTOR'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {order.filter((d) => d.n > 0).map((d) => {
                              const isOpen = bestOpen && bestOpen.label === d.label;
                              const isClick = bestClick && bestClick.label === d.label;
                              const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
                              return (
                                <tr key={d.label}>
                                  <td style={{ ...td, textAlign: 'left', fontWeight: 700 }}>{DOWF[DOWL.indexOf(d.label)]}</td>
                                  <td style={{ ...td, color: d.n < 2 ? '#c62828' : '#222' }}>{d.n}{d.n < 2 ? ' (muestra baja)' : ''}</td>
                                  <td style={{ ...td, fontWeight: isOpen ? 800 : 400, background: isOpen ? '#fff6ee' : 'transparent' }}>{(d.open * 100).toFixed(1)}%</td>
                                  <td style={{ ...td, fontWeight: isClick ? 800 : 400, background: isClick ? '#fff6ee' : 'transparent' }}>{(d.click * 100).toFixed(2)}%</td>
                                  <td style={td}>{(d.ctor * 100).toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div style={styles.cardSubtext}>Envíos de {rangeLabel} y del periodo anterior (sin automáticos ni pruebas). Se marca en naranja el mejor día solo entre los que tienen 2 o más envíos.</div>
                      </div>
                    )}
                    {perBucket.length > 0 && (
                      <div style={{ ...styles.card, marginTop: '20px' }}>
                        <div style={styles.cardTitle}>Rendimiento de los envíos por franja horaria de envío (hora Colombia)</div>
                        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '8px' }}>
                          <thead>
                            <tr>{['Franja', 'Envíos', 'Apertura', 'Clics', 'CTOR'].map((h, k) => <th key={h} style={{ textAlign: k ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {perBucket.map((b) => {
                              const isOpen = bestBkOpen && bestBkOpen.label === b.label;
                              const isClick = bestBkClick && bestBkClick.label === b.label;
                              const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
                              return (
                                <tr key={b.label}>
                                  <td style={{ ...td, textAlign: 'left', fontWeight: 700 }}>{b.label}</td>
                                  <td style={{ ...td, color: b.n < 2 ? '#c62828' : '#222' }}>{b.n}{b.n < 2 ? ' (muestra baja)' : ''}</td>
                                  <td style={{ ...td, fontWeight: isOpen ? 800 : 400, background: isOpen ? '#fff6ee' : 'transparent' }}>{(b.open * 100).toFixed(1)}%</td>
                                  <td style={{ ...td, fontWeight: isClick ? 800 : 400, background: isClick ? '#fff6ee' : 'transparent' }}>{(b.click * 100).toFixed(2)}%</td>
                                  <td style={td}>{(b.ctor * 100).toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                );
              })()}

              {(() => {
                const daily = TR.daily || [];
                const val = {};
                daily.forEach((d) => { val[d.date] = d.value; });
                const key = (iso) => iso.slice(0, 10).replace(/-/g, '');
                const addDays = (k, n) => { const d = new Date(Date.UTC(+k.slice(0, 4), +k.slice(4, 6) - 1, +k.slice(6))); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10).replace(/-/g, ''); };
                const sends = (E?.emails || []).filter((e) => e.kind !== 'automated' && isRealEmail(e) && e.sentAt);
                const sendKeys = sends.map((e) => key(e.sentAt));
                const windowKeys = new Set(sendKeys.flatMap((k) => [k, addDays(k, 1)]));
                const base = daily.filter((d) => !windowKeys.has(d.date));
                const baseline = base.length ? base.reduce((a, d) => a + d.value, 0) / base.length : 0;
                const rows = sends.map((e) => {
                  const k = key(e.sentAt);
                  const web = (val[k] || 0) + (val[addDays(k, 1)] || 0);
                  const extra = web - 2 * baseline;
                  return { e, web, extra, mult: baseline ? web / (2 * baseline) : 0, per1000: e.delivered ? (Math.max(extra, 0) / e.delivered) * 1000 : 0 };
                }).sort((x, y) => y.extra - x.extra);
                const totalDelivered = (E?.emails || []).filter(isRealEmail).reduce((a, e) => a + e.delivered, 0);
                const identified = (TR.campaigns || []).filter((c) => c.name !== '(not set)').reduce((a, c) => a + c.views, 0);
                const identPct = TR.views ? identified / TR.views : 0;
                const totalSrc = (TR.sources || []).reduce((a, x) => a + x.views, 0);
                const topSrc = (TR.sources || [])[0];
                const Q = TR.quality;
                const avgExtra = rows.length ? rows.reduce((a, r) => a + Math.max(r.extra, 0), 0) / rows.length : 0;
                const bestRow = rows[0];
                const insights = [];
                if (rows.length && baseline) insights.push(`Un día normal el sitio recibe unas ${Math.round(baseline)} vistas desde email; cada envío suma en promedio ${Math.round(avgExtra).toLocaleString('es-CO')} vistas extra en el día del envío y el siguiente.`);
                if (bestRow && bestRow.extra > 0) insights.push(`El envío que más tráfico llevó fue "${bestRow.e.subject || bestRow.e.name}": ${Math.round(bestRow.extra).toLocaleString('es-CO')} vistas extra (x${bestRow.mult.toFixed(1)} sobre un día normal).`);
                if (totalDelivered && TR.views) insights.push(`Por cada 1.000 emails entregados llegan unas ${((TR.views / totalDelivered) * 1000).toFixed(0)} vistas web desde el canal Email.`);
                if (Q?.email && Q?.site) insights.push(`Quienes llegan por email ${Q.email.sec >= Q.site.sec ? 'leen más' : 'leen menos'} que el promedio del sitio: ${fmtHMS(Q.email.sec)} frente a ${fmtHMS(Q.site.sec)}, con rebote de ${(Q.email.bounce * 100).toFixed(0)}% frente a ${(Q.site.bounce * 100).toFixed(0)}%.`);
                if (TR.views) insights.push(`Solo el ${(identPct * 100).toFixed(0)}% del tráfico de email trae campaña identificada. Sin utm_campaign no se puede atribuir el resto a un envío específico.`);
                if (topSrc && totalSrc) insights.push(`${((topSrc.views / totalSrc) * 100).toFixed(0)}% del tráfico de email viene de "${topSrc.name}"${(TR.sources || []).length > 1 ? `; el resto llega desde otras plataformas de envío (${(TR.sources || []).slice(1, 3).map((x) => x.name).join(', ')}).` : '.'}`);
                const pagesTotal = (TR.pages || []).reduce((a, p) => a + p.views, 0);
                return (
                  <>
                    {insights.length > 0 && (
                      <div style={{ ...styles.card, marginTop: '20px', background: '#f5f1e6' }}>
                        <div style={styles.cardTitle}>Lo que dicen los datos</div>
                        <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: 1.6 }}>
                          {insights.map((t, k) => <li key={k}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {rows.length > 0 && (
                      <div style={{ ...styles.card, marginTop: '20px' }}>
                        <div style={styles.cardTitle}>Qué trae cada envío a la web</div>
                        <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '640px' }}>
                            <thead>
                              <tr>
                                {['Envío', 'Fecha', 'Entregados', 'Vistas web (día + siguiente)', 'Vistas extra', 'Vs día normal', 'Extra por 1.000 entregados'].map((h, k) => (
                                  <th key={h} style={{ textAlign: k > 2 ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((r, k) => {
                                const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
                                return (
                                  <tr key={r.e.id} style={{ background: k === 0 ? '#fff6ee' : 'transparent' }}>
                                    <td style={{ ...td, textAlign: 'left' }}><div style={{ fontWeight: 700 }}>{r.e.subject || r.e.name}</div><div style={{ fontSize: '11px', color: '#888' }}>{r.e.name}{k === 0 ? <span style={{ marginLeft: '6px', background: T.highlight, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>MÁS TRÁFICO</span> : null}</div></td>
                                    <td style={{ ...td, textAlign: 'left', whiteSpace: 'nowrap' }}>{new Date(r.e.sentAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</td>
                                    <td style={td}>{nf(r.e.delivered)}</td>
                                    <td style={td}>{nf(r.web)}</td>
                                    <td style={{ ...td, fontWeight: 700, color: r.extra >= 0 ? '#2e7d32' : '#c62828' }}>{r.extra >= 0 ? '+' : ''}{Math.round(r.extra).toLocaleString('es-CO')}</td>
                                    <td style={td}>x{r.mult.toFixed(1)}</td>
                                    <td style={td}>{r.per1000.toFixed(1)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div style={styles.cardSubtext}>Vistas extra = vistas desde email el día del envío y el siguiente, menos lo que el canal recibe en un día normal ({Math.round(baseline)} vistas/día). Es una estimación que no depende de utm_campaign.</div>
                      </div>
                    )}
                    {((TR.articles || []).length > 0 || (TR.pages || []).length > 0) && (() => {
                      const arts = TR.articles || [];
                      const total = TR.articleTotal || arts.reduce((x, a) => x + a.views, 0);
                      const fmtDate = (iso) => (iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '\u2014');
                      return (
                        <div style={{ ...styles.card, marginTop: '20px' }}>
                          <div style={styles.cardTitle}>Artículos más leídos desde email · {rangeLabel}</div>
                          {arts.length > 0 ? (
                            <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '720px' }}>
                                <thead>
                                  <tr>{['#', 'Artículo', 'Sección', 'Publicado', 'Vistas', '% de artículos', 'Entradas'].map((h, k) => <th key={h} style={{ textAlign: k > 3 ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {arts.map((a, k) => (
                                    <tr key={a.path} style={{ background: k === 0 ? '#fff6ee' : 'transparent' }}>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', fontWeight: 800, color: k < 3 ? T.accent : '#888' }}>{k + 1}</td>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee' }}>
                                        <div style={{ fontWeight: 700 }}>{a.title || a.path}</div>
                                        {a.title && <div style={{ fontSize: '11px', color: '#888', overflowWrap: 'anywhere' }}>{a.path}</div>}
                                      </td>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', textTransform: 'capitalize' }}>{a.topic}</td>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{fmtDate(a.date)}</td>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 700 }}>{nf(a.views)}</td>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{total ? ((a.views / total) * 100).toFixed(1) : 0}%</td>
                                      <td style={{ padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{nf(a.entries)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                          {(TR.otherPages || []).length > 0 && (
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#444' }}>
                              <strong>Otras páginas muy visitadas (no son artículos):</strong>{' '}
                              {TR.otherPages.map((p, k) => <span key={p.path}>{k ? ' · ' : ''}{p.path === '/' ? 'Portada' : p.path} <strong>{nf(p.views)}</strong></span>)}
                            </div>
                          )}
                          <div style={styles.cardSubtext}>Vistas: veces que se abrió el artículo en sesiones que llegaron por el canal Email. Entradas: sesiones que empezaron directamente en ese artículo. Los títulos y fechas salen del sitio.</div>
                        </div>
                      );
                    })()}
                    {((TR.secondClicks || []).length > 0 || (TR.flows || []).length > 0) && (() => {
                      const destList = (TR.secondClicks || []).slice(0, 6).map((x) => [x.path, x.views]);
                      const destTotal = TR.secondTotal || destList.reduce((a, x) => a + x[1], 0);
                      const label = (p) => (p === '/' ? 'Home (portada)' : p);
                      return (
                        <div style={{ ...styles.card, marginTop: '20px' }}>
                          <div style={styles.cardTitle}>Segundo clic: a dónde van después de la primera página</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', marginTop: '10px', alignItems: 'start' }}>
                            <div>
                              <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Páginas más vistas después de la primera ({nf(destTotal)} vistas en total)</div>
                              {destList.map(([path, v], k) => (
                                <div key={path} style={{ marginTop: '10px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ overflowWrap: 'anywhere' }}>{label(path)}</span><strong>{nf(v)} · {destTotal ? ((v / destTotal) * 100).toFixed(0) : 0}%</strong></div>
                                  <div style={{ background: T.soft, borderRadius: '4px', height: '8px', marginTop: '3px' }}><div style={{ width: `${destTotal ? (v / destTotal) * 100 : 0}%`, background: k === 0 ? T.highlight : T.accent, height: '8px', borderRadius: '4px' }} /></div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ ...styles.cardTitle, fontSize: '11px' }}>Recorridos más comunes</div>
                              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '6px' }}>
                                <tbody>
                                  {TR.flows.slice(0, 6).map((f) => (
                                    <tr key={`${f.from}>${f.to}`}>
                                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #eee', overflowWrap: 'anywhere' }}>{label(f.from)} <span style={{ color: '#888' }}>{'\u2192'}</span> <strong>{label(f.to)}</strong></td>
                                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 700 }}>{nf(f.views)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div style={styles.cardSubtext}>Páginas vistas en sesiones que empezaron por email, sin contar la página de entrada (vistas de la página menos las sesiones que aterrizaron ahí). Los recorridos son una muestra de los más repetidos, sin el archivo de notificaciones push.</div>
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </>
          );
        })() : null;
        if (!E) {
          return (
            <>
              <h2 style={styles.sectionTitle}>Emails · aporte a la web · {rangeLabel}</h2>
              {trafficBlock}
              <div style={{ ...styles.card, color: '#555', marginTop: '20px' }}>Las métricas de envío (aperturas, clics, bajas) requieren el token de HubSpot configurado en Vercel. Revisa el mensaje de error de arriba.</div>
            </>
          );
        }
        const webViewsFor = (e) => {
          const keys = [norm(e.name), norm(e.subject)].filter((k) => k.length >= 6);
          const hit = (TR?.campaigns || []).find((c) => { const cn = norm(c.name); return cn.length >= 6 && keys.some((k) => k.includes(cn) || cn.includes(k)); });
          if (hit) return hit.views;
          const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          if (!e.sentAt || e.kind === 'automated') return null;
          const d = new Date(e.sentAt);
          const byDate = (TR?.campaigns || []).find((c) => {
            const m = /^(\d{4})\s+([A-Za-zÁÉÍÓÚáéíóú]+)\s+(\d{1,2})\b/.exec(c.name);
            return m && Number(m[1]) === d.getUTCFullYear() && MESES.indexOf(m[2].toLowerCase()) === d.getUTCMonth() && Number(m[3]) === d.getUTCDate();
          });
          return byDate ? byDate.views : null;
        };
        const sum = (list, k) => (list || []).reduce((a, e) => a + (e[k] || 0), 0);
        const agg = (list) => {
          const sent = sum(list, 'sent'); const delivered = sum(list, 'delivered'); const open = sum(list, 'open');
          const click = sum(list, 'click'); const unsub = sum(list, 'unsubscribed'); const bounce = sum(list, 'bounce');
          return { sent, delivered, open, click, unsub, bounce, openRate: delivered ? open / delivered : 0, clickRate: delivered ? click / delivered : 0, ctor: open ? click / open : 0, unsubRate: delivered ? unsub / delivered : 0, bounceRate: sent ? bounce / sent : 0 };
        };
        const cur = agg((E.emails || []).filter((e) => isRealEmail(e)));
        const prv = agg((E.prevEmails || []).filter((e) => isRealEmail(e)));
        const hasPrev = (E.prevEmails || []).length > 0;
        const rel = (a, b) => (b ? a / b - 1 : null);
        const pc = (v, d = 1) => `${(v * 100).toFixed(d)}%`;
        const tile = (title, value, change, prevText, lowerBetter) => (
          <div style={styles.card}>
            <div style={styles.cardTitle}>{title}</div>
            <div style={styles.cardValue}>{value}</div>
            {hasPrev ? renderChange(change, lowerBetter, prevText) : null}
          </div>
        );
        const sorted = [...(E.emails || [])].filter((e) => isRealEmail(e)).sort((a, b) => new Date(a.sentAt || 0) - new Date(b.sentAt || 0));
        const batchOnly = sorted.filter((e) => e.kind !== 'automated');
        const chartData = batchOnly.map((e) => ({
          label: e.sentAt ? `${new Date(e.sentAt).getUTCDate()} ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][new Date(e.sentAt).getUTCMonth()]}` : e.name.slice(0, 12),
          Apertura: e.delivered ? e.open / e.delivered : 0,
          Clics: e.delivered ? e.click / e.delivered : 0,
        }));
        const rate = (e, k) => (e.delivered ? e[k] / e.delivered : 0);
        const maxOpenR = Math.max(0.0001, ...batchOnly.map((e) => rate(e, 'open')));
        const maxClickR = Math.max(0.0001, ...batchOnly.map((e) => rate(e, 'click')));
        const score = (e) => (rate(e, 'open') / maxOpenR + rate(e, 'click') / maxClickR) / 2;
        const ranked = [...batchOnly].sort((a, b) => score(b) - score(a)).concat(sorted.filter((e) => e.kind === 'automated').sort((a, b) => score(b) - score(a)));
        const best = batchOnly.slice().sort((a, b) => (b.delivered ? b.click / b.delivered : 0) - (a.delivered ? a.click / a.delivered : 0))[0];
        return (
          <>
            <h2 style={styles.sectionTitle}>Emails · HubSpot · {rangeLabel}</h2>
            {sorted.length === 0 ? (
              <div style={{ ...styles.card, color: '#555' }}>No hay emails de {activeTab === 'axxis' ? 'AXXIS' : 'Diners'} enviados en este periodo. Las marcas se identifican porque el nombre o el asunto del email contiene "{activeTab === 'axxis' ? 'AXXIS' : 'Diners'}".</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
                  {tile('Enviados', nf(cur.sent), rel(cur.sent, prv.sent), nf(prv.sent))}
                  {tile('Entregados', nf(cur.delivered), rel(cur.delivered, prv.delivered), nf(prv.delivered))}
                  {tile('Tasa de apertura', pc(cur.openRate), rel(cur.openRate, prv.openRate), pc(prv.openRate))}
                  {tile('Tasa de clics', pc(cur.clickRate, 2), rel(cur.clickRate, prv.clickRate), pc(prv.clickRate, 2))}
                  {tile('Clics sobre aperturas (CTOR)', pc(cur.ctor), rel(cur.ctor, prv.ctor), pc(prv.ctor))}
                  {tile('Bajas', pc(cur.unsubRate, 2), rel(cur.unsubRate, prv.unsubRate), pc(prv.unsubRate, 2), true)}
                </div>

                {TR && <div style={{ ...styles.sectionTitle, fontSize: '16px', margin: '30px 0 12px' }}>Aporte a la web · tráfico desde email</div>}
                {trafficBlock}

                <div style={{ ...styles.card, marginTop: '20px' }}>
                  <div style={styles.cardTitle}>Detalle de envíos</div>
                  <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', minWidth: '800px' }}>
                      <thead>
                        <tr>
                          {['#', 'Fecha', 'Email', 'Enviados', 'Apertura', 'Clics', 'CTOR', 'Bajas', 'Vistas web'].map((h, k) => (
                            <th key={h} style={{ textAlign: k > 2 ? 'right' : 'left', padding: '8px 6px', borderBottom: '2px solid #ddd', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ranked.map((e, idx) => {
                          const or = e.delivered ? e.open / e.delivered : 0;
                          const cr = e.delivered ? e.click / e.delivered : 0;
                          const co = e.open ? e.click / e.open : 0;
                          const ur = e.delivered ? e.unsubscribed / e.delivered : 0;
                          const td = { padding: '8px 6px', borderBottom: '1px solid #eee', textAlign: 'right' };
                          return (
                            <tr key={e.id} style={{ background: best && best.id === e.id ? '#fff6ee' : 'transparent' }}>
                              <td style={{ ...td, textAlign: 'left', fontWeight: 800, color: idx < 3 && e.kind !== 'automated' ? T.accent : '#888' }}>{e.kind === 'automated' ? '\u2014' : idx + 1}</td>
                              <td style={{ ...td, textAlign: 'left', whiteSpace: 'nowrap' }}>{e.kind === 'automated' ? 'Automático' : (e.sentAt ? <><div>{new Date(e.sentAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</div><div style={{ fontSize: '11px', color: '#888' }}>{['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][new Date(new Date(e.sentAt).getTime() - 5 * 3600000).getUTCDay()]} {String(new Date(new Date(e.sentAt).getTime() - 5 * 3600000).getUTCHours()).padStart(2, '0')}:{String(new Date(e.sentAt).getUTCMinutes()).padStart(2, '0')}</div></> : '\u2014')}</td>
                              <td style={{ ...td, textAlign: 'left' }}>
                                <div style={{ fontWeight: 700 }}>{e.subject || e.name}</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>{e.name}{best && best.id === e.id ? <span style={{ marginLeft: '6px', background: T.highlight, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>MEJOR RENDIMIENTO</span> : null}</div>
                              </td>
                              <td style={td}>{nf(e.sent)}</td>
                              <td style={{ ...td, fontWeight: 700 }}>{pc(or)}</td>
                              <td style={{ ...td, fontWeight: 700 }}>{pc(cr, 2)}</td>
                              <td style={td}>{pc(co)}</td>
                              <td style={td}>{pc(ur, 2)}</td>
                              <td style={{ ...td, fontWeight: 700 }}>{webViewsFor(e) === null ? '\u2014' : nf(webViewsFor(e))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={styles.cardSubtext}>Ordenado de mejor a peor rendimiento: promedia la tasa de apertura y la de clics de cada envío, cada una medida frente al mejor envío del periodo. Los automáticos van al final. Apertura y clics sobre entregados; CTOR = clics sobre aperturas. La marca se asigna por el nombre o asunto del email ("AXXIS" o "Diners"). "Vistas web" se asigna cuando el nombre de la campaña (utm_campaign) coincide con el nombre o asunto del email. Las aperturas pueden estar infladas por la protección de privacidad de Apple Mail.</div>
                </div>
              </>
            )}
          </>
        );
      })()}

      {!ready && (
        <div style={{ ...styles.card, textAlign: 'center', padding: '40px', color: '#555' }}>
          {loading ? `Cargando ${sectionDef.label}…` : `No se pudo cargar ${sectionDef.label}. Revisa los avisos de arriba.`}
        </div>
      )}
    </div>
  );
}
