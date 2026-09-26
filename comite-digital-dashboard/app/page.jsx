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

const SECTIONS = [
  { key: 'resumen', label: 'Resumen', apis: ['ga4', 'meta', 'pauta'] },
  { key: 'web', label: 'Web', apis: ['ga4', 'gsc'] },
  { key: 'seo', label: 'SEO', apis: ['gsc', 'seo'] },
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
const API_NAMES = { gsc: 'Search Console', ga4: 'GA4', meta: 'Meta', seo: 'SEO', pauta: 'Pauta', emails: 'Emails', emailtraffic: 'Tráfico de email' };

export default function Dashboard() {
  const [data, setData] = useState({ gsc: {}, ga4: {}, meta: {}, seo: {}, pauta: {}, emails: {}, emailtraffic: {} });
  const [errorsBy, setErrorsBy] = useState({});
  const [loadedKey, setLoadedKey] = useState({});
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState('web');
  const [activeTab, setActiveTab] = useState('axxis');
  const [range, setRange] = useState(null);
  const [draft, setDraft] = useState({ start: '', end: '' });
  const [trends, setTrends] = useState(null);
  const [trendDays, setTrendDays] = useState(30);
  const [traficoOpen, setTraficoOpen] = useState(false);
  const [trafico, setTrafico] = useState(null);
  const rangeKey = range ? `${range.start}|${range.end}` : 'default';
  const sectionDef = SECTIONS.find((x) => x.key === section);
  const ready = sectionDef.apis.every((a) => loadedKey[a] === rangeKey);

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
      if (!force && loadedKey[api] === rangeKey) return;
      const mock = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mock') === '1';
      const qs = [range && `start=${range.start}&end=${range.end}`, mock && 'mock=1'].filter(Boolean).join('&');
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
        setLoadedKey((k) => ({ ...k, [api]: rangeKey }));
      } catch (e) {
        if (cancelled) return;
        setErrorsBy((er) => ({ ...er, [api]: [`${API_NAMES[api]}: ${e.message}`] }));
        setLoadedKey((k) => ({ ...k, [api]: rangeKey }));
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
  const rangeLabel = data.ga4?.range?.label || data.gsc?.range?.label || data.seo?.range?.label || data.meta?.range?.label || data.pauta?.range?.label || '';
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
          {presetOptions().map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" value={draft.start || data.ga4?.range?.start || ''} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDraft({ ...draft, start: e.target.value, end: draft.end || data.ga4?.range?.end || '' })} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <span>a</span>
        <input type="date" value={draft.end || data.ga4?.range?.end || ''} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDraft({ ...draft, end: e.target.value, start: draft.start || data.ga4?.range?.start || '' })} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginTop: '10px' }}>
                          {aiCh && kpi('Vistas desde IA', nf(aiCh.views), <>{renderChange(chg, false, aiCh.prevViews ? nf(aiCh.prevViews) : null)}</>)}
                          {aiCh && totV > 0 && kpi('Peso sobre las vistas del sitio', `${((aiCh.views / totV) * 100).toFixed(2)}%`, <div style={styles.cardSubtext}>{nf(aiCh.sessions)} sesiones · {nf(aiCh.users)} usuarios</div>)}
                          {topSrc && kpi('Asistente principal', topSrc.name, <div style={styles.cardSubtext}>{srcTotal ? ((topSrc.views / srcTotal) * 100).toFixed(0) : 0}% de las vistas de IA</div>)}
                          {Q?.ai && Q?.organic && kpi('Duración vs búsqueda', `${Q.ai.sec >= Q.organic.sec ? '\u25B2' : '\u25BC'} ${Math.abs((Q.ai.sec / Q.organic.sec - 1) * 100).toFixed(0)}%`, <div style={styles.cardSubtext}>IA {fmtHMS(Q.ai.sec)} · búsqueda {fmtHMS(Q.organic.sec)}</div>)}
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
                      <Bar dataKey="sesiones" name="Sesiones" fill="#333333" legendType="square" />
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
      {/* GSC */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Google Search Console</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Clics</div>
            <div style={styles.cardValue}>{nf(current.gsc?.clicks)}</div>
            <div style={styles.cardSubtext}>{rangeLabel}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Impresiones</div>
            <div style={styles.cardValue}>{nf(current.gsc?.impressions)}</div>
            <div style={styles.cardSubtext}>{rangeLabel}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>CTR Promedio</div>
            <div style={styles.cardValue}>{current.gsc?.ctr ? (current.gsc.ctr * 100).toFixed(2) : 0}%</div>
            <div style={styles.cardSubtext}>tasa de clics</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Posición Promedio</div>
            <div style={styles.cardValue}>{current.gsc?.position?.toFixed(1) || 0}</div>
            <div style={styles.cardSubtext}>en búsquedas</div>
          </div>
        </div>
      </div>

      {/* Rendimiento SEO */}
      {current.seo && (() => {
        const seo = current.seo;
        const cell = { padding: '8px', borderBottom: '1px solid #eee', fontSize: '12px' };
        const num = { ...cell, textAlign: 'right' };
        const head = { padding: '8px', textAlign: 'right', fontSize: '11px', color: '#666', textTransform: 'uppercase' };
        const table = (rows, keyLabel) => (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
            <thead>
              <tr style={{ background: T.soft }}>
                <th style={{ ...head, textAlign: 'left' }}>{keyLabel}</th>
                <th style={head}>Clics</th>
                <th style={head}>Impresiones</th>
                <th style={head}>CTR</th>
                <th style={head}>Posición</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, k) => (
                <tr key={r.key + k}>
                  <td style={{ ...cell, wordBreak: 'break-all' }}><span style={{ color: '#999' }}>{k + 1}.</span> {r.key}</td>
                  <td style={num}><strong>{nf(r.clicks)}</strong></td>
                  <td style={num}>{nf(r.impressions)}</td>
                  <td style={num}>{(r.ctr * 100).toFixed(1)}%</td>
                  <td style={num}>{r.position.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Rendimiento SEO · {rangeLabel}</h2>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Rendimiento orgánico por páginas (Top 10)</div>
              {table(seo.pages, 'Página')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Consultas orgánicas según posición (Top 10 mejor posicionadas)</div>
                {table(seo.byPosition, 'Consulta')}
                <div style={styles.cardSubtext}>Consultas con al menos 100 impresiones, ordenadas por posición promedio.</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Distribución de consultas por posición</div>
                <div style={{ width: '100%', height: 260, marginTop: '12px' }}>
                  <ResponsiveContainer>
                    <BarChart data={seo.buckets} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                      <Bar dataKey="queries" name="Consultas" fill={T.accent}>
                        <LabelList dataKey="queries" position="top" formatter={(v) => v.toLocaleString('es-CO')} style={{ fontSize: 11 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={styles.cardSubtext}>{nf(seo.totalQueries)} consultas con impresiones{seo.truncated ? ' (tope de 25.000 de Search Console)' : ''}. Clics por rango: {seo.buckets.map((b) => `${b.label.replace('Posición ', '')}: ${nf(b.clicks)}`).join(' · ')}</div>
              </div>
            </div>

            <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '30px 0 10px' }}>Insumos para contenido editorial (sin consultas de marca)</div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Temas que rinden por encima de la media (Top 10)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                <thead>
                  <tr style={{ background: T.soft }}>
                    <th style={{ ...head, textAlign: 'left' }}>Tema</th>
                    <th style={head}>Clics</th>
                    <th style={head}>Impresiones</th>
                    <th style={head}>CTR</th>
                    <th style={head}>vs media</th>
                    <th style={head}>Posición</th>
                  </tr>
                </thead>
                <tbody>
                  {seo.topics.map((t, k) => (
                    <tr key={t.term}>
                      <td style={cell}><span style={{ color: '#999' }}>{k + 1}.</span> {t.term}</td>
                      <td style={num}><strong>{nf(t.clicks)}</strong></td>
                      <td style={num}>{nf(t.impressions)}</td>
                      <td style={num}>{(t.ctr * 100).toFixed(1)}%</td>
                      <td style={{ ...num, color: '#2e7d32', fontWeight: 700 }}>{t.vsAvg.toFixed(1)}x</td>
                      <td style={num}>{t.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={styles.cardSubtext}>Temas = palabras y pares de palabras agrupadas de consultas sin marca. Solo entran los que superan el CTR promedio editorial ({(seo.topicsAvgCtr * 100).toFixed(2)}%), con al menos 300 impresiones y 3 consultas distintas.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Top 10 consultas editoriales (sin marca)</div>
                {table(seo.editorialTop, 'Consulta')}
                <div style={styles.cardSubtext}>Excluye consultas que incluyen el nombre de la revista y las de tipo URL.</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Consultas con potencial: posición 8-20 (Top 10 por impresiones)</div>
                {table(seo.opportunities, 'Consulta')}
                <div style={styles.cardSubtext}>Mucha demanda y todavía en segunda página o borde de la primera: buenas candidatas para nuevo contenido o mejora.</div>
              </div>
            </div>
            <div style={{ ...styles.card, marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <div style={styles.cardTitle}>Noticias del sector · temas de la revista</div>
                <select value={trendDays} onChange={(e) => setTrendDays(Number(e.target.value))} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value={7}>Últimos 7 días</option>
                  <option value={30}>Últimos 30 días</option>
                  <option value={90}>Últimos 90 días</option>
                </select>
              </div>
              {!trends && <div style={styles.cardSubtext}>Consultando Google Trends…</div>}
              {trends?.error && <div style={{ ...styles.cardSubtext, color: '#b71c1c' }}>No se pudo leer Google Trends: {trends.error}</div>}
              {trends?.topics && (
                <div style={{ overflowX: 'auto', marginTop: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
                    <thead>
                      <tr style={{ background: T.soft }}>
                        <th style={{ ...head, textAlign: 'left', width: '13%' }}>Tema</th>
                        <th style={{ ...head, textAlign: 'left' }}>Noticias del sector (últimos días)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.topics.map((t) => (
                        <tr key={t.keyword} style={{ verticalAlign: 'top' }}>
                          <td style={{ ...cell, fontWeight: 700, textTransform: 'capitalize' }}>{t.keyword}</td>
                          <td style={cell}>
                            {t.news?.length ? t.news.map((n) => (
                              <div key={n.url || n.title} style={{ marginBottom: '6px' }}>
                                <a href={n.url} target="_blank" rel="noreferrer" style={{ color: '#0b57d0' }}>{n.title}</a>
                                <span style={{ color: '#888' }}> · {n.source} · {n.date}</span>
                              </div>
                            )) : <span style={{ color: '#999' }}>sin noticias recientes</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={styles.cardSubtext}>Noticias recientes de Colombia por tema (Google News), con búsquedas pensadas para el nicho de la revista.</div>
            </div>
            <div style={{ ...styles.card, marginTop: '20px' }}>
              <div style={styles.cardTitle}>Tendencias generales del día en Colombia (todas las categorías)</div>
              {Array.isArray(seo.trends) ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                  <thead>
                    <tr style={{ background: T.soft }}>
                      <th style={{ ...head, textAlign: 'left' }}>Tendencia</th>
                      <th style={head}>Búsquedas aprox.</th>
                      <th style={{ ...head, textAlign: 'left' }}>Noticia relacionada</th>
                      <th style={{ ...head, textAlign: 'left' }}>Coincide con tus temas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seo.trends.map((t) => (
                      <tr key={t.title} style={{ background: t.matches.length ? '#eef7ee' : 'transparent' }}>
                        <td style={{ ...cell, fontWeight: 600 }}>{t.title}</td>
                        <td style={num}>{t.traffic}</td>
                        <td style={cell}>{t.newsUrl ? <a href={t.newsUrl} target="_blank" rel="noreferrer" style={{ color: T.accent }}>{t.news}</a> : t.news} <span style={{ color: '#999' }}>{t.source ? `· ${t.source}` : ''}</span></td>
                        <td style={cell}>{t.matches.length ? t.matches.join(', ') : '\u2014'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div style={styles.cardSubtext}>No se pudo leer Google Trends: {seo.trends?.error}</div>}
              <div style={styles.cardSubtext}>Fuente: feed público de Google Trends (búsquedas en tendencia en Colombia, últimas 24 h). Google no ofrece API para "consultas relacionadas" por tema. Resaltado en verde: la tendencia comparte palabras con consultas que ya te traen impresiones.</div>
            </div>
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
        const groups = ga.audience?.channels ? groupChannels(ga.audience.channels).filter((g) => g.pct > 0) : [];
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
              </div>
            </div>

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
                      <div style={{ fontSize: '15px', fontWeight: 700, color: T.ink }}>{g.name}</div>
                      <div style={{ fontSize: '13px' }}>Visitas <strong>{nf(g.views)}</strong>{chip(g.prevViews ? g.views / g.prevViews - 1 : null)}</div>
                    </div>
                  ))}
                </div>
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
            </div>
          </div>
        );
      })()}

      {ready && section === 'pauta' && (
      <>
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
