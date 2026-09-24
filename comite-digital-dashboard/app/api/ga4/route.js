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
        sessions: 93919,
        users: 80065,
        newUsers: 72360,
        pageviews: 136612,
        bounceRate: 0.48,
        avgSessionDuration: '00:01:23',
        engagementRate: 0.5171,
        sessionsChange: -0.318,
        pageviewsChange: -0.168,
        usersChange: -0.306,
        newUsersChange: -0.318,
        bounceRateChange: -0.234,
        avgSessionDurationChange: -0.038,
        engagementRateChange: 0.40,
        dailyViews: [
          { label: '2 ago', value: 5250 },
          { label: '3 ago', value: 4700 },
          { label: '4 ago', value: 5400 },
          { label: '5 ago', value: 5200 },
          { label: '6 ago', value: 5900 },
          { label: '7 ago', value: 5500 },
          { label: '8 ago', value: 5000 },
          { label: '9 ago', value: 5100 },
          { label: '10 ago', value: 4650 },
          { label: '11 ago', value: 4900 },
          { label: '12 ago', value: 4750 },
          { label: '13 ago', value: 3400 },
          { label: '14 ago', value: 3800 },
          { label: '15 ago', value: 3700 },
          { label: '16 ago', value: 4000 },
          { label: '17 ago', value: 3500 },
          { label: '18 ago', value: 4400 },
          { label: '19 ago', value: 4900 },
          { label: '20 ago', value: 4200 },
          { label: '21 ago', value: 3900 },
          { label: '22 ago', value: 3300 },
          { label: '23 ago', value: 2200 },
          { label: '24 ago', value: 2400 },
          { label: '25 ago', value: 4700 },
          { label: '26 ago', value: 4300 },
          { label: '27 ago', value: 4400 },
          { label: '28 ago', value: 3800 },
          { label: '29 ago', value: 3750 },
          { label: '30 ago', value: 4200 },
          { label: '31 ago', value: 5186 },
          { label: '1 sep', value: 3900 },
          { label: '2 sep', value: 4000 },
          { label: '3 sep', value: 3500 },
          { label: '4 sep', value: 3200 },
          { label: '5 sep', value: 3000 },
          { label: '6 sep', value: 3200 },
          { label: '7 sep', value: 3800 },
          { label: '8 sep', value: 3600 },
          { label: '9 sep', value: 3300 },
          { label: '10 sep', value: 3500 },
          { label: '11 sep', value: 3300 },
          { label: '12 sep', value: 2800 },
          { label: '13 sep', value: 3200 },
          { label: '14 sep', value: 3800 },
          { label: '15 sep', value: 3400 },
          { label: '16 sep', value: 3500 },
          { label: '17 sep', value: 2400 },
          { label: '18 sep', value: 3300 },
          { label: '19 sep', value: 3647 },
          { label: '20 sep', value: 3400 }
        ],
        dailyPeaks: [
          { label: '6 ago', value: 5900, note: 'Estadio de Bogotá' },
          { label: '31 ago', value: 5186, note: 'Colegio Chía' },
          { label: '19 sep', value: 3647, note: 'Edificio Gimnasio Los Cerros' },
        ],
        septPartial: { range: '1 al 21 de septiembre', views: 67523, viewsChange: -0.31, users: 42749, usersChange: -0.241 },
        analysis: 'Cerramos agosto con 136.612 visitas, por debajo de julio (164.000), pero cerca de la meta mensual de 140.000, con un promedio diario estable de unas 4.400 visitas salvo un fin de semana. El tiempo de lectura estuvo afectado por un error de Analytics durante diez días y, además, el terremoto marcó parte de la línea editorial, representando un reto para adaptar los contenidos de AXXIS a la coyuntura.',
        monthlyHistory: [
          { month: 'ene 2026', sesiones: 102342, vistas: 131316, usuarios: 81215 },
          { month: 'feb 2026', sesiones: 86510, vistas: 114258, usuarios: 68357 },
          { month: 'mar 2026', sesiones: 99187, vistas: 123321, usuarios: 77472 },
          { month: 'abr 2026', sesiones: 70962, vistas: 89357, usuarios: 58182 },
          { month: 'may 2026', sesiones: 69142, vistas: 86765, usuarios: 54400 },
          { month: 'jun 2026', sesiones: 97699, vistas: 117470, usuarios: 80778 },
          { month: 'jul 2026', sesiones: 137622, vistas: 164159, usuarios: 115360 },
          { month: 'ago 2026', sesiones: 93919, vistas: 136612, usuarios: 80065 },
        ],
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
    newUsers: res.newUsers || 0,
    pageviews: res.pageviews || 0,
    bounceRate: res.bounceRate || 0,
    avgSessionDuration: res.avgSessionDuration || null,
    engagementRate: res.engagementRate || 0,
    sessionsChange: res.sessionsChange ?? null,
    pageviewsChange: res.pageviewsChange ?? null,
    usersChange: res.usersChange ?? null,
    newUsersChange: res.newUsersChange ?? null,
    bounceRateChange: res.bounceRateChange ?? null,
    avgSessionDurationChange: res.avgSessionDurationChange ?? null,
    engagementRateChange: res.engagementRateChange ?? null,
    monthlyHistory: res.monthlyHistory || [],
    dailyViews: res.dailyViews || [],
    dailyPeaks: res.dailyPeaks || [],
    septPartial: res.septPartial || null,
    analysis: res.analysis || null,
  };
}
