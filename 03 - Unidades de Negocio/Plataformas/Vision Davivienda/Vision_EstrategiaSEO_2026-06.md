---
date: 2026-06-19
type: estrategia-seo
tags: [vision-davivienda, seo, tecnico, contenido, schema, ctr, indexacion, ai-overviews]
related-projects: [vision-davivienda, growth-dashboard]
related-people: [natalia-otalora, carolina-ramirez, jeison-montero, leo-brace]
sources:
  - "Vision_02_SEO_2026-06 — dashboard GSC mayo 2026"
  - "2026-06 Auditoria Web SEO CRO Vision Davivienda — auditoría técnica 16 jun"
  - "Vision_01_NorthStar_2026-06 — objetivos anuales"
ai-first: true
confidence: high
---

# Visión Davivienda — Estrategia SEO 2026

> **For future Claude:** Estrategia SEO completa basada en auditoría técnica del 16 jun 2026 y datos reales de GSC (mar-jun 2026). El problema NO es visibilidad — el sitio ya tiene 453K impresiones/mes. El problema es: (1) 5 bloqueos técnicos que limitan indexación y CTR, (2) solo 24% del sitio está indexado (2,676 de ~11,000 páginas), (3) CTR de 1.5% vs benchmark 3-5%. La oportunidad inmediata vale +3,149 clics/mes solo con fixes de título/meta en 5 páginas. El foco es Leo (proveedor técnico Brace CMS). Natalia ausente desde 28 jun — todo debe estar escalado antes de esa fecha.

---

## DIAGNÓSTICO — EL PROBLEMA ES CTR, NO VISIBILIDAD

| Métrica | Valor actual | Benchmark | Brecha |
|---------|-------------|-----------|--------|
| Impresiones/mes | 453,000 | — | Fuerte |
| CTR medio | 1.5% | 3-5% | **3x por debajo** |
| Clics/mes estimado | ~2,265 | ~13,600 con CTR 3% | -11,335/mes |
| Páginas indexadas | 2,676 / ~11,000 | 80%+ | Solo 24% |
| Soft 404 (JS rendering) | 988 páginas | 0 | Causa raíz caída 2025 |
| Sesiones orgánicas (mayo) | 4,817 | 20,000+ (objetivo 2026) | -75% del objetivo |

**Lectura directa:** Si el CTR sube de 1.5% a 3% con las mismas impresiones → 13,600 clics/mes → +163,000 sesiones/año desde SEO sin crear un solo artículo nuevo. Eso resuelve 40% del gap hacia el objetivo anual de 138K sesiones orgánicas.

---

## LOS 5 BLOQUEOS TÉCNICOS — P0 (owner: Leo)

Estos 5 issues no son mejoras. Son bugs que están limitando activamente la indexación. Deben resolverse antes de cualquier estrategia de contenido.

### C1 — Canonical tags ausentes en todo el sitio
- **Estado:** 0/10 — ausentes en homepage, artículos y categorías
- **Consecuencia:** Google puede indexar múltiples variantes de la misma URL, dividir el PageRank, y elegir la URL equivocada para rankear
- **Fix:** `<link rel="canonical" href="[URL exacta]">` dinámico en todos los templates de Brace
- **Esfuerzo:** 1-2 horas desarrollo · **Deadline: 18 jun**

### C2 — Títulos duplicados sitewide
- **Estado:** 1/10 — todas las páginas usan el mismo título de la homepage
- **Consecuencia:** Google no puede distinguir qué página rankear por query. CTR bajo porque el título no describe el contenido
- **Fix por template:**
  - Homepage: `Visión Davivienda | Análisis económico y financiero Colombia`
  - Artículo: `[Título del artículo] | Visión Davivienda`
  - Categoría: `[Nombre categoría]: análisis y perspectivas | Visión Davivienda`
  - Subcategoría: `[Nombre subcategoría] | Visión Davivienda`
- **Esfuerzo:** 2-3 horas desarrollo · **Deadline: 18 jun**

### C3 — Meta descriptions duplicadas sitewide
- **Estado:** todas las páginas comparten la misma meta description genérica
- **Consecuencia:** Google reescribe las metas → pierde control del mensaje en SERP → CTR subóptimo
- **Fix:** Template dinámico que use los primeros 155 caracteres del artículo o excerpt manual por categoría
- **Esfuerzo:** 1-2 horas desarrollo · **Deadline: 18 jun**

### C4 — Contenido renderizado por JavaScript con delay 3+ segundos
- **Estado:** 3/10 — al cargar un artículo inmediatamente: wordCount = 1. Después de 3s: wordCount = 1,005
- **Consecuencia directa:** 988 Soft 404 en GSC → Google ve páginas vacías → las desindexó en masa en 2025 (causa probable de la caída de 2M a 1.2M vistas)
- **Fix:** SSR o SSG para páginas de artículos y categorías en Brace. Como mínimo: pre-rendering del contenido crítico
- **Evidencia de urgencia:** regresión del 8 jun (+1,141 páginas desindexadas en un día) puede estar relacionada con este mismo issue
- **Esfuerzo:** 1-2 semanas desarrollo · **Deadline: 30 jun**

### C5 — Sitemap.xml devuelve 403 Forbidden
- **Estado:** 0/10 — el archivo declarado en robots.txt no es accesible para Googlebot
- **Consecuencia:** Google descubre URLs solo por links internos → crawl incompleto → artículos nuevos sin indexar por días o semanas
- **Fix:** Verificar configuración Cloudflare que bloquea `/sitemap.xml`. Asegurar HTTP 200 para todos los user-agents. Resubmitir a GSC
- **Esfuerzo:** 30 minutos · **Deadline: 18 jun**

---

## OPORTUNIDAD INMEDIATA — 5 PÁGINAS, +3,149 CLICS/MES

Estas páginas ya tienen alto volumen de impresiones pero CTR crítico. El fix es solo el título tag y la meta description. Sin tocar el contenido.

| Página | Impresiones | CTR actual | Posición | CTR objetivo | Clics adicionales/mes |
|--------|-------------|------------|----------|--------------|----------------------|
| /macroeconomia/deficit-fiscal-colombia-2026 | 33,734 | 0.31% | 6.67 | 3% | **+898** |
| /macroeconomia/Colombia-2025-crecimiento-inflacion | 28,244 | 0.53% | 7.46 | 3% | **+697** |
| /analisis-de-companias/ecopetrol/dividendos-ecopetrol-2026 | 23,477 | 1.29% | 5.79 | 4% | **+635** |
| /macroeconomia/BanRep-junta-directiva-2025 | 13,330 | 1.46% | 6.22 | 4% | **+338** |
| /analisis-de-companias/celsia-recompra-acciones-2026 | 12,351 | 1.29% | **3.88** | 6% | **+581** |
| **TOTAL** | **111,136** | — | — | — | **+3,149/mes** |

> **Celsia es el caso más urgente:** posición 3.88 (top 4) con CTR de 1.29% es imposible con un título bien optimizado. A esa posición el CTR normal es 6-8%. El título actual es literal del artículo — debe responder la intención del buscador: `"Celsia recompra acciones a $9,002: lo que necesita saber el inversor"`.

**Títulos propuestos:**

| Página | Título actual (estimado) | Título propuesto |
|--------|-------------------------|-----------------|
| Déficit fiscal Colombia 2026 | [título genérico] | `Déficit fiscal Colombia 2026: cuánto es, por qué importa y qué sigue | Visión` |
| Colombia macro 2025 | [título genérico] | `Colombia 2025: crecimiento, inflación y retos fiscales — análisis completo | Visión` |
| Dividendos Ecopetrol 2026 | [título genérico] | `Dividendos Ecopetrol 2026: fecha, monto y cómo recibirlos | Visión Davivienda` |
| BanRep junta | [título genérico] | `¿Cómo cambiaría la junta directiva del BanRep en 2025? | Visión Davivienda` |
| Celsia recompra | [título genérico] | `Celsia recompra acciones a $9,002: lo que necesita saber el inversor | Visión` |

---

## CLUSTERS DE CONTENIDO — DEMANDA EN CRECIMIENTO

Búsquedas con tendencia al alza que Visión puede capturar con contenido nuevo o actualizado:

### Cluster P0 — Dividendos 2026 (+220% a +517%)
**Páginas ancla existentes:** `/en-que-invertir/acciones/calendario-dividendos-colombia-2026` (CTR 10.76% ✅)
**Oportunidad:** el calendario ya funciona. Falta contenido de análisis por empresa.

| URL propuesta | Query objetivo | Volumen tendencia |
|--------------|---------------|------------------|
| `/analisis-de-companias/ecopetrol/dividendos-ecopetrol-2026` | dividendos ecopetrol 2026 | +220% |
| `/analisis-de-companias/bancolombia/dividendos-bancolombia-2026` | dividendos bancolombia 2026 | Sin contenido actual |
| `/analisis-de-companias/grupo-argos/dividendos-grupo-argos-2026` | dividendos grupo argos | Sin contenido actual |
| `/analisis-de-companias/davivienda/dividendos-davivienda-2026` | dividendos davivienda 2026 | 61 clics ya |

### Cluster P0 — Macro Colombia (+500% a +700%)
**Páginas ancla existentes:** `/macroeconomia/deficit-fiscal-colombia-2026` (33K impresiones, CTR 0.31% → fix urgente)

| URL propuesta | Query objetivo | Volumen tendencia |
|--------------|---------------|------------------|
| `/macroeconomia/ipc-colombia-2026` | ipc 2026 colombia / inflación colombia | +500% |
| `/macroeconomia/crecimiento-economia-colombia-2026` | como va la economía en colombia 2026 | +700% |
| `/macroeconomia/perspectivas-economicas-colombia-2026` | perspectivas economicas colombia | Sin contenido actual |

### Cluster P0 — BanRep / Tasas de interés (+1,100%)
**Páginas ancla existentes:** `/macroeconomia/BanRep-junta-directiva-2025` (13K impresiones)

| URL propuesta | Query objetivo | Volumen tendencia |
|--------------|---------------|------------------|
| `/macroeconomia/tasas-interes-colombia-2026` | banrep sube tasas / tasa interés bancos colombia | +1,100% |
| `/macroeconomia/decision-banrep-junio-2026` | banrep junio 2026 | Coyuntural recurrente |
| `/macroeconomia/tasa-de-intervencion-banrep-2026` | tasa de intervención banrep | Alta intención técnica |

### Cluster P1 — Compañías Colombia (nuevo)
**Sin contenido actual suficiente**

| URL propuesta | Query objetivo |
|--------------|---------------|
| `/analisis-de-companias/mineros-recompra-acciones-2026` | recompra mineros 2026 |
| `/analisis-de-companias/bancolombia-resultados-2026` | bancolombia resultados 2026 |

### Cluster P1 — COLCAP / Índices (+2,000%)
| URL propuesta | Query objetivo |
|--------------|---------------|
| `/en-que-invertir/acciones/rebalanceo-colcap-2026` | rebalanceo msci colcap 2026 |
| `/en-que-invertir/acciones/colcap-que-es-como-invertir` | ¿qué es el COLCAP? (evergreen) |

---

## SCHEMA Y E-E-A-T — VISIBILIDAD EN AI OVERVIEWS

Objetivo explícito de Natalia para 2026: "estar en búsquedas de IA". Requisitos mínimos:

### Estado actual
| Requisito | Estado | Impacto |
|-----------|--------|---------|
| Schema NewsArticle | ❌ Ausente | Sin rich results, sin Google News |
| Schema BreadcrumbList | ❌ Ausente | Sin breadcrumbs en SERP |
| Schema FAQPage | ❌ Ausente | Invisible para AI Overviews |
| Schema Speakable | ❌ Ausente | Sin voice search / AI citation |
| Canonical sitewide | ❌ Ausente | Bloqueo indexación (ver C1) |
| Autoría individual (E-E-A-T) | ❌ Sin autor individual | Señal YMYL débil |
| JS rendering para bots | ❌ 3s delay | Google ve páginas vacías (ver C4) |
| HTTPS + señales confianza | ✅ OK | Base sólida |
| FAQPage schema en categorías | ❌ Ausente | 3.2x más probabilidad AI Overview |

### Schema mínimo a implementar (owner: Leo)

**Para artículos:**
```json
{
  "@type": "NewsArticle",
  "headline": "[Título del artículo]",
  "datePublished": "[fecha ISO]",
  "dateModified": "[fecha modificación]",
  "author": {"@type": "Person", "name": "[Nombre analista]", "url": "[URL página autor]"},
  "publisher": {"@type": "Organization", "name": "Visión Davivienda"},
  "image": "[URL imagen principal]",
  "articleBody": "[Primeros 500 caracteres del artículo]"
}
```

**Para categorías:**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://vision.davivienda.com/"},
    {"@type": "ListItem", "position": 2, "name": "[Categoría]", "item": "[URL]"}]
}
```

**Para homepage (AI Overviews):**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "¿Qué es Visión Davivienda?", "acceptedAnswer": {"@type": "Answer", "text": "..."}},
    {"@type": "Question", "name": "¿Cómo invertir en Colombia en 2026?", "acceptedAnswer": {"@type": "Answer", "text": "..."}}
  ]
}
```

### Páginas de autor (owner: Ernesto + Natalia)
Crear `vision.davivienda.com/autores/[nombre-analista]` con:
- Foto, nombre, cargo
- Área de especialización
- Lista de artículos publicados
- Schema `Person` con credentials verificables

Esto es la señal E-E-A-T más importante para contenido YMYL (finanzas). Sin autor verificable, Google y los LLMs no citan el contenido.

---

## HOJA DE RUTA — 3 SPRINTS

### Sprint 1 — Semana 1-2 (18-30 jun) — Desbloquear indexación
**Owner principal: Leo (Brace)**

| # | Tarea | KPI éxito |
|---|-------|-----------|
| 1 | Fix canonical sitewide | 0 páginas sin canonical en GSC |
| 2 | Fix títulos dinámicos por template | 0 páginas con título duplicado |
| 3 | Fix meta descriptions dinámicas | Google reescribe <20% de metas |
| 4 | Fix sitemap.xml 403 → 200 | GSC confirma sitemap procesado |
| 5 | Escalamiento regresión 8 jun | Identificar causa +1,141 desindexadas |
| 6 | Optimizar 5 títulos top páginas CTR bajo | CTR >3% en esas 5 páginas en 30 días |

**Resultado esperado en 30-45 días:** +3,149 clics/mes solo por fix CTR. Recuperar parte de las 1,141 páginas desindexadas.

---

### Sprint 2 — Mes 1-2 (jul 2026) — Schema + E-E-A-T + Contenido
**Owner: Leo (schema) + Ernesto (contenido) + Carolina (coordinación)**

| # | Tarea | Impacto |
|---|-------|---------|
| 1 | Implementar NewsArticle schema en artículos | Elegibilidad Google News + rich results |
| 2 | Implementar BreadcrumbList en categorías | CTR mejorado en SERP |
| 3 | Crear páginas de autor (Jaramillo, Acosta, equipo) | E-E-A-T para YMYL |
| 4 | Fix aria-label en tarjetas de artículos | Señal de relevancia |
| 5 | Publicar 3 artículos Cluster Dividendos 2026 | +500-1,000 visitas orgánicas/mes en 60 días |
| 6 | Publicar 2 artículos Cluster Macro/BanRep | +300-600 visitas orgánicas/mes |
| 7 | Update títulos de las 5 páginas CTR crítico | +3,149 clics/mes validados |

---

### Sprint 3 — Mes 2-3 (ago 2026) — Performance + AI Overviews
**Owner: Leo (técnico) + Ernesto (contenido) + Carolina (priorización)**

| # | Tarea | Impacto |
|---|-------|---------|
| 1 | SSR/SSG en Brace para artículos y categorías | Recuperar 988 Soft 404 → reindexación |
| 2 | Implementar FAQPage schema en categorías clave | 3.2x probabilidad AI Overview |
| 3 | Implementar Speakable schema en artículos seleccionados | Citabilidad en IA generativa |
| 4 | CDN para imágenes (CloudFront o Cloudflare Images) | -100-150ms latencia Colombia |
| 5 | Consolidar 25 scripts JS con defer/async | Reducir delay de renderizado |
| 6 | Publicar cluster COLCAP/Índices (3 artículos) | Capturar demanda creciente +2,000% |
| 7 | Auditoría de contenido thin (3,803 páginas "rastreada sin indexar") | Decidir consolidar, noindex, o enriquecer |

---

## PROYECCIÓN DE IMPACTO

| Acción | Timeline | Sesiones orgánicas adicionales/mes |
|--------|----------|-----------------------------------|
| Fix canonical + títulos + metas (C1-C3-C2) | Sem 1 → impacto en 30-45 días | +1,500 a +3,000 |
| Optimización CTR 5 páginas | Sem 1 → impacto en 30 días | +3,149 |
| Fix sitemap (C5) → mejor crawl | Sem 1 → impacto en 2-4 semanas | +500 a +1,000 (nuevas páginas indexadas) |
| SSR/SSG (C4) → recuperar 988 Soft 404 | Sprint 3 → impacto en 60-90 días | +3,000 a +5,000 |
| Schema NewsArticle → rich results | Sprint 2 → impacto en 30-60 días | +800 a +1,500 (CTR mejorado) |
| Contenido clusters P0 (6 artículos) | Sprint 2 → impacto en 60-90 días | +2,000 a +3,500 |
| **TOTAL PROYECTADO (6 meses)** | | **+11,000 a +17,150/mes** |

> Objetivo 2026: 20,000 sesiones orgánicas/mes (vs 4,817 actuales en mayo). Esta hoja de ruta cubre 55-86% del gap.

---

## PRÓXIMOS PASOS — POR OWNER

### Leo (Brace) — antes 30 jun
1. Fix C5: sitemap.xml 403 → 200 (30 min)
2. Fix C1: canonical dinámico en todos los templates (2h)
3. Fix C2: títulos dinámicos por tipo de página (2-3h)
4. Fix C3: meta descriptions dinámicas (2h)
5. Investigar causa regresión 8 jun (+1,141 desindexadas)
6. Evaluar SSR/SSG — proponer arquitectura a Jeison

### Carolina — antes 28 jun
1. Escalar los 5 issues a Jeison/Leo con este documento como brief (18 jun)
2. Entregar los 5 títulos propuestos a Ernesto para aprobación editorial
3. Proponer a Natalia el plan de clusters de contenido antes del 28 jun
4. Validar acceso GSC con Jeison para monitoreo semanal post-fix

### Ernesto — sprint 2
1. Aprobar y publicar 3 artículos Cluster Dividendos 2026
2. Aprobar y publicar 2 artículos Cluster Macro/BanRep
3. Crear páginas de autor para el equipo de investigaciones
4. Definir política editorial de URLs (max 3 niveles, slugs cortos)

### Jeison — antes 30 jun
1. Coordinar con Leo la implementación de los 5 fixes críticos
2. Gestionar acceso GSC para Carolina
3. Validar configuración Cloudflare que bloquea sitemap.xml
