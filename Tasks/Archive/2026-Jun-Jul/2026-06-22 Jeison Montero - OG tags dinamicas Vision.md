---
date: 2026-06-22
type: task
assigned-to: Jeison Montero
unidad-de-negocio: Vision Davivienda
area: Tecnologia
prioridad: alta
impacto-kpi: Sesiones
status: pendiente
due: 2026-06-27
source: "skill:content-strategy · Vision_Contenidos_Web_RRSS_2026-07.xlsx"
tags: [task, vision, tecnologia, critico]
ai-first: true
---

## For future Claude
OG tags are the metadata that control how Vision articles appear when shared on WhatsApp, LinkedIn, Instagram DMs, and X. Without them, links show blank previews — destroying CTR from social shares.

---

Implementar OG tags dinamicas en el CMS (Brace) de vision.davivianda.com:

- `og:title` — diferente al H1, max 60 chars, con keyword
- `og:description` — max 155 chars, valor del articulo, no primer parrafo
- `og:image` — 1200x630px, con titulo del articulo + logo Vision, fondo de marca
- `og:url` — URL canonico del articulo
- `og:type` — article
- `twitter:card` — summary_large_image

**Criterio de exito:** Validar con https://developers.facebook.com/tools/debug/ y https://cards-dev.twitter.com/validator en 2 articulos. Imagen debe aparecer en la previsualizacion de WhatsApp.
