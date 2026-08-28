---
date: 2026-08-19
type: plan-accion-mes
tags: [growth-system, axxis, diners, septiembre-2026, seo, sem, pauta, ga4, indexacion]
status: activo
owner: Carolina Ramirez
scope: revistas-nexsteps
version: 1.0
last_updated: 2026-08-19
related: "[[Plan-Accion-Agosto-2026]], [[Comite-Plan-Digital-Agosto-2026]]"
---

# Plan de Acción — Septiembre 2026
**Documento vivo: fuente única del vault · Se actualiza conforme avanza el mes**

Construido sobre el diagnóstico del corte 1 jul-15 ago 2026 (Metricool, Google Ads, GSC performance y cobertura de indexación, GA4). Agosto fue el mes de detectar los problemas estructurales; septiembre es el mes de corregirlos y empezar a medir con datos limpios.

**Condición de entrada:** ninguna meta de septiembre se fija sobre GA4 de AXXIS hasta que el tag esté corregido y validado por un ciclo completo. Mientras tanto, GSC (clics/impresiones) y Metricool (visitas/redes) son la referencia.

---

## Prioridades y quick wins

### P1 — Estructural, bloqueante (semana 1)

Sin esto resuelto, cualquier otra métrica de septiembre queda en duda.

- **Corregir el tag GA4 de AXXIS.** Tracking mezclado con Diners confirmado (~22-24 jul). Ningún reporte de GA4 de AXXIS es válido hasta la corrección y un ciclo limpio de medición.
- **Auditar las 915 páginas de AXXIS excluidas por noindex marcado como error en GSC Coverage.** Candidato directo a explicar la caída de tráfico orgánico que julio dejó sin resolver. Exportar el listado de URLs y confirmar cuáles son contenido real bloqueado por accidente.
- **Resolver las 1,531 páginas 404 de AXXIS.** Enlaces rotos con pérdida directa de equity de SEO.
- **Pausar o recortar las campañas de Google Ads que pagan por keywords donde Diners ya rankea top 3 orgánico** (confirmado con evidencia keyword por keyword: termales, restaurantes Candelaria, karts, afueras de Bogotá). 56% del gasto activo de la cuenta compartida sin una sola conversión.
- **Investigar el embudo de suscripción de AXXIS.** 28 conversiones de "Finalizar compra suscripción" contra 108,000 usuarios activos en julio. Esta es la métrica de negocio real, no de tráfico — conecta directo con la prioridad de compensar la pérdida de Privilegios Davivienda.
- **El embudo de suscripción falla en las dos plataformas de pauta, no solo en Google Ads.** Meta Ads de agosto (1-27, cuenta completa): solo 2.8% del gasto va a campañas de conversión, con 3 leads y 1 compra en todo el mes entre AXXIS y Diners. Confirma que el problema es estructural (checkout/tracking/propuesta de valor), no de configuración de una sola plataforma.
- **Separar el reporting de Colchones El Dorado.** Sigue apareciendo mezclado en la misma cuenta de Meta Ads pese a la regla ya establecida en julio — 5.7% del gasto de agosto es de esta cuenta cliente, no editorial.
- **La fragmentación de campañas empeoró desde julio, y ya tiene un costo medible.** De 52 campañas activas (julio) a 208 campañas individuales de boost de artículos en agosto (1-27), consumiendo 68.8% del presupuesto de Meta. Verificado con export nativo (no Metricool ni Gemini): el alcance promocionado por publicación cayó -67% de julio a agosto en ambas marcas — la misma pauta repartida entre demasiadas campañas pequeñas rinde menos por pieza. Consolidar en 2-3 campañas por BU sigue pendiente.
- **Corrección de diagnóstico: no es un problema de Facebook vs. Instagram, es de fragmentación.** El alcance orgánico+pagado de Facebook por publicación cayó -57% a -64% de julio a agosto (AXXIS y Diners respectivamente, verificado con export nativo). Instagram, en cambio, se mantuvo prácticamente plano (-0.4% a -4% por publicación) — no aceleró como se reportó inicialmente con una fuente no verificada. La caída de Facebook coincide en el tiempo con la fragmentación de campañas de pauta, no con una caída de la plataforma en sí.

### P2 — Quick wins (semana 2-3)

- **Auditar por qué la campaña "Suscripción AXXIS"** (la única que convierte en toda la cuenta de Google Ads) tiene volumen mínimo de impresiones. Si es un problema de configuración se corrige en días, no semanas.
- **Schema Organization + sitelinks para la búsqueda de marca "axxis"** — sigue en posición 5.4, sin moverse desde agosto.
- **Subir cadencia de reels en AXXIS.** 10 publicados en 46 días frente a 19 de Diners, con el reel siendo el formato de mejor engagement de AXXIS (6.49% vs 4.94% de post).
- **Auditar experiencia mobile de AXXIS.** Desktop convierte mejor pese a rankear peor (CTR 2.68% vs 1.69% mobile) — con 83% del tráfico social en mobile, es una fricción cara.
- **Corregir la metodología de reporte de redes sociales.** El aporte de IG/FB al tráfico que se venía reportando incluía pauta paga (94-98% de esas cifras es `cpc`, no orgánico) — separar antes del próximo corte para no duplicar la misma inversión bajo dos etiquetas.

### P3 — Estructural, resultados visibles en el mes (semana 3-4)

- **Auditar el Hub Arquitectos de Colombia a nivel página — actualizado con URL real (GSC Páginas, agosto 1-27).** Fischer, Jiménez, Soto y Cuartas están publicados y funcionan con CTR sólido (6.8%-14.1%). **Mauricio Zapata no aparece en el listado de páginas con tráfico** — no es una caída de posición, es ausencia total de clics. Confirmar si la página existe y está indexada antes de cualquier otra acción sobre ese perfil.
- **Consolidar las 7 URLs de suscripción de AXXIS en una sola.** Encontradas en GSC Páginas: `/categoria-producto/suscripciones/`, `/suscripciones/`, y cinco variantes de `/producto/suscripcion-...` con descuentos distintos, cada una con tráfico mínimo por separado (62, 8, 3, 2, 2, 2, 1 clics). Es una causa raíz nueva para las 28 conversiones contra 108,000 usuarios — la señal de intención de compra se reparte en vez de consolidarse, y el usuario no tiene un camino de compra claro. Verificado con auditoría técnica (ILR/enlaces internos): las páginas de producto de AXXIS tienen 1-2 enlaces internos entrantes cada una, prácticamente huérfanas. **Diners no tiene este problema** — solo 2 URLs de producto (plan 3 y 6 meses) y su página hub de suscripciones tiene la autoridad interna máxima (ILR 100). Confirma que es un problema específico de cómo se construyó esa sección en AXXIS, no del CMS compartido.
- **Muestreo del bucket de noindex de Diners** (104,726 páginas marcadas error). A esa escala de sitio, probablemente es ruido estructural (filtros, paginación) y no contenido perdido, pero conviene cuantificarlo.
- **Investigar la caída de velocidad de carga en Diners.** Auditoría técnica (200 páginas de muestra, 24 ago vs 20 ago): páginas con carga lenta pasaron de 5 a 25 en cuatro días — la métrica que más empeoró del reporte. Revisar si coincide con un deploy o cambio reciente antes de que afecte ranking.
- **Replicar en AXXIS el patrón evergreen + reel que funciona en Diners.**
- **Arrancar estrategia de recurrencia para AXXIS.** 106,000 de 108,000 usuarios de julio fueron nuevos — retención casi nula. Prioridad de mayor impacto según el propio diagnóstico: newsletter segmentada + módulos de "leer a continuación" (interlinking) + notificaciones push. Ver detalle en sección Redes/Newsletter.

---

## Métricas de referencia (corte 1 jul-15 ago, 46 días, GSC + Metricool)

| Métrica | AXXIS | Diners |
|---|---|---|
| Clics orgánicos (GSC) | 8,237 | 52,123 |
| Posición promedio | 8.65 | 8.44 |
| Clics/día agosto (1-27), aparte | 204 (+14% vs. promedio jul-ago15) | pendiente de verificar |
| "axxis" a secas (marca) | posición 5.44, sin cambio en 3 mediciones | — |
| Páginas indexadas | 4,753 (32% del inventario conocido) | 19,700 (3.5%, en crecimiento) |
| Visitas web (Metricool) | 72.3K | 109K |
| Seguidores IG | 163.6K (+2,501) | 100.7K (+2,847) |
| Engagement IG (post/reel) | 4.94% / 6.49% | 7.3% / 7.88% |

**Meta de septiembre:** no fijar metas numéricas de sesiones/usuarios de AXXIS hasta cerrar P1. Meta de proceso: GA4 de AXXIS validado y GSC Coverage de AXXIS con el bucket de noindex-error resuelto o descartado como falso positivo, antes del 30 de septiembre.

---

## SEO / Contenido

| Tarea | Detalle | Owner | Prioridad |
|---|---|---|---|
| Exportar y auditar URLs noindex-error de AXXIS | 915 páginas | Plataformas (Jeison) | P1 |
| Resolver 404 de AXXIS | 1,531 páginas | Plataformas | P1 |
| Schema + sitelinks "axxis" | Posición 5.4 sin moverse | Mateo / Juan David | P2 |
| Auditoría por URL de Hub Arquitectos | 5 perfiles, resultados mixtos | Mateo | P3 |
| Muestreo noindex Diners | 104,726 páginas, probable ruido estructural | Plataformas | P3 |

## Pauta (Meta + Google Ads)

| Tarea | Detalle | Owner | Prioridad |
|---|---|---|---|
| Pausar/recortar campañas Diners sobre keywords ya rankeadas | Confirmado keyword por keyword, 56% del gasto activo, 0 conversiones | Growth / agencia Google Ads | P1 |
| Auditar throttling de "Suscripción AXXIS" | Única campaña que convierte, volumen mínimo | Agencia Google Ads | P2 |
| Investigar embudo de suscripción AXXIS end-to-end | 28 conversiones / 108K usuarios | Growth / Plataformas | P1 |

## Redes sociales / Newsletter

| Tarea | Detalle | Owner | Prioridad |
|---|---|---|---|
| Subir cadencia de reels AXXIS | De 10 a ~18-20/mes | Paola Gordillo | P2 |
| Corregir metodología de reporte social (excluir paid del "aporte orgánico") | 94-98% de lo reportado como aporte de IG/FB era pauta paga | Growth | P2 |
| Newsletter segmentada + lead magnet para AXXIS | Estrategia de recurrencia — retención casi nula (98% tráfico nuevo) | Growth / Paola Nossa | P3 |
| Módulos "leer a continuación" en artículos AXXIS | Combate el bajo tiempo de interacción (29s promedio) | Plataformas | P3 |

---

## Checklist de cierre de mes

- [ ] Tag GA4 AXXIS corregido y validado
- [ ] Listado de URLs noindex-error de AXXIS auditado
- [ ] Campañas Diners de bajo ROI pausadas o recortadas
- [ ] Causa raíz de la campaña Suscripción AXXIS identificada
- [ ] Embudo de suscripción AXXIS diagnosticado (28/108K)
- [ ] Reporte de redes sociales con metodología corregida (sin duplicar paid)
