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

Construido sobre el diagnóstico del corte 1 jul-28 ago 2026 (Metricool, Google Ads, Meta Ads, GSC performance + cobertura, GA4, AdButler) y el diagnóstico técnico de proveedor externo (ago 2026).

## Objetivo del plan

**Recuperar y proteger tráfico de calidad.** La conversión NO es objetivo de growth mientras el flujo de la página no esté arreglado — es un frente de Producto, no de Growth. Los hallazgos del embudo están documentados abajo como handoff, no como prioridad de este plan.

**Cómo se mide:**

| Métrica | Compromiso |
|---|---|
| Tráfico orgánico | Crece — es el activo recuperable y el que retiene (38s vs. 9s de Paid Social) |
| Impresiones publicitarias viewable | No bajan — protege el ingreso directo de AdButler |
| Tráfico total | Se sostiene; cualquier baja por reasignación de pauta debe ser planeada y anunciada, no reactiva |

**Condición de medición:** ninguna meta se fija sobre GA4 (ninguna de las dos marcas) hasta corregir el tag contaminado. Mientras tanto GSC (clics/impresiones) y Metricool son la referencia.

**Decisión pendiente — momento de corregir el tag GA4.** Al separar las propiedades, la cifra reportada de AXXIS baja (hoy incluye tráfico de Diners), aunque el tráfico real no cambie. Choca con el compromiso de "el tráfico no baja". Opciones: (A) corregir justo después de un reporte a junta, para llegar al siguiente con la base ya estabilizada; (B) anunciarlo antes como corrección de medición, lo que cuesta más en el momento pero blinda cualquier caída futura y se adelanta al dato histórico del proveedor externo (-71% AXXIS, -68% Diners desde sus picos). Definir antes de que Plataformas toque el tag.

**Sobre Paid Social:** no se corta hasta que el orgánico recupere volumen suficiente para reemplazarlo. Bajo un objetivo de tráfico, cortar antes resta volumen sin sustituto. El arreglo de redirecciones es lo que habilita esa reducción más adelante.

---

## Prioridades y quick wins

### P1 — Recuperación de tráfico (semana 1)

Lo que devuelve volumen real. Ordenado por impacto sobre el objetivo.

- **Mapa de redirecciones 301 para AXXIS — la causa raíz del colapso de tráfico.** La migración de plataforma (~2025) cambió la estructura de URLs de plana a categorizada y nunca se implementaron las redirecciones. **Verificado de forma independiente el 28-ago: 12 de 12 URLs categorizadas actuales tienen su versión plana en 404** (ej. `/casa-de-cristal-de-fernanda-marques/` → 404, mientras `/arquitectura/casa-de-cristal-de-fernanda-marques/` → 200). Cada artículo publicado antes de la migración perdió su enlace, su autoridad acumulada y su posición. Es la acción de mayor impacto sobre el objetivo de tráfico de todo el plan. Owner: Plataformas (Jeison) o proveedor externo.
- **Corregir el tag GA4 — integridad del número que se reporta a la junta.** Contaminación bidireccional confirmada y activa en agosto: GA4 Diners muestra "Revista AXXIS" en su top de páginas (3,695 vistas) y GA4 AXXIS muestra "Revista Diners" (3,481 vistas). Es un tag/contenedor GTM compartido mal configurado. Mientras no se corrija, las cifras de tráfico que se presentan están infladas por un monto desconocido. Owner: Plataformas.
- **Corregir los 47 artículos de AXXIS bloqueados por noindex.** Del bucket de 798 URLs en GSC, el 94% es comportamiento correcto de WordPress (búsqueda interna, paginación, embeds). El problema real son 47 artículos genuinos mal bloqueados — ej. `diseno-casa-tenjo`, `el-encanto-de-las-ciudades-intermedias-colombianas`. Tarea acotada: corregir el tag y solicitar reindexación.
- **Resolver los 404 y enlaces internos rotos.** GSC reporta 1,531 páginas en 404 en AXXIS. GA4 de Diners muestra **8,681 vistas de "página no encontrada"** en su top 25 de páginas del mes — más que casi cualquier artículo real. Es tráfico real que ya llegó y se pierde en un callejón sin salida.

### P2 — Quick wins (semana 2-3)

- **Schema Organization + sitelinks para la búsqueda de marca "axxis"** — sigue en posición 5.4, sin moverse desde agosto.
- **Subir cadencia de reels en AXXIS.** 10 publicados en 46 días frente a 19 de Diners, con el reel siendo el formato de mejor engagement de AXXIS (6.49% vs 4.94% de post).
- **Auditar experiencia mobile de AXXIS.** Desktop convierte mejor pese a rankear peor (CTR 2.68% vs 1.69% mobile) — con 83% del tráfico social en mobile, es una fricción cara.
- **Corregir la metodología de reporte de redes sociales.** El aporte de IG/FB al tráfico que se venía reportando incluía pauta paga (94-98% de esas cifras es `cpc`, no orgánico) — separar antes del próximo corte para no duplicar la misma inversión bajo dos etiquetas.

### P3 — Estructural, resultados visibles en el mes (semana 3-4)

- **Auditar el Hub Arquitectos de Colombia a nivel página — actualizado con URL real (GSC Páginas, agosto 1-27).** Fischer, Jiménez, Soto y Cuartas están publicados y funcionan con CTR sólido (6.8%-14.1%). **Mauricio Zapata no aparece en el listado de páginas con tráfico** — no es una caída de posición, es ausencia total de clics. Confirmar si la página existe y está indexada antes de cualquier otra acción sobre ese perfil.
- ~~Muestreo del bucket de noindex de Diners~~ — **Verificado (28-ago).** Muestra de 2,000 URLs del total de 104,726: 90.4% páginas de búsqueda interna, 9.4% paginación profunda, 99.8% del total. **Cero artículos de contenido real encontrados.** Confirmado como ruido estructural, sin acción pendiente.
- **Investigar la caída de velocidad de carga en Diners.** Auditoría técnica (200 páginas de muestra, 24 ago vs 20 ago): páginas con carga lenta pasaron de 5 a 25 en cuatro días — la métrica que más empeoró del reporte. Revisar si coincide con un deploy o cambio reciente antes de que afecte ranking.
- **Replicar en AXXIS el patrón evergreen + reel que funciona en Diners.**
- **Arrancar estrategia de recurrencia para AXXIS y Diners.** AXXIS: 106,000 de 108,000 usuarios de julio fueron nuevos (98%). Diners (GA4, 1-25 ago): mejor pero igual débil — 9.7% recurrente, retención a 7 días por debajo de 0.3% en casi todas las cohortes. Prioridad de mayor impacto según el propio diagnóstico: newsletter segmentada + módulos de "leer a continuación" (interlinking) + notificaciones push. Ver detalle en sección Redes/Newsletter.
- **El pico del 21-ago en Diners aparece en una tercera fuente independiente (AdButler) — cada vez más parece tráfico real, no un bug de tracking.** GA4 mostró 12,766 usuarios nuevos ese día (vs. ~3,000-4,000 normal). AdButler muestra el mismo día picos de 8-15× en los banners de escritorio de Diners (Barra Fija: 20,635 vs. ~1,400-2,600 normal). Que aparezca en una herramienta sin relación con el tag de GA4 debilita la hipótesis de tracking cruzado. Acción: identificar qué artículo o campaña generó el pico — si es contenido viral replicable, documentarlo; si no hay explicación de contenido, el patrón "solo desktop" es típico de tráfico bot/scraping y hay que auditarlo.

---

## Métricas de referencia (corte 1 jul-15 ago, 46 días, GSC + Metricool)

| Métrica | AXXIS | Diners |
|---|---|---|
| Clics orgánicos (GSC) | 8,237 | 52,123 |
| Posición promedio | 8.65 | 8.44 |
| Clics/día agosto (1-27), aparte | 204 (+14% vs. promedio jul-ago15) | 1,078 (-4.9% vs. promedio jul-ago15) |
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
| Implementar mapa de redirecciones 301 AXXIS | Migración rompió URLs — verificado 12/12 en 404 | Plataformas / proveedor | **P1** |
| Corregir 47 artículos con noindex | Verificado: solo 47 reales de 798 del bucket | Plataformas (Jeison) | P1 |
| Resolver 404 de AXXIS | 1,531 páginas | Plataformas | P1 |
| Schema + sitelinks "axxis" | Posición 5.4 sin moverse | Mateo / Juan David | P2 |
| Auditoría por URL de Hub Arquitectos | 5 perfiles, resultados mixtos | Mateo | P3 |
| Velocidad de carga Diners | Páginas lentas pasaron de 5 a 25 en 4 días | Plataformas | P3 |

## Pauta (Meta + Google Ads)

**Principio:** no se corta Paid Social hasta que el orgánico recupere volumen. La pauta de conversión sigue pausada hasta que Producto arregle el flujo.

| Tarea | Detalle | Owner | Prioridad |
|---|---|---|---|
| Recortar campañas Diners sobre keywords ya rankeadas top 3 orgánico | Verificado keyword por keyword. Ya bajó solo -20% a -36% entre jul y ago — confirmar si fue deliberado | Growth / agencia Google Ads | P2 |
| Consolidar campañas fragmentadas de Meta | De 52 (jul) a 208 (ago). El alcance promocionado por publicación cayó -67% — misma pauta diluida en demasiadas campañas | Paola Nossa / agencia | P2 |
| Separar reporting de Colchones El Dorado | Cuenta cliente mezclada con editorial, 5.7% del gasto de agosto. Regla ya vigente desde julio | Paola Nossa | P2 |
| Mantener pausada la pauta de suscripción | Decisión de Carolina — no reactivar hasta que Producto resuelva el flujo | Carolina | — |

## Redes sociales / Newsletter

| Tarea | Detalle | Owner | Prioridad |
|---|---|---|---|
| Subir cadencia de reels AXXIS | De 10 a ~18-20/mes | Paola Gordillo | P2 |
| Corregir metodología de reporte social (excluir paid del "aporte orgánico") | 94-98% de lo reportado como aporte de IG/FB era pauta paga | Growth | P2 |
| Newsletter segmentada + lead magnet para AXXIS | Estrategia de recurrencia — retención casi nula (98% tráfico nuevo) | Growth / Paola Nossa | P3 |
| Módulos "leer a continuación" en artículos AXXIS | Combate el bajo tiempo de interacción (29s promedio) | Plataformas | P3 |

---

## Handoff a Producto — conversión (no es objetivo de Growth este mes)

Documentado para quien sea dueño del flujo de compra. Growth no lo persigue mientras la página no esté arreglada, pero el diagnóstico ya está hecho y no hay que repetirlo.

| Hallazgo | Evidencia | Impacto |
|---|---|---|
| **Muro de login antes de comprar** | GA4 embudo (31 jul-27 ago): 98.84% abandona en el paso de login en Diners, 98.11% en AXXIS. De quienes sí completan, 0.42% compra (proporción sana) | El cuello de botella real del negocio. Evaluar guest checkout o login simplificado |
| **Cross-domain con ePayco sin configurar** | `new-checkout.epayco.co` aparece como referral externo en ambas marcas | GA4 pierde la sesión al saltar al checkout — hay ingresos registrados sin evento clave asociado |
| **7 URLs de suscripción fragmentadas en AXXIS** | 62, 8, 3, 2, 2, 2 y 1 clic cada una; páginas de producto con 1-2 enlaces internos. Diners no tiene el problema (solo 2 URLs, hub con ILR 100) | La intención de compra se reparte en vez de consolidarse |
| **Píxel de conversión de AdButler nunca configurado** | Columna Conversions en 0 en las 28 filas del periodo, ambas marcas | No se puede medir el retorno de las campañas de clientes |
| **Valor de evento de compra sin mapear en AXXIS** | $0 de ingresos en todos los canales pese a tener eventos de compra registrados | Diners sí registra ingresos; AXXIS no |
| **CTA de suscripción ausente en artículos** | Quien entra por home completa login 3.55%; por artículo, 0%-0.08% (44× peor) | Quick win de días una vez se defina el flujo |

---

## Checklist de cierre de mes

- [ ] Mapa de redirecciones 301 de AXXIS implementado y validado
- [ ] Tag GA4 corregido (contaminación bidireccional) y validado con un ciclo limpio
- [ ] 47 artículos con noindex corregidos y reindexación solicitada
- [ ] 404 y enlaces internos rotos resueltos en ambas marcas
- [ ] Reporte de redes sociales con metodología corregida (sin duplicar paid como orgánico)
- [ ] Baseline de tráfico orgánico e impresiones viewable establecido para medir recuperación
