---
date: 2026-06-19
type: estrategia-seo-cro
tags: [vision-davivienda, seo, cro, tecnico, contenido, schema, ctr, indexacion, ai-overviews, conversion, ux]
related-projects: [vision-davivienda, growth-dashboard]
related-people: [natalia-otalora, carolina-ramirez, jeison-montero, leo-brace, ernesto, estefania]
sources:
  - "Vision_03_Web_2026-06.xlsx — datos reales GA4 + GSC mayo 2026"
  - "Auditoría Web SEO CRO Visión Davivienda 2026-06-16"
  - "Google Search Console — 453K impresiones/mes · CTR 1.5%"
  - "GA4 Visión Davivienda — 42,295 sesiones · 1.61 pág/ses · 03:15 duración"
ai-first: true
confidence: high
---

# Visión Davivienda — Estrategia SEO + CRO Web 2026

> **For future Claude:** Estrategia integrada de SEO y CRO para vision.davivienda.com. El sitio tiene tráfico (42K sesiones/mes, 453K impresiones GSC) pero baja conversión en dos dimensiones: (1) de impresión a click (CTR 1.5% vs benchmark 3-5%) — problema SEO técnico y de contenido, y (2) de visitante a suscriptor y de suscriptor a cliente Davivienda — problema de CRO. Hay **5 bugs técnicos P0** todos en Brace (owner: Leo) y **4 oportunidades CRO de alto impacto** ninguna requiere desarrollo mayor. El deadline duro es 28 jun — Natalia sale esa fecha.

---

## SITUACIÓN ACTUAL — DIAGNÓSTICO INTEGRADO

### Métricas de salud web (GA4 · mayo 2026)

| Métrica | Real mayo | Meta/KPI | Estado | Diagnóstico |
|---------|----------|----------|--------|-------------|
| Sesiones totales | 42,295 | 44,000 | 🟢 96% | Crecimiento sostenido |
| Usuarios únicos | 24,899 | 26,000 | 🟠 95.7% | Adquisición algo por debajo |
| Sesiones orgánicas | 4,817 | KPI anual 138K | 🔴 Solo 3.5%/mes del objetivo | El canal más eficiente pero más rezagado |
| Tasa de rebote | 59.75% | <62% | 🟢 CUMPLE | Mejor canal: orgánico 45.19% |
| Duración media sesión | 3:15 | 3:30 | 🟠 93% | Buena señal — falta navegación profunda |
| Páginas por sesión | 1.61 | 2.0 | 🔴 -20% | El gap más grande: el usuario lee y se va |
| Usuarios recurrentes | 40.1% | 45% | 🟠 -5pp | Potencial en email y notificaciones push |
| Posición promedio GSC | 6.83 | <11.4 | 🟢 CUMPLE | Buena visibilidad — el problema es el CTR |
| CTR GSC | 1.5% | 3-5% | 🔴 3x bajo benchmark | La palanca SEO más urgente |
| Páginas indexadas | 2,676 / ~11K | 80%+ | 🔴 Solo 24% | 5 bugs técnicos lo explican |

### La brecha de sesiones orgánicas es crítica

Con el plan actual, el proyectado YTD es 26,195 sesiones orgánicas vs meta de 138,000. Para cerrar la brecha hace falta crecer 10x el ritmo actual. El plan de 3 sprints que sigue lo hace posible pero **requiere ejecutar los 5 fixes técnicos en las próximas 2 semanas sin excepción.**

---

## PARTE 1 — SEO

### 1.1 El problema no es visibilidad — es CTR

453,000 impresiones/mes significa que Google ya muestra Visión en 453K búsquedas. Pero de esas búsquedas, solo 1.5% hace click. El benchmark para medios financieros especializados es 3-5%.

**Lo que cuesta ese gap en clics reales:**

| CTR | Clics/mes (con 453K impresiones) | Diferencia vs actual |
|-----|----------------------------------|----------------------|
| 1.5% (actual) | 6,795 | — |
| 3.0% (benchmark mínimo) | 13,590 | **+6,795/mes** |
| 5.0% (benchmark medio) | 22,650 | **+15,855/mes** |
| 7.0% (benchmark top) | 31,710 | **+24,915/mes** |

**Llevar el CTR de 1.5% a 3% = duplicar el tráfico orgánico sin crear un solo artículo nuevo.** Es la palanca más rápida disponible y depende casi completamente de los 5 fixes técnicos de Leo.

---

### 1.2 Los 5 bloqueos técnicos P0 — todos en Brace CMS (owner: Leo)

Estos no son mejoras opcionales. Son bugs activos que están limitando la indexación y el CTR sitewide. Deben resolverse antes de cualquier estrategia de contenido.

---

#### C1 — Canonical tags ausentes en todo el sitio
**Severidad:** 0/10 — crítico

| Campo | Detalle |
|-------|---------|
| Estado | Ausente en 100% de las páginas — homepage, artículos, categorías |
| Consecuencia | Google indexa múltiples variantes de la misma URL (con/sin www, con/sin slash, HTTP/HTTPS), divide el PageRank entre ellas, y puede rankear la URL equivocada para cada query |
| Fix | `<link rel="canonical" href="[URL exacta con protocolo]">` dinámico en todos los templates de Brace |
| Tiempo estimado | 1-2 horas desarrollo |
| Deadline | **18 jun** |
| Cómo verificar | Google Search Console → Cobertura → "Duplicado, el usuario no seleccionó la canónica" debe caer a 0 en 30-45 días |

---

#### C2 — Títulos duplicados sitewide
**Severidad:** 1/10 — crítico

| Campo | Detalle |
|-------|---------|
| Estado | Todas las páginas del sitio tienen el mismo `<title>` de la homepage |
| Consecuencia | Google no puede distinguir qué página mostrar para cada query. CTR bajo en todo el sitio porque el título que aparece en la SERP no describe el contenido de la página |
| Fix por template | Artículo: `[Título del artículo] \| Visión Davivienda` · Categoría: `[Nombre categoría]: análisis y perspectivas \| Visión` · Subcategoría: `[Nombre subcategoría] \| Visión Davivienda` · Homepage: `Visión Davivienda \| Análisis económico y financiero Colombia` |
| Tiempo estimado | 2-3 horas desarrollo |
| Deadline | **18 jun** |
| Cómo verificar | GSC → Rendimiento → páginas individuales deben mostrar CTR mejorando en 30 días |

---

#### C3 — Meta descriptions duplicadas sitewide
**Severidad:** crítico

| Campo | Detalle |
|-------|---------|
| Estado | Todas las páginas comparten la misma meta description genérica de la homepage |
| Consecuencia | Google detecta la duplicación y reescribe automáticamente el snippet, usando un fragmento aleatorio del contenido. Se pierde control total del mensaje en SERP → CTR subóptimo en todas las páginas indexadas |
| Fix | Template dinámico que use los primeros 155 caracteres del excerpt del artículo (o excerpt editorial configurado por Ernesto) para páginas de artículos · excerpt manual por categoría |
| Tiempo estimado | 1-2 horas desarrollo |
| Deadline | **18 jun** |

---

#### C4 — Contenido renderizado por JavaScript con delay 3+ segundos
**Severidad:** crítico — **causa raíz de la caída de 2025**

| Campo | Detalle |
|-------|---------|
| Estado | Al cargar un artículo inmediatamente: `wordCount = 1`. Después de 3+ segundos: `wordCount = 1,005` |
| Consecuencia | Googlebot tiene timeout más corto que 3 segundos. Ve la página como vacía → la registra como Soft 404. Esto generó **988 Soft 404 en GSC** y es la causa más probable de la caída de 2M a 1.2M vistas en 2025 |
| Evidencia adicional | Regresión del 8 jun: +1,141 páginas desindexadas en un día — puede ser el mismo issue reactivado por un deploy de Brace |
| Fix | SSR (Server-Side Rendering) o SSG (Static Site Generation) para páginas de artículos y categorías en Brace. Como mínimo: pre-rendering del contenido principal antes de enviar al cliente |
| Tiempo estimado | 1-2 semanas desarrollo |
| Deadline | **30 jun** |
| Riesgo si no se hace | Las 988 páginas en Soft 404 nunca se recuperan. El contenido editorial de Ernesto nunca se indexa. Los sprints 2 y 3 tienen impacto mínimo sin este fix. |

---

#### C5 — Sitemap.xml devuelve 403 Forbidden
**Severidad:** 0/10 — crítico

| Campo | Detalle |
|-------|---------|
| Estado | El sitemap está declarado en `robots.txt` pero devuelve 403 a Googlebot |
| Consecuencia | Google descubre URLs solo mediante links internos → crawl incompleto → artículos nuevos sin indexar por días o semanas → el editorial de Ernesto (Pista A y Pista B) tarda en aparecer en Google |
| Fix | Verificar configuración Cloudflare que está bloqueando `/sitemap.xml`. Asegurar HTTP 200 para todos los user-agents incluyendo Googlebot. Resubmitir en GSC tras el fix. |
| Tiempo estimado | 30 minutos |
| Deadline | **18 jun — prioridad máxima por rapidez** |
| Cómo verificar | GSC → Sitemaps → debe mostrar "Éxito" con número de URLs procesadas |

---

#### Alerta activa: regresión del 8 de junio
**Nadie la había detectado antes de esta auditoría.**

Entre el 8 y el 11 de junio 2026, Google desindexó **+1,141 páginas en un solo día** (de 2,647 indexadas a 7,428 sin indexar). Las posibles causas:
- Deploy de Brace que reintrodujo el delay de JS rendering (C4)
- Cambio inadvertido en `robots.txt` que bloqueó secciones del sitio
- Problema nuevo con el Sitemap 403 (C5)

**Jeison + Leo deben identificar la causa antes del 18 jun.** Si fue un deploy de Brace, hay que hacer rollback o fix urgente antes de que Google consolide la desindexación.

---

### 1.3 Oportunidad de CTR inmediata — 5 páginas, +3,149 clics/mes

Estas páginas ya tienen alto volumen de impresiones pero CTR crítico. El fix requiere solo cambiar el `<title>` y la `<meta description>`. Sin crear contenido nuevo, sin esperar mejora de posición.

| Página | Impresiones/mes | CTR actual | Posición | CTR objetivo | Clics adicionales |
|--------|----------------|------------|----------|-------------|-------------------|
| /macroeconomia/deficit-fiscal-colombia-2026 | 33,734 | 0.31% | 6.67 | 3% | **+898** |
| /macroeconomia/Colombia-2025-crecimiento-inflacion | 28,244 | 0.53% | 7.46 | 3% | **+697** |
| /analisis-de-companias/ecopetrol/dividendos-ecopetrol-2026 | 23,477 | 1.29% | 5.79 | 4% | **+635** |
| /macroeconomia/BanRep-junta-directiva-2025 | 13,330 | 1.46% | 6.22 | 4% | **+338** |
| /analisis-de-companias/celsia-recompra-acciones-2026 ⭐ | 12,351 | 1.29% | **3.88** | 6% | **+581** |
| **TOTAL** | **111,136** | **0.8% prom** | — | — | **+3,149/mes** |

> **⭐ Celsia es el caso más urgente:** posición 3.88 (casi top 3) con CTR de 1.29% es imposible con un título bien escrito. En posición 4 el CTR normal es 6-10%. El título actual no está respondiendo la intención del buscador — alguien que busca "celsia recompra acciones" quiere saber precio, plazo, impacto en el inversor.

**Títulos propuestos (listos para implementar):**

| URL | Título propuesto | Por qué funciona |
|-----|-----------------|-----------------|
| /deficit-fiscal-colombia-2026 | `Déficit fiscal Colombia 2026: cuánto es, por qué importa y qué sigue \| Visión` | Responde las 3 preguntas del buscador |
| /Colombia-2025-crecimiento-inflacion | `Colombia 2025: crecimiento, inflación y retos — análisis completo \| Visión` | "Análisis completo" aumenta CTR para buscadores de profundidad |
| /ecopetrol/dividendos-ecopetrol-2026 | `Dividendos Ecopetrol 2026: fecha, monto y cómo recibirlos \| Visión Davivienda` | Altísima intención — persona quiere recibir el dividendo |
| /BanRep-junta-directiva-2025 | `¿Cómo cambiaría la junta directiva del BanRep en 2025? \| Visión Davivienda` | Pregunta directa = match exacto con lo que busca el usuario |
| /celsia-recompra-acciones-2026 | `Celsia recompra acciones a $9,002: lo que necesita saber el inversor \| Visión` | Precio + beneficiario claro → CTR 6-8% en posición 4 |

**Meta descriptions propuestas:**

| URL | Meta description (155 chars max) |
|-----|----------------------------------|
| /deficit-fiscal-colombia-2026 | `El déficit fiscal de Colombia en 2026 equivale al X% del PIB. Analizamos sus causas, consecuencias para el gasto público y las tasas de interés.` |
| /Colombia-2025-macro | `¿Cómo cerrará la economía colombiana en 2025? Crecimiento, inflación, tasa de cambio y riesgo fiscal — análisis del equipo de investigaciones de Davivienda.` |
| /dividendos-ecopetrol | `Ecopetrol anunció dividendos para 2026 por $X/acción. Fecha de corte, fecha de pago y cómo recibirlos si eres accionista.` |
| /BanRep-junta | `Los cambios en la composición de la Junta del BanRep en 2025 y su posible efecto sobre la política monetaria y la tasa de referencia.` |
| /celsia-recompra | `Celsia lanzó una recompra de acciones a $9,002 por título. Qué significa para el valor de la empresa y qué deben hacer los accionistas.` |

---

### 1.4 Indexación — solo el 24% del sitio está activo

| Estado en GSC | Páginas | Causa raíz | Acción |
|--------------|---------|------------|--------|
| **Indexadas** | 2,676 | — | Proteger y crecer |
| **Soft 404 (JS rendering)** | 988 | Googlebot ve página vacía (C4) | Fix SSR/SSG — causa raíz de la caída 2025 |
| **Rastreada sin indexar** | 3,803 | Thin content / duplicados sin canonical | Auditar: noindex / consolidar / enriquecer |
| **Descubierta sin indexar** | 1,238 | Crawl budget agotado · sitemap 403 | Fix C5 + C1 desbloquea el crawl |
| **Duplicada sin canonical** | 145 | Sin canonical (C1) | Fix C1 urgente — Google elige URL arbitrariamente |
| Noindex intencional | 1,166 | Configuración correcta | No tocar |
| **Total sitio** | ~11,010 | | **Solo 24% indexado** |

La recuperación de las 988 páginas en Soft 404 (fix C4 SSR/SSG) + las 145 duplicadas (fix C1) + las 1,238 sin crawl suficiente (fix C5) = **2,371 páginas con potencial de indexación que hoy no existen para Google.**

---

### 1.5 Clusters de contenido — demanda con tendencia al alza

Producir estos artículos en Sprint 2 (julio) con Ernesto. Todos tienen demanda creciente confirmada en GSC.

#### Cluster P0 — Dividendos 2026 (+220% a +517% tendencia)

| URL | Query objetivo | Estado | Acción |
|-----|---------------|--------|--------|
| /analisis-de-companias/dividendos-ecopetrol-2026 | dividendos ecopetrol 2026 | Existe — CTR 1.29% | Fix título → +635 clics/mes |
| /analisis-de-companias/dividendos-bancolombia-2026 | dividendos bancolombia 2026 | **Sin contenido** | Producir en julio |
| /analisis-de-companias/dividendos-grupo-argos-2026 | dividendos grupo argos 2026 | **Sin contenido** | Producir en julio |
| /analisis-de-companias/dividendos-davivienda-2026 | dividendos davivienda 2026 | Parcial — 61 clics | Ampliar y optimizar |

**Estructura sugerida por artículo de dividendos:**
1. Resumen ejecutivo: cuánto, cuándo, quién puede recibirlo
2. Fecha de corte y fecha de pago
3. ¿Cómo recibirlos si eres accionista en Davivienda?
4. ¿Qué conviene hacer: guardar o reinvertir?
5. Schema NewsArticle + FAQPage en la misma página

#### Cluster P0 — Macroecomía Colombia 2026 (+500% a +700%)

| URL | Query objetivo | Tendencia |
|-----|---------------|-----------|
| /macroeconomia/ipc-colombia-2026 | ipc 2026 colombia · inflación colombia | +500% |
| /macroeconomia/crecimiento-economia-colombia-2026 | como va la economía en colombia 2026 | +700% |
| /macroeconomia/perspectivas-economicas-colombia-2026 | perspectivas económicas colombia 2026 | Sin contenido |

#### Cluster P0 — BanRep / Tasas de interés (+1,100%)

| URL | Query objetivo | Tendencia |
|-----|---------------|-----------|
| /macroeconomia/tasas-interes-colombia-2026 | banrep sube tasas · tasa interés bancos colombia | +1,100% |
| /macroeconomia/decision-banrep-junio-2026 | banrep junio 2026 | Coyuntural recurrente |
| /macroeconomia/tasa-de-intervencion-banrep-2026 | tasa de intervención banrep | Alta intención técnica |

#### Cluster P1 — COLCAP / Índices (+2,000%)

| URL | Query objetivo |
|-----|---------------|
| /en-que-invertir/acciones/rebalanceo-colcap-2026 | rebalanceo msci colcap 2026 |
| /en-que-invertir/acciones/colcap-que-es-como-invertir | ¿qué es el COLCAP? (evergreen permanente) |

---

### 1.6 Schema + E-E-A-T — para Google News y AI Overviews

Objetivo Natalia: "estar en búsquedas de IA". Requisito mínimo para lograrlo.

| Schema | Estado | Tipo página | Impacto | Owner | Sprint |
|--------|--------|-------------|---------|-------|--------|
| NewsArticle | ❌ Ausente | Artículos | Google News + rich results + CTR mejorado | Leo | Sprint 2 |
| BreadcrumbList | ❌ Ausente | Categorías | Breadcrumbs visibles en SERP → +0.5-1% CTR | Leo | Sprint 2 |
| Person (autor) | ❌ Ausente | Artículos | E-E-A-T YMYL — sin autor individual Google no cita el contenido | Ernesto+Natalia | Sprint 2 |
| FAQPage | ❌ Ausente | Homepage + categorías | 3.2x más probabilidad de aparecer en AI Overviews de Google | Leo | Sprint 3 |
| Speakable | ❌ Ausente | Artículos seleccionados | Citabilidad en ChatGPT, Perplexity, Bing Copilot | Leo | Sprint 3 |
| Organization + WebSite | ✅ Presente | Todo el sitio | Base mínima — ya en producción | — | — |

**Páginas de autor — la señal E-E-A-T más importante para finanzas:**

Visión atribuye todos los artículos a "Visión Davivienda" (entidad). Google pondera fuertemente la experiencia del autor para contenido YMYL (Your Money or Your Life — aplica a finanzas). Sin autor individual verificable, Google y los LLMs no citan el contenido.

Crear `vision.davivienda.com/autores/[nombre]` para cada analista con: foto, nombre, cargo, especialización, lista de artículos publicados y schema `Person`. Es la señal de E-E-A-T con mayor ROI en el mediano plazo.

---

## PARTE 2 — CRO (Conversion Rate Optimization)

### 2.1 Diagnóstico de conversión — dónde se va el usuario

El problema de CRO tiene dos capas:

1. **Conversión a suscriptor:** el visitante llega al artículo, lee, y se va sin suscribirse al newsletter
2. **Conversión a cliente Davivienda:** el suscriptor lee el análisis económico pero nunca recibe un CTA hacia productos Davivienda (CDTs, fondos de inversión, acciones)

La segunda capa es el mayor potencial de monetización — Visión no es solo un medio, es una plataforma de inversión de Davivienda.

---

### 2.2 Los 4 problemas CRO con mayor impacto

#### CRO-1 — Páginas por sesión: 1.61 vs target 2.0 (−20%)

**Causa:** no hay navegación interna que lleve al usuario de un artículo al siguiente. El usuario termina el artículo y no sabe qué leer después.

**Impacto en números:** si páginas/sesión sube de 1.61 a 2.0 con las mismas sesiones → 42,295 sesiones × 0.39 páginas adicionales = **16,495 páginas adicionales por mes vistas** sin traer un solo usuario nuevo.

**Soluciones ordenadas por esfuerzo:**

| Solución | Esfuerzo | Impacto est. | Owner | Deadline |
|----------|----------|-------------|-------|----------|
| Módulo "También te puede interesar" al final de cada artículo (3 artículos recomendados del mismo cluster) | Medio | **+0.3 pág/ses** | Leo | Jul sem 1 |
| Barra lateral fija en desktop: "Más análisis de [Categoría]" | Bajo | +0.15 pág/ses | Leo | Jul sem 1 |
| Links internos dentro del cuerpo del artículo — mínimo 3 por artículo | Muy bajo | +0.1 pág/ses | Ernesto (editorial) | Inmediato |
| Breadcrumbs clickeables en la parte superior del artículo | Muy bajo | +0.05 pág/ses | Leo | Jun 30 |
| Carrusel "Artículos relacionados" anclado al fondo del scroll | Medio | +0.2 pág/ses | Leo | Jul sem 2 |

**Recomendación de prioridad:** el módulo de "También te puede interesar" al final del artículo es el cambio más alto ROI. Ernesto puede empezar hoy con links internos editoriales — sin esperar desarrollo.

---

#### CRO-2 — Sin CTA a productos Davivienda en los artículos

**Causa:** Visión publica análisis de CDTs, fondos de inversión, acciones, tasas BanRep — pero ningún artículo tiene un call-to-action que lleve al lector a los productos de Davivienda.

**Ejemplo de oportunidad perdida:** el artículo de dividendos de Ecopetrol tiene 23,477 impresiones/mes y CTR 1.29% → aproximadamente 303 lectores/mes. Esos 303 lectores están activamente pensando en acciones. Un CTA de "¿Tienes acciones Ecopetrol en Davivienda? Revisa tu portafolio →" convierte directamente.

**Matriz de artículo → producto Davivienda:**

| Tipo de artículo | Producto Davivienda sugerido | CTA propuesto |
|-----------------|------------------------------|---------------|
| Artículo de tasas BanRep | CDTs Davivienda | `"Las tasas cambian. Tu CDT puede estar trabajando más. Ver tasas actuales →"` |
| Artículo de dividendos acciones | Davivienda Corredores / custodia | `"¿Tienes acciones de [empresa] en Davivienda? Revisa tu portafolio →"` |
| Artículo de inflación/IPC | Fondos de inversión | `"¿Tu dinero está creciendo más que la inflación? Ver opciones de inversión →"` |
| Artículo macro/perspectivas | Asesoría de inversiones | `"Habla con un asesor de inversiones Davivienda sobre el contexto actual →"` |
| Artículo de dólar/TRM | Divisas Davivienda | `"Compra o vende dólares al precio justo. Ver TRM Davivienda →"` |
| Artículo de sector vivienda | Crédito hipotecario Davivienda | `"Calcula tu cuota hipotecaria con las tasas de hoy →"` |
| Artículo de análisis COLCAP | Davivienda Corredores acciones | `"Invierte en la bolsa colombiana con Davivienda Corredores →"` |

**Formato del CTA (basado en benchmark medios financieros):**

```
┌─────────────────────────────────────────────────────────────────┐
│  💡  Con las tasas actuales, ¿tu CDT está al máximo rendimiento? │
│  Davivienda ofrece [X]% E.A. en CDTs desde [monto mínimo].      │
│                          [Ver tasas actuales →]                  │
└─────────────────────────────────────────────────────────────────┘
```

**Posición en el artículo:** al 60% del scroll (después del segundo o tercer párrafo de análisis, antes de la conclusión). No al inicio — el lector aún no ha recibido el valor.

**Owners y responsables:**
- Definir qué productos Davivienda están disponibles para vincular: Carolina → equipo Davivienda
- Implementar el componente CTA en Brace: Leo
- Asignar la regla editorial (qué CTA va en qué artículo): Ernesto + Carolina
- Deadline sugerido: **Q3 2026 (julio-agosto)** — requiere coordinación con Davivienda

---

#### CRO-3 — Alta tasa de rebote en Homepage (64.67% tráfico Direct)

**Causa:** el usuario que llega directo a la homepage (a menudo desde un email o bookmark) ve el listado de artículos y no sabe por dónde empezar. Sin un hero claro, sin una jerarquía editorial visual, el usuario rebota.

**Benchmark:** la tasa de rebote de orgánico es 45.19% — los usuarios que llegan por una búsqueda específica saben qué quieren. La homepage tiene rebote 64.67% porque no articula propuesta de valor en los primeros 5 segundos.

**Soluciones de CRO para la homepage:**

| Elemento | Problema actual | Solución propuesta | Impacto est. |
|----------|----------------|-------------------|-------------|
| Hero banner | Sin CTA claro de suscripción | Hero con headline "169,000 profesionales confían en nuestro análisis" + CTA "Suscríbete gratis" prominente | -8pp rebote |
| Artículo destacado | Listado cronológico sin jerarquía | Artículo ancla de la semana (Pista A de Ernesto) con imagen grande y extracto de 2 líneas | -5pp rebote |
| Navegación temática | Sin categorías visibles en fold | Barra de categorías: Macroeconomía · Empresas · Inversión · Sectores · Mercados | +0.3 pág/ses |
| CTA suscripción inline | Ausente en homepage | Banner flotante (no popup) después de 30s o 50% scroll | +suscriptores |
| Social proof | No visible | "169,000 suscriptores · análisis semanal · Banco Davivienda" visible en el fold | -3pp rebote |

**Prioridad:** el CTA de suscripción en la homepage es la acción más directa para crecer la base. Si 42,295 usuarios/mes llegan al sitio y ninguno ve un CTA claro de suscripción en la homepage, se está dejando dinero en la mesa.

---

#### CRO-4 — Tráfico sin atribución (3.5% Unassigned en GA4)

**Causa:** 1,496 sesiones/mes en GA4 aparecen como "Unassigned" — sin UTMs configurados en los links de email, WhatsApp, o pauta.

**Impacto:** no se sabe si esas sesiones vienen de un email específico de Braze, de un WhatsApp de la comunidad, o de pauta mal configurada. Las decisiones de inversión en canales se toman con data incompleta.

**Fix rápido:**

```
Estructura UTM estándar propuesta:

Email Braze semanal:
utm_source=braze&utm_medium=email&utm_campaign=newsletter-quincenal&utm_content=[fecha-YYYYMMDD]

Email Braze especial:
utm_source=braze&utm_medium=email&utm_campaign=breaking-[tema]&utm_content=[fecha]

WhatsApp comunidad:
utm_source=whatsapp&utm_medium=social&utm_campaign=comunidad-vision

Pauta Meta Tipo 2:
utm_source=meta&utm_medium=paid&utm_campaign=tipo2-trafico&utm_content=[id-creativo]

Pauta Google:
utm_source=google&utm_medium=paid&utm_campaign=tipo1-adquisicion&utm_term=[keyword]
```

**Owner:** Estefanía (email UTMs) + Performix (pauta UTMs)
**Deadline:** **21 jun** — es un cambio de texto en links, no requiere desarrollo

---

### 2.3 CRO para el funnel de suscripción

Actualmente no existe un funnel de conversión medible desde visitante → suscriptor confirmado. Hay 135,500 suscriptores en Braze, pero no se sabe cuántos nuevos suscriptores orgánicos llegan cada semana ni a través de qué página.

**Pasos para construir el funnel:**

1. **Configurar evento de GA4 `newsletter_signup`** cuando el usuario completa el formulario de suscripción en el sitio (owner: Leo · deadline: 30 jun)
2. **Medir tasa de conversión por página de entrada** — qué artículos tienen mayor conversión a suscriptor (GA4 Funnel Exploration · owner: Carolina · deadline: jul)
3. **Identificar el artículo ancla de conversión** — usarlo como landing page de pauta Tipo 1
4. **Test A/B de posición del formulario de suscripción:** actual vs al 60% del scroll del artículo

**Benchmark de conversión visitante → suscriptor en medios financieros:** 1.5% a 4% de los visitantes que llegan a un artículo. Con 42,295 sesiones/mes y 1.5% de conversión → 634 suscriptores nuevos orgánicos/mes posibles. Con 4% → 1,692/mes.

---

### 2.4 CRO — Oportunidades rápidas (sin desarrollo)

Estas acciones las puede ejecutar Ernesto o Estefanía sin esperar a Leo:

| Acción | Cómo hacerlo | Impacto est. | Quién | Esta semana |
|--------|-------------|-------------|-------|-------------|
| Agregar 3 links internos en cada artículo nuevo | En el CMS de Brace al publicar · links a artículos del mismo cluster | +0.15 pág/ses | Ernesto | ✅ Inmediato |
| Actualizar los 5 títulos de las páginas de CTR bajo | Cambiar el `<title>` en el CMS de Brace | +3,149 clics/mes | Ernesto + Leo | Antes 23 jun |
| UTMs en todos los links del newsletter Braze | Editar el template del email en Braze | -1,496 ses sin atribución | Estefanía | Antes 21 jun |
| CTA de suscripción al final de los últimos 5 artículos publicados | Agregar bloque HTML manual al final del artículo | +suscriptores sin desarrollo | Ernesto | Esta semana |
| Añadir "Lee también" manualmente en artículos top 10 de tráfico | Links editoriales en el CMS | +pág/ses inmediato | Ernesto | Esta semana |

---

## HOJA DE RUTA — 3 SPRINTS INTEGRADOS (SEO + CRO)

### Sprint 1 — 18 al 30 jun — Desbloquear indexación + Quick wins CRO

**Foco:** corregir los bugs que limitan el tráfico orgánico y las ganancias inmediatas sin desarrollo

| # | Tarea | Owner | Deadline | KPI de éxito |
|---|-------|-------|----------|--------------|
| 1 | Fix C5: sitemap.xml 403→200 | Leo | **18 jun** | GSC confirma sitemap procesado · crawl aumenta |
| 2 | Fix C1: canonical dinámico sitewide | Leo | **18 jun** | 0 páginas sin canonical · PageRank consolidado |
| 3 | Fix C2: títulos dinámicos por template | Leo | **18 jun** | 0 páginas con título duplicado |
| 4 | Fix C3: meta descriptions dinámicas | Leo | **18 jun** | Google reescribe <20% de las metas |
| 5 | Investigar causa regresión 8 jun | Leo + Jeison | **18 jun** | Causa identificada y cerrada |
| 6 | Optimizar 5 títulos páginas CTR crítico | Carolina + Ernesto | **23 jun** | CTR >3% en esas páginas (medir en 30 días) |
| 7 | UTMs estandarizados en email Braze | Estefanía | **21 jun** | Unassigned cae a <1% en GA4 |
| 8 | Links internos manuales en top 10 artículos | Ernesto | **25 jun** | Páginas/sesión empieza a subir |
| 9 | Evaluar arquitectura SSR/SSG — propuesta técnica | Leo → Jeison | **30 jun** | Propuesta técnica aprobada |
| 10 | Breadcrumbs clickeables en artículos | Leo | **30 jun** | +0.05 pág/ses |

**Resultado esperado:** +3,149 clics orgánicos/mes (CTR fix) + inicio de recuperación de las 1,141 páginas desindexadas en la regresión del 8 jun.

---

### Sprint 2 — Jul 2026 — Schema + Contenido + CRO estructural

**Foco:** schema para Google News y AI Overviews, 5 artículos de clusters de alta demanda, mejoras CRO que requieren desarrollo

| # | Tarea | Owner | Deadline | Resultado esperado |
|---|-------|-------|----------|-------------------|
| 1 | NewsArticle schema en todos los artículos | Leo | Jul sem 1 | Elegibilidad Google News + rich results en SERP |
| 2 | BreadcrumbList schema en categorías | Leo | Jul sem 1 | Breadcrumbs en SERP → +0.5% CTR sitewide |
| 3 | Módulo "También te puede interesar" al final del artículo | Leo | Jul sem 1 | Páginas/sesión: 1.61 → 1.85+ |
| 4 | Barra lateral "Más en [Categoría]" en desktop | Leo | Jul sem 1 | Páginas/sesión adicional |
| 5 | Páginas de autor: Jaramillo, Acosta, equipo | Ernesto + Natalia | Jul sem 2 | E-E-A-T YMYL · autores con Person schema |
| 6 | 3 artículos Cluster Dividendos 2026 (Bancolombia, Argos, Davivienda) | Ernesto | Jul | +500-1,000 sesiones orgánicas/mes |
| 7 | 2 artículos Cluster Macro/BanRep (tasas + IPC) | Ernesto | Jul | +300-600 sesiones orgánicas/mes |
| 8 | Configurar evento GA4 `newsletter_signup` | Leo | Jul sem 1 | Funnel de conversión medible |
| 9 | Fix aria-label en tarjetas de artículos sin texto ancla | Leo | Jul sem 1 | Señal de relevancia interna |
| 10 | Update mega-meta en homepage: hero con CTA suscripción | Leo + Carolina | Jul sem 2 | Rebote homepage -5 a -10pp |

---

### Sprint 3 — Ago 2026 — Performance + AI Overviews + CRO avanzado

**Foco:** el fix estructural más difícil (SSR/SSG) y las piezas de largo plazo para aparecer en búsquedas de IA

| # | Tarea | Owner | Deadline | Resultado esperado |
|---|-------|-------|----------|-------------------|
| 1 | SSR/SSG en Brace — artículos y categorías | Leo | Ago | Recuperar 988 Soft 404 → +3,000-5,000 ses/mes |
| 2 | FAQPage schema en categorías de alto tráfico | Leo | Ago sem 1 | 3.2x probabilidad AI Overview de Google |
| 3 | Speakable schema en artículos seleccionados | Leo | Ago sem 2 | ChatGPT, Perplexity, Bing Copilot citan a Visión |
| 4 | CDN para imágenes (CloudFront o Cloudflare Images) | Leo + Jeison | Ago | Core Web Vitals: LCP -100-150ms en Colombia |
| 5 | CTAs hacia productos Davivienda en artículos | Leo + Carolina | Ago | Primeras conversiones medibles a productos |
| 6 | Cluster COLCAP / Índices: 3 artículos | Ernesto | Ago | +500-800 ses/mes · captura demanda +2,000% |
| 7 | Auditoría thin content — 3,803 páginas "rastreada sin indexar" | Carolina + Leo | Ago | Plan de noindex / consolidar / enriquecer |
| 8 | Test A/B posición CTA suscripción en artículo | Leo + Estefanía | Ago | Tasa conversión visitante → suscriptor |
| 9 | Consolidar 25 scripts JS con defer/async | Leo | Ago | Reducción tiempo de renderizado |
| 10 | Banner de suscripción flotante (no popup) en artículos | Leo | Ago | +suscriptores orgánicos/mes |

---

## PROYECCIÓN DE IMPACTO — SEO + CRO integrado

| Acción | Sprint | Timeline impacto | Sesiones adicionales/mes |
|--------|--------|-----------------|--------------------------|
| Fix canonical + títulos + metas + sitemap | Sprint 1 | 30-45 días | +1,500 a +3,000 |
| Optimización CTR 5 páginas | Sprint 1 | 30 días | **+3,149** |
| Links internos editoriales + módulo relacionados | Sprint 1-2 | Inmediato | +pág/sesión (retención) |
| Schema NewsArticle → rich results | Sprint 2 | 30-60 días | +800 a +1,500 |
| Contenido clusters P0 — 6 artículos nuevos | Sprint 2 | 60-90 días | +2,000 a +3,500 |
| SSR/SSG → recuperar 988 Soft 404 | Sprint 3 | 60-90 días | **+3,000 a +5,000** |
| FAQPage + Speakable → AI Overviews | Sprint 3 | 90 días | +500 a +1,500 |
| CTAs Davivienda en artículos | Sprint 3 | Continuo | Conversiones a cliente |
| **TOTAL PROYECTADO** | | **6 meses** | **+11,000 a +17,650/mes** |

> Objetivo 2026: 20,000 sesiones orgánicas/mes (vs 4,817 actuales). Este plan cubre 55-88% del gap. El 12-45% restante requiere crecimiento de la base de contenido más allá de los clusters definidos.

---

## PRÓXIMOS PASOS — POR OWNER Y FECHA

### Leo (Brace) — antes del 30 jun 2026
1. **18 jun:** Fix C5 — sitemap.xml 403→200 (30 min) — PRIMERO POR RAPIDEZ
2. **18 jun:** Fix C1 — canonical dinámico en todos los templates (2h)
3. **18 jun:** Fix C2 — títulos dinámicos por tipo de página (3h)
4. **18 jun:** Fix C3 — meta descriptions dinámicas (2h)
5. **18 jun:** Investigar causa regresión 8 jun (+1,141 desindexadas en 1 día)
6. **30 jun:** Breadcrumbs clickeables en artículos
7. **30 jun:** Propuesta técnica SSR/SSG para aprobación de Jeison

### Carolina — antes del 28 jun 2026
1. **18 jun:** Escalar los 5 fixes a Jeison + Leo con este documento como brief
2. **23 jun:** Entregar los 5 títulos y metas propuestos a Ernesto para aprobación editorial
3. **23 jun:** Escalar la regresión del 8 jun a Jeison — nadie la había detectado
4. **Antes 28 jun:** Proponer a Natalia el plan de clusters de contenido (6 artículos en julio)
5. **Antes 28 jun:** Validar con equipo Davivienda qué productos vinculables existen para CTAs

### Ernesto — inmediato + sprint 2
1. **Esta semana:** Agregar mínimo 3 links internos a cada artículo nuevo publicado
2. **Esta semana:** CTA manual de suscripción al final de los últimos 5 artículos
3. **23 jun:** Aprobar los 5 títulos propuestos para páginas de CTR bajo
4. **Julio:** Publicar 3 artículos Cluster Dividendos (Bancolombia, Argos, Davivienda)
5. **Julio:** Publicar 2 artículos Cluster Macro/BanRep (tasas + IPC)
6. **Julio:** Crear páginas de autor para el equipo (Jaramillo, Acosta)

### Estefanía — antes del 21 jun 2026
1. **21 jun:** Implementar UTMs estandarizados en todos los links del newsletter Braze
2. **21 jun:** Auditar links de email anteriores — ¿cuántos sin UTMs?

### Jeison — antes del 30 jun 2026
1. **18 jun:** Coordinar con Leo la ejecución de los 5 fixes C1-C5
2. **18 jun:** Validar configuración Cloudflare que bloquea sitemap.xml
3. **23 jun:** Gestionar acceso GSC para Carolina
4. **30 jun:** Aprobar propuesta SSR/SSG para Sprint 3

---

## MÉTRICAS DE SEGUIMIENTO

| KPI | Actual (mayo) | Target Sprint 1 (jul) | Target Sprint 2 (ago) | Target Sprint 3 (sep) |
|-----|--------------|----------------------|----------------------|----------------------|
| Sesiones orgánicas/mes | 4,817 | 8,000 | 12,000 | 18,000+ |
| CTR medio GSC | 1.5% | 2.5% | 3.0%+ | 3.5%+ |
| Páginas/sesión | 1.61 | 1.75 | 1.90 | 2.0+ |
| Páginas indexadas | 2,676 | 3,500+ | 5,000+ | 6,500+ |
| Rebote homepage | 64.67% | 58% | 55% | <52% |
| Duración media | 3:15 | 3:25 | 3:35 | 3:45+ |
| Tráfico Unassigned GA4 | 3.5% | <1% | <0.5% | <0.5% |
| Posición media GSC | 6.83 | <6.5 | <6.0 | <5.5 |

---

## NOTAS OPERATIVAS

- **Código regresión a investigar:** 8-11 jun 2026 · +1,141 páginas desindexadas en 1 día · Jeison + Leo deben identificar el deploy de Brace responsable
- **Acceso GSC:** Carolina no tiene acceso directo — Jeison debe gestionarlo antes del 23 jun
- **Brace CMS:** todos los fixes técnicos C1-C5 van por Leo (único desarrollador del CMS)
- **Deadline Natalia:** 28 jun 2026 — todo lo que requiera aprobación presupuestal o de prioridad editorial debe estar escalado antes
- **Verificación de fixes:** usar Rich Results Test (search.google.com/test/rich-results) para schema y GSC Coverage para indexación
- **Meta descriptions:** máximo 155 caracteres · incluir 1 dato numérico cuando sea posible · terminar con un verbo de acción
