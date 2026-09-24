import axios from 'axios';

export async function GET() {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) throw new Error('META_ACCESS_TOKEN no configurado');

    // IDs de Instagram Business Account (usados vía Facebook Graph API)
    const axxisIgId = process.env.META_AXXIS_PAGE_ID || 'default';
    const dinersIgId = process.env.META_DINERS_PAGE_ID || 'default';
    // IDs de página de Facebook (distintos a los de Instagram)
    const axxisFbId = process.env.META_AXXIS_FB_PAGE_ID || 'default';
    const dinersFbId = process.env.META_DINERS_FB_PAGE_ID || 'default';

    // Instagram insights (vía graph.facebook.com, no graph.instagram.com)
    const [axxisIgRes, dinersIgRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisIgId}/insights`, {
        params: {
          metric: 'reach,profile_views,accounts_engaged,total_interactions',
          period: 'day',
          metric_type: 'total_value',
          access_token: token,
        },
      }).catch((err) => {
        console.error('AXXIS Instagram error:', err.response?.data || err.message);
        return { data: null };
      }),
      axios.get(`https://graph.facebook.com/v19.0/${dinersIgId}/insights`, {
        params: {
          metric: 'reach,profile_views,accounts_engaged,total_interactions',
          period: 'day',
          metric_type: 'total_value',
          access_token: token,
        },
      }).catch((err) => {
        console.error('Diners Instagram error:', err.response?.data || err.message);
        return { data: null };
      }),
    ]);

    // Facebook Page insights
    const [axxisFbRes, dinersFbRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${axxisFbId}/insights`, {
        params: {
          metric: 'page_fans',
          access_token: token,
        },
      }).catch((err) => {
        console.error('AXXIS Facebook error:', err.response?.data || err.message);
        return { data: null };
      }),
      axios.get(`https://graph.facebook.com/v19.0/${dinersFbId}/insights`, {
        params: {
          metric: 'page_fans',
          access_token: token,
        },
      }).catch((err) => {
        console.error('Diners Facebook error:', err.response?.data || err.message);
        return { data: null };
      }),
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

  const impressions = metrics.profile_views || 0;
  const engagement = metrics.total_interactions || metrics.accounts_engaged || 0;

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
  const engagement = metrics.page_post_engagements || 0;

  return {
    reach: metrics.page_impressions_unique || 0,
    impressions,
    engagement,
    engagementRate: impressions ? (engagement / impressions) : 0,
  };
}
