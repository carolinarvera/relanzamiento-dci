import axios from 'axios';
import { resolveRange } from '../../lib/range';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const BRANDS = [
  { key: 'axxis', re: /a+x+i+s/ },
  { key: 'diners', re: /din+ers?/ },
  { key: 'gamma', re: /ga+m+a/ },
];
// Pauta de clientes = campañas cuyo nombre lleva alguna de estas palabras; el resto es contenido general propio.
const CLIENT_KEYWORDS = ['content', 'feria'];
const KNOWN_CLIENTS = [
  { name: 'Colchones El Dorado', re: /dorado/ },
  { name: 'VIU Group', re: /\bviu\b/ },
  { name: 'Planeta Legno Floors', re: /legno/ },
  { name: 'Pisos Albornoz', re: /albornoz/ },
  { name: 'Productos Arquitectónicos', re: /productos arquitect/ },
  { name: 'Encortinarte', re: /encortinarte/ },
  { name: 'Gran Salón Inmobiliario', re: /salon inmobiliario/ },
  { name: 'Eternit', re: /eternit/ },
  { name: 'Nórdika', re: /nordika/ },
];
const clientOf = (name) => KNOWN_CLIENTS.find((c) => c.re.test(norm(name)))?.name || null;
const payerOf = (name) => (CLIENT_KEYWORDS.some((k) => norm(name).includes(k)) || clientOf(name) ? 'cliente' : 'propia');
const brandOf = (name) => BRANDS.find((b) => b.re.test(norm(name)))?.key || 'otras';

const RESULT_BY_OBJECTIVE = {
  OUTCOME_TRAFFIC: { label: 'Clics en enlace', types: ['link_click'] },
  OUTCOME_ENGAGEMENT: { label: 'Interacciones', types: ['post_engagement'] },
  OUTCOME_LEADS: { label: 'Leads', types: ['lead', 'onsite_conversion.lead_grouped'] },
  OUTCOME_SALES: { label: 'Compras', types: ['purchase', 'omni_purchase'] },
  OUTCOME_AWARENESS: { label: 'Alcance', types: [] },
  OUTCOME_APP_PROMOTION: { label: 'Instalaciones', types: ['mobile_app_install'] },
};

async function paged(url, params) {
  let res = await axios.get(url, { params });
  let data = res.data.data || [];
  for (let i = 0; i < 6 && res.data.paging?.next; i += 1) {
    res = await axios.get(res.data.paging.next);
    data = data.concat(res.data.data || []);
  }
  return data;
}

const CACHE = new Map();
const TTL = 20 * 60 * 1000;

async function accountCampaigns(account, token, range) {
  const rows = await paged(`https://graph.facebook.com/v19.0/${account.id}/insights`, {
    level: 'campaign',
    fields: 'campaign_id,campaign_name,spend,impressions,reach,clicks,inline_link_clicks,actions',
    time_ranges: JSON.stringify([{ since: range.start, until: range.end }, { since: range.prevStart, until: range.prevEnd }]),
    limit: 500,
    access_token: token,
  });
  if (!rows.length) return { cur: [], prev: [] };
  const camps = await paged(`https://graph.facebook.com/v19.0/${account.id}/campaigns`, { fields: 'id,objective', limit: 500, access_token: token }).catch(() => []);
  const objective = Object.fromEntries(camps.map((c) => [c.id, c.objective]));
  const shaped = rows.map((r) => {
    const obj = objective[r.campaign_id] || null;
    const def = RESULT_BY_OBJECTIVE[obj] || { label: 'Clics en enlace', types: ['link_click'] };
    const actions = Object.fromEntries((r.actions || []).map((a) => [a.action_type, Number(a.value)]));
    const results = def.types.length ? def.types.reduce((a, t) => a + (actions[t] || 0), 0) : Number(r.reach || 0);
    return {
      id: r.campaign_id,
      name: r.campaign_name,
      brand: brandOf(r.campaign_name),
      payer: payerOf(r.campaign_name),
      client: clientOf(r.campaign_name),
      objective: obj,
      resultLabel: def.label,
      currency: account.currency,
      spend: Number(r.spend || 0),
      impressions: Number(r.impressions || 0),
      reach: Number(r.reach || 0),
      clicks: Number(r.clicks || 0),
      linkClicks: Number(r.inline_link_clicks || 0),
      results,
      isPrev: r.date_start === range.prevStart,
    };
  });
  return { cur: shaped.filter((c) => !c.isPrev), prev: shaped.filter((c) => c.isPrev) };
}

const sum = (list, k) => list.reduce((a, c) => a + c[k], 0);
const totals = (list) => {
  const spend = sum(list, 'spend');
  const impressions = sum(list, 'impressions');
  const linkClicks = sum(list, 'linkClicks');
  return {
    campaigns: list.length,
    spend, impressions, reach: sum(list, 'reach'), clicks: sum(list, 'clicks'), linkClicks,
    ctr: impressions ? linkClicks / impressions : 0,
    cpc: linkClicks ? spend / linkClicks : 0,
    cpm: impressions ? (spend / impressions) * 1000 : 0,
  };
};

export async function GET(request) {
  try {
    const range = resolveRange(new URL(request.url).searchParams);
    const cacheKey = `${range.start}|${range.end}`;
    const hit = CACHE.get(cacheKey);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ...hit.data, cached: true }, { headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' } });
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');
    const accounts = await paged('https://graph.facebook.com/v19.0/me/adaccounts', { fields: 'id,name,currency,account_status', limit: 50, access_token: token });

    const errors = [];
    const results = await Promise.all(accounts.map((a) => accountCampaigns(a, token, range).catch((e) => { errors.push(`${a.name}: ` + (e.response?.data?.error?.message || e.message)); return { cur: [], prev: [] }; })));
    const cur = results.flatMap((r) => r.cur);
    const prev = results.flatMap((r) => r.prev);
    if (errors.length && !cur.length) {
      if (hit) return Response.json({ ...hit.data, cached: true, stale: true, errors });
      return Response.json({ error: errors[0] }, { status: 502 });
    }
    const grand = sum(cur, 'spend');
    const enrich = (list, prevList) => {
      const t = totals(list);
      const prevByName = new Map(prevList.map((c) => [c.name, c]));
      return {
        totals: t,
        prevTotals: totals(prevList),
        campaigns: list
          .slice()
          .sort((x, y) => y.spend - x.spend)
          .map((c) => ({
            ...c,
            spendShare: t.spend ? c.spend / t.spend : 0,
            ctr: c.impressions ? c.linkClicks / c.impressions : 0,
            cpc: c.linkClicks ? c.spend / c.linkClicks : 0,
            cpm: c.impressions ? (c.spend / c.impressions) * 1000 : 0,
            costPerResult: c.results ? c.spend / c.results : null,
            prevSpend: prevByName.get(c.name)?.spend ?? null,
          })),
      };
    };
    const out = {};
    ['axxis', 'diners', 'gamma', 'otras'].forEach((b) => {
      const list = cur.filter((c) => c.brand === b);
      const prevList = prev.filter((c) => c.brand === b);
      const all = enrich(list, prevList);
      out[b] = {
        ...all,
        spendShare: grand ? all.totals.spend / grand : 0,
        cliente: enrich(list.filter((c) => c.payer === 'cliente'), prevList.filter((c) => c.payer === 'cliente')),
        clients: Object.values(
          list.filter((c) => c.payer === 'cliente').reduce((acc, c) => {
            const key = c.client || 'Otros clientes (content / feria)';
            acc[key] = acc[key] || { name: key, spend: 0, campaigns: 0 };
            acc[key].spend += c.spend;
            acc[key].campaigns += 1;
            return acc;
          }, {}),
        ).sort((a, b) => b.spend - a.spend),
        propia: enrich(list.filter((c) => c.payer === 'propia'), prevList.filter((c) => c.payer === 'propia')),
      };
    });
    const global = {
      cliente: enrich(cur.filter((c) => c.payer === 'cliente'), prev.filter((c) => c.payer === 'cliente')),
      propia: enrich(cur.filter((c) => c.payer === 'propia'), prev.filter((c) => c.payer === 'propia')),
      prevTotalSpend: sum(prev, 'spend'),
      clients: Object.values(
        cur.filter((c) => c.payer === 'cliente').reduce((acc, c) => {
          const key = c.client || 'Otros clientes (content / feria)';
          acc[key] = acc[key] || { name: key, spend: 0, campaigns: 0 };
          acc[key].spend += c.spend;
          acc[key].campaigns += 1;
          return acc;
        }, {}),
      ).sort((a, b) => b.spend - a.spend),
    };
    const payload = { range, currency: accounts.find((a) => a.currency === 'COP')?.currency || accounts[0]?.currency || 'COP', accounts: accounts.map((a) => a.name), totalSpend: grand, global, clientKeywords: CLIENT_KEYWORDS, brands: out, errors };
    if (!errors.length) CACHE.set(cacheKey, { at: Date.now(), data: payload });
    else if (hit) return Response.json({ ...hit.data, cached: true, stale: true, errors });
    return Response.json(payload, { headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' } });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Pauta API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
