---
date: 2026-07-07
type: estrategia
tags: [growth-system, axxis, diners, social-organico, meta-ads, google-ads, suscripciones]
status: propuesta
owner: Carolina Ramirez
---

# Estrategia Digital 360 — AXXIS y Diners
**Social orgánico + Pauta Meta + Pauta Google Ads → Suscripciones y Tráfico**

Basado en diagnóstico real de datos (jun-jul 2026): Meta Ads Manager, Metricool (IG orgánico AXXIS+Diners), Google Search Console, Google Ads. No es un plan genérico — cada acción está anclada a un número que ya vimos.

---

## 0. Diagnóstico consolidado — el hallazgo que cambia todo

**El funnel de suscripción está roto en los 4 canales, no en uno.** Confirmado de forma independiente 4 veces:

| Canal | Evidencia |
|---|---|
| Meta Ads | Campañas "ventas: suscripción" (AXXIS + Diners) — $73,263 COP gastados, **0 conversiones trackeadas** |
| Social orgánico | 1 de 30 posts/reels analizados (AXXIS+Diners) menciona suscripción |
| Google Ads | Campaña Performance Max **"Suscriptores"** ($4,000/día) — **detenida**, "se rechazó la mayoría de los grupos de recursos" |
| SEO Diners | Página `/suscripciones/`: 36 clics de 90,167 totales (**0.04%** del tráfico orgánico del trimestre) |
| SEO AXXIS | Página `/suscripciones/`: 151 clics de 17,948 (**0.84%**) — funciona proporcionalmente 20x mejor que Diners, pero el tráfico total de AXXIS cae -37% |

**Consecuencia directa:** ninguna acción de pauta, contenido o SEO de este plan tiene sentido escalarla hasta resolver Fase 0. Es la misma conclusión a la que llegamos con la pasarela de checkout ya reportada (9 personas atascadas, $0 revenue) — este documento la confirma desde 4 ángulos adicionales.

---

## Fase 0 — Destapar el funnel (Semana 1, bloqueante)

No se libera presupuesto nuevo de pauta hasta cerrar esto.

| # | Acción | Owner sugerido | Por qué |
|---|---|---|---|
| 1 | Auditar Meta Pixel + Conversions API en checkout de suscripción (AXXIS y Diners) — verificar si el evento `Purchase` dispara | Plataformas (Jeison) | Sin esto, Meta no puede optimizar hacia venta ni sabemos qué campañas funcionan |
| 2 | Investigar por qué se rechazaron los asset groups de la PMax "Suscriptores" en Google Ads y volver a lanzarla con recursos conformes | Growth / agencia Google Ads | Presupuesto ya aprobado ($4,000/día) sin usar hace semanas |
| 3 | Verificar conversion tracking de Google Ads a nivel de cuenta — 0.00% de conversión en TODAS las campañas (no solo suscripción) sugiere un problema de tag, no solo de checkout | Growth / agencia Google Ads | Sin esto ninguna campaña de Google Ads es optimizable |
| 4 | Confirmar con el equipo técnico que el checkout procesa pago de principio a fin | Jeison / equipo técnico | Root cause — todo lo demás es síntoma |
| 5 | Auditar la página `/suscripciones/` con marco CRO: claridad de propuesta de valor, CTA, señales de confianza, fricción en el formulario | Growth | 9 personas llegaron a checkout y no completaron — probablemente no es solo tracking |

**Owner de cierre de Fase 0:** Carolina — checkpoint con Jeison antes de liberar Fase 1.

---

## Fase 1 — Detener la fuga y reasignar presupuesto (Semanas 2-4)

### Google Ads

**Hallazgo estructural:** el 60% del gasto activo de Diners ($56,594 de $94,624 en la semana medida) paga por keywords donde Diners **ya rankea orgánico en posición 2-4** (termales cerca a Bogotá, restaurantes candelaria, karts). Es presupuesto pagando por tráfico gratis.

| Acción | Detalle |
|---|---|
| Pausar/reducir 50% del bid en "Aguas termales Bogotá" y "Cinco lugares para correr karts" | Juntas son el 43% del gasto semanal, keywords con posición orgánica ya fuerte |
| Migrar bid strategy de las 6 campañas con "configuración incorrecta" a Smart Bidding (tCPA) — solo después de Fase 0 | Manual CPC / Maximizar clics sin conversión trackeada es gasto ciego |
| Reactivar presencia de AXXIS en Google Ads (hoy: $0, todo detenido) | AXXIS cae -37% en orgánico; pauta debería ser la red de seguridad mientras se investiga la caída |
| Nueva campaña de marca ("axxis", "revista axxis", "revista diners") con budget mínimo | Ninguna campaña activa cubre términos de marca — están regalando ese tráfico a competidores en el auction |
| Reservar el presupuesto liberado (~$25-30K COP/semana) para relanzar "Suscriptores" PMax una vez resuelta Fase 0 | El único campaign con intención de compra directa no está corriendo |

### Meta Ads

**Hallazgo estructural:** cada pieza de contenido corre como campaña individual (52 campañas activas para 52 piezas). Esto va en contra del algoritmo 2026 de Meta (Andromeda/GEM/Lattice), que necesita volumen de señal por campaña para salir rápido de fase de aprendizaje — la fragmentación actual diluye ese aprendizaje entre decenas de campañas pequeñas.

| Acción | Detalle |
|---|---|
| Consolidar en 2-3 campañas por BU: "Tráfico-Contenido" y "Conversión-Suscripción" (esta última en espera de Fase 0), con múltiples anuncios dentro de cada una | Reduce fragmentación, acelera salida de aprendizaje, más señal por campaña |
| Separar reporting de "Colchones El Dorado" (pauta cliente, 39% del gasto de cuenta) de la pauta editorial propia | Regla ya vigente — mezclar infla el CPA real y confunde el análisis |
| Subir a pauta los 5 candidatos ya validados por performance orgánica (ver tabla abajo) | Contenido pre-validado por el algoritmo orgánico — menor riesgo, mejor arranque |
| Frecuencia y CTR de cuenta están sanos (1.22 promedio, CTR 3.84%) — no tocar creativo existente de contenido | El problema no es creativo, es tracking de conversión |

**Candidatos validados para pauta (diversidad de concepto/formato ya garantizada — cumple el criterio de diversidad de Andromeda):**

| BU | Pieza | Formato | Engagement orgánico | Señal |
|---|---|---|---|---|
| AXXIS | El Arca, Panamá | Carrusel | 6.63% | Saves 14, shares 15 |
| AXXIS | Casa lago Memphremagog | Carrusel | 6.39% | Saves 20 |
| AXXIS | Babel, Tulum | Carrusel | 5.55% | Saves 13, shares 9 |
| Diners | MAZ / Oh My Heart | Reel | 9.64% | View rate 3s: 53.7%, saves 96 |
| Diners | Estatuas más impresionantes del mundo | Carrusel | 6.10% | Reach orgánico 49,636, saves 511 |

### SEO / Contenido

| Acción | Detalle |
|---|---|
| Insertar CTA de suscripción en las 10 páginas top de Diners (28K clics/trimestre combinados) | Tráfico ya existe y es gratis — no requiere pauta, es la palanca más barata disponible |
| Investigar caída -37% de AXXIS: Core Web Vitals, backlinks perdidos, cadencia de publicación | Daño real y medible ocurriendo ahora — más urgente que cualquier optimización de Diners |
| Replicar en Diners el patrón de contenido de AXXIS: mezclar contenido temáticamente relevante a la marca (no solo genérico de entretenimiento) para construir búsqueda de marca | AXXIS tiene 15.8% de tráfico de marca vs 1.4% de Diners — así es como su página de suscripción rankea #1 |

---

## Fase 2 — Escalar lo que funciona (Mes 2+)

Solo se activa cuando Fase 0 está verificada (conversiones visibles en Meta + Google Ads + GA4 alineadas).

1. Relanzar "Suscriptores" PMax con recursos conformes y presupuesto reasignado de Fase 1.
2. Convertir la identificación mensual de top performers orgánicos (el mismo ejercicio hecho hoy para 5 piezas) en proceso recurrente — calendario de revisión cada 2 semanas.
3. Escalar presupuesto de pauta en incrementos de 20-30%, esperando 3-5 días entre ajustes (regla estándar anti-fatiga de aprendizaje).
4. Evaluar placement Threads en Meta (CPM más bajo, canal emergente, ~0.04% del gasto actual — oportunidad de entrada temprana).
5. Explorar AI Max for Search en Google Ads una vez el tracking esté sólido (lift de conversión ~13-14% reportado, pero requiere negativos fuertes ya armados en Fase 1).

---

## KPIs / Dashboard de seguimiento

| Métrica | Baseline (jul 2026) | Meta Mes 1 | Meta Mes 3 |
|---|---|---|---|
| Conversiones de suscripción trackeadas (Meta + Google Ads + GA4) | 0 | >0 y verificado end-to-end | Volumen estable semanal |
| % tráfico orgánico Diners → `/suscripciones/` | 0.04% | 0.3% | 0.8% (nivel actual de AXXIS) |
| Tráfico orgánico AXXIS (clics/día) | 141 (jul) cayendo | Estabilizado | Recuperando hacia 224 (nivel abril) |
| Tráfico orgánico Diners (clics/día) | ~1,200 creciendo | Mantener tendencia | +10% adicional |
| % gasto Google Ads en keywords con ranking orgánico propio ya fuerte | 60% | <30% | <15% |
| Campañas Meta activas por BU | ~26 por BU | 2-3 por BU | 2-3 por BU (consolidado) |

---

## Notas de alcance

- No incluye Ediciones Gamma (cuenta de pauta compartida por facturación, pero fuera del alcance de suscripciones — sin canal de suscripción propio).
- No incluye "Colchones El Dorado" (pauta de cliente, INGRESOS — reporting separado por regla existente).
- Asume que el diagnóstico técnico de checkout (equipo técnico/Jeison) se resuelve en paralelo a Fase 0 — este plan no reemplaza esa conversación, la refuerza con evidencia de 4 canales adicionales. No confundir con el bloqueante de Sandra Martínez (editora revista impresa) sobre contenido exclusivo — son dos bloqueantes distintos, ver [[Ejes-de-Contenido-AXXIS-Diners-2026]].
