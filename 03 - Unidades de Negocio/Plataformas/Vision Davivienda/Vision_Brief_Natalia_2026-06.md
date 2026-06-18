---
date: 2026-06-17
type: brief
tags: [vision-davivienda, brief, natalia-otalora, estrategia, junio-2026]
related-projects: [vision-davivienda]
related-people: [natalia-otalora, carolina-ramirez, jeison-montero]
ai-first: true
confidence: high
---

# Visión Davivienda — Brief Estratégico
**Para:** Natalia Otálora | **De:** Carolina Ramirez | **Fecha:** 17 jun 2026
**Deadline de aprobación:** 28 de junio (antes de tu ausencia)

---

## Estado actual vs meta

| | Meta 2026 | Hoy | Brecha |
|--|-----------|-----|--------|
| Visualizaciones anuales | 2,000,000 | 520,941 YTD | Necesita ~246K/mes en H2 |
| Tráfico orgánico % | 20% | 18% | -2 puntos |
| Posición media Google | 9.4 | 4.9 | ✅ Superada |
| Email CTR | 5%+ | 2.5% | -2.5 puntos |
| Suscriptores activos | 160,000 | 135,500 (Braze) | -24,500 |
| Pauta eficiencia | ~300K views/mes | Muy por debajo | Mix objetivos desalineado |

---

## Diagnóstico raíz — 3 causas confirmadas

**1. El sitio está 76% deindexado por Google**
Solo 2,676 de ~11,000 páginas aparecen en Google. Las otras 988 páginas devuelven error silencioso porque el contenido tarda 3 segundos en cargar (JavaScript). Google las ve vacías y las ignora. Esto explica la caída de 2M → 1.2M en 2025.
→ Fix: SSR/SSG en Brace (Leo). Sin esto, ninguna otra acción de SEO funciona al máximo.

**⚠️ Alerta activa:** El 8 de junio se desindexaron 1,141 páginas adicionales en un día. Pendiente investigar causa con Jeison/Leo.

**2. La pauta genera engagement, no tráfico**
~$9.9M del presupuesto 2026 están en objetivos de Interacción, Registros y Visitas al perfil (Meta) — ninguno lleva personas al sitio. En 2024 todo el presupuesto iba a Clic y Conversión.
→ Fix: Reasignar esos $9.9M a objetivos de tráfico web + revisar segmentaciones con Performix.

**3. El email abre pero no hace clic**
Open rate estimado real: 47.66% (excelente). CTOR: 2.5% vs benchmark industria 10-15%. La audiencia existe y está comprometida — el problema es el diseño interno del email y el CTA.
→ Fix: Rediseño de plantilla con un CTA único, prominente, mobile-first.

---

## Plan de acción — 4 palancas

### Palanca 1 — Técnica (Leo) · Impacto: +3,000-8,000 visualizaciones/mes
| Prioridad | Acción | Deadline |
|-----------|--------|---------|
| 🔴 P0 urgente | Investigar regresión 8 jun (+1,141 páginas desindexadas) | Esta semana |
| 🔴 P0 | SSR/SSG: renderizado del lado del servidor para que Googlebot lea el contenido | Jul sem 1-2 |
| 🔴 P0 | Canonical tags en todas las páginas (145 duplicados sin canonical confirmados) | Jul sem 1 |
| 🔴 P0 | Títulos dinámicos por página ("Artículo | Visión Davivienda") | Jul sem 1 |
| 🔴 P0 | Corregir sitemap 403 | Jun sem 3 |
| 🟠 P1 | NewsArticle schema para AI Overviews y búsquedas de IA | Jul sem 2 |
| 🟠 P1 | Páginas de autor verificables (E-E-A-T) | Jul sem 2 |

### Palanca 2 — Pauta (Performix + Natalia) · Impacto: +8,000-12,000 visualizaciones/mes
| Acción | Responsable | Deadline |
|--------|-------------|---------|
| Auditar mezcla de objetivos 2026 — identificar cuánto va a engagement vs tráfico | Carolina + Natalia | 20 jun |
| Reasignar $9.9M (Interacción + Registros + Visitas perfil) → Sesiones web | Carolina + Natalia → Performix | 25 jun |
| Revisar segmentaciones y lookalikes 2026 vs 2024 | Natalia + Alejandro Bojacá | 25 jun |
| Obtener acceso analista Carolina a Meta Business Manager | Jeison → Alejandro | 18 jun |

### Palanca 3 — Email (Estefanía) · Impacto: +3,200 visualizaciones/mes
| Acción | Responsable | Deadline |
|--------|-------------|---------|
| Rediseño plantilla: un CTA único, botón con texto de acción, mobile-first | Estefanía + Carolina | 25 jun |
| Implementar nueva plantilla en Braze y A/B test vs versión actual | Estefanía | 27 jun |
| Auditar y estandarizar UTMs en todos los envíos (hay 2.74% "not set") | Estefanía | 23 jun |
| Investigar los 33,500 registrados que no están en lista activa de Braze | Natalia + Jeison | 25 jun |

### Palanca 4 — Contenido evergreen (Estefanía + equipo) · Impacto: +3,000-5,000 visualizaciones/mes en 90 días
Basado en datos GSC: estos clusters tienen demanda comprobada y contenido insuficiente.

| Cluster | Tendencia | Artículos a producir (julio) |
|---------|----------|------------------------------|
| Dividendos 2026 | +517% | Ecopetrol, Bancolombia, Corficolombiana, GEB, Celsia, calendario hub |
| Macro Colombia | +700% | IPC tracker mensual, crecimiento PIB, déficit fiscal actualizado |
| BanRep / tasas | +1,100% | Tracker decisiones JDBR, tasa de usura mensual |
| Análisis compañías | Nuevo | MSCI COLCAP rebalanceo, recompras acciones |

**Regla de distribución (acordada en reunión):** mismo contenido, diferentes fechas y formatos por canal. Una pieza bien investigada → web + email + IG (educativo) + LI (autoridad) + X (coyuntura).

---

## Lo que necesita aprobación antes del 28 jun

| Decisión | Opciones | Recomendación |
|----------|---------|---------------|
| **Reasignación $9.9M pauta** | Mantener mix actual vs mover a tráfico | Mover a tráfico — ROI inmediato |
| **Piloto contenido 2 meses** | Aprobar 4 pilares + cronograma | Aprobar — bajo riesgo, data real en 60 días |
| **ManyChat ($69 USD/mes)** | Aprobar o no | Jeison presenta justificación a dirección |
| **SSR/SSG como P0 técnico** | Confirmar que Leo lo prioriza sobre otros desarrollos | Sí — sin esto el SEO no despega |

---

## Métricas de éxito del piloto (2 meses)

| Métrica | Hoy (baseline) | Target piloto (sep) |
|---------|---------------|---------------------|
| CTR orgánico (GSC) | 1.5% | 2.5% |
| Sesiones desde organic social | ~1,846/mes | +30% (~2,400/mes) |
| Email CTOR | 2.5% | 4.0% |
| Páginas indexadas | 2,676 | 3,500+ |
| Clics desde cluster dividendos/macro | ~800/mes | 2,000+/mes |

---

## Redes sociales — activaciones pendientes

| Canal | Estado | Próximo paso |
|-------|--------|-------------|
| Instagram | Solo imágenes estáticas | Activar mini-videos 60s + carruseles |
| Instagram DM | Sin automatización | ManyChat — pendiente aprobación Jeison |
| YouTube | Solo eventos | Cortos de análisis entre eventos |
| X | Activo | Mantener coyuntura económica en tiempo real |

---

## Relacionado

[[Vision_01_NorthStar_2026-06]] · [[Vision_Estrategia_Growth_2026]] · [[Vision_02_SEO_2026-06]] · [[Vision_04_Pauta_2026-06]] · [[Vision_NextSteps_2026-06]] · [[2026-06-16 Natalia Otalora - Alineacion Estrategia Digital]]
