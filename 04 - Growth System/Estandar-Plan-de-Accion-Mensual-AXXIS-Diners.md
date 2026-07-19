---
date: 2026-07-19
type: estandar
tags: [growth-system, axxis, diners, plan-de-accion, template]
status: activo
owner: Carolina Ramirez
related: ["[[Estrategia-Digital-por-Canal-2026]]"]
---

# Estándar — Plan de Acción Mensual AXXIS/Diners

Este documento define la estructura fija que debe seguir el Plan de Acción Editorial de **cada mes**, a partir de lo construido en julio 2026 (`Plan-Accion-Editorial-Julio-2026.html`). El objetivo: que Mateo, Simón, Paola Gordillo, Paola Nossa y Juan David reciban el mismo formato mes a mes, sin tener que reaprender la estructura.

**Archivo de referencia (mes base):** `00 - Executive Layer/Plan-Accion-Editorial-[Mes]-2026.html`
**Fuente de datos que lo alimenta:** `00 - Executive Layer/Panel-Decision-Digital-AXXIS-Diners.html` (diagnóstico) + `04 - Growth System/Estrategia-Digital-por-Canal-2026.md` (estrategia narrativa)

---

## 1. Estructura de la página (orden fijo)

1. **H1** — "Plan de Acción — [Mes] 2026"
2. **"Cómo medimos [mes]"** — callout `.measure`, va primero, antes de cualquier otro contenido. Fija la métrica norte del mes (tiempo de interacción + páginas por sesión, nunca visitas).
3. **Estrategia de Tráfico al Sitio Web** — tabla de mezcla de canales actual vs. meta del trimestre, sin título ni frase introductoria (se quitaron en julio por pedido explícito). Solo la tabla + "Dónde debe aterrizar" + "KPI único del mes", ambos en tabla, no en párrafo.
4. **Tabs por revista** — AXXIS / Diners. Nunca una pestaña "transversal": lo compartido se repite completo en cada pestaña, con evidencia adaptada a los datos de esa revista.
5. **Párrafo "why" por pestaña** (`#why-axxis` / `#why-diners`) — un dato del mes que explica por qué se prioriza lo que sigue. Se cambia con `display:none/''` al cambiar de tab. Sin el título "Por qué estamos aquí, en una frase" (se quitó en julio).
6. **`#app`** — contenedor que renderiza las tareas, agrupadas por canal.

---

## 2. Agrupación de tareas — por canal, no por esfuerzo

Corrección explícita de julio: **no agrupar por nivel/tier de esfuerzo**. Agrupar por tipo de canal, en este orden fijo:

| Orden | Grupo (`TYPES`) | Color (`TYC`) |
|---|---|---|
| 1 | SEO — Contenido y Búsqueda Orgánica | `--seo` |
| 2 | SEM — Google Ads (Paid Search) | `--brief` |
| 3 | Pauta — Meta (Paid Social) | `--f0` |
| 4 | Redes Sociales — Orgánico | `--cm` |
| 5 | Newsletter — Email | `--nl` |
| 6 | Formatos Digitales | `--mkt` |

`tier` (1/2/3) se conserva en el dato de cada tarea solo para ordenar *dentro* del grupo (de más simple a más nueva/con más producción) — no para agrupar visualmente.

**Casos especiales de orden dentro de un grupo:**
- Tareas que dependen de producción nueva (ej. ficha técnica, PMax) van al final del grupo, tier 3, con nota explícita de por qué esperan.
- El mapa de keywords GSC (`kwCard`) se inserta automáticamente después del grupo SEO.
- La tabla de formatos comerciales (`fmtTable`) se inserta **primero** dentro del grupo Formatos Digitales; las tareas de ese grupo quedan **ocultas** hasta que se decida reactivarlas (cambio de julio — antes se mostraban).

---

## 3. Reglas de contenido por tarea

- **Cada tarea = 1 objeto** `{id, tier, t, ow, oc, ev, brief?}` en `TASKS.axxis` / `TASKS.diners`.
- **`ev` debe traer el dato duro que la justifica** — nunca una tarea sin número de respaldo (CTR, impresiones, ER, segundos de interacción, etc.).
- **Si la tarea depende de un dato externo (GSC, GA4, Metricool) con URLs o keywords específicas, van embebidas en tabla dentro de `ev`**, no solo mencionadas en prosa. Patrón: `<div style="overflow-x:auto"><table class="ftab">...</table></div>` seguido de una frase de **"Sugerencia" o "Qué hacer, a la fija"** con pasos concretos, no solo el diagnóstico.
- **Nunca pedir un bloque/feature que ya existe en el sitio** — verificar en el sitio en vivo (Browser) antes de pedir "crear" algo. Si ya existe pero no funciona bien, la tarea es "corregir X", no "crear X" (caso real: `ax09`, el bloque de relacionados ya existía, el problema era relevancia).
- **Owners:** un owner por tarea, nombre real (no "Owner por definir" salvo que sea explícitamente una decisión pendiente de reunión, ej. Newsletter). Si el mismo trabajo aplica a ambas revistas con distinto owner (Mateo vs. Simón), se repite la tarea completa en cada pestaña con su owner correspondiente.
- **`brief:true`** se usa solo para tareas que dependen de que Sebastián (agencia) ejecute — ya no lleva badge visual, solo el estilo de caja `.brief-box`.
- **Fases condicionadas:** si una táctica requiere validar algo antes de escalar (ej. PMax, Advantage+), la tarea explicita la condición y a qué otra tarea espera (ej. "no se relanza junto con las campañas 1-5, espera a ax28").

---

## 4. Fuentes de datos por sección

| Sección | Fuente | Ruta |
|---|---|---|
| SEO — meta-títulos, CTR, top páginas | GSC / Auditoría SEO | `03 - Unidades de Negocio/[BU]/SEO/[Mes] Auditoría SEO - [BU].md` y `GSC_Reporte_Completo_2026.md` |
| SEM | Estado de cuenta Google Ads | Brief directo con Sebastián |
| Pauta / Redes | Metricool + Meta Business Suite | Pegado directo en sesión — **guardar el export relevante como archivo en el vault si trae datos post-por-post**, para poder validar/ampliar ejemplos en meses futuros sin depender del historial de chat |
| Newsletter | HubSpot (pendiente migración) | Sin baseline hasta que cierre la migración |
| Formatos Digitales | Inventario comercial | `03 - Unidades de Negocio/[BU]/Formatos-Digitales-[BU].md` |

**Nota operativa:** varios datos usados en julio (post-por-post de Instagram, totales de informes GA4 con inconsistencias) solo existieron como texto pegado en el chat y no se guardaron como archivo — eso limitó la posibilidad de dar más de 5-6 ejemplos reales en algunas tareas (ver `di03`). Regla para meses futuros: **todo export de Metricool/Meta/GA4 que se pegue en el chat y vaya a alimentar el plan debe guardarse como archivo `.md` en la carpeta SEO o de la BU correspondiente**, no solo quedar en la conversación.

---

## 5. Validación antes de publicar (checklist)

1. Extraer el `<script>` del HTML y correrlo contra un shim de Node (`document.getElementById`, `innerHTML`, `createElement`) para confirmar que `render('axxis')` y `render('diners')` corren sin error.
2. Confirmar con `grep -c` que los textos que se pidieron quitar/agregar aparecen exactamente el número de veces esperado.
3. Publicar con `Artifact`, reusando el mismo `url` del mes anterior si se quiere mantener el link, o uno nuevo si es un mes nuevo.
4. Commit en git con mensaje que describa el cambio puntual, no "actualizar plan".

---

## 6. Errores de datos — regla permanente

Todo informe de GA4/GSC/Metricool que alimente el plan debe pasar primero por el **Panel de Decisión Digital** (`Panel-Decision-Digital-AXXIS-Diners.html`), que mantiene la sección **"Errores de data en los informes de junio [o el mes correspondiente] — corregir antes de presentar"**. Regla de fondo, válida para todos los meses: **usar cifras relativas (tiempo, $/sesión, % por canal) para decisiones — nunca totales absolutos sin nota**, porque los totales de GA4 varían entre exports del mismo mes (visto en junio: ±6% en sesiones, ±34% en ingresos, y hasta las propias tablas de canales del Panel no cuadran exactas con su total, 0.5%-1.9% de diferencia).

**How to apply:** antes de construir el plan de acción de cada mes, correr esta misma validación cruzada (sumar filas de canal, comparar contra el label) sobre el Panel del mes nuevo, y agregar cualquier discrepancia encontrada a su lista de errores — no asumir que un mes limpio no la necesita.
