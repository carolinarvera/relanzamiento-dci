---
date: 2026-07-19
type: funnel-vs
tags: [vs01, vision-davivienda, funnel, trafico, suscriptores, newsletter, braze]
related-people: [natalia-otalora, carolina-ramirez, estefania-ochoa, jeison-montero, leo-brace]
related-projects: [vision-davivienda]
sources: [Vision_Estrategia_Digital_360_2026]
ai-first: true
confidence: high
---

## For future Claude
VS01 para Visión Davivienda: funnel principal de tráfico + suscripción al newsletter. North Star: (1) 90% → tráfico al sitio, (2) 10% → suscriptores Braze. Canal #1 por sesiones = Organic Social (35.5%, 15,427 sesiones) pero con engagement 0-3s y 80-85% rebote porque las campañas AON aterrizan en categorías genéricas. Email/Braze = canal #1 por calidad (4.3 sesiones/usuario, 45s-1:33 engagement). SEO orgánico (9.9%) = mayor potencial sin explotar. Baseline: 43,400 sesiones/mes. form_start: 64 eventos = suscripción casi invisible. Creado 2026-07-19, actualizado con datos de campañas 2026-07-19.

---

# VS01 — Funnel Tráfico + Suscriptores (OBJ1 + OBJ2)
**Fecha:** 2026-07-19 | **Owner:** Carolina Ramirez + Natalia Otálora | **Plataforma email:** Braze (Estefanía Ochoa)

---

## North Star Metrics

| Objetivo | Métrica | Baseline jun 2026 | Meta dic 2026 |
|---|---|---|---|
| OBJ1: Tráfico | Sesiones/mes | **~43,400** (jul 2026) | 70,000 |
| OBJ2: Suscripción | form_start/mes | **64** (dato roto — CTA inexistente) | 500 suscriptores nuevos/mes |

---

## Mapa del Funnel — 4 Etapas

```
[DESCUBRIMIENTO] → [CONSIDERACIÓN] → [CONVERSIÓN] → [RETENCIÓN]
  Google/RRSS/Email    Artículo en sitio    Suscribirse      Email recurrente
```

---

## ETAPA 1 — DESCUBRIMIENTO (TOFU)

**Objetivo:** que el usuario encuentre Visión antes que a la competencia, en el canal correcto.

### Canal Social (FB/AON) — #1 por volumen (35.5%), pero calidad cero

**El problema de fondo:** Las campañas AON de Facebook (2-AON-VISION_CSD y 4-AON-VISION_CSD) generan 15,000+ sesiones, pero aterrizan en páginas de categoría genéricas.

| Campaña | Sesiones | Engagement | Rebote | Landing page actual | Landing page correcto |
|---|---|---|---|---|---|
| 2-AON-VISION_CSD / FB Social | 13,643 | **0-1s** | **80-85%** | `/`, `/estar-actualizado` | Artículo específico |
| 4-AON-VISION_CSD / FB Social | 1,381 | **2-3s** | **77-81%** | `/macroeconomia`, `/estar-actualizado` | Artículo específico |

Fix inmediato: cambiar landing page de cada pauta a artículo publicado en las últimas 48h. Sin cambio de presupuesto.

### Canal Email/Braze — #1 por calidad (4.3 sesiones/usuario nuevo)
| Acción | Estado | Gap |
|---|---|---|
| Email de informe (trigger 1-2h post-publicación) | ⚠️ Existe, sin A/B | Sin test de asunto; CTOR 2.5% vs meta 5% |
| Email semanal (martes 8AM) | ❌ No existe | Canal sin activar — mayor oportunidad inmediata |
| A/B test de asunto en cada envío | ❌ No existe | Sin esto, no mejora el open rate ni el CTOR |
| Naming de campañas actualizado | ❌ Obsoleto | Código "20250828" activo desde ago 2025 — inútil para comparación |

**Dato de campaña (GA4 exploración):**
| Tipo email | Rebote | Engagement | Acción |
|---|---|---|---|
| Para empezar el día | **40-43%** | 38s-1:19 | Ampliar frecuencia — el mejor formato |
| Boletin quincenal (3189_IEC) | **37-55%** | 57s-1:33 | Escalar — mayor engagement del sitio |
| Expectativa semanal | 57-63% | 54-59s | Mantener |
| Visión macro / Seguimiento BanRep | 43-72% | 32s-1:02 | Variable — optimizar asunto |

### Canal Google Orgánico — #2 hoy (23.2%), mayor potencial
| Acción | Estado | Gap |
|---|---|---|
| C1-C5 bugs técnicos resueltos | ❌ Pendiente (Leo) | 76% del sitio sin indexar; CTR 1.5% vs benchmark 3-5% |
| Títulos y meta descriptions optimizados (top 20 páginas) | ❌ No existe | 26K impresiones desperdiciadas en déficit fiscal con 0.15% CTR |
| Schema NewsArticle + Person | ❌ No existe | Sin esto, Google Overviews no cita los artículos |
| Artículos del tipo "Para empezar el día [fecha]" publicados sistemáticamente | ⚠️ Irregular | CTR 9.2% cuando se publica — formato de alto rendimiento sin sistema |

### Canal Redes Sociales (10% sesiones estimado)
| Acción | Estado | Gap |
|---|---|---|
| Carrusel IG derivado de artículo (4-5/semana) | ⚠️ Irregular | Sin frecuencia ni sistema; 6K seguidores subutilizados |
| Hilo X/Twitter del informe semanal | ❌ No existe | 25.5K seguidores sin estrategia de contenido |
| YouTube: links al sitio en los 77 videos | ❌ 0/77 videos | 252K views sin convertir a tráfico |
| LinkedIn: activar perfil Visión | ❌ No existe | Canal sin activar |

### Canal Pauta (Performix/Starcom)
| Acción | Estado | Gap |
|---|---|---|
| Pauta con objetivo "tráfico al sitio" | ❌ Incorrecto | $9.9M en "interacción" y "visitas perfil" — no llevan al sitio |
| UTMs en todos los creativos | ❌ Rotos | ~6K sesiones aparecen como (not set) — pauta invisible en GA4 |
| CPV ≤ $350 COP | ⚠️ $395 actual | Optimizar segmentación de audiencia |

---

## ETAPA 2 — CONSIDERACIÓN (MOFU)

**Objetivo:** que el visitante lea el artículo completo y explore el sitio — no rebote en 30 segundos.

### Artículo en sitio
| Elemento | Estado | Impacto esperado |
|---|---|---|
| OG tags dinámicas (og:title, og:image 1200x630) | ❌ Incompletas | Cuando se comparte el artículo en WhatsApp/X, aparece imagen y resumen |
| Botones compartir al final del artículo (X, LinkedIn, WhatsApp, Copiar link) | ❌ No existen | Multiplica distribución orgánica sin costo |
| "Artículos relacionados" al final de cada post | ❌ No existe | 1.34 páginas/sesión → meta 2.5 |
| Resumen ejecutivo visible en primeras 3 oraciones | ⚠️ Irregular | Lo que los LLMs citan; también reduce rebote |
| Nombre del analista visible con credencial | ⚠️ Parcial | EEAT — autoridad editorial en análisis financiero |

### Navegación y arquitectura
| Elemento | Estado | Gap |
|---|---|---|
| Categorías con páginas de sección optimizadas | ⚠️ Algunas | "Así Cierran los Mercados" tiene 43% CTR pero solo 72 impresiones |
| URLs limpias sin hashes ni IDs | ⚠️ Parcial | Algunas URLs tienen slugs tipo "609c6b55d88db47d9b1a06d1" — sin keyword |
| Búsqueda interna funcional | ⚠️ Existe | No medido si convierte en sesiones adicionales |

---

## ETAPA 3 — CONVERSIÓN (BOFU)

**Objetivo:** convertir visitante en suscriptor del newsletter Braze.

### Formulario de suscripción
| Elemento | Estado | Gap |
|---|---|---|
| Módulo suscripción inline (al 50% del scroll del artículo) | ❌ No existe | El CTA solo aparece en homepage — no en artículos individuales |
| CTA fija en "Para empezar el día" (sección top de tráfico) | ❌ No existe | 130K sesiones/año, 4.8% conv. implícita — duplicarla = 3,000 subs más |
| Pop-up de salida (exit intent) | ❌ No existe | Último intento antes de que el usuario abandone |
| CTA en pie de email: "¿Lo reenviaron? Suscríbete" | ❌ No existe | Captura lectores secundarios que reciben emails reenviados |
| Link directo a formulario en bio X e IG | ❌ No verificado | Tráfico de RRSS sin convertir |

### Propuesta de valor del newsletter
El CTA debe prometer algo concreto:
> *"Recibe el análisis económico de Davivienda antes de que abran los mercados. Gratis, sin publicidad, solo para profesionales del sector financiero."*

---

## ETAPA 4 — RETENCIÓN Y CICLO

**Objetivo:** que el suscriptor abra cada email y vuelva al sitio regularmente.

| Acción | Owner | Estado |
|---|---|---|
| Email semanal de curación (martes 8AM) | Estefanía | ❌ No existe |
| Segmentación por interés (macro / empresas / mercados / Centroamérica) | Estefanía + Braze | ❌ No segmentado |
| Módulo "Dato de la semana" fijo en cada email | Estefanía | ❌ No existe |
| Limpieza de lista inactivos >180 días | Estefanía | ❌ No realizada (afecta deliverability) |
| Re-engagement de inactivos 90-180 días | Estefanía | ❌ No existe |

---

## Tablero de gaps por prioridad

| Acción | Owner | Deadline | Bloqueador | Impacto |
|---|---|---|---|---|
| Fix C1-C5 técnicos (canonical, títulos, meta, sitemap) | Leo | Semana 1-2 | Ninguno | Alto |
| UTMs de pauta estandarizados | Jeison + Performix | Semana 1 | Ninguno | Alto |
| GA4 event: pasar article_id | Leo | Semana 1 | Ninguno | Alto |
| Email semanal (martes 8AM) | Estefanía | Semana 2 | Template HTML | Alto |
| Botones compartir en artículos | Leo | Semana 2 | Ninguno | Alto |
| OG tags dinámicas | Leo | Semana 2 | Ninguno | Alto |
| CTA suscripción inline en artículos | Leo | Semana 2 | Ninguno | Alto |
| Artículos relacionados (widget) | Leo | Semana 3 | Ninguno | Medio |
| Optimizar títulos top 20 páginas GSC | Estefanía + analistas | Semana 2-3 | Leo C1-C2 | Alto |
| YouTube: links en 77 videos | Leo + Estefanía | Semana 3 | Ninguno | Medio |
| LinkedIn: activar perfil | Por definir | Semana 4 | Ninguno | Medio |

---

## KPIs del funnel VS01

### TOFU (Descubrimiento)
- Sesiones desde Google/mes: baseline 4,176 → meta jul 6,000 → meta dic 15,000
- Sesiones desde RRSS/mes: baseline ~1,800 → meta dic 5,000
- Sesiones desde pauta (atribuidas): baseline 0 (UTMs rotos) → meta: 100% atribuidas

### MOFU (Consideración)
- Páginas/sesión: baseline 1.34 → meta dic 2.5
- Tiempo medio en artículo: no medido → establecer baseline semana 1
- % sesiones con scroll >50%: no medido → establecer baseline semana 1

### BOFU (Conversión)
- Suscriptores nuevos/mes: baseline desconocido → meta 500/mes
- Tasa conversión visitante→suscriptor: baseline 4.8% implícita → meta 8%

### Retención
- CTOR email: baseline 2.5% → meta 5%
- Open rate: mantener >55%
- Tasa desuscripción: medir y mantener <0.5%/envío

---

## Relacionado
[[Vision_Estrategia_Digital_360_2026]] · [[Vision_EstrategiaSEO_CRO_2026-06]] · [[Vision_EstrategiaEmail_2026-06]] · [[Vision Dashboard Estratégico]]

#vision-davivienda #vs01 #funnel #trafico #suscriptores #newsletter #braze
