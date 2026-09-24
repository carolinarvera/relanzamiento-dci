'use client';

import React, { useState, useEffect } from 'react';
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

const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const isoDate = (d) => d.toISOString().slice(0, 10);

function presetOptions() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const opts = [
    { label: 'Mes actual (hasta hoy)', value: `${isoDate(new Date(Date.UTC(y, now.getUTCMonth(), 1)))}|${isoDate(now)}` },
    { label: 'Últimos 30 días', value: `${isoDate(new Date(now.getTime() - 29 * 86400000))}|${isoDate(now)}` },
    { label: 'Últimos 7 días', value: `${isoDate(new Date(now.getTime() - 6 * 86400000))}|${isoDate(now)}` },
  ];
  for (let m = now.getUTCMonth() - 1; m >= 0; m -= 1) {
    opts.push({ label: `${MONTH_NAMES[m]} ${y}`, value: `${isoDate(new Date(Date.UTC(y, m, 1)))}|${isoDate(new Date(Date.UTC(y, m + 1, 0)))}` });
  }
  return opts;
}

const SECTIONS = [
  { key: 'resumen', label: 'Resumen', apis: ['ga4', 'meta', 'pauta'] },
  { key: 'web', label: 'Web', apis: ['ga4'] },
  { key: 'seo', label: 'SEO', apis: ['gsc', 'seo'] },
  { key: 'redes', label: 'Redes sociales', apis: ['meta'] },
  { key: 'pauta', label: 'Pauta', apis: ['pauta'] },
];
const API_NAMES = { gsc: 'Search Console', ga4: 'GA4', meta: 'Meta', seo: 'SEO', pauta: 'Pauta' };

export default function Dashboard() {
  const [data, setData] = useState({ gsc: {}, ga4: {}, meta: {}, seo: {}, pauta: {} });
  const [errorsBy, setErrorsBy] = useState({});
  const [loadedKey, setLoadedKey] = useState({});
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState('web');
  const [activeTab, setActiveTab] = useState('axxis');
  const [range, setRange] = useState(null);
  const [draft, setDraft] = useState({ start: '', end: '' });
  const [trends, setTrends] = useState(null);
  const [trendDays, setTrendDays] = useState(30);
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
    let cancelled = false;
    const loadApi = async (api, force) => {
      if (!force && loadedKey[api] === rangeKey) return;
      const qs = range ? `?start=${range.start}&end=${range.end}` : '';
      try {
        const r = await fetch(`/api/${api}${qs}`, api === 'pauta' ? {} : { cache: 'no-store' });
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

  const styles = {
    container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#222' },
    tabs: { display: 'flex', gap: '10px' },
    tabBtn: (active) => ({
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: active ? '#0066cc' : '#ddd',
      color: active ? 'white' : '#333',
      fontWeight: active ? 'bold' : 'normal',
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    cardTitle: { fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '8px' },
    cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#0066cc' },
    cardSubtext: { fontSize: '12px', color: '#999', marginTop: '8px' },
    section: { marginBottom: '40px' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#222', marginBottom: '15px' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { backgroundColor: '#f0f0f0', padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#666' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
    change: (positive) => ({ fontSize: '12px', marginTop: '8px', color: positive ? '#2e7d32' : '#c62828', fontWeight: '600' }),
  };

  const renderChange = (value, lowerIsBetter = false) => {
    if (value === null || value === undefined) return null;
    const positive = value >= 0;
    const good = lowerIsBetter ? !positive : positive;
    const arrow = positive ? '↑' : '↓';
    return <div style={styles.change(good)}>{arrow} {(Math.abs(value) * 100).toFixed(1)}% vs mes anterior</div>;
  };

  const renderPP = (cur, prev) => {
    if (prev === null || prev === undefined) return null;
    const diff = (cur - prev) * 100;
    return <div style={styles.change(diff >= 0)}>{diff >= 0 ? '\u2191' : '\u2193'} {Math.abs(diff).toFixed(2)} pp vs periodo anterior</div>;
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
  };

  const dinersData = {
    gsc: data.gsc?.diners || {},
    ga4: data.ga4?.diners || {},
    meta: data.meta?.diners || {},
    seo: data.seo?.diners || null,
  };

  const current = activeTab === 'axxis' ? axxisData : dinersData;
  const rangeLabel = data.ga4?.range?.label || data.gsc?.range?.label || data.seo?.range?.label || data.meta?.range?.label || data.pauta?.range?.label || '';
  const nf = (v) => (v === undefined || v === null ? '\u2014' : Number(v).toLocaleString('es-CO'));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Comité Digital Dashboard</h1>
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
          style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', background: '#0066cc', color: 'white', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => { if (draft.start && draft.end && draft.start <= draft.end) setRange({ start: draft.start, end: draft.end }); }}
        >Aplicar</button>
        <span style={{ fontSize: '13px', color: '#666' }}>{loading ? 'Actualizando…' : `Mostrando: ${rangeLabel}`} · variación vs periodo anterior equivalente</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        {SECTIONS.map((x) => (
          <button
            key={x.key}
            onClick={() => setSection(x.key)}
            style={{ padding: '10px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: section === x.key ? 700 : 500, color: section === x.key ? '#0066cc' : '#555', borderBottom: section === x.key ? '3px solid #0066cc' : '3px solid transparent', marginBottom: '-2px' }}
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
            {renderChange(current.ga4?.pageviewsChange)}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Sesiones</div>
            <div style={styles.cardValue}>{nf(current.ga4?.sessions)}</div>
            {renderChange(current.ga4?.sessionsChange)}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Total de Usuarios</div>
            <div style={styles.cardValue}>{nf(current.ga4?.users)}</div>
            {renderChange(current.ga4?.usersChange)}
          </div>
        </div>

        {current.ga4?.monthlyHistory?.length > 0 && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tráfico total de la página web</div>
            <div style={{ width: '100%', height: 360, marginTop: '12px' }}>
              <ResponsiveContainer>
                <BarChart data={current.ga4.monthlyHistory} margin={{ top: 30, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                  <Legend />
                  <Bar dataKey="vistas" name="Vistas" fill="#0066cc" legendType="square">
                    {current.ga4.monthlyHistory.map((entry, i) => (
                      <Cell key={`vis-${i}`} fill={i === current.ga4.monthlyHistory.length - 1 ? '#ff8c00' : '#0066cc'} />
                    ))}
                    <LabelList dataKey="vistas" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#0066cc' }} />
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

        <div style={{ ...styles.cardTitle, fontSize: '14px', margin: '20px 0 10px' }}>Tráfico orgánico (búsqueda) · {rangeLabel}</div>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Vistas orgánicas</div>
            <div style={styles.cardValue}>{nf(current.ga4?.organic?.views)}</div>
            {renderChange(current.ga4?.organic?.viewsChange)}
            <div style={styles.cardSubtext}>GA4 · grupo de canal Organic Search</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Posición promedio</div>
            <div style={styles.cardValue}>{current.gsc?.position ? current.gsc.position.toFixed(1) : '\u2014'}</div>
            {current.gsc?.prev?.position ? renderChange(current.gsc.position / current.gsc.prev.position - 1, true) : null}
            <div style={styles.cardSubtext}>Search Console · menor es mejor</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Rebote orgánico</div>
            <div style={styles.cardValue}>{current.ga4?.organic ? `${(current.ga4.organic.bounceRate * 100).toFixed(1)}%` : '\u2014'}</div>
            {renderChange(current.ga4?.organic?.bounceRateChange, true)}
            <div style={styles.cardSubtext}>sesiones de búsqueda orgánica · menor es mejor</div>
          </div>
        </div>

        {current.ga4?.hourlyViews?.some((h) => h.vistas > 0) && (
          <div style={{ ...styles.card, marginTop: '20px' }}>
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
                  <Bar dataKey="vistas" name="Vistas" fill="#0066cc" legendType="square">
                    {current.ga4.hourlyViews.map((h) => {
                      const max = Math.max(...current.ga4.hourlyViews.map((x) => x.vistas));
                      return <Cell key={h.hour} fill={h.vistas === max ? '#ff8c00' : '#0066cc'} />;
                    })}
                  </Bar>
                  <Bar dataKey="sesiones" name="Sesiones" fill="#333333" legendType="square" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.cardSubtext}>Hora del día en la zona horaria de la propiedad de GA4. La hora con más vistas se destaca en naranja.</div>
          </div>
        )}

        <div style={{ ...styles.grid, marginTop: '20px' }}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Usuarios Nuevos</div>
            <div style={styles.cardValue}>{nf(current.ga4?.newUsers)}</div>
            {renderChange(current.ga4?.newUsersChange)}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Duración Media Sesión</div>
            <div style={styles.cardValue}>{current.ga4?.avgSessionDuration || '00:00:00'}</div>
            {renderChange(current.ga4?.avgSessionDurationChange)}
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Porcentaje de Rebote</div>
            <div style={styles.cardValue}>{current.ga4?.bounceRate ? (current.ga4.bounceRate * 100).toFixed(0) : 0}%</div>
            {renderChange(current.ga4?.bounceRateChange, true)}<div style={styles.cardSubtext}>menor es mejor</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Porcentaje de Interacciones</div>
            <div style={styles.cardValue}>{current.ga4?.engagementRate ? (current.ga4.engagementRate * 100).toFixed(2) : 0}%</div>
            {renderChange(current.ga4?.engagementRateChange)}
          </div>
        </div>

        {current.ga4?.dailyViews?.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={styles.sectionTitle}>Informe Web - Página 2</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                <div style={styles.cardTitle}>Visitas diarias: agosto y septiembre</div>
                <div style={{ width: '100%', height: 320, marginTop: '12px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={current.ga4.dailyViews} margin={{ top: 30, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={6} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                      <Area type="monotone" dataKey="value" name="Vistas" stroke="#0066cc" strokeDasharray="2 3" strokeWidth={2} fill="#0066cc" fillOpacity={0.08} />
                      <ReferenceLine x="1 sep" stroke="#0000cc" strokeWidth={2} />
                      {current.ga4.dailyPeaks?.map((pk) => (
                        <ReferenceDot key={pk.label} x={pk.label} y={pk.value} r={5} fill="#ff8c00" stroke="#fff"
                          label={{ value: pk.value.toLocaleString('es-CO'), position: 'top', fontSize: 12, fill: '#222' }} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Vistas {rangeLabel}</div>
                  <div style={styles.cardValue}>{nf(current.ga4?.pageviews)}</div>
                </div>
                {current.ga4.septPartial && (
                  <>
                    <div style={{ ...styles.cardTitle, margin: '20px 0 10px' }}>Cifras actuales del {current.ga4.septPartial.range}</div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Vistas</div>
                      <div style={styles.cardValue}>{current.ga4.septPartial.views.toLocaleString('es-CO')}</div>
                      {renderChange(current.ga4.septPartial.viewsChange)}
                    </div>
                    <div style={{ ...styles.card, marginTop: '12px' }}>
                      <div style={styles.cardTitle}>Total de usuarios</div>
                      <div style={styles.cardValue}>{current.ga4.septPartial.users.toLocaleString('es-CO')}</div>
                      {renderChange(current.ga4.septPartial.usersChange)}
                    </div>
                  </>
                )}
              </div>
            </div>
            {current.ga4.sections?.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h2 style={styles.sectionTitle}>Vistas por sección ({rangeLabel})</h2>
                {current.ga4.sections.map((sec) => (
                  <div key={sec.slug} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>{sec.label}</div>
                      <div style={styles.cardValue}>{nf(sec.views)}</div>
                      {renderChange(sec.change)}
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
                          <tr>
                            <td></td>
                            <td style={{ padding: '6px 4px', fontWeight: 700 }}>Total sección</td>
                            <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 700 }}>{nf(sec.views)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Vistas {sec.label}{sec.peak ? ` · pico ${sec.peak.value.toLocaleString('es-CO')} (${sec.peak.label})` : ''}</div>
                      <div style={{ width: '100%', height: 200, marginTop: '12px' }}>
                        <ResponsiveContainer>
                          <AreaChart data={sec.daily} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                            <Area type="monotone" dataKey="value" name="Vistas" stroke="#1a4fb3" strokeWidth={2} fill="#1a4fb3" fillOpacity={0.08} />
                            {sec.peak && <ReferenceDot x={sec.peak.label} y={sec.peak.value} r={5} fill="#d32f2f" stroke="#fff" />}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Vistas {sec.label} por hora del día{(() => { const top = sec.hourly?.reduce((b, h) => (!b || h.value > b.value ? h : b), null); return top ? ` · pico ${top.hour}` : ''; })()}</div>
                      <div style={{ width: '100%', height: 200, marginTop: '12px' }}>
                        <ResponsiveContainer>
                          <BarChart data={sec.hourly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip formatter={(value) => value.toLocaleString('es-CO')} />
                            <Bar dataKey="value" name="Vistas" fill="#1a4fb3">
                              {sec.hourly.map((h) => {
                                const max = Math.max(...sec.hourly.map((x) => x.value));
                                return <Cell key={h.hour} fill={h.value === max && max > 0 ? '#ff8c00' : '#1a4fb3'} />;
                              })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ))}
                {current.ga4.sectionSummary && (
                  <div style={{ ...styles.card, background: '#f5f1e6' }}>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Sección con más tráfico:</strong> {current.ga4.sectionSummary.topSection}</p>
                    <p style={{ margin: '4px 0', fontSize: '14px', wordBreak: 'break-all' }}><strong>Página más leída:</strong> {current.ga4.sectionSummary.topArticle}</p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      {current.ga4.sections.map((sec) => sec.change === null || sec.change === undefined ? null : `${sec.label} ${sec.change >= 0 ? 'aumentó' : 'disminuyó'} ${(Math.abs(sec.change) * 100).toFixed(0)}%`).filter(Boolean).join(' · ')} frente al mes anterior.
                    </p>
                  </div>
                )}
              </div>
            )}

            {current.ga4.topArticles?.length > 0 && (
              <div style={{ ...styles.card, marginTop: '20px', padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#262626', color: 'white' }}>
                      <th style={{ padding: '12px' }}></th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>FECHA DE PUBLICACIÓN</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Los artículos más leídos {rangeLabel}</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>VISITAS</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>TEMA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.ga4.topArticles.map((a, k) => (
                      <tr key={a.path} style={{ background: '#f2f2f2' }}>
                        <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px dotted #999' }}>{k + 1}</td>
                        <td style={{ padding: '12px', borderBottom: '1px dotted #999', whiteSpace: 'nowrap' }}>{a.date || '\u2014'}</td>
                        <td style={{ padding: '12px', borderBottom: '1px dotted #999' }}>{a.title || a.path}</td>
                        <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px dotted #999', fontWeight: 600 }}>{nf(a.views)}</td>
                        <td style={{ padding: '12px', borderBottom: '1px dotted #999' }}>{a.topic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {current.ga4.audience && (
              <div style={{ marginTop: '30px' }}>
                <h2 style={styles.sectionTitle}>Datos demográficos relevantes</h2>
                {(() => {
                  const groups = groupChannels(current.ga4.audience.channels).filter((g) => g.pct > 0);
                  const chip = (v) => (v === null || v === undefined || !Number.isFinite(v) ? null : (
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px', marginLeft: '6px', background: v >= 0 ? '#e3f4e6' : '#fbe4e4', color: v >= 0 ? '#2e7d32' : '#b71c1c' }}>
                      {v >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(v * 100).toFixed(v > 1 ? 0 : 1)}%
                    </span>
                  ));
                  const rel = (cur, prev) => (prev ? cur / prev - 1 : null);
                  return (
                    <div style={{ ...styles.card, marginBottom: '20px', background: '#f3f1ee' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#1c2a6b', marginBottom: '12px' }}>Fuentes de tráfico</div>
                      <div style={{ display: 'flex', height: '44px', borderRadius: '22px', overflow: 'hidden', background: '#ddd' }}>
                        {groups.map((g) => (
                          <div key={g.name} title={`${g.name} ${(g.pct * 100).toFixed(1)}%`} style={{ width: `${g.pct * 100}%`, background: g.color }} />
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '18px', marginTop: '16px' }}>
                        {groups.map((g) => (
                          <div key={g.name} style={{ borderTop: `3px solid ${g.color}`, paddingTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '30px', fontWeight: 800, color: '#111' }}>{(g.pct * 100).toFixed(g.pct < 0.1 ? 1 : 0)}%</span>
                              {chip(rel(g.pct, g.prevPct))}
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1c2a6b' }}>{g.name}</div>
                            <div style={{ fontSize: '13px', color: '#333', marginTop: '4px' }}>
                              Visitas <strong>{nf(g.views)}</strong>{chip(rel(g.views, g.prevViews))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={styles.cardSubtext}>% de sesiones por tipo de fuente; variaciones vs el periodo anterior equivalente. Visitas = vistas de página.</div>
                    </div>
                  );
                })()}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Usuarios nuevos</div>
                      <div style={styles.cardValue}>{nf(current.ga4.newUsers)}</div>
                    </div>
                    <div style={{ ...styles.card, marginTop: '20px' }}>
                      <div style={styles.cardTitle}>Dispositivos usados para conectarse</div>
                      {current.ga4.audience.devices.map((d) => (
                        <div key={d.name} style={{ marginTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', textTransform: 'capitalize' }}>
                            <span>{d.name}</span><strong>{(d.pct * 100).toFixed(1)}%</strong>
                          </div>
                          <div style={{ background: '#e8eefc', borderRadius: '4px', height: '10px' }}>
                            <div style={{ width: `${d.pct * 100}%`, background: '#4a86e8', height: '10px', borderRadius: '4px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={styles.card}>
                    <div style={styles.cardTitle}>Fuentes de tráfico (% de sesiones)</div>
                    {(() => {
                      const groups = groupChannels(current.ga4.audience.channels);
                      return (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '14px 0' }}>
                            {groups.map((g) => (
                              <div key={g.name} style={{ borderLeft: `4px solid ${g.color}`, paddingLeft: '10px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#222' }}>{(g.pct * 100).toFixed(1)}%</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{g.name}</div>
                              </div>
                            ))}
                          </div>
                          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ background: '#1a4fb3', color: 'white' }}>
                                <th style={{ padding: '6px', textAlign: 'left' }}>Tipo / canal</th>
                                <th style={{ padding: '6px', textAlign: 'right' }}>Vistas</th>
                                <th style={{ padding: '6px', textAlign: 'right' }}>Sesiones</th>
                                <th style={{ padding: '6px', textAlign: 'right' }}>Usuarios</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groups.map((g) => (
                                <React.Fragment key={g.name}>
                                  <tr style={{ background: '#f4f6fb' }}>
                                    <td style={{ padding: '6px', fontWeight: 700, borderLeft: `4px solid ${g.color}` }}>{g.name} · {(g.pct * 100).toFixed(1)}%</td>
                                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 700 }}>{nf(g.views)}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 700 }}>{nf(g.sessions)}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 700 }}>{nf(g.users)}</td>
                                  </tr>
                                  {g.items.map((c) => (
                                    <tr key={c.name}>
                                      <td style={{ padding: '6px 6px 6px 22px', borderBottom: '1px solid #eee' }}>{c.name} <span style={{ color: '#888' }}>({(c.pct * 100).toFixed(1)}%)</span></td>
                                      <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(c.views)}</td>
                                      <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(c.sessions)}</td>
                                      <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(c.users)}</td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </>
                      );
                    })()}
                  </div>
                  {current.ga4.audience.ai?.sources?.length > 0 && (
                    <div style={styles.card}>
<div>
                        <div style={styles.cardTitle}>Asistentes de IA que envían tráfico</div>
                        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '6px' }}>
                          <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                              <th style={{ padding: '6px', textAlign: 'left' }}>Asistente</th>
                              <th style={{ padding: '6px', textAlign: 'right' }}>Vistas</th>
                              <th style={{ padding: '6px', textAlign: 'right' }}>Sesiones</th>
                              <th style={{ padding: '6px', textAlign: 'right' }}>Usuarios</th>
                            </tr>
                          </thead>
                          <tbody>
                            {current.ga4.audience.ai.sources.map((a) => (
                              <tr key={a.name}>
                                <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>{a.name}</td>
                                <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(a.views)}</td>
                                <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(a.sessions)}</td>
                                <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(a.users)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {current.ga4.audience.ai.pages?.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <div style={styles.cardTitle}>Artículos a los que llegan (sesiones)</div>
                            <ol style={{ fontSize: '12px', paddingLeft: '18px', margin: '6px 0 0' }}>
                              {current.ga4.audience.ai.pages.map((pg) => (
                                <li key={pg.path} style={{ marginBottom: '4px' }}>{pg.title || pg.path} <strong>· {nf(pg.sessions)}</strong></li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                  {current.ga4.audience.cities?.length > 0 && (
                    <div style={styles.card}>
                      <div style={styles.cardTitle}>Distribución geográfica de lectores</div>
                      <div style={{ width: '100%', height: 260, marginTop: '12px' }}>
                        <ResponsiveContainer>
                          <BarChart data={current.ga4.audience.cities} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                            <Bar dataKey="pct" name="Lectores" fill="#000000">
                              <LabelList dataKey="pct" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 11 }} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      {current.ga4.audience.countries?.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>
                          Países: {current.ga4.audience.countries.map((c) => `${c.name} ${(c.pct * 100).toFixed(1)}%`).join(' · ')}
                        </div>
                      )}
                    </div>
                  )}
                  <div style={styles.card}>
                    <div style={styles.cardTitle}>Sexo y edad lectores</div>
                    {current.ga4.audience.gender.length > 0 ? (
                      <div style={{ margin: '10px 0', fontSize: '24px', fontWeight: 700 }}>
                        {current.ga4.audience.gender.map((g) => (
                          <div key={g.name} style={{ color: g.name === 'female' ? '#1a73e8' : '#222' }}>
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
                            <Bar dataKey="mujeres" name="Mujeres" fill="#1a73e8">
                              <LabelList dataKey="mujeres" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 10, fill: '#1a73e8' }} />
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
              </div>
            )}

            <div style={{ ...styles.card, marginTop: '20px' }}>
              <div style={styles.cardTitle}>Picos de visitas (calculados de GA4)</div>
              <ul style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginTop: '12px', paddingLeft: '18px' }}>
                {current.ga4.dailyPeaks?.map((pk) => (
                  <li key={pk.label}>{pk.label}: {pk.value.toLocaleString('es-CO')} vistas</li>
                ))}
              </ul>
            </div>
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
              <tr style={{ background: '#f4f6fb' }}>
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
                      <Bar dataKey="queries" name="Consultas" fill="#1a4fb3">
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
                  <tr style={{ background: '#f4f6fb' }}>
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
                      <tr style={{ background: '#f4f6fb' }}>
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
                    <tr style={{ background: '#f4f6fb' }}>
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
                        <td style={cell}>{t.newsUrl ? <a href={t.newsUrl} target="_blank" rel="noreferrer" style={{ color: '#0066cc' }}>{t.news}</a> : t.news} <span style={{ color: '#999' }}>{t.source ? `· ${t.source}` : ''}</span></td>
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
          { name: 'Visualizaciones', value: fb.views, fill: '#4a86e8' },
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
                {renderChange(current.ga4?.social?.facebook?.shareChange)}
                <div style={styles.cardSubtext}>% de sesiones del sitio desde Facebook (GA4)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Nuevos seguidores</div>
                <div style={styles.cardValue}>{nf(fb.newFollowers)}</div>
                {renderChange(fb.newFollowersChange)}
                <div style={styles.cardSubtext}>brutos; dejaron de seguir: {nf(fb.unfollows)}</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(fb.viewers)}</div>
                {renderChange(fb.viewersChange)}
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
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#0066cc' }}>Ver en Facebook</a>
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
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#0066cc' }}>Ver en Facebook</a>
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
                {renderChange(current.ga4?.social?.instagram?.shareChange)}
                <div style={styles.cardSubtext}>% de sesiones del sitio desde Instagram (GA4)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Nuevos seguidores</div>
                <div style={styles.cardValue}>{nf(d?.period?.newFollowers)}</div>
                {renderChange(d?.period?.newFollowersChange)}
                <div style={styles.cardSubtext}>netos en el periodo (máx. 30 días)</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(d?.period?.reach ?? ig?.reach)}</div>
                {renderChange(d?.period?.reachChange)}
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
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#0066cc' }}>Ver en Instagram</a>
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
                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#0066cc' }}>Ver en Instagram</a>
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
                    <span style={{ color: '#1a73e8' }}>Mujeres {(d.women * 100).toFixed(1)}%</span> - Hombres {(d.men * 100).toFixed(1)}%
                  </div>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={d.ageGender} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                        <Legend />
                        <Bar dataKey="mujeres" name="Mujeres" fill="#1a73e8">
                          <LabelList dataKey="mujeres" position="top" formatter={(v) => `${(v * 100).toFixed(1)}%`} style={{ fontSize: 10, fill: '#1a73e8' }} />
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
            <h2 style={{ ...styles.sectionTitle, color: '#1c2a6b' }}>CIFRAS DIGITALES · {brandName} · {rangeLabel}</h2>

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
                      <Line type="monotone" dataKey="vistas" name="Vistas" stroke="#f39c12" strokeWidth={2} dot>
                        <LabelList dataKey="vistas" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#f39c12' }} />
                      </Line>
                      <Line type="monotone" dataKey="usuarios" name="Usuarios" stroke="#999999" strokeWidth={2} dot>
                        <LabelList dataKey="usuarios" position="bottom" formatter={formatCompact} style={{ fontSize: 10, fill: '#888' }} />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px', alignContent: 'start' }}>
                <div style={{ ...styles.card, background: '#eef1fb' }}>
                  {topSec ? (
                    <>
                      <div><strong style={{ fontSize: '20px', color: '#1c2a6b' }}>{topSec.label}</strong> <span style={{ fontSize: '12px', color: '#555' }}>Sección con mayor interés</span></div>
                      <div style={{ fontSize: '14px', marginTop: '6px' }}>Aporta <strong>{ga.pageviews ? ((topSec.views / ga.pageviews) * 100).toFixed(0) : '\u2014'}% del tráfico</strong></div>
                      {growth && <div style={{ fontSize: '14px', marginTop: '6px' }}>{growth.label} {chip(growth.change)} <span style={{ color: '#555' }}>vs periodo anterior</span></div>}
                    </>
                  ) : <div style={styles.cardSubtext}>Sin datos de secciones</div>}
                </div>
                <div style={{ ...styles.card, background: '#eef1fb' }}>
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
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#1c2a6b', marginBottom: '12px' }}>Fuentes de tráfico</div>
                <div style={{ display: 'flex', height: '40px', borderRadius: '20px', overflow: 'hidden', background: '#ddd' }}>
                  {groups.map((g) => <div key={g.name} title={`${g.name} ${(g.pct * 100).toFixed(1)}%`} style={{ width: `${g.pct * 100}%`, background: g.color }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '18px', marginTop: '14px' }}>
                  {groups.map((g) => (
                    <div key={g.name} style={{ borderTop: `3px solid ${g.color}`, paddingTop: '8px' }}>
                      <div><span style={{ fontSize: '30px', fontWeight: 800 }}>{(g.pct * 100).toFixed(g.pct < 0.1 ? 1 : 0)}%</span>{chip(g.prevPct ? g.pct / g.prevPct - 1 : null)}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1c2a6b' }}>{g.name}</div>
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
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1c2a6b', marginBottom: '12px' }}>Redes <span style={{ fontWeight: 400 }}>sociales</span></div>
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
        const CLIENT = '#d84315';
        const OWN = '#1a4fb3';
        const totalBrand = b.totals.spend;
        const clientBrand = b.cliente.totals.spend;
        const ownBrand = b.propia.totals.spend;
        const clientShare = totalBrand ? clientBrand / totalBrand : 0;

        const campaignTable = (list, limit) => (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f4f6fb' }}>
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
                {renderChange(rel(t.spend, pt.spend))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Impresiones</div>
                <div style={styles.cardValue}>{nf(t.impressions)}</div>
                {renderChange(rel(t.impressions, pt.impressions))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Alcance</div>
                <div style={styles.cardValue}>{nf(t.reach)}</div>
                {renderChange(rel(t.reach, pt.reach))}
                <div style={styles.cardSubtext}>suma por campaña</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Clics en enlace</div>
                <div style={styles.cardValue}>{nf(t.linkClicks)}</div>
                {renderChange(rel(t.linkClicks, pt.linkClicks))}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CTR (enlace)</div>
                <div style={styles.cardValue}>{(t.ctr * 100).toFixed(2)}%</div>
                {renderPP(t.ctr, pt.impressions ? pt.linkClicks / pt.impressions : null)}
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CPC</div>
                <div style={styles.cardValue}>{t.linkClicks ? cop(t.cpc) : '\u2014'}</div>
                {renderChange(rel(t.cpc, pt.cpc), true)}
                <div style={styles.cardSubtext}>menor es mejor</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>CPM</div>
                <div style={styles.cardValue}>{t.impressions ? cop(t.cpm) : '\u2014'}</div>
                {renderChange(rel(t.cpm, pt.cpm), true)}
                <div style={styles.cardSubtext}>menor es mejor</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Campañas con gasto</div>
                <div style={styles.cardValue}>{nf(t.campaigns)}</div>
                {renderChange(rel(t.campaigns, pt.campaigns))}
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
                {renderChange(rel(totalBrand, b.prevTotals.spend))}
              </div>
              <div style={{ ...styles.card, borderTop: `4px solid ${CLIENT}` }}>
                <div style={styles.cardTitle}>Pauta de clientes (content, feria)</div>
                <div style={styles.cardValue}>{cop(clientBrand)}</div>
                {renderChange(rel(clientBrand, b.cliente.prevTotals.spend))}
                <div style={styles.cardSubtext}>{(clientShare * 100).toFixed(1)}% de la inversión de {brandName} · la pagan los clientes</div>
              </div>
              <div style={{ ...styles.card, borderTop: `4px solid ${OWN}` }}>
                <div style={styles.cardTitle}>Pauta propia (contenido general)</div>
                <div style={styles.cardValue}>{cop(ownBrand)}</div>
                {renderChange(rel(ownBrand, b.propia.prevTotals.spend))}
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
          </div>
        );
      })()}
      </>
      )}

      {!ready && (
        <div style={{ ...styles.card, textAlign: 'center', padding: '40px', color: '#555' }}>
          {loading ? `Cargando ${sectionDef.label}…` : `No se pudo cargar ${sectionDef.label}. Revisa los avisos de arriba.`}
        </div>
      )}
    </div>
  );
}
