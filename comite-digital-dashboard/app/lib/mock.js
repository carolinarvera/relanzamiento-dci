// Datos sintéticos para iterar la estructura del informe sin llamar a las APIs. Solo activos fuera de producción con ?mock=1.
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const ABOVE_AVG_FACTOR = 1.15;

const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const hh = (h) => `${String(h).padStart(2, '0')}h`;
const dur = (s) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), Math.round(s % 60)].map((n) => String(n).padStart(2, '0')).join(':');

const BRANDS = {
  axxis: {
    base: 4400,
    sections: [['arquitectura', 'Arquitectura'], ['diseno', 'Diseño'], ['decoracion', 'Decoración']],
    slugs: ['casa-en-la-montana', 'edificio-mirador-bogota', 'renovacion-apartamento-chapinero', 'museo-de-arte-moderno', 'cocina-minimalista', 'oficinas-abiertas', 'casa-de-campo-sabana', 'torre-residencial-medellin', 'restauracion-patrimonial', 'museo-del-oro-ampliacion'],
  },
  diners: {
    base: 9000,
    sections: [['gastronomia', 'Gastronomía'], ['viajes', 'Viajes'], ['estilo-de-vida', 'Estilo de vida']],
    slugs: ['donde-comer-en-bogota', 'hoteles-boutique-cartagena', 'restaurantes-con-estrella', 'escapada-de-fin-de-semana', 'vinos-para-regalar', 'brunch-favoritos', 'ruta-del-cafe', 'cocteleria-de-autor', 'spa-y-bienestar', 'mercado-gastronomico'],
  },
};

function days(range) {
  const out = [];
  for (let t = new Date(`${range.start}T00:00:00Z`); t <= new Date(`${range.end}T00:00:00Z`); t = new Date(t.getTime() + 86400000)) out.push(new Date(t));
  return out;
}

function mockBrand(brand, range) {
  const cfg = BRANDS[brand];
  const r = rng(brand === 'axxis' ? 7 : 13);
  const list = days(range);
  const dailyViews = list.map((d) => {
    const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
    const wave = 1 + 0.25 * Math.sin(d.getUTCDate() / 3);
    return { date: ymd, label: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`, value: Math.round(cfg.base * wave * (0.8 + r() * 0.5)) };
  });
  const total = dailyViews.reduce((a, d) => a + d.value, 0);
  const avg = total / dailyViews.length;
  const above = dailyViews.filter((d) => d.value > avg * ABOVE_AVG_FACTOR);
  const dailyPeaks = [...dailyViews].sort((x, y) => y.value - x.value).slice(0, 3).map((d) => ({ ...d }));

  const path = (sec, i) => `/${sec}/${cfg.slugs[i % cfg.slugs.length]}/`;
  const CHANNELS = ['Búsqueda orgánica', 'Social pagado', 'Directo', 'Referido'];
  const DEVICES = ['Móvil', 'Escritorio', 'Tablet'];
  const aboveAvgDays = above.map((d) => {
    const sec = cfg.sections[Math.floor(r() * 3)][0];
    const c = [0.35 + r() * 0.1, 0.25 + r() * 0.1, 0.12 + r() * 0.05];
    const v = [0.6 + r() * 0.1, 0.28 + r() * 0.05, 0.03];
    return {
      label: d.label,
      views: d.value,
      pages: [0, 1, 2].map((i) => ({ path: path(sec, Math.floor(r() * 10)), views: Math.round(d.value * (0.06 - i * 0.015)), readSec: i === 2 ? 2 : 20 + r() * 90, channels: [{ name: CHANNELS[Math.floor(r() * 3)], share: 0.55 + r() * 0.2 }, { name: CHANNELS[3], share: 0.15 + r() * 0.1 }, { name: CHANNELS[2], share: 0.08 }] })),
      devices: v.map((share, i) => ({ name: DEVICES[i], share })),
      hours: [19, 12, 7].map((h) => ({ hour: hh(h), views: Math.round(d.value * 0.06 * (0.9 + r() * 0.2)) })),
      readTime: dur(30 + r() * 20),
    };
  });

  const hourlyViews = Array.from({ length: 24 }, (_, h) => {
    const vistas = Math.round((total / dailyViews.length) * (0.01 + 0.05 * Math.sin(Math.max(0, h - 5) / 18 * Math.PI) ** 2) * (0.9 + r() * 0.2));
    return { hour: hh(h), vistas, sesiones: Math.round(vistas * 0.7), vistasPrev: Math.round(vistas * (0.75 + r() * 0.4)) };
  });

  const sections = cfg.sections.map(([slug, label], si) => {
    const daily = dailyViews.map((d) => ({ ...d, value: Math.round(d.value * (0.28 - si * 0.06) * (0.8 + r() * 0.4)) }));
    const peak = [...daily].sort((x, y) => y.value - x.value)[0];
    const topPages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ path: path(slug, i), views: Math.round(peak.value * (2.5 - i * 0.2)) }));
    return {
      slug, label,
      views: daily.reduce((a, d) => a + d.value, 0),
      change: -0.2 + r() * 0.4,
      topPages,
      peakPages: topPages.map((p) => ({ ...p, views: Math.round(p.views * 0.3) })),
      topPageByDay: Object.fromEntries(daily.map((d, i) => [d.label, { path: path(slug, i % 10), views: Math.round(d.value * 0.35), readSec: 20 + r() * 90, channels: [{ name: CHANNELS[Math.floor(r() * 3)], share: 0.5 + r() * 0.25 }, { name: CHANNELS[3], share: 0.15 }], peakHour: hh(Math.floor(9 + r() * 12)) }])),
      topPagesByDay: Object.fromEntries(daily.map((d, i) => [d.label, [0, 1, 2].map((k) => ((d, i, k) => ({ path: path(slug, (i + k) % 10), views: Math.round(d.value * (0.35 - k * 0.07)), readSec: 20 + r() * 90, channels: [{ name: CHANNELS[Math.floor(r() * 3)], share: 0.5 + r() * 0.25 }, { name: CHANNELS[3], share: 0.15 }], peakHour: hh(Math.floor(9 + r() * 12)) }))(d, i, k))])),
      daily, peak,
      hourly: hourlyViews.map((h) => ({ hour: h.hour, value: Math.round(h.vistas * (0.3 - si * 0.06)) })),
    };
  });
  const top = [...sections].sort((a, b) => b.views - a.views)[0];

  const sessions = Math.round(total * 0.69);
  const users = Math.round(sessions * 0.85);
  return {
    sessions, users, organicSessions: 0, paidSessions: 0,
    newUsers: Math.round(users * 0.9), pageviews: total,
    bounceRate: 0.48, avgSessionDuration: '00:01:23', engagementRate: 0.5171,
    sessionsChange: -0.318, pageviewsChange: -0.168, usersChange: -0.306, newUsersChange: -0.318,
    bounceRateChange: -0.234, avgSessionDurationChange: -0.038, engagementRateChange: 0.4,
    monthlyHistory: MONTHS.slice(0, 8).map((m, i) => ({ month: `${m} 2026`, sesiones: Math.round(sessions * (0.8 + r() * 0.5)), vistas: Math.round(total * (0.8 + r() * 0.5)), usuarios: Math.round(users * (0.8 + r() * 0.5)) })),
    dailyViews, dailyPeaks, aboveAvgDays, hourlyViews,
    prevDailyViews: dailyViews.map((d) => ({ date: d.date.replace(/^(\d{4})(\d{2})/, (_, y, m) => `${y}${String(Number(m) - 1).padStart(2, '0')}`), value: Math.round(d.value * (0.75 + r() * 0.4)) })),
    organic: { views: Math.round(total * 0.37), viewsChange: 0.37 / (0.35 * 0.9) - 1, sessions: Math.round(sessions * 0.37), bounceRate: 0.34, bounceRateChange: -0.131 },
    social: { instagram: { sessions: 1200, share: 0.04, shareChange: 0.1 }, facebook: { sessions: 8000, share: 0.09, shareChange: -0.05 } },
    sections,
    topArticles: [0, 1, 2, 3, 4].map((i) => ({ date: range.start, path: path(cfg.sections[0][0], i), title: `Nota destacada ${i + 1} (ejemplo)`, topic: cfg.sections[0][1], views: Math.round(total * (0.02 - i * 0.003)) })),
    audience: {
      age: [['18-24', 0.08], ['25-34', 0.22], ['35-44', 0.28], ['45-54', 0.24], ['55+', 0.18]].map(([name, pct]) => ({ name, pct, value: Math.round(users * pct) })),
      ageGender: ['18-24', '25-34', '35-44', '45-54', '55+'].map((age) => ({ age, hombres: 0.03 + r() * 0.1, mujeres: 0.04 + r() * 0.12 })),
      gender: [{ name: 'female', pct: 0.58, value: Math.round(users * 0.58) }, { name: 'male', pct: 0.42, value: Math.round(users * 0.42) }],
      devices: [{ name: 'mobile', pct: 0.72, prevPct: 0.69, value: Math.round(users * 0.72) }, { name: 'desktop', pct: 0.25, prevPct: 0.28, value: Math.round(users * 0.25) }, { name: 'tablet', pct: 0.03, prevPct: 0.03, value: Math.round(users * 0.03) }],
      cities: [{ name: 'Bogotá', pct: 0.48 }, { name: 'Medellín', pct: 0.14 }, { name: 'Cali', pct: 0.07 }, { name: 'Barranquilla', pct: 0.05 }, { name: 'Cartagena', pct: 0.03 }],
      countries: [{ name: 'Colombia', pct: 0.88 }, { name: 'Estados Unidos', pct: 0.04 }, { name: 'México', pct: 0.02 }, { name: 'España', pct: 0.015 }, { name: 'Argentina', pct: 0.01 }],
      channels: [['Organic Search', 0.37, 0.35], ['Paid Social', 0.29, 0.26], ['Paid Search', 0.05, 0.04], ['Direct', 0.15, 0.18], ['Referral', 0.08, 0.09], ['Organic Social', 0.054, 0.08], ['AI Assistant', 0.006, 0.003]].map(([name, pct, prevPct]) => ({ name, pct, prevPct, prevSessions: Math.round(sessions * prevPct * 0.9), prevViews: Math.round(total * prevPct * 0.9), sessions: Math.round(sessions * pct), users: Math.round(users * pct), views: Math.round(total * pct) })),
      ai: {
        sources: [['chatgpt.com', 390, 333, 632], ['gemini.google.com', 54, 45, 90], ['perplexity.ai', 10, 9, 23], ['copilot.com', 10, 9, 17], ['claude.ai', 7, 6, 9]].map(([name, sessions, users, views]) => ({ name, sessions, users, views })),
        pages: [['/gastronomia/donde-comer/1921-express-bogota', 'Dónde comer: 1921 Express', 8], ['/arquitectura/kubik-edificio-residencial', 'Kubik: proyecto residencial con certificación LEED', 7], ['/arquitectura/arquitectura-que-rompe-esquemas', 'Arquitectura que rompe esquemas', 6], ['/diseno/interiorismo-objetos-bazar', 'Interiorismo y objetos de diseño', 5], ['/decoracion/apartamento-escandinavo', 'Apartamento de decoración escandinava', 4]].map(([path, title, sessions]) => ({ path, title, sessions })),
        quality: { ai: { sec: 118, bounce: 0.32, engagement: 0.68, sessions: 471 }, organic: { sec: 74, bounce: 0.41, engagement: 0.59, sessions: 30000 }, site: { sec: 83, bounce: 0.48, engagement: 0.52, sessions: 105000 } },
      },
      interests: [['Hogar y jardín › Aficionados a la decoración', 0.11], ['Viajes › Viajeros frecuentes', 0.09], ['Cocina › Aspirantes a chef', 0.08], ['Compradores › Aficionados a las compras', 0.06], ['Vehículos › Aficionados a los autos', 0.04], ['Belleza y bienestar › Expertos en belleza', 0.035]].map(([name, pct]) => ({ name, pct })),
      newDuration: { sec: 62, prevSec: 71 },
      returningDuration: { sec: 148, prevSec: 139 },
      returningChannels: [{ name: 'Direct', sessions: 19000 }, { name: 'Organic Search', sessions: 12000 }, { name: 'Paid Social', sessions: 3000 }, { name: 'Referral', sessions: 1500 }, { name: 'Email', sessions: 900 }],
      newChannels: [{ name: 'Organic Search', sessions: 21000 }, { name: 'Organic Social', sessions: 2500 }, { name: 'Paid Social', sessions: 16000 }, { name: 'Direct', sessions: 6000 }, { name: 'Referral', sessions: 2000 }],
      interestsCoverage: 0.62,
      interestsBySegment: {
        segments: ['Mujeres', 'Hombres', '18-24', '25-34', '35-44', '45-54', '55+'],
        rows: [
          ['Hogar y jardín › Aficionados a la decoración', [0.34, 0.27, 0.22, 0.33, 0.35, 0.33, 0.26]],
          ['Viajes › Viajeros frecuentes', [0.24, 0.31, 0.18, 0.26, 0.32, 0.29, 0.22]],
          ['Cocina › Aspirantes a chef', [0.25, 0.23, 0.15, 0.22, 0.28, 0.30, 0.27]],
          ['Compradores › Aficionados a las compras', [0.27, 0.10, 0.24, 0.24, 0.19, 0.14, 0.09]],
          ['Vehículos › Aficionados a los autos', [0.24, 0.09, 0.10, 0.16, 0.21, 0.22, 0.17]],
          ['Belleza y bienestar › Expertos en belleza', [0.06, 0.19, 0.11, 0.13, 0.14, 0.12, 0.10]],
        ].map(([name, values]) => ({ name, values })),
      },
      returning: { newPct: 0.58, returningPct: 0.42, prevNewPct: 0.63, prevReturningPct: 0.37, frequency: [['1 visita', 0.58], ['2 a 3 visitas', 0.24], ['4 a 9 visitas', 0.12], ['10 o más', 0.06]].map(([label, pct]) => ({ label, pct })) },
      os: [['iOS', 0.44, 0.41], ['Android', 0.41, 0.44], ['Windows', 0.09, 0.09], ['macOS', 0.05, 0.05], ['Otros', 0.01, 0.01]].map(([name, pct, prevPct]) => ({ name, pct, prevPct })),
      brands: [['Apple', 0.49], ['Samsung', 0.22], ['Xiaomi', 0.11], ['Motorola', 0.08], ['Otras', 0.10]].map(([name, pct]) => ({ name, pct })),
      regions: [['Bogotá D.C.', 0.47], ['Antioquia', 0.14], ['Valle del Cauca', 0.08], ['Cundinamarca', 0.06], ['Atlántico', 0.04], ['Santander', 0.03]].map(([name, pct]) => ({ name, pct })),
    },
    home: (() => {
      const daily = dailyViews.map((d) => ({ ...d, value: Math.round(d.value * (0.16 + r() * 0.06)) }));
      const peak = [...daily].sort((x, y) => y.value - x.value)[0];
      const hv = daily.reduce((a, d) => a + d.value, 0);
      return {
        newUsers: Math.round(hv * 0.26), newUsersChange: -0.04,
        newDuration: { sec: 41, prevSec: 45 },
        returningDuration: { sec: 96, prevSec: 88 },
        newChannels: [{ name: 'Direct', sessions: 5200 }, { name: 'Organic Search', sessions: 4100 }, { name: 'Paid Social', sessions: 1800 }, { name: 'Referral', sessions: 500 }],
        returningChannels: [{ name: 'Direct', sessions: 7800 }, { name: 'Organic Search', sessions: 2600 }, { name: 'Email', sessions: 900 }, { name: 'Paid Social', sessions: 600 }],
        viewsPrev: Math.round(hv / 1.052), usersPrev: Math.round((hv * 0.7) / 0.97), bounceRatePrev: 0.41 / 0.94, readSecPrev: 48 / 1.09,
        views: hv, viewsChange: 0.052, users: Math.round(hv * 0.7), usersChange: -0.03,
        bounceRate: 0.41, bounceRateChange: -0.06, readSec: 48, readChange: 0.09,
        returning: { newPct: 0.37, returningPct: 0.63, prevNewPct: 0.41, prevReturningPct: 0.59, frequency: [['1 visita', 0.37], ['2 a 3 visitas', 0.28], ['4 a 9 visitas', 0.20], ['10 o más', 0.15]].map(([label, pct]) => ({ label, pct })) },
        daily, peak,
        hourly: hourlyViews.map((h) => ({ hour: h.hour, value: Math.round(h.vistas * 0.2) })),
        channels: [['Direct', 0.44, 0.4], ['Organic Search', 0.33, 0.35], ['Paid Social', 0.12, 0.1], ['Referral', 0.06, 0.07], ['Organic Social', 0.05, 0.08]].map(([name, a, b]) => ({ name, views: Math.round(hv * a), prevViews: Math.round(hv * b * 0.95) })),
      };
    })(),
    sectionSummary: { topSection: top.label, topArticle: top.topPages[0].path },
    septPartial: null,
  };
}

export function mockGa4(range) {
  const empty = (m) => ({ ...m });
  return { range, axxis: empty(mockBrand('axxis', range)), diners: empty(mockBrand('diners', range)), mock: true };
}

export function mockGsc(range) {
  const one = (k) => ({ clicks: 8000 * k, impressions: 96000 * k, ctr: 0.083, position: 8.2, prev: { clicks: 7000 * k, impressions: 90000 * k, ctr: 0.078, position: 8.5 } });
  const withHome = (k) => ({ ...one(k), home: { clicks: 1500 * k, impressions: 22000 * k, ctr: 0.068, position: 3.4, prev: { clicks: 1400 * k, impressions: 21000 * k, ctr: 0.066, position: 3.7 } } });
  return { range, axxis: withHome(1), diners: withHome(6), mock: true };
}

export const isMock = (searchParams) => process.env.NODE_ENV !== 'production' && searchParams.get('mock') === '1';

export function mockEmails(range) {
  const r = rng(29);
  const mk = (brand, n, scale, startMs) => Array.from({ length: n }, (_, i) => {
    const sent = Math.round((9000 + r() * 4000) * scale);
    const delivered = Math.round(sent * (0.97 + r() * 0.02));
    const open = Math.round(delivered * (0.26 + r() * 0.16));
    const click = Math.round(open * (0.07 + r() * 0.1));
    return {
      id: `${brand}-${startMs}-${i}`,
      name: `Newsletter ${brand === 'axxis' ? 'AXXIS' : 'Diners'} · Edición ${i + 1}`,
      subject: brand === 'axxis' ? ['Casas que dialogan con la montaña', 'Diseño colombiano en Milán', 'Cocinas para recibir', 'El regreso del bambú', 'Interiores en tonos tierra'][i % 5] : ['Dónde comer esta semana', 'Escapadas de fin de semana', 'Los mejores brunch de Bogotá', 'Hoteles con alma', 'Vinos para regalar'][i % 5],
      sentAt: new Date(startMs + i * 4 * 86400000).toISOString(),
      sent, delivered, open, click,
      bounce: Math.round(sent * 0.012), unsubscribed: Math.round(delivered * (0.002 + r() * 0.002)),
    };
  });
  const start = new Date(`${range.start}T12:00:00Z`).getTime();
  const pstart = new Date(`${range.prevStart}T12:00:00Z`).getTime();
  return {
    range,
    axxis: { emails: mk('axxis', 7, 1, start), prevEmails: mk('axxis', 7, 0.92, pstart) },
    diners: { emails: mk('diners', 7, 1.6, start), prevEmails: mk('diners', 6, 1.5, pstart) },
    mock: true,
  };
}

export function mockEmailTraffic(range) {
  const emails = mockEmails(range);
  const build = (brand, scale) => {
    const list = emails[brand].emails;
    const slug = (e) => e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
    const r = rng(brand === 'axxis' ? 41 : 43);
    const campaigns = list.map((e) => { const views = Math.round((1800 + r() * 2200) * scale); return { name: slug(e), views, sessions: Math.round(views * 0.62) }; });
    campaigns.push({ name: '(not set)', views: Math.round(900 * scale), sessions: Math.round(540 * scale) });
    const views = campaigns.reduce((a, c) => a + c.views, 0);
    const days = [];
    for (let t = new Date(`${range.start}T00:00:00Z`); t <= new Date(`${range.end}T00:00:00Z`); t = new Date(t.getTime() + 86400000)) days.push(new Date(t));
    const sendDays = new Set(list.map((e) => e.sentAt.slice(0, 10)));
    const daily = days.map((d) => {
      const iso = d.toISOString().slice(0, 10);
      const spike = sendDays.has(iso) ? 1500 : ([...sendDays].some((sd) => Math.abs((new Date(sd) - d) / 86400000) === 1) ? 600 : 0);
      return { date: iso.replace(/-/g, ''), label: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`, value: Math.round((120 + r() * 80 + spike) * scale) };
    });
    return {
      views, prevViews: Math.round(views * 0.88), sessions: Math.round(views * 0.62), prevSessions: Math.round(views * 0.62 * 0.9), users: Math.round(views * 0.5), prevUsers: Math.round(views * 0.5 * 0.9),
      siteViews: Math.round(views / 0.03), prevSiteViews: Math.round(views / 0.03 * 1.1), siteSessions: Math.round(views / 0.03 * 0.69),
      pages: [['/arquitectura/casa-en-la-montana/', 0.16], ['/diseno/interiorismo-objetos-bazar/', 0.12], ['/decoracion/apartamento-escandinavo/', 0.09], ['/arquitectura/museo-de-arte-moderno/', 0.07], ['/', 0.06]].map(([path, f]) => ({ path, views: Math.round(views * f) })), quality: { email: { sec: 96, bounce: 0.38, engagement: 0.62, sessions: Math.round(views * 0.62) }, site: { sec: 83, bounce: 0.48, engagement: 0.52, sessions: Math.round(views / 0.03 * 0.69) } },
      byHour: Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, '0')}h`, value: Math.round(views / 31 * (h >= 6 && h <= 22 ? 0.02 + 0.05 * Math.exp(-((h - 9) ** 2) / 8) + 0.03 * Math.exp(-((h - 20) ** 2) / 6) : 0.005) * 8) })),
      byDow: [['Lun', 1.0], ['Mar', 1.35], ['Mié', 1.1], ['Jue', 0.95], ['Vie', 0.8], ['Sáb', 0.7], ['Dom', 0.9]].map(([label, f]) => ({ label, value: Math.round(views / 31 * f) })),
      secondClicks: [['/', 0.10], ['/arquitectura/', 0.07], ['/diseno/', 0.05], ['/marketplace/', 0.04], ['/arquitectura/museo-de-arte-moderno/', 0.03]].map(([path, f]) => ({ path, views: Math.round(views * f) })),
      secondTotal: Math.round(views * 0.62),
      flows: [['/arquitectura/casa-en-la-montana/', '/arquitectura/museo-de-arte-moderno/', 0.05], ['/arquitectura/casa-en-la-montana/', '/', 0.03], ['/', '/marketplace/', 0.03], ['/diseno/interiorismo-objetos-bazar/', '/diseno/cocina-minimalista/', 0.025], ['/decoracion/apartamento-escandinavo/', '/marketplace/', 0.02]].map(([from, to, f]) => ({ from, to, views: Math.round(views * f) })),
      campaigns: campaigns.sort((a, b) => b.views - a.views), sources: [{ name: 'hs_email', views: Math.round(views * 0.8) }, { name: 'newsletter', views: Math.round(views * 0.2) }], daily,
    };
  };
  return { range, axxis: build('axxis', 1), diners: build('diners', 1.6), mock: true };
}
