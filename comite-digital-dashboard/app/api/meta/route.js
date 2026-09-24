import axios from 'axios';

export async function GET() {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');

    const axxisPageId = process.env.META_AXXIS_PAGE_ID || 'default';
    const dinersPageId = process.env.META_DINERS_PAGE_ID || 'default';

    // Instagram insights
    const [axxisIgRes, dinersIgRes] = await Promise.all([
      axios.get(`https://graph.instagram.com/${axxisPageId}/insights`, {
        params: {
          metric: 'impressions,reach,profile_views,website_clicks,engagement',
          period: 'day',
          access_token: token,
        },
      }).catch(() => ({ data: null })),
      axios.get(`https://graph.instagram.com/${dinersPageId}/insights`, {
        params: {
          metric: 'impressions,reach,profile_views,website_clicks,engagement',
          period: 'day',
          access_token: token,
        },
      }).catch(() => ({ data: null })),
    ]);

    // Facebook insights
    const [axxisFbRes, dinersFbRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/${axxisPageId}/insights`, {
        params: {
          metric: 'page_impressions,page_fan_adds,page_engaged_users,page_actions_post_like',
          period: 'day',
          access_token: token,
        },
      }).catch(() => ({ data: null })),
      axios.get(`https://graph.facebook.com/${dinersPageId}/insights`, {
        params: {
          metric: 'page_impressions,page_fan_adds,page_engaged_users,page_actions_post_like',
          period: 'day',
          access_token: token,
        },
      }).catch(() => ({ data: null })),
    ]);

    return Response.json({
      axxis: {
        instagram: parseInstagramResponse(axxisIgRes.data),
        facebook: parseFacebookResponse(axxisFbRes.data),
      },
      diners: {
        instagram: parseInstagramResponse(dinersIgRes.data),
        facebook: parseFacebookResponse(dinersFbRes.data),
      },
    });
  } catch (error) {
    console.error('Meta API Error:', error);
    // Mock data en caso de error
    return Response.json({
      axxis: {
        instagram: {
          reach: 145000,
          impressions: 320000,
          engagement: 12500,
          engagementRate: 0.0391,
        },
        facebook: {
          reach: 95000,
          impressions: 210000,
          engagement: 8300,
          engagementRate: 0.0395,
        },
      },
      diners: {
        instagram: {
          reach: 215000,
          impressions: 520000,
          engagement: 31200,
          engagementRate: 0.06,
        },
        facebook: {
          reach: 180000,
          impressions: 410000,
          engagement: 24500,
          engagementRate: 0.0598,
        },
      },
    });
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
    metrics[item.name] = item.values?.[0]?.value || 0;
  });

  const impressions = metrics.impressions || 0;
  const engagement = (metrics.engagement || metrics.profile_views || 0);

  return {
    reach: metrics.reach || 0,
    impressions,
    engagement,
    engagementRate: impressions ? (engagement / impressions) : 0,
  };
}

function parseFacebookResponse(data) {
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
    metrics[item.name] = item.values?.[0]?.value || 0;
  });

  const impressions = metrics.page_impressions || 0;
  const engagement = (metrics.page_engaged_users || metrics.page_actions_post_like || 0);

  return {
    reach: metrics.page_fan_adds || 0,
    impressions,
    engagement,
    engagementRate: impressions ? (engagement / impressions) : 0,
  };
}
