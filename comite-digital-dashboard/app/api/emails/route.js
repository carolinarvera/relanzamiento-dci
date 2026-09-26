import axios from 'axios';
import { resolveRange } from '../../lib/range';
import { isMock, mockEmails } from '../../lib/mock';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const API = 'https://api.hubapi.com/marketing/v3/emails';
const detailCache = new Map();
const DETAIL_TTL_MS = 60 * 60 * 1000;

function brandOf(d) {
  const test = (t) => (/axxis/i.test(t) ? 'axxis' : /diners/i.test(t) ? 'diners' : null);
  return test(d.from?.fromName || '') || test(d.name || '') || test(d.subject || '') || test(d.from?.replyTo || '');
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const k = i;
      i += 1;
      out[k] = await fn(items[k]);
    }
  }));
  return out;
}

const uniq = (list) => [...new Set((list || []).map(String))];

async function listIds(headers, start, end) {
  const res = await axios.get(`${API}/statistics/list`, { params: { startTimestamp: `${start}T00:00:00Z`, endTimestamp: `${end}T23:59:59Z` }, headers });
  return uniq(res.data.emails);
}

async function counters(headers, id, start, end) {
  const res = await axios.get(`${API}/statistics/list`, { params: { startTimestamp: `${start}T00:00:00Z`, endTimestamp: `${end}T23:59:59Z`, emailIds: id }, headers });
  return res.data.aggregate?.counters || {};
}

async function detail(headers, id) {
  const hit = detailCache.get(id);
  if (hit && Date.now() - hit.at < DETAIL_TTL_MS) return hit.value;
  const res = await axios.get(`${API}/${id}`, { headers });
  const d = res.data;
  const value = {
    id: String(d.id), name: d.name || '', subject: d.subject || '', from: d.from || {},
    kind: d.state === 'AUTOMATED' || d.type === 'AUTOMATED_EMAIL' ? 'automated' : 'batch',
    sentAt: d.publishDate || d.publishedAt || null,
  };
  detailCache.set(id, { at: Date.now(), value });
  return value;
}

const row = (d, c) => ({
  id: d.id, name: d.name, subject: d.subject, kind: d.kind, sentAt: d.sentAt,
  sent: c.sent || 0, delivered: c.delivered || 0, open: c.open || 0, click: c.click || 0, bounce: c.bounce || 0, unsubscribed: c.unsubscribed || 0,
});

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const range = resolveRange(params);
    if (isMock(params)) return Response.json(mockEmails(range));
    const token = process.env.HUBSPOT_TOKEN;
    if (!token) return Response.json({ error: 'HUBSPOT_TOKEN no configurado en Vercel' }, { status: 502 });
    const headers = { Authorization: `Bearer ${token}` };

    const [curIds, prevIds] = await Promise.all([
      listIds(headers, range.start, range.end),
      listIds(headers, range.prevStart, range.prevEnd).catch(() => []),
    ]);
    const allIds = uniq([...curIds, ...prevIds]);
    const details = {};
    (await pool(allIds, 6, (id) => detail(headers, id).catch(() => null))).forEach((d) => { if (d) details[d.id] = d; });

    const out = { axxis: { emails: [], prevEmails: [] }, diners: { emails: [], prevEmails: [] } };
    let unassigned = 0;
    await pool(curIds, 6, async (id) => {
      const d = details[id];
      if (!d) return;
      const b = brandOf(d);
      if (!b) { unassigned += 1; return; }
      out[b].emails.push(row(d, await counters(headers, id, range.start, range.end).catch(() => ({}))));
    });
    await pool(prevIds, 6, async (id) => {
      const d = details[id];
      const b = d && brandOf(d);
      if (!b) return;
      out[b].prevEmails.push(row(d, await counters(headers, id, range.prevStart, range.prevEnd).catch(() => ({}))));
    });
    return Response.json({ range, ...out, unassigned });
  } catch (error) {
    const detailMsg = error.response?.data?.message || error.response?.data?.error || error.message;
    console.error('Emails API Error:', detailMsg);
    return Response.json({ error: `HubSpot: ${detailMsg}` }, { status: 502 });
  }
}
