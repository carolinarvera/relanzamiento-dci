'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('axxis');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gscRes, ga4Res, metaRes] = await Promise.all([
          fetch('/api/gsc'),
          fetch('/api/ga4'),
          fetch('/api/meta'),
        ]);

        if (!gscRes.ok || !ga4Res.ok || !metaRes.ok) throw new Error('Error fetching data');

        const gscData = await gscRes.json();
        const ga4Data = await ga4Res.json();
        const metaData = await metaRes.json();

        setData({ gsc: gscData, ga4: ga4Data, meta: metaData });
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Comité Digital Dashboard</h1>
        <div style={styles.tabs}>
          <button style={styles.tabBtn(activeTab === 'axxis')} onClick={() => setActiveTab('axxis')}>AXXIS</button>
          <button style={styles.tabBtn(activeTab === 'diners')} onClick={() => setActiveTab('diners')}>DINERS</button>
        </div>
      </div>

      {/* GSC */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Google Search Console</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Clics</div>
            <div style={styles.cardValue}>{current.gsc?.clicks || 0}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Impresiones</div>
            <div style={styles.cardValue}>{current.gsc?.impressions || 0}</div>
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
        <h2 style={styles.sectionTitle}>Google Analytics 4</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Sesiones</div>
            <div style={styles.cardValue}>{current.ga4?.sessions || 0}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Usuarios</div>
            <div style={styles.cardValue}>{current.ga4?.users || 0}</div>
            <div style={styles.cardSubtext}>únicos</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tráfico Orgánico</div>
            <div style={styles.cardValue}>{current.ga4?.organicSessions || 0}</div>
            <div style={styles.cardSubtext}>sesiones</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tráfico Pauta</div>
            <div style={styles.cardValue}>{current.ga4?.paidSessions || 0}</div>
            <div style={styles.cardSubtext}>sesiones</div>
          </div>
        </div>
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
            <div style={styles.cardTitle}>Impresiones</div>
            <div style={styles.cardValue}>{current.meta?.instagram?.impressions || 0}</div>
            <div style={styles.cardSubtext}>últimas</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Engagement</div>
            <div style={styles.cardValue}>{current.meta?.instagram?.engagement || 0}</div>
            <div style={styles.cardSubtext}>interacciones</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tasa Engagement</div>
            <div style={styles.cardValue}>{current.meta?.instagram?.engagementRate ? (current.meta.instagram.engagementRate * 100).toFixed(2) : 0}%</div>
            <div style={styles.cardSubtext}>respecto impresiones</div>
          </div>
        </div>
      </div>

      {/* Facebook */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Facebook</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Alcance</div>
            <div style={styles.cardValue}>{current.meta?.facebook?.reach || 0}</div>
            <div style={styles.cardSubtext}>últimos 30 días</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Impresiones</div>
            <div style={styles.cardValue}>{current.meta?.facebook?.impressions || 0}</div>
            <div style={styles.cardSubtext}>últimas</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Engagement</div>
            <div style={styles.cardValue}>{current.meta?.facebook?.engagement || 0}</div>
            <div style={styles.cardSubtext}>interacciones</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tasa Engagement</div>
            <div style={styles.cardValue}>{current.meta?.facebook?.engagementRate ? (current.meta.facebook.engagementRate * 100).toFixed(2) : 0}%</div>
            <div style={styles.cardSubtext}>respecto impresiones</div>
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
              <td style={styles.td}>{current.gsc?.clicks || 0}</td>
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
