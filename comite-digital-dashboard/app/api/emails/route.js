import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { isMock, mockEmails } from '../../lib/mock';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BASE = 'https://api.hubapi.com/marketing/v3/emails/statistics/list';

const pick = (obj, names) => {
  for (const n of names) if (obj && obj[n] !== undefined && obj[n] !== null) return Number(obj[n]) || 0;
  return 0;
};

function brandOf(text) {
  if (/axxis/i.test(text)) return 'axxis';
  if (/diners/i.test(text)) return 'diners';
  return null;
}

async function fetchStats(token, startIso, endIso) {
  const res = await axios.get(BASE, {
    params: { startTimestamp: startIso, endTimestamp: endIso },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

function normalize(email) {
  const st = email.stats?.counters || email.counters || email.stats || {};
  return {
    id: String(email.id),
    name: email.name || '',
    subject: email.subject || email.emailSubject || '',
    sentAt: email.publishedAt || email.publishDate || email.sendTime || email.updatedAt || email.createdAt || null,
    sent: pick(st, ['sent']),
    delivered: pick(st, ['delivered']),
    open: pick(st, ['open', 'opened']),
    click: pick(st, ['click', 'clicked']),
    bounce: pick(st, ['bounce', 'bounced']),
    unsubscribed: pick(st, ['unsubscribed', 'unsubscribe']),
  };
}

function splitByBrand(list) {
  const out = { axxis: [], diners: [] };
  list.map(normalize).forEach((e) => {
    const b = brandOf(`${e.name} ${e.subject}`);
    if (b) out[b].push(e);
  });
  return out;
}

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const range = resolveRange(params);
    if (isMock(params)) return Response.json(mockEmails(range));
    const token = process.env.HUBSPOT_TOKEN;
    if (!token) return Response.json({ error: 'HUBSPOT_TOKEN no configurado en Vercel (token de app privada de HubSpot con permiso marketing-email o content)' }, { status: 502 });
    const [cur, prev] = await Promise.all([
      fetchStats(token, `${range.start}T00:00:00Z`, `${range.end}T23:59:59Z`),
      fetchStats(token, `${range.prevStart}T00:00:00Z`, `${range.prevEnd}T23:59:59Z`).catch(() => ({ emails: [] })),
    ]);
    const c = splitByBrand(cur.emails || []);
    const p = splitByBrand(prev.emails || []);
    const body = {
      range,
      axxis: { emails: c.axxis, prevEmails: p.axxis },
      diners: { emails: c.diners, prevEmails: p.diners },
      unassigned: (cur.emails || []).length - c.axxis.length - c.diners.length,
    };
    if (params.get('debug') === '1') body.sample = (cur.emails || [])[0] || null;
    return Response.json(body);
  } catch (error) {
    const detail = error.response?.data?.message || error.response?.data?.error || error.message;
    console.error('Emails API Error:', detail);
    return Response.json({ error: `HubSpot: ${detail}` }, { status: 502 });
  }
}
