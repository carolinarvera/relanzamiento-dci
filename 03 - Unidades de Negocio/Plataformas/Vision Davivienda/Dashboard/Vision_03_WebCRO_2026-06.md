---
date: 2026-06-16
type: dashboard-tab
tags: [vision-davivienda, dashboard, web, cro, ux, junio-2026]
related-projects: [vision-davivienda, growth-dashboard]
sources:
  - "GA4 mayo 2026"
  - "Auditoría técnica browser 2026-06-16"
ai-first: true
confidence: high
---

# Visión Davivienda — Web & CRO
**Período:** Mayo / Junio 2026

---

## Métricas Web — Mayo 2026 (plataforma principal)

| Métrica | Valor | KPI | Estado |
|---------|-------|-----|--------|
| Sesiones totales | 42,295 | — | 🟢 |
| Usuarios únicos | 24,899 | — | 🟢 |
| % Rebote | 59.75% | <61% | ✅ |
| Duración media sesión | 00:03:15 | — | 🟢 |
| Vistas por sesión | 1.61 | — | 🟠 bajo |
| Páginas/visita (benchmark) | **1.36** vs Bloomberg 2.6 | — | 🟠 brecha |
| Usuarios nuevos | 50.1% | — | 🟢 |
| Usuarios recurrentes | 40.1% | — | 🟢 |

---

## Canales de tráfico — Mayo 2026

| Canal | Sesiones | % | Calidad |
|-------|----------|---|---------|
| 📧 Email (informe diario + boletines) | ~21,600 | **51%** | Media — CTR email 2% |
| 📱 Meta Paid (FB/IG) | 8,580 | 20.3% | Media |
| 🔗 Direct | 5,384 | 12.7% | Rebote 64.67% |
| 🔍 Google Organic | 4,485 | 10.6% | **Alta** — rebote 45%, 4:46 |
| 💰 Google CPC (GOSEM) | 4,292 | 10.2% | Media |
| 📲 Organic Social | 1,846 | 4.4% | — |
| ❓ Unassigned | 1,496 | 3.5% | ⚠️ UTMs incompletos |

---

## Top contenidos por sesiones — Mayo 2026

| # | Categoría | Sesiones | % total |
|---|-----------|----------|---------|
| 1 | Estar Actualizado | 13,784 | 33.8% |
| 2 | ¿En qué Invertir? | 11,335 | 27.8% |
| 3 | Macroeconomía | 7,153 | 17.5% |
| 4 | Análisis de Compañías | 4,919 | 12.1% |

---

## Hallazgos CRO — Auditoría técnica 2026-06-16

### Problemas que afectan conversión (suscripción + retorno)

| Issue | Impacto en CRO | Fix |
|-------|---------------|-----|
| Títulos de página genéricos en todos los artículos | Usuario no diferencia páginas en SERP → CTR bajo → menos sesiones | Fix técnico Brace |
| Contenido JS-rendered 3s | Abandono antes de ver contenido → bounce alto | SSR/SSG |
| Email CTR al 2% | Canal #1 desperdiciado — 98% de suscriptores no hacen clic | Rediseño plantillas email |
| Sin paginación visible en categorías | Usuario no descubre más contenido → 1.36 páginas/visita | Implementar paginación |
| Links de tarjetas sin texto | Accesibilidad comprometida | Leo: aria-label |
| Suscripción manual (Brace MVP) | Fricción en proceso de alta | Automatizar con Brace completo |

### Fortalezas de UX confirmadas
- Arquitectura de navegación clara — 9 secciones bien diferenciadas
- Tiempo de sesión 3:15 — usuario encuentra valor
- Rebote 59.75% por debajo del KPI <61%
- Libro 2026: tiempo en sitio 6:08 — formato largo funciona muy bien
- Mobile viewport configurado correctamente

---

## Performance técnica — Homepage

| Métrica | Valor | Referencia |
|---------|-------|-----------|
| TTFB | **275ms** | Excelente (<600ms) |
| DOM Interactive | 294ms | Muy bueno |
| DOM Complete | 575ms | Bueno (shell SPA) |
| Carga total recursos | 51 recursos | Elevado |
| JS scripts | **25 scripts** | Alto — causa delay |
| Transfer inicial | ~1KB | Shell SPA muy ligero |
| Contenido visible | **+3,000ms** | ⚠️ JS rendering tardío |

### Terceros cargando en cada página
- Google Tag Manager + GA4
- Microsoft Clarity (heatmaps)
- Meta Pixel (Facebook)
- Google Fonts (2 dominios)
- Cloudflare Insights
- Amazon S3 (imágenes — sin CDN)

---

## Oportunidades CRO prioritarias

| Oportunidad | Impacto estimado | Esfuerzo |
|-------------|-----------------|---------|
| Rediseño plantillas email (CTR 2% → 5%+) | +60% sesiones desde email | Bajo |
| ManyChat — DM automático de informes | +X suscriptores Instagram | Bajo ($69/mes) |
| Implementar canonical + títulos dinámicos | CTR orgánico +30% en 90 días | Medio (Leo) |
| Corregir JS rendering | Sesiones orgánicas +40% potencial | Alto (Leo/Brace) |
| Paginación en categorías | +páginas/visita | Medio |
