---
date: 2026-06-16
type: auditoria
tags: [vision-davivienda, seo, web, cro, auditoria, tecnico, schema, performance, brace]
related-people: [Carolina Ramirez, Natalia Otalora, Jeison Montero]
related-projects: [Estrategia-Digital, vision-davivienda]
sources:
  - "Auditoría directa via browser 2026-06-16 — vision.davivienda.com"
  - "robots.txt: https://vision.davivienda.com/robots.txt"
ai-first: true
confidence: high
---

# Auditoría Web / SEO / CRO — Visión Davivienda
**Fecha:** 2026-06-16 | **Ejecutada por:** Claude vía browser automation
**URL auditada:** https://vision.davivienda.com/

> **For future Claude:** Auditoría técnica completa del sitio post-migración a Brace CMS. Hallazgos críticos: canonical tags ausentes en TODO el sitio, títulos y meta descriptions duplicados en todas las páginas, contenido renderizado por JavaScript con delay de 3+ segundos (riesgo de indexación), sitemap.xml devuelve 403, schema limitado a Organization+WebSite únicamente. Estos 5 issues bloquean el objetivo de tráfico orgánico 2026. Requieren acción inmediata de Leo (proveedor técnico).

---

## RESUMEN EJECUTIVO

| Área | Puntuación | Estado |
|------|-----------|--------|
| Canonicalización | 0/10 | 🔴 Crítico — ausente en todo el sitio |
| Títulos / Metas | 1/10 | 🔴 Crítico — duplicados sitewide |
| Renderizado JS | 3/10 | 🔴 Crítico — 3s delay, riesgo indexación |
| Schema Markup | 2/10 | 🔴 Crítico — sin Article ni NewsArticle |
| Sitemap | 0/10 | 🔴 Crítico — 403 Forbidden |
| Velocidad (TTFB) | 8/10 | 🟢 TTFB 275ms — bueno |
| Arquitectura URLs | 6/10 | 🟡 Mayoría buena, algunos 4 niveles |
| Imágenes | 5/10 | 🟡 Servidas desde S3 sin CDN |
| robots.txt | 9/10 | 🟢 Bien configurado |
| Mobile | 8/10 | 🟢 Viewport correcto, lang="es" |

**Veredicto: el sitio tiene una base técnica de servidor sólida (TTFB bueno, HTTPS, mobile OK) pero la migración a Brace dejó 5 issues críticos de SEO que están limitando activamente la indexación y el ranking. Son todos fixes de desarrollo, no de contenido.**

---

## ISSUES CRÍTICOS — P0 (bloquean tráfico orgánico)

---

### 🔴 C1 — Canonical tags ausentes en todo el sitio

**Evidencia:** Revisadas homepage, artículo individual (`/estar-actualizado/...`) y dos categorías (`/macroeconomia`, `/en-que-invertir`). Todas retornan `canonical: MISSING`.

**Impacto:** Sin canonical, Google puede:
- Indexar múltiples variantes de la misma URL (con/sin trailing slash, con parámetros, HTTP vs HTTPS)
- Dividir el PageRank entre versiones
- Elegir la URL "canónica" equivocada para rankear
- Esto es especialmente peligroso durante/post migración a Brace

**Fix:** Agregar `<link rel="canonical" href="[URL exacta de la página]">` en el `<head>` de cada template del CMS. En Brace, debe generarse dinámicamente con la URL completa de la página actual.

**Owner:** Leo (desarrollo Brace) | **Prioridad:** Esta semana

---

### 🔴 C2 — Títulos duplicados en todo el sitio

**Evidencia:**
- Homepage: `"Visión Davivienda | Análisis económico, financiero y de mercados"`
- Artículo `lo-que-hoy-debe-saber-16-junio-2026`: mismo título que homepage
- Categoría `/macroeconomia`: mismo título que homepage
- Categoría `/en-que-invertir`: mismo título que homepage

**Impacto:**
- Google no puede distinguir qué página rankear para cada query
- CTR bajo en SERP porque los títulos no describen el contenido real del artículo
- Páginas individuales pierden toda oportunidad de rankear por queries específicos

**Fix por tipo de página:**

| Tipo | Formato título | Ejemplo |
|------|---------------|---------|
| Homepage | `Visión Davivienda | Análisis económico y financiero Colombia` | — |
| Artículo | `[Título del artículo] \| Visión Davivienda` | `EE.UU. e Irán acuerdan poner fin al conflicto \| Visión Davivienda` |
| Categoría | `[Nombre categoría]: análisis y perspectivas \| Visión Davivienda` | `Macroeconomía Colombia: análisis y perspectivas \| Visión Davivienda` |
| Subcategoría | `[Nombre subcategoría] \| Visión Davivienda` | `¿En qué invertir en Colombia? \| Visión Davivienda` |

**Owner:** Leo (Brace templates) + Ernesto/Estefanía (meta copies) | **Prioridad:** Esta semana

---

### 🔴 C3 — Meta descriptions duplicadas en todo el sitio

**Evidencia:** Todas las páginas revisadas comparten la misma meta:
> *"Herramientas, perspectivas y tendencias clave, explicadas por expertos, para tomar decisiones de inversión más informadas, estratégicas y con mayor confianza."*

**Impacto:** Google reescribe metas cuando detecta duplicación — pierde control de la narrativa en el SERP. CTR subóptimo en todas las páginas indexadas.

**Fix:** Template dinámico que use los primeros 155 caracteres del artículo o un excerpt manual por categoría. Para artículos: usar el "smart content" / abstract que ya genera Ernesto.

**Owner:** Leo (Brace) + Ernesto | **Prioridad:** Esta semana

---

### 🔴 C4 — Contenido renderizado por JavaScript con delay 3+ segundos

**Evidencia:**
- Al cargar `/estar-actualizado/.../lo-que-hoy-debe-saber-16-junio-2026` inmediatamente: `wordCount: 1`
- Después de 3 segundos: `wordCount: 1005`
- El sitio usa arquitectura SPA (Single Page Application) con Brace
- 25 recursos JavaScript cargan en cada página

**Impacto:** Googlebot tiene tiempo limitado de renderizado. Si el bot indexa la versión sin JS ejecutado, ve una página vacía (1 palabra). Esto explicaría en parte la caída de tráfico de 2024→2025 si la migración a Brace introdujo este patrón.

**Fix:** Implementar Server-Side Rendering (SSR) o Static Site Generation (SSG) para las páginas de artículos y categorías. Al menos implementar pre-rendering para el contenido crítico. Verificar en Google Search Console → URL Inspection si el contenido renderizado coincide con lo que ve el usuario.

**Owner:** Leo (arquitectura Brace) | **Prioridad:** URGENTE — puede ser la causa principal de la caída de tráfico

---

### 🔴 C5 — Sitemap.xml devuelve 403 Forbidden

**Evidencia:** `GET https://vision.davivienda.com/sitemap.xml` → HTTP 403
**robots.txt declara:** `Sitemap: https://vision.davivienda.com/sitemap.xml` — referencia válida pero URL inaccesible

**Impacto:** Google no puede usar el sitemap para descubrir URLs. El crawl depende exclusivamente de links internos, lo que ralentiza la indexación de contenido nuevo y puede dejar artículos sin indexar.

**Fix:** Verificar configuración del servidor/CDN (Cloudflare) que está bloqueando el acceso al sitemap. Asegurar que `/sitemap.xml` devuelve 200 para todos los user-agents. Resubmitir a Google Search Console una vez accesible.

**Owner:** Leo + Jeison | **Prioridad:** Esta semana

---

## ISSUES DE ALTO IMPACTO — P1

---

### 🟠 H1 — Schema markup insuficiente (sin Article ni NewsArticle)

**Evidencia:** Todas las páginas solo tienen:
```json
{"@type": "Organization"} + {"@type": "WebSite"}
```
Ausente en artículos: `Article` / `NewsArticle`, `BreadcrumbList`, `Person` (autor)

**Impacto para objetivos 2026:**
- Sin `NewsArticle` schema: inelegible para Google News y rich results de noticias
- Sin `BreadcrumbList`: sin breadcrumbs en SERP (reduce CTR)
- Sin `Person` schema en autores: señal E-E-A-T débil para el reto de búsquedas IA
- Sin `FAQPage` o `Speakable`: invisible para AI Overviews de Google

**Schema mínimo a implementar por tipo de página:**

| Tipo página | Schema a agregar |
|-------------|-----------------|
| Artículo | `NewsArticle` (headline, datePublished, dateModified, author, image, articleBody) |
| Categoría | `BreadcrumbList` |
| Homepage | `FAQPage` con preguntas frecuentes + `Speakable` |
| Autor | `Person` (name, jobTitle, url) |

**Owner:** Leo (implementación) + Ernesto (datos editoriales) | **Prioridad:** 2 semanas

---

### 🟠 H2 — URLs de 4 niveles de profundidad

**Evidencia:**
```
/en-que-invertir/renta-fija/inversionistas-de-tes/inversionistas-tes-prepago-trs-ventas-extranjeros-2026
```
4 niveles de profundidad + slug muy largo (62 caracteres en el slug final)

**Impacto:** Crawl depth elevado reduce prioridad de indexación. Slugs largos diluyen el peso de keywords en la URL.

**Recomendación:** Mantener máximo 3 niveles. Para artículos de subcategoría: `/en-que-invertir/renta-fija/[slug-corto]`. Acortar slugs eliminando años o palabras de relleno.

**Owner:** Leo (redirecciones 301) + Ernesto (política editorial de URLs) | **Prioridad:** Medio plazo

---

### 🟠 H3 — Links de tarjetas sin texto ancla

**Evidencia:** En `/en-que-invertir` se detectaron links con texto vacío:
```json
{"text":"","href":"https://vision.davivienda.com/en-que-invertir/renta-fija/..."}
```
Las tarjetas de artículos tienen `<a>` wrapeando imágenes sin `alt` text ni aria-label.

**Impacto:** Google no puede interpretar el contexto del link → pierde señal de relevancia. Accesibilidad comprometida.

**Fix:** Agregar `aria-label="[Título del artículo]"` en el `<a>` o `alt` descriptivo en la imagen dentro de la tarjeta.

**Owner:** Leo | **Prioridad:** 2 semanas

---

### 🟠 H4 — Imágenes servidas desde S3 sin CDN de imágenes

**Evidencia:** Recursos de imágenes cargan desde:
`prod-vision-davivienda.s3.us-east-1.amazonaws.com`

El sitio usa Cloudflare para el dominio principal pero las imágenes evaden el CDN al venir directamente de un bucket S3 en us-east-1 (Virginia, USA).

**Impacto:** Latencia adicional para usuarios en Colombia (~100-150ms extra vs un CDN con presencia en Bogotá). Imágenes sin optimización automática de formato (WebP) ni compresión.

**Fix:** Configurar CloudFront delante del bucket S3 o usar Cloudflare Images/R2. Habilitar conversión automática a WebP.

**Owner:** Leo / Jeison | **Prioridad:** Medio plazo

---

### 🟠 H5 — Sin autor individual en artículos (E-E-A-T débil)

**Evidencia:** Artículos atribuidos a "Visión Davivienda" como entidad, sin nombre de analista individual, sin bio, sin foto.

**Impacto:** En 2026, Google pondera fuertemente la experiencia real del autor (E-E-A-T) para contenido YMYL (Your Money Your Life) — exactamente la categoría de análisis financiero. Sin autor identificable, el contenido tiene señales E-E-A-T débiles frente a Bloomberg, Reuters o BanRep.

**Fix:** Crear páginas de autor para el equipo de investigaciones económicas de Davivienda. Vincular artículos a su autor real. Agregar `Person` schema con credentials. Esto también apoya el objetivo de AI Overviews — los modelos de IA priorizan citar fuentes con autores verificables.

**Owner:** Ernesto + Natalia (política editorial) | **Prioridad:** 2-3 semanas

---

## ISSUES MEDIOS — P2

---

### 🟡 M1 — OG Title diferente del Title tag en homepage

- **Title:** "Visión Davivienda | Análisis económico, financiero y de mercados"
- **OG Title:** "Visión Davivienda | Informes económicos y financieros"

Inconsistencia que confunde el mensaje de marca en social sharing vs SERP. **Fix:** Alinear ambos.

---

### 🟡 M2 — H1 en mayúsculas como valor HTML (no CSS)

Los H1 de categorías aparecen como `"MACROECONOMÍA"` y `"¿EN QUÉ INVERTIR?"` en el DOM.
Si es texto real en mayúsculas (no `text-transform: uppercase` en CSS), Google lee eso literalmente — menos natural para keyword matching.
**Fix:** Verificar si es CSS o HTML. Si es HTML, cambiar a casing normal con CSS para mayúsculas visuales.

---

### 🟡 M3 — Zero external links

La homepage no tiene ningún link externo. Cero. **Impacto menor** pero los links salientes a fuentes autorizadas (Banco de la República, DANE, FMI) son señal positiva de E-E-A-T. **Fix:** Agregar 2-3 links a fuentes institucionales en el footer o en artículos.

---

### 🟡 M4 — 25 scripts JavaScript en cada carga

**Evidencia:** 25 recursos JS cargan en cada página (GTM, GA4, Microsoft Clarity, Meta Pixel, Google Fonts x2, Cloudflare Insights, Amazon S3).

**Impacto:** Contribuye al delay de renderizado de 3 segundos. GTM y Clarity son scripts síncronos que bloquean el parser.

**Fix:** Cargar tracking scripts con `defer` o `async`. Consolidar en GTM en lugar de cargar scripts individuales. Implementar `<link rel="preconnect">` para dominios de terceros (fonts.googleapis.com, connect.facebook.net).

---

## FORTALEZAS CONFIRMADAS ✅

| Ítem | Detalle |
|------|---------|
| TTFB 275ms | Tiempo de respuesta del servidor excelente — infraestructura sólida |
| HTTPS | Sitio completamente en HTTPS |
| Mobile-first | `viewport` correctamente configurado |
| `lang="es"` | Atributo de idioma presente en `<html>` |
| robots.txt | Bien configurado — permite Googlebot, bloquea solo /download, /pdf/, /search? |
| URLs semánticas | `/macroeconomia/`, `/en-que-invertir/`, `/estar-actualizado/` — palabras clave relevantes |
| H1 únicos | Cada página tiene H1 diferente (el único elemento on-page que no está duplicado) |
| Cloudflare | CDN activo para el dominio principal |
| Schema base | Organization + WebSite presentes (base mínima, expandible) |
| Estructura nav | 9 secciones bien categorizadas por intención de búsqueda |

---

## ARQUITECTURA DEL SITIO

### Navegación principal detectada

| Sección | URL | Potencial SEO |
|---------|-----|--------------|
| Estar actualizado | /estar-actualizado | Alto — tráfico daily/newsletter |
| Macroeconomía | /macroeconomia | Alto — keyword alta búsqueda |
| Nuestros indicadores | /nuestros-indicadores | Medio — herramienta de retención |
| Economías centroamericanas | /economias-centroamericanas | Medio — nicho diferencial |
| Tendencias sectoriales | /tendencias-sectoriales | Alto — evergreen |
| Análisis de compañías | /analisis-de-companias | Alto — alta intención inversión |
| ¿En qué invertir? | /en-que-invertir | **MUY ALTO** — máxima intención comercial |
| Multimedia | /multimedia | Bajo para SEO texto |

### Subsecciones de "En qué invertir" (mayor oportunidad SEO)

- `/en-que-invertir/acciones`
- `/en-que-invertir/monedas`
- `/en-que-invertir/renta-fija`

Estas 3 subcategorías tienen la mayor intención de búsqueda transaccional. Actualmente sin títulos únicos ni contenido evergreen optimizado.

---

## DIAGNÓSTICO PARA EL RETO "BÚSQUEDAS DE IA" (objetivo Natalia)

Para aparecer en AI Overviews (Google), ChatGPT, Perplexity y Bing Copilot:

| Requisito | Estado actual | Acción |
|-----------|--------------|--------|
| Contenido con autoría verificable | ❌ Sin autor individual | Crear páginas de autor con schema Person |
| Schema Article/NewsArticle | ❌ Ausente | Implementar en todos los artículos |
| Schema FAQPage | ❌ Ausente | Agregar en páginas de categoría |
| Schema Speakable | ❌ Ausente | Marcar párrafos clave como speakable |
| Canonical sitewide | ❌ Ausente | Fix C1 |
| Contenido renderizado para bots | ❌ JS delay 3s | Fix C4 — SSR |
| HTTPS + señales de confianza | ✅ OK | — |
| Datos estructurados verificables | ❌ Solo Organization | Expandir schema |

**Conclusión:** Visión actualmente no cumple los requisitos mínimos para aparecer en AI Overviews. Los 5 issues críticos (C1-C5) deben resolverse primero. Una vez resueltos, implementar schema Speakable y FAQPage para el paso final.

---

## PLAN DE ACCIÓN PRIORIZADO

### Semana 1 — Bloqueos de indexación (Leo)
1. ✅ Implementar canonical tags dinámicos en todos los templates de Brace
2. ✅ Corregir títulos dinámicos por tipo de página
3. ✅ Corregir meta descriptions dinámicas (usar excerpt del artículo)
4. ✅ Corregir 403 en sitemap.xml — verificar config Cloudflare

### Semana 2-3 — Schema y E-E-A-T (Leo + Ernesto)
5. Implementar NewsArticle schema en artículos
6. Implementar BreadcrumbList schema en categorías
7. Agregar aria-label en tarjetas de artículos
8. Crear páginas de autor para equipo editorial

### Mes 2 — Performance y AI visibility
9. Evaluar SSR/SSG en Brace para resolver JS rendering delay
10. Implementar FAQPage schema en categorías de alto tráfico
11. Implementar Speakable schema en artículos seleccionados
12. Configurar CDN para imágenes (CloudFront o Cloudflare Images)

---

## RELACIONADO

[[Vision Davivienda]] · [[Vision Dashboard Estratégico]] · [[Natalia Otalora]] · [[Jeison Montero]] · [[2026-06-16 Natalia Otalora - Alineacion Estrategia Digital]]

---

#vision-davivienda #auditoria #seo #web #cro #brace #schema #canonicals #performance
