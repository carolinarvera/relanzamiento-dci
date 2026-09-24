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

async function accountCampaigns(account, token, start, end) {
  const [rows, camps] = await Promise.all([
    paged(`https://graph.facebook.com/v19.0/${account.id}/insights`, {
      level: 'campaign',
      fields: 'campaign_id,campaign_name,spend,impressions,reach,clicks,inline_link_clicks,actions',
      time_range: JSON.stringify({ since: start, until: end }),
      limit: 500,
      access_token: token,
    }),
    paged(`https://graph.facebook.com/v19.0/${account.id}/campaigns`, { fields: 'id,objective', limit: 500, access_token: token }).catch(() => []),
  ]);
  const objective = Object.fromEntries(camps.map((c) => [c.id, c.objective]));
  return rows.map((r) => {
    const obj = objective[r.campaign_id] || null;
    const def = RESULT_BY_OBJECTIVE[obj] || { label: 'Clics en enlace', types: ['link_click'] };
    const actions = Object.fromEntries((r.actions || []).map((a) => [a.action_type, Number(a.value)]));
    const results = def.types.length ? def.types.reduce((a, t) => a + (actions[t] || 0), 0) : Number(r.reach || 0);
    return {
      id: r.campaign_id,
      name: r.campaign_name,
      brand: brandOf(r.campaign_name),
      objective: obj,
      resultLabel: def.label,
      currency: account.currency,
      spend: Number(r.spend || 0),
      impressions: Number(r.impressions || 0),
      reach: Number(r.reach || 0),
      clicks: Number(r.clicks || 0),
      linkClicks: Number(r.inline_link_clicks || 0),
      results,
    };
  });
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
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');
    const accounts = await paged('https://graph.facebook.com/v19.0/me/adaccounts', { fields: 'id,name,currency,account_status', limit: 50, access_token: token });

    const errors = [];
    const load = async (start, end) => (await Promise.all(accounts.map((a) => accountCampaigns(a, token, start, end).catch((e) => { errors.push(`${a.name}: ` + (e.response?.data?.error?.message || e.message)); return []; })))).flat();
    const [cur, prev] = await Promise.all([load(range.start, range.end), load(range.prevStart, range.prevEnd)]);

    const grand = sum(cur, 'spend');
    const out = {};
    ['axxis', 'diners', 'gamma', 'otras'].forEach((b) => {
      const list = cur.filter((c) => c.brand === b);
      const prevList = prev.filter((c) => c.brand === b);
      const t = totals(list);
      const pt = totals(prevList);
      const prevByName = new Map(prevList.map((c) => [c.name, c]));
      out[b] = {
        totals: t,
        prevTotals: pt,
        spendShare: grand ? t.spend / grand : 0,
        campaigns: list
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
    });
    return Response.json({ range, currency: accounts.find((a) => a.currency === 'COP')?.currency || accounts[0]?.currency || 'COP', accounts: accounts.map((a) => a.name), totalSpend: grand, brands: out, errors });
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('Pauta API Error:', detail);
    return Response.json({ error: detail }, { status: 502 });
  }
}
