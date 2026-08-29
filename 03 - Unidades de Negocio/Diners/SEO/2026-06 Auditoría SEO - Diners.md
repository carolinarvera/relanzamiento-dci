---
date: 2026-06-16
type: seo-audit
tags: [diners, seo, auditoria, gsc, google-search-console, junio-2026]
related-people: [Carolina Ramirez]
related-projects: [Diners-Dashboard-Growth]
sources:
  - "Google Search Console: https://revistadiners.com.co/ — 12 meses (jun 2025–jun 2026)"
confidence: high
ai-first: true
---

## For future Claude
**Vigencia (2026-08-29):** esta es la auditoría BASE con ventana de 12 meses (jun-25 a jun-26) — sigue siendo la referencia de diagnóstico estructural (canonicals duplicadas, crisis de indexación). Para el snapshot más reciente (jul 2026) ver el reporte completo archivado en [[SEO/Archive/GSC_Reporte_Completo_2026]] y el resumen en [[Diners.md]] sección SEO. Para saber qué de este plan de 90 días (fases jun 20-jul 25) ya se ejecutó, ver [[estrategia-seo-90-dias]]. Auditoría SEO de Diners (`revistadiners.com.co`) extraída directamente desde Google Search Console, junio 2026. Horizonte: 12 meses. Diners es 7.5x más grande que AXXIS en tráfico orgánico (637K vs 84.8K clics). El problema crítico es la indexación: solo 10.700 páginas indexadas vs 777.000 no indexadas — el 98.6% del sitio es invisible para Google. La causa principal es doble: 246.221 páginas con canonicals duplicadas (problema de estructura de URL en WordPress) y 383.067 páginas que Google rastrea pero rechaza indexar (señal de calidad masiva). Hay también múltiples URLs para el mismo contenido (canónicas dividiendo tráfico) y una dependencia alta en contenido viral (tests de Harry Potter, Netflix, celebrities) que es frágil a largo plazo.

---

# Auditoría SEO — Diners junio 2026
**Sitio:** `https://revistadiners.com.co/`
**Fuente:** Google Search Console (12 meses: 15 jun 2025 – 14 jun 2026)
**Extraído:** 2026-06-16

---

## 1. Métricas globales

| Métrica | Valor | vs AXXIS |
|---|---|---|
| Clics totales (12 m) | **637.000** | 7,5x mayor |
| Impresiones totales (12 m) | **40.100.000** | 9,1x mayor |
| CTR medio | **1,6%** | Similar |
| Posición media | **13,1** | Peor (AXXIS: 10.3) |

---

## 2. Distribución por dispositivo

| Dispositivo | Clics | CTR | Posición media |
|---|---|---|---|
| Móvil | 488.850 (76,7%) | 1,8% | 8,1 |
| Ordenador | 142.672 (22,4%) | 1,2% | 24,6 |
| Tablet | 5.885 (0,9%) | 1,6% | 7,4 |

> ⚠️ Desktop posición media **24.6** — extremadamente baja. Los usuarios de escritorio casi no encuentran a Diners en Google. Esto sugiere que el sitio puede no estar bien optimizado para experiencia desktop, o que el contenido está optimizado solo para móvil.

---

## 3. Distribución geográfica (Top 15)

| País | Clics | % total | CTR | Posición |
|---|---|---|---|---|
| Colombia | 413.868 | 65% | 2,0% | 9,9 |
| México | 52.269 | 8,2% | 1,1% | 14,0 |
| España | 48.542 | 7,6% | 1,5% | 20,9 |
| Argentina | 20.695 | 3,3% | 1,2% | 15,0 |
| Chile | 16.956 | 2,7% | 1,3% | 12,4 |
| Estados Unidos | 15.900 | 2,5% | 0,7% | 19,1 |
| Perú | 11.457 | 1,8% | 1,0% | 14,1 |
| Venezuela | 9.382 | 1,5% | 1,2% | 9,9 |
| Ecuador | 6.298 | 1,0% | 1,2% | 13,0 |
| Costa Rica | 3.888 | 0,6% | 1,2% | 12,1 |
| Guatemala | 2.982 | 0,5% | 1,0% | 12,0 |
| Uruguay | 2.973 | 0,5% | 1,4% | 12,4 |
| Panamá | 2.798 | 0,4% | 1,2% | 14,1 |
| Rep. Dominicana | 2.648 | 0,4% | 1,1% | 11,3 |
| Bolivia | 2.302 | 0,4% | 0,9% | 13,2 |

> Diners tiene más diversificación geográfica que AXXIS: Colombia es solo el 65% vs 76% de AXXIS. México y España generan tráfico significativo — señal de que el contenido de gastronomía, viajes y cultura tiene resonancia internacional.

---

## 4. Top páginas por clics (Top 25)

| # | URL (slug resumido) | Clics | Impresiones | CTR | Pos | Nota |
|---|---|---|---|---|---|---|
| 1 | /cultura/quiz-casa-de-hogwarts/ | 32.516 | 996.251 | 3,3% | 11,0 | Viral / quiz |
| 2 | /gastronomia/restaurantes-a-las-afueras-de-bogota/ | 19.384 | 577.035 | 3,4% | 11,8 | ⚠️ URL duplicada |
| 3 | / (homepage) | 13.081 | 103.976 | 12,6% | **33,3** ⚠️ | Pos muy baja |
| 4 | /cine/laguna-hermosa-la-huesped-netflix/ | 12.377 | 162.187 | 7,6% | 3,3 | Viral |
| 5 | /cine/delirio-actor/ | 11.709 | 343.297 | 3,4% | 8,3 | Viral Netflix |
| 6 | /cultura/poemas-de-amor-garcia-marquez/ | 11.514 | 169.422 | 6,8% | 22,9 | ⚠️ URL duplicada |
| 7 | /viajes/destinos-aguas-termales-cerca-bogota/ (v1) | 11.276 | 198.003 | 5,7% | 8,9 | ⚠️ URL duplicada |
| 8 | /estilo-de-vida/58511_destinos-aguas-termales/ (v2) | 9.079 | 145.027 | 6,3% | 5,2 | Mismo contenido |
| 9 | /gastronomia/cocinas-del-mundo-2025/ | 8.755 | 184.019 | 4,8% | 8,2 | |
| 10 | /viajes/mejores-rooftop-bogota/ | 8.392 | 162.158 | 5,2% | 7,4 | |
| 11 | /estilo-de-vida/restaurantes-a-las-afueras/ (v2) | 8.225 | 161.724 | 5,1% | 6,0 | Mismo artículo #2 |
| 12 | /cultura/poemas-de-amor-garcia-marquez/ (v2 sin num) | 8.133 | 73.989 | 11,0% | 7,7 | Mismo artículo #6 |
| 13 | /gastronomia/restaurantes-tematicos-en-bogota/ (v1) | 7.114 | 117.832 | 6,0% | 8,3 | ⚠️ URL duplicada |
| 14 | /cine/ubeimar-rios-un-poeta/ | 6.975 | 37.291 | 18,7% | 5,7 | Celebrity |
| 15 | /cine/happy-gilmore/ | 6.812 | 236.422 | 2,9% | 10,2 | **CTR bajo** ⚠️ |
| 16 | /cine/rob-schneider/ | 6.438 | 160.276 | 4,0% | 9,0 | |
| 17 | /cine/delirio-canciones/ | 5.294 | 69.849 | 7,6% | 13,3 | |
| 18 | /gastronomia-restaurantes-tematicos/ (v2) | 4.913 | 81.597 | 6,0% | 7,1 | Mismo artículo #13 |
| 19 | /gastronomia/restaurantes-candelaria/ | 4.663 | 99.518 | 4,7% | 7,4 | |
| 20 | /estilo-de-vida/restaurantes-de-carnes-bogota/ | 4.327 | 97.895 | 4,4% | 7,3 | |
| 21 | /cultura/series-mas-largas/ | 3.529 | 154.866 | 2,3% | 5,2 | **CTR bajo** ⚠️ |
| 22 | /cine/simplemente-alicia/ | 3.513 | **295.102** | **1,2%** ⚠️ | 7,3 | **OPORTUNIDAD** |
| 23 | /cine/la-huesped-personajes/ | 3.390 | 201.369 | 1,7% | 6,8 | **CTR bajo** ⚠️ |
| 24 | /cine/series-mas-largas-2/ | 3.381 | 91.576 | 3,7% | 5,3 | ⚠️ URL duplicada |
| 25 | /estilo-de-vida/karts-en-bogota/ | 3.312 | 92.643 | 3,6% | 6,5 | |

---

## 5. ALERTA CRÍTICA — URLs duplicadas dividiendo tráfico

Se detectaron **múltiples URLs que sirven el mismo contenido**, compitiendo entre sí en Google. Esto divide el poder de ranking y confunde a Google sobre cuál es la URL canónica.

| Contenido | URL 1 (clics) | URL 2 (clics) | Total combinado | Pérdida estimada |
|---|---|---|---|---|
| Termales cerca Bogotá | /viajes/58511_ (11.276) | /estilo-de-vida/58511_ (9.079) | **20.355** | ~3.000 clics/año |
| Restaurantes afueras Bogotá | /gastronomia/71972_ (19.384) | /estilo-de-vida/71972_ (8.225) | **27.609** | ~5.000 clics/año |
| Restaurantes temáticos | /gastronomia/61731_ (7.114) | /gastronomia-61731_ (4.913) | **12.027** | ~2.000 clics/año |
| Poemas García Márquez | /cultura/15323_ (11.514) | /cultura/poemas-garcia-marquez/ (8.133) | **19.647** | ~3.000 clics/año |
| Series más largas | /cultura/series-mas-largas/ (3.529) | /cultura/cine/53993_ (3.381) | **6.910** | ~1.000 clics/año |
| Restaurantes pescado | /estilo-de-vida/restaurantes-pescado/ (2.614) | /gastronomia/152726_ (2.599) | **5.213** | ~1.000 clics/año |
| La Huésped Netflix | 3 URLs distintas del mismo show | — | ~17.000 combinado | ~3.000 clics/año |

> **Impacto estimado total: ~18.000 clics/año perdidos** por fragmentación de URLs. Si se consolida con canonicals correctas, el poder de ranking se concentra en una sola URL que podría escalar.

> La raíz técnica probable: WordPress que genera múltiples permalinks para el mismo post (categoría primaria + categoría secundaria, o migración de estructura de URLs).

---

## 6. Oportunidades de CTR — alto volumen, bajo CTR

| URL (slug) | Impresiones | CTR actual | CTR target | Clics adicionales |
|---|---|---|---|---|
| /cultura/quiz-casa-de-hogwarts/ | **996.251** | 3,3% | 5,0% | +16.933 |
| /cine/simplemente-alicia/ | **295.102** | 1,2% | 3,0% | +5.312 |
| /cine/delirio-actor/ | 343.297 | 3,4% | 5,0% | +5.493 |
| /viajes/santorini-colombiano-antioquia/ | 185.985 | 1,6% | 4,0% | +4.464 |
| /cine/la-huesped-personajes/ | 201.369 | 1,7% | 4,0% | +4.628 |
| /cine/happy-gilmore/ | 236.422 | 2,9% | 5,0% | +4.964 |
| /gastronomia/restaurantes-afueras/ | 577.035 | 3,4% | 5,0% | +9.233 |
| /cultura/series-mas-largas/ | 154.866 | 2,3% | 4,0% | +2.632 |

**Potencial combinado: ~53.000 clics adicionales anuales** solo con mejores titles y meta descriptions.

---

## 7. Top queries (Top 30)

| Consulta | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| revista diners | 6.509 | 10.008 | 65% | 1,6 |
| ubeimar rios | 4.977 | 20.901 | 23,8% | 2,1 |
| termales cerca de bogota | 3.416 | 23.246 | 14,7% | 2,4 |
| delirio netflix reparto | 3.010 | 46.039 | 6,5% | 4,6 |
| diners | 2.622 | 13.431 | 19,5% | 6,9 |
| rooftop bogota | 2.417 | 19.283 | 12,5% | 2,9 |
| restaurantes tematicos bogota | 2.360 | 15.592 | 15,1% | 2,3 |
| laguna hermosa colombia | 2.238 | 11.800 | 19% | 1,9 |
| poemas de gabriel garcia marquez | 2.187 | 7.450 | 29,4% | 1,9 |
| termales | 2.166 | 32.795 | 6,6% | 3,8 |
| test casa de hogwarts | 2.140 | 46.269 | 4,6% | 6,4 |
| termales cerca a bogotá | 1.877 | 13.819 | 13,6% | 2,4 |
| test de casa de hogwarts | 1.785 | 33.369 | 5,3% | 5,9 |
| test de harry potter | 1.753 | 49.492 | 3,5% | 7,1 |
| simplemente alicia | 1.575 | **131.355** | **1,2%** ⚠️ | 8,4 |
| gabriel garcia marquez poemas | 1.489 | 6.074 | 24,5% | 1,8 |
| rob schneider | 1.279 | 67.069 | 1,9% | 9,4 |
| brunch bogota | 1.145 | 23.158 | 4,9% | 7,2 |
| restaurantes campestres bogota | 1.015 | 6.185 | 16,4% | 3,0 |
| test casa hogwarts | 1.007 | 23.816 | 4,2% | 6,2 |
| que casa de harry potter soy | 970 | 32.321 | 3,0% | 7,0 |
| poemas gabriel garcia marquez | 926 | 2.794 | 33,1% | 1,7 |
| karts bogota | 922 | 17.176 | 5,4% | 4,0 |
| ranking mejor gastronomia del mundo 2025 | 912 | 4.749 | 19,2% | 2,4 |
| santorini colombiano | 697 | **98.666** | **0,7%** ⚠️ | 4,2 |
| ganadores india catalina 2026 | 843 | 4.070 | 20,7% | 2,3 |

### Patrón de queries
- **Marca fuerte**: "revista diners" CTR 65% — reconocimiento sólido
- **Gastronomía + viajes**: termales, rooftop, restaurantes temáticos — el núcleo editorial funciona
- **Cluster Harry Potter/Hogwarts**: 5 variantes del mismo test sumando ~8.000 clics → dependencia de un solo artículo viral
- **Cluster Netflix**: delirio, simplemente alicia, la huésped, rob schneider → tráfico reactivo a estrenos, no sostenible
- **"santorini colombiano"**: 98.666 impresiones con CTR 0,7% → la mayor oportunidad no capturada del sitio

---

## 8. Indexación — CRISIS ESTRUCTURAL

| Estado | Páginas |
|---|---|
| **Indexadas** | **10.700** |
| **Sin indexar** | **777.000** |
| **% indexado** | **1,4%** ← CRÍTICO |

### Razones de no indexación

| Motivo | Páginas | Fuente | Prioridad |
|---|---|---|---|
| **Rastreada: actualmente sin indexar** | **383.067** | Google | 🔴 CRÍTICO |
| **Página alternativa con canónica adecuada** | **246.221** | Sitio web | 🔴 CRÍTICO |
| **Excluida por noindex** | **94.007** | Sitio web | 🟠 Revisar |
| **No se ha encontrado (404)** | **48.959** | Sitio web | 🔴 CRÍTICO |
| Error de servidor (5xx) | 2.521 | Sitio web | 🔴 Urgente |
| Página con redirección | 861 | Sitio web | 🟠 Revisar |
| Bloqueada por robots.txt | 20 | Sitio web | 🟡 Verificar |
| 403 / otro 4xx / 401 | 6 | Sitio web | 🟡 Revisar |
| Duplicada (Google eligió otra canónica) | 53 | Google | 🟠 Revisar |
| Descubierta: sin indexar aún | 827 | Google | 🟡 Normal |
| Página indexada sin contenido | 1 | Sitio web | 🔴 Urgente |

### Análisis de causas raíz

**1. 383.067 "rastreada, sin indexar"** → Google rastrea estas páginas pero decide no indexarlas. Causas más probables:
- Paginación de categorías (página 2, 3, ... de /gastronomia/, /cultura/, etc.)
- Tags de WordPress generando miles de páginas delgadas
- Artículos muy cortos / sin suficiente contenido original
- Páginas de autor sin contenido real

**2. 246.221 "alternativa con canónica adecuada"** → son las páginas que el sitio mismo declaró como no-canónicas mediante `rel=canonical`. Probablemente las múltiples URLs del mismo artículo (ver sección 5). El sitio ya tiene canonicals implementados, pero hay 246K páginas en esta situación — señal de fragmentación histórica masiva de URLs.

**3. 94.007 con noindex** → el sitio excluye 94K páginas voluntariamente. Probablemente correcto (páginas de admin, búsquedas internas, resultados de filtros) — pero 94K es un número muy alto que merece revisión.

**4. 48.959 errores 404** → URLs que alguna vez existieron pero ya no. Cada una representa un backlink perdido y crawl budget desperdiciado.

**5. 2.521 errores 5xx** → el servidor falla para Google en 2.521 URLs. Señal de inestabilidad del servidor o de recursos que el servidor no puede servir en carga de crawl.

---

## 9. Sitemaps

| Sitemap | Tipo | Enviado | Última lectura | Estado | Páginas descubiertas |
|---|---|---|---|---|---|
| /sitemap_index.xml | Índice | 25 nov 2025 | 13 jun 2026 | ✅ Correcto | 15.497 |
| /sitemap.xml | Índice | 25 nov 2025 | 12 jun 2026 | ✅ Correcto | 15.525 |

> ⚠️ El sitemap reporta ~15.500 URLs pero solo 10.700 están indexadas → 4.800 URLs del sitemap no están indexadas. Google las conoce pero no las acepta. Esto es señal de que el contenido no supera el umbral de calidad de indexación.

---

## 10. Diagnóstico consolidado

### Fortalezas
- ✅ Volumen de tráfico sólido (637K clics/año) — Diners tiene una base orgánica real
- ✅ Diversificación geográfica (Colombia 65%, México 8%, España 7%) — alcance latinoamericano genuino
- ✅ Sitemaps actualizados y funcionando
- ✅ Varios artículos con CTR alto (restaurantes afueras 18.7%, ubeimar ríos 18.7%)
- ✅ Marca reconocida: "revista diners" con CTR 65%

### Problemas críticos (ordenados por impacto)

| # | Problema | Impacto estimado | Dificultad |
|---|---|---|---|
| 1 | **777K páginas sin indexar (98,6%)** — el sitio casi no existe para Google | Muy alto | Alta |
| 2 | **URLs duplicadas para mismo contenido** — ~18K clics/año fragmentados entre versiones del mismo artículo | Alto | Media |
| 3 | **383K páginas rastreadas pero rechazadas por Google** — señal masiva de calidad percibida como baja | Muy alto | Alta |
| 4 | **Homepage en posición 33.3** — el homepage propio no rankea en top 30 para búsquedas de su marca | Alto | Media |
| 5 | **48.959 errores 404** — crawl budget masivamente desperdiciado | Alto | Media |
| 6 | **2.521 errores de servidor (5xx)** — inestabilidad técnica | Alto | Media |
| 7 | **Dependencia de contenido viral** — top 5 artículos son tests y noticias de Netflix, no contenido de marca | Medio | Alta |
| 8 | **"santorini colombiano": 98.666 imp, CTR 0,7%** — la mayor oportunidad de CTR no capturada | Medio | Baja |

---

## 11. Plan de acción prioritario

| Acción | Impacto | Dificultad | Owner | Plazo |
|---|---|---|---|---|
| **Auditoría técnica de URLs duplicadas** — mapear todas las URLs que sirven el mismo contenido, elegir canónica y redirigir las demás con 301 | 🔴 Crítico | Media | Proveedor web | 30 días |
| **Auditoría de 48.959 páginas 404** — identificar cuáles tienen backlinks valiosos y redirigirlas | 🔴 Crítico | Media | Proveedor web | 30 días |
| **Auditoría de errores 5xx** — identificar si es problema de hosting/capacidad o de recursos específicos | 🔴 Crítico | Media | Proveedor web | 7 días |
| **Auditar el 94.007 noindex** — confirmar que todas son páginas que merecen noindex (no artículos editoriales accidentalmente excluidos) | 🔴 Crítico | Media | Proveedor web | 30 días |
| **Mejorar CTR del quiz de Hogwarts** (996K impresiones, 3.3% CTR) — cambiar title/meta para aumentar de 3.3% a 5%: +16.933 clics | 🔴 Alta | Baja | Editorial | 7 días |
| **Mejorar title/meta de "Simplemente Alicia"** (295K imp, 1.2% CTR) — claro quick win | 🟠 Alto | Baja | Editorial | 7 días |
| **Investigar homepage posición 33.3** — puede ser un problema de crawl o de cómo Google interpreta el homepage | 🟠 Alto | Media | SEO | 15 días |
| **Estrategia de contenido sostenible** — reducir dependencia de contenido viral efímero (tests, Netflix) y fortalecer clusters temáticos de gastronomía, viajes y cultura | 🟠 Estratégico | Alta | Editorial | 90 días |

---

## 12. Auditoría técnica — Screaming Frog (junio 2026)

**Fuente:** `Diners_issues_overview_report.csv` — rastreo Screaming Frog SEO Spider, ~85 páginas HTML rastreadas.
**Leído:** 2026-06-19

### Problemas críticos (bloquean ranking)

| # | Problema | Páginas | % sitio | Prioridad |
|---|---|---|---|---|
| 1 | **H1 faltante** — 88% de páginas sin encabezado principal | 75 | 88.24% | 🔴 CRÍTICO |
| 2 | **Meta description múltiple** — plugins en conflicto; Google ignora ambas | 61 | 71.76% | 🔴 Alta |
| 3 | **Error 4xx internos** — enlaces rotos que pierden PageRank | 2 | — | 🔴 Alta |
| 4 | **Paginación sin enlace `<a>`** — Google no puede pasar PageRank entre páginas paginadas | 4 | — | 🔴 Alta |
| 5 | **URLs Noindex** — 4 páginas excluidas del índice (verificar si es intencional) | 4 | — | 🟠 Revisar |

> ⚠️ **El dato más alarmante:** 75 de ~85 páginas rastreadas no tienen H1. Esto confirma el problema de plantilla/template que ya señalaba GSC (383K páginas rechazadas por Google). Si el H1 falta en el 88% de páginas, Google no tiene señal de tema principal en casi ninguna página — el impacto en ranking es directo.

### Oportunidades de on-page (CTR y experiencia)

| Problema | Páginas | Impacto | Acción |
|---|---|---|---|
| Títulos >60 caracteres (truncados en SERPs) | 53 | 🟠 CTR | Acortar a ≤60 chars con keyword al inicio |
| Títulos >561px (misma causa, medido en píxeles) | 52 | 🟠 CTR | Revisar junto con el punto anterior |
| Meta descriptions duplicadas | 47 | 🟡 CTR | Escribir description única por página |
| Meta descriptions >155 chars | 45 | 🟡 CTR | Acortar + CTA al inicio |
| H2 duplicados entre páginas | 70 | 🟡 Diferenciación | Reescribir H2 únicos |
| H2 >70 chars | 50 | 🟡 UX | Acortar subheadings |
| Contenido difícil de leer (Flesch) | 62 | 🟡 Engagement | Oraciones más cortas, menos tecnicismos |
| Contenido muy difícil de leer | 10 | 🟡 Engagement | Prioridad en artículos de alto tráfico |
| Páginas con <200 palabras | 9 | 🟠 Indexación | Ampliar o consolidar con canonical |
| Títulos <30 chars (subaprovechados) | 8 | 🟡 Keywords | Completar con keyword secondary |
| Imágenes >100KB | 7 | 🟠 Core Web Vitals | Comprimir con WebP/AVIF |
| Meta descriptions faltantes | 5 | 🟡 CTR | Escribir descriptions en páginas clave |

### Seguridad — infraestructura (1 fix, 5 issues resueltos)

Todos los headers de seguridad faltan en las mismas 120 URLs. Un único cambio en `.htaccess` o en la configuración del servidor los resuelve todos:

| Header faltante | Riesgo |
|---|---|
| `Strict-Transport-Security` (HSTS) | Usuarios HTTP expuestos |
| `X-Frame-Options: DENY` | Clickjacking |
| `X-Content-Type-Options: nosniff` | MIME sniffing attacks |
| `Content-Security-Policy` | XSS |
| `Referrer-Policy: strict-origin-when-cross-origin` | Data leakage |

> Escalar a Jeison + proveedor web como un solo ticket: "Agregar security headers en servidor." No requiere cambios en WordPress.

### Adicionales de baja prioridad

| Issue | URLs | Acción |
|---|---|---|
| 3xx internas (redirecciones) | 82 | Actualizar links directos a URL final |
| Links externos sin `rel="noopener"` | 78 | Fix en plantilla WordPress |
| Links internos sin texto de anclaje | 85 | Revisar widgets y menús |
| Links internos con `nofollow` | 4 | Eliminar nofollow si son páginas propias importantes |
| URLs con path repetido | 3 | Investigar links relativos incorrectos |

### Plan de acción técnica — Screaming Frog

| Acción | Owner | Plazo | Prioridad |
|---|---|---|---|
| Investigar por qué el 88% de páginas no tiene H1 — ¿plantilla? ¿render JS? | Proveedor web | 7 días | 🔴 CRÍTICO |
| Identificar qué plugins generan meta descriptions múltiples y desactivar el duplicado | Proveedor web | 7 días | 🔴 Alta |
| Resolver 2 errores 4xx internos | Proveedor web | 7 días | 🔴 Alta |
| Corregir paginación sin enlace `<a>` (4 casos) | Proveedor web | 7 días | 🔴 Alta |
| Agregar security headers en servidor (1 ticket = 5 issues) | Jeison / Proveedor web | 15 días | 🟠 Media |
| Auditar y acortar títulos >60 chars (53 páginas, priorizar las de mayor tráfico) | Editorial / SEO | 30 días | 🟠 Media |
| Comprimir imágenes >100KB a WebP | Proveedor web | 15 días | 🟠 Media |

---

## Relacionado

[[Diners]] · [[2026-06 Auditoría SEO - AXXIS]]

## Tags
#diners #seo #auditoria #gsc #screaming-frog #junio-2026
