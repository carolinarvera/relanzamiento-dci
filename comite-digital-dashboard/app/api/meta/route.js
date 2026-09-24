import axios from 'axios';

async function getPageAccessTokens(userToken) {
  try {
    const res = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
      params: { access_token: userToken },
    });
    const tokens = {};
    (res.data.data || []).forEach((page) => {
      tokens[page.id] = page.access_token;
    });
    return tokens;
  } catch (err) {
    console.error('Error obteniendo Page Access Tokens:', err.response?.data || err.message);
    return {};
  }
}

export async function GET() {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');

    // IDs de Instagram Business Account (usados vía Facebook Graph API)
    const errors = [];
    const until = Math.floor(Date.now() / 1000);
    const since = until - 29 * 86400;
    const axxisIgId = process.env.META_AXXIS_PAGE_ID || 'default';
    const dinersIgId = process.env.META_DINERS_PAGE_ID || 'default';
    // IDs de página de Facebook (distintos a los de Instagram)
    const axxisFbId = process.env.META_AXXIS_FB_PAGE_ID || 'default';
    const dinersFbId = process.env.META_DINERS_FB_PAGE_ID || 'default';

    // Facebook Page Insights requiere el Page Access Token (no el de usuario)
    const pageTokens = await getPageAccessTokens(token);
    const axxisFbToken = pageTokens[axxisFbId] || token;
    const dinersFbToken = pageTokens[dinersFbId] || token;

    // Instagram insights (vía graph.facebook.com, no graph.instagram.com)
    const [axxisIgRes, dinersIgRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisIgId}/insights`, {
        params: {
          metric: 'reach,profile_views,accounts_engaged,total_interactions',
          period: 'day',
          metric_type: 'total_value',
          since,
          until,
          access_token: token,
        },
      }).catch((err) => {
        errors.push('AXXIS Instagram: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
      axios.get(`https://graph.facebook.com/v19.0/${dinersIgId}/insights`, {
        params: {
          metric: 'reach,profile_views,accounts_engaged,total_interactions',
          period: 'day',
          metric_type: 'total_value',
          since,
          until,
          access_token: token,
        },
      }).catch((err) => {
        errors.push('Diners Instagram: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
    ]);

    // Facebook Page insights (page_fans/page_impressions* fueron deprecadas por Meta en 2023)
    const [axxisFbRes, dinersFbRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisFbId}/insights`, {
        params: {
          metric: 'page_post_engagements,page_views_total',
          period: 'day',
          since,
          until,
          access_token: axxisFbToken,
        },
      }).catch((err) => {
        errors.push('AXXIS Facebook: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
      axios.get(`https://graph.facebook.com/v19.0/${dinersFbId}/insights`, {
        params: {
          metric: 'page_post_engagements,page_views_total',
          period: 'day',
          since,
          until,
          access_token: dinersFbToken,
        },
      }).catch((err) => {
        errors.push('Diners Facebook: ' + (err.response?.data?.error?.message || err.message));
        return { data: null };
      }),
    ]);

    // Fan count (seguidores) como proxy de alcance — page_fans fue deprecada
    const [axxisFbFields, dinersFbFields] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisFbId}`, {
        params: { fields: 'fan_count', access_token: axxisFbToken },
      }).catch(() => ({ data: null })),
      axios.get(`https://graph.facebook.com/v19.0/${dinersFbId}`, {
        params: { fields: 'fan_count', access_token: dinersFbToken },
      }).catch(() => ({ data: null })),
    ]);

    return Response.json({
      errors,
      axxis: {
        instagram: parseInstagramResponse(axxisIgRes.data),
        facebook: parseFacebookResponse(axxisFbRes.data, axxisFbFields.data),
      },
      diners: {
        instagram: parseInstagramResponse(dinersIgRes.data),
        facebook: parseFacebookResponse(dinersFbRes.data, dinersFbFields.data),
      },
    });
  } catch (error) {
    console.error('Meta API Error:', error.message);
    return Response.json({ error: error.message }, { status: 502 });
  }
}

function parseInstagramResponse(data) {
  if (!data || !data.data) {
    return {
      reach: 0,
      impressions: 0,
      engagement: 0,
      engagementRate: 0,
    };
  }

  const metrics = {};
  data.data.forEach(item => {
    metrics[item.name] = item.total_value?.value ?? item.values?.[0]?.value ?? 0;
  });

  const reach = metrics.reach || 0;
  const engagement = metrics.total_interactions || metrics.accounts_engaged || 0;

  return {
    reach,
    impressions: metrics.profile_views || 0,
    engagement,
    engagementRate: reach ? (engagement / reach) : 0,
  };
}

function parseFacebookResponse(data, fieldsData) {
  const metrics = {};
  if (data && data.data) {
    data.data.forEach(item => {
      metrics[item.name] = (item.values || []).reduce((sum, v) => sum + (v.value || 0), 0);
    });
  }

  const impressions = metrics.page_views_total || 0;
  const engagement = metrics.page_post_engagements || 0;
  const reach = fieldsData?.fan_count || 0;

  return {
    reach,
    impressions,
    engagement,
    engagementRate: reach ? (engagement / reach) : 0,
  };
}
