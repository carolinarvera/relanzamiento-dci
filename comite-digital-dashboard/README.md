# Comité Digital Dashboard

Dashboard en vivo con métricas de GSC, GA4 e Instagram/Facebook.

## Setup Rápido

### 1. Copiar el proyecto a tu máquina

```bash
git clone <repo-url> comite-digital-dashboard
cd comite-digital-dashboard
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
cp .env.example .env.local
```

Luego edita `.env.local`:
- `GOOGLE_CLOUD_JSON_KEY`: El contenido completo del JSON key (como string)
- `GA4_AXXIS_ID`: 352202754
- `GA4_DINERS_ID`: 352131785
- `GSC_AXXIS_URL`: https://revistaaxxis.com.co/
- `GSC_DINERS_URL`: https://revistadiners.com.co/
- `META_ACCESS_TOKEN`: Tu token de Meta
- `META_AXXIS_PAGE_ID`: ID de página de Instagram/Facebook AXXIS (opcional por ahora)
- `META_DINERS_PAGE_ID`: ID de página de Instagram/Facebook Diners (opcional por ahora)

### 3. Correr localmente

```bash
npm run dev
```

Abre http://localhost:3000

### 4. Desplegar en Vercel

```bash
npm install -g vercel
vercel deploy
```

Cuando Vercel te pregunte, configura las variables de entorno en el dashboard de Vercel:
- Ve a Project Settings → Environment Variables
- Pega cada variable según tu `.env.local`

## Estructura

```
app/
├── page.jsx          # Dashboard principal
├── layout.jsx        # Layout base
└── api/
    ├── gsc/route.js  # Google Search Console API
    ├── ga4/route.js  # Google Analytics 4 API
    └── meta/route.js # Instagram/Facebook API
```

## Notas

- El dashboard actualiza cada 5 minutos
- Por ahora, GSC y Meta tienen datos mock. Actualmente GSC y GA4 están integradas parcialmente.
- Para activar la integración completa de Google APIs, necesita configuración de OAuth2 y JWT.

## URLs

- **Local:** http://localhost:3000
- **Vercel:** https://comite-digital-dashboard.vercel.app (una vez desplegada)
