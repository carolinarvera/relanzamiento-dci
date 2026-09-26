import axios from 'axios';

export async function getAccessToken() {
  const res = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.GA4_OAUTH_CLIENT_ID,
      client_secret: process.env.GA4_OAUTH_CLIENT_SECRET,
      refresh_token: process.env.GA4_OAUTH_REFRESH_TOKEN,
    }),
  );
  return res.data.access_token;
}

const MAX_CONCURRENT = 4;
const gates = {};

async function withGate(propertyId, fn) {
  const g = (gates[propertyId] = gates[propertyId] || { active: 0, queue: [] });
  if (g.active >= MAX_CONCURRENT) await new Promise((resolve) => g.queue.push(resolve));
  g.active += 1;
  try {
    return await fn();
  } finally {
    g.active -= 1;
    const next = g.queue.shift();
    if (next) next();
  }
}

export async function runReport(token, propertyId, body) {
  const res = await withGate(propertyId, async () => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await axios.post(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          body,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (err) {
        const quota = err.response?.status === 429 || /quota|concurrent/i.test(err.response?.data?.error?.message || '');
        if (!quota || attempt >= 3) throw err;
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  });
  return res.data.rows || [];
}
