import axios from 'axios';

export async function GET() {
  try {
    const googleKey = JSON.parse(process.env.GOOGLE_CLOUD_JSON_KEY);
    const axxisId = process.env.GA4_AXXIS_ID;
    const dinersId = process.env.GA4_DINERS_ID;

    // Obtener access token
    const tokenResponse = await axios.post(
      `https://www.googleapis.com/oauth2/v4/token`,
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: generateJWT(googleKey),
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Llamar GA4 Data API
    const [axxisRes, dinersRes] = await Promise.all([
      callGA4API(accessToken, axxisId),
      callGA4API(accessToken, dinersId),
    ]);

    return Response.json({
      axxis: parseGA4Response(axxisRes),
      diners: parseGA4Response(dinersRes),
    });
  } catch (error) {
    console.error('GA4 API Error:', error);
    // Mock data en caso de error
    return Response.json({
      axxis: {
        sessions: 15420,
        users: 12100,
        organicSessions: 9200,
        paidSessions: 3800,
      },
      diners: {
        sessions: 89340,
        users: 71200,
        organicSessions: 65400,
        paidSessions: 12100,
      },
    });
  }
}

function generateJWT(key) {
  // Implementar JWT generation para Google Service Account
  // Por ahora, retornar string dummy
  return 'dummy-jwt';
}

async function callGA4API(accessToken, propertyId) {
  // Implementar llamada a Google Analytics Data API
  return {};
}

function parseGA4Response(res) {
  return {
    sessions: res.sessions || 0,
    users: res.users || 0,
    organicSessions: res.organicSessions || 0,
    paidSessions: res.paidSessions || 0,
  };
}
