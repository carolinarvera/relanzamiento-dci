'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList, Cell, PieChart, Pie, AreaChart, Area, ReferenceDot, ReferenceLine } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('axxis');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const load = async (name, url) => {
          try {
            const r = await fetch(url, { cache: 'no-store' });
            const j = await r.json();
            if (!r.ok) return { name, error: j.error || `HTTP ${r.status}` };
            return { name, json: j };
          } catch (e) {
            return { name, error: e.message };
          }
        };
        const results = await Promise.all([load('Search Console', '/api/gsc'), load('GA4', '/api/ga4'), load('Meta', '/api/meta')]);
        const [gsc, ga4, meta] = results;
        const errs = results.filter((r) => r.error).map((r) => `${r.name}: ${r.error}`);
        (meta.json?.errors || []).forEach((e) => errs.push(`Meta ${e}`));
        setData({ gsc: gsc.json || {}, ga4: ga4.json || {}, meta: meta.json || {}, errors: errs });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh cada 5 min
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando datos...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: '40px' }}>Sin datos</div>;

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

  const renderChange = (value) => {
    if (value === null || value === undefined) return null;
    const positive = value >= 0;
    const arrow = positive ? '↑' : '↓';
    return <div style={styles.change(positive)}>{arrow} {(Math.abs(value) * 100).toFixed(1)}% vs mes anterior</div>;
  };

  const formatCompact = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  const axxisData = {
    gsc: data.gsc?.axxis || {},
    ga4: data.ga4?.axxis || {},
    meta: data.meta?.axxis || {},
  };

  const dinersData = {
    gsc: data.gsc?.diners || {},
    ga4: data.ga4?.diners || {},
    meta: data.meta?.diners || {},
  };

  const current = activeTab === 'axxis' ? axxisData : dinersData;
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

      {data.errors?.length > 0 && (
        <div style={{ background: '#fdecea', color: '#b71c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
          <strong>Fuentes con error (sin datos de ejemplo, solo datos reales):</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>{data.errors.map((e, k) => <li key={k}>{e}</li>)}</ul>
        </div>
      )}

      {/* GSC */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Google Search Console</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Clics</div>
            <div style={styles.cardValue}>{nf(current.gsc?.clicks)}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Impresiones</div>
            <div style={styles.cardValue}>{nf(current.gsc?.impressions)}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
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
                  <Bar dataKey="sesiones" name="Sesiones" fill="#333333" legendType="square">
                    {current.ga4.monthlyHistory.map((entry, i) => (
                      <Cell key={`ses-${i}`} fill={i === current.ga4.monthlyHistory.length - 1 ? '#000000' : '#333333'} />
                    ))}
                    <LabelList dataKey="sesiones" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#333' }} />
                  </Bar>
                  <Bar dataKey="vistas" name="Vistas" fill="#0066cc" legendType="square">
                    {current.ga4.monthlyHistory.map((entry, i) => (
                      <Cell key={`vis-${i}`} fill={i === current.ga4.monthlyHistory.length - 1 ? '#ff8c00' : '#0066cc'} />
                    ))}
                    <LabelList dataKey="vistas" position="top" formatter={formatCompact} style={{ fontSize: 10, fill: '#0066cc' }} />
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
            {renderChange(current.ga4?.bounceRateChange)}
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
                  <div style={styles.cardTitle}>Vistas {current.ga4.monthlyHistory?.[current.ga4.monthlyHistory.length - 1]?.month}</div>
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
                <h2 style={styles.sectionTitle}>Vistas por sección ({current.ga4.monthlyHistory?.[current.ga4.monthlyHistory.length - 1]?.month})</h2>
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
                      <th style={{ padding: '12px', textAlign: 'left' }}>Los artículos más leídos {current.ga4.monthlyHistory?.[current.ga4.monthlyHistory.length - 1]?.month}</th>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '14px 0' }}>
                      {current.ga4.audience.channels.map((c) => (
                        <div key={c.name}>
                          <div style={{ fontSize: '24px', fontWeight: 700, color: '#222' }}>{(c.pct * 100).toFixed(1)}%</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{c.name}</div>
                        </div>
                      ))}
                    </div>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#1a4fb3', color: 'white' }}>
                          <th style={{ padding: '6px', textAlign: 'left' }}>Grupo de canal</th>
                          <th style={{ padding: '6px', textAlign: 'right' }}>Sesiones</th>
                          <th style={{ padding: '6px', textAlign: 'right' }}>Vistas</th>
                          <th style={{ padding: '6px', textAlign: 'right' }}>Usuarios</th>
                        </tr>
                      </thead>
                      <tbody>
                        {current.ga4.audience.channels.map((c) => (
                          <tr key={c.name}>
                            <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>{c.name}</td>
                            <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(c.sessions)}</td>
                            <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(c.views)}</td>
                            <td style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{nf(c.users)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    {current.ga4.audience.age.length > 0 ? (
                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie data={current.ga4.audience.age} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="85%" label={(e) => `${(e.pct * 100).toFixed(1)}%`}>
                              {current.ga4.audience.age.map((a, k) => (
                                <Cell key={a.name} fill={['#1a4fb3', '#2f66c6', '#4a86e8', '#7aa6ee', '#a9c4f5', '#cfdcf7'][k % 6]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => v.toLocaleString('es-CO')} />
                            <Legend />
                          </PieChart>
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

      {/* Instagram */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Instagram</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Alcance</div>
            <div style={styles.cardValue}>{current.meta?.instagram?.reach || 0}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Visitas al perfil</div>
            <div style={styles.cardValue}>{nf(current.meta?.instagram?.impressions)}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Engagement</div>
            <div style={styles.cardValue}>{current.meta?.instagram?.engagement || 0}</div>
            <div style={styles.cardSubtext}>interacciones</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tasa Engagement</div>
            <div style={styles.cardValue}>{current.meta?.instagram?.engagementRate ? (current.meta.instagram.engagementRate * 100).toFixed(2) : 0}%</div>
            <div style={styles.cardSubtext}>respecto a alcance/seguidores</div>
          </div>
        </div>
      </div>

      {/* Facebook */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Facebook</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Seguidores</div>
            <div style={styles.cardValue}>{nf(current.meta?.facebook?.reach)}</div>
            <div style={styles.cardSubtext}>total actual</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Vistas de página</div>
            <div style={styles.cardValue}>{nf(current.meta?.facebook?.impressions)}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Engagement</div>
            <div style={styles.cardValue}>{current.meta?.facebook?.engagement || 0}</div>
            <div style={styles.cardSubtext}>interacciones</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tasa Engagement</div>
            <div style={styles.cardValue}>{current.meta?.facebook?.engagementRate ? (current.meta.facebook.engagementRate * 100).toFixed(2) : 0}%</div>
            <div style={styles.cardSubtext}>respecto a alcance/seguidores</div>
          </div>
        </div>
      </div>

      {/* Resumen tabular */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Resumen Consolidado</h2>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={styles.th}>Métrica</th>
              <th style={styles.th}>Valor</th>
              <th style={styles.th}>Fuente</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Clics de búsqueda</td>
              <td style={styles.td}>{nf(current.gsc?.clicks)}</td>
              <td style={styles.td}>GSC</td>
            </tr>
            <tr>
              <td style={styles.td}>Sesiones totales</td>
              <td style={styles.td}>{current.ga4?.sessions || 0}</td>
              <td style={styles.td}>GA4</td>
            </tr>
            <tr>
              <td style={styles.td}>Alcance redes</td>
              <td style={styles.td}>{(current.meta?.instagram?.reach || 0) + (current.meta?.facebook?.reach || 0)}</td>
              <td style={styles.td}>Meta</td>
            </tr>
            <tr>
              <td style={styles.td}>Engagement redes</td>
              <td style={styles.td}>{(current.meta?.instagram?.engagement || 0) + (current.meta?.facebook?.engagement || 0)}</td>
              <td style={styles.td}>Meta</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '40px' }}>
        Última actualización: {new Date().toLocaleString('es-CO')} · Actualiza cada 5 minutos
      </div>
    </div>
  );
}
