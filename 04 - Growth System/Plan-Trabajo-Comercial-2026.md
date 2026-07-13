---
date: 2026-07-12
type: framework
tags: [ventas, comercial, hubspot, pipeline, forecast, seguimiento, plan-trabajo]
owner: Carolina Ramirez
equipo: [Claudia Grandas, Clara Vergara, Natalia Castaño, Paola Pantaleón]
related: [Sistema-Ventas-Editorial-2026]
status: activo
ai-first: true
---

# Plan de Trabajo Comercial 2026 — Gestión Diaria en HubSpot

> **Para las comerciales:** El [[Sistema-Ventas-Editorial-2026]] dice CÓMO vender. Este documento dice QUÉ hacer cada día y cómo se mide. Todo se gestiona en HubSpot: si no está en HubSpot, no existe.

---

## Parte 0 — Diagnóstico del Pipeline Actual (2026-07-12)

Auditoría del Pipeline B2B en HubSpot al 12 de julio:

| Etapa | Deals | Monto |
|---|---|---|
| Prospecto | 3 | $15.6M |
| Cita agendada | **0** | — |
| Seguimiento | **0** | — |
| Propuesta enviada | **0** | — |
| Closed Won | 105 | $993.6M |

**El problema:** HubSpot se usa como registro de cierres, no como herramienta de gestión. Los negocios se crean cuando ya están ganados. Consecuencias:
- No hay visibilidad de pipeline: imposible saber qué viene en 30/60/90 días
- No hay forecast real: el forecast se arma de memoria, no de datos
- No se puede hacer seguimiento ni coaching sobre negociaciones en curso
- Con el gap de -$341.6M vs presupuesto, no ver el pipeline es volar a ciegas

**La regla nueva (no negociable): todo prospecto contactado se crea como deal en HubSpot el mismo día del primer contacto.** El deal avanza de etapa en etapa — no se crea al final.

### ⚠️ Alerta técnica para Jeison

La etapa "Propuesta enviada" del Pipeline B2B usa el ID interno `closedwon`. Esto sugiere que la etapa original "Cierre ganado" fue renombrada y puede tener probabilidad de cierre configurada al 100%, lo que inflaría el forecast automático de HubSpot cuando empecemos a usar las etapas intermedias. **Acción: verificar y corregir la probabilidad de cada etapa antes de activar el forecast de HubSpot.**

---

## Parte 1 — Estructura del Pipeline (etapas y significado)

Mapeo del proceso comercial completo sobre el Pipeline B2B:

| # | Etapa HubSpot | Significado operativo | Probabilidad sugerida | Sale de esta etapa cuando... |
|---|---|---|---|---|
| 1 | Prospecto | Identificado y con primer contacto hecho | 10% | Acepta una cita/visita |
| 2 | Cita agendada | Reunión o visita con fecha confirmada | 25% | La visita se realizó |
| 3 | Seguimiento | Visita hecha, cotización enviada, en negociación | 50% | Cliente acepta la propuesta verbalmente |
| 4 | Propuesta enviada* | Aceptada verbalmente — en trámite documental (proveedor/crédito/orden) | 80% | Orden de compra o contrato firmado |
| 5 | Closed Won | Orden firmada / facturable | 100% | — |
| 6 | Cierre perdido | Perdido — registrar SIEMPRE el motivo | 0% | — |

> *Recomendación: renombrar la etapa 4 a **"En cierre / Documentación"** para que refleje el trámite de proveedor y crédito. Mientras tanto, usarla con este significado.

**Campos obligatorios al crear cada deal:**
- Nombre del deal: `[Marca] — [Formato ancla] — [BU]` (ej: "BMW — Página ed. 382 — AXXIS")
- Monto estimado (usar tabla de formatos del Sistema de Ventas)
- Fecha estimada de cierre
- Owner (comercial responsable)

---

## Parte 2 — Rutina Diaria: Las 4 Preguntas

Cada comercial abre HubSpot cada mañana y responde estas 4 preguntas. 15 minutos máximo de planeación, el resto del día es ejecución.

### Pregunta 1 — ¿Qué clientes nuevos voy a buscar hoy?

**Fuente:** [[Auditoria-Competencia-Anunciantes-2026]] — 51 prospectos priorizados por revenue.

- Meta: **1 prospecto nuevo contactado por día** (5/semana por comercial)
- Antes de contactar: checklist de research de 30 min (Parte 5 del Sistema de Ventas)
- Al contactar: crear el deal en etapa **Prospecto** + registrar la actividad (llamada/email) en HubSpot
- Vista HubSpot: filtro `Etapa = Prospecto` + `Owner = yo` + `Última actividad > 7 días` = prospectos míos que se están enfriando

### Pregunta 2 — ¿A qué clientes les hago seguimiento de negociación hoy?

- Vista HubSpot: `Etapa = Cita agendada o Seguimiento` + `Owner = yo`, ordenado por fecha de próxima tarea
- Regla: **ningún deal en Seguimiento puede pasar más de 7 días sin actividad registrada**
- Cada contacto de seguimiento termina con un siguiente paso agendado con fecha (tarea en HubSpot)
- Si un deal lleva 3 seguimientos sin avanzar de etapa: decidir — escalar con propuesta revisada o marcar perdido con motivo

### Pregunta 3 — ¿A quién voy a cerrar hoy?

- Vista HubSpot: `Etapa = Propuesta enviada (En cierre)` + `Fecha estimada de cierre <= próximos 15 días`
- Estos deals son la prioridad #1 del día — se atienden ANTES que la prospección
- Acción típica: destrabar documentación (proveedor/crédito), confirmar orden de compra, agendar firma

### Pregunta 4 — ¿Cuánto va a tardar cada negocio?

Todo deal tiene **fecha estimada de cierre** desde el día 1. Referencia por tipo de cliente:

| Tipo de cliente | Ciclo estimado | Nota |
|---|---|---|
| Cliente recurrente (renovación/ampliación) | 15-30 días | Ya está creado como cliente, sin trámite documental |
| Empresa mediana, decisión local | 30-45 días | Gerente de Marketing decide directo |
| Multinacional con agencia de medios | 60-90 días | Agencia + comité + trámite proveedor |
| Marca de lujo internacional | 90-120 días | Aprobación regional + creación proveedor + crédito |
| Filial Grupo Bolívar | 45-60 días | Relación existe; el trámite es interno |

**Alertas de estancamiento (SLA por etapa):**

| Etapa | Máximo saludable | Si se pasa... |
|---|---|---|
| Prospecto | 14 días sin cita | Reintentar 2 veces más por otro canal, luego pausar |
| Cita agendada | 10 días sin realizarse | Reconfirmar o reagendar ya |
| Seguimiento | 21 días sin avance | Revisar con Carolina en el viernes de forecast |
| En cierre / Documentación | 30 días sin firma | Escalar — riesgo de perder el presupuesto asignado |

---

## Parte 3 — Checkpoints Documentales (el trámite que mata cierres)

Los cierres B2B se caen o se atrasan por papeles, no por precio. Estos dos checks se gestionan DENTRO de la etapa "En cierre / Documentación" y se registran como propiedades del deal.

### Check 1 — Creación de Gamma como proveedor del cliente

Documentos que **Gamma le envía al cliente** para ser creada como proveedor. Tener el paquete listo en una carpeta compartida para enviarlo el mismo día que lo pidan:

- [ ] RUT actualizado de Ediciones Gamma
- [ ] Certificado de Cámara de Comercio (no mayor a 30 días)
- [ ] Certificación bancaria (no mayor a 30 días)
- [ ] Cédula del representante legal
- [ ] Certificado de composición accionaria
- [ ] Estados financieros del último año (si el cliente los exige)
- [ ] Formulario de vinculación de proveedores del cliente (diligenciado)
- [ ] Certificaciones comerciales de otros clientes (2-3 referencias)
- [ ] Formato SARLAFT / conocimiento de contraparte (si aplica)

> **Acción pendiente:** confirmar con contabilidad la carpeta oficial con estos documentos actualizados y su ubicación en Drive. La comercial no debe perseguir papeles internos — el paquete debe estar siempre vigente.

### Check 2 — Plan de crédito / creación del cliente

Documentos que **el cliente le envía a Gamma** para otorgarle crédito (pago a 30/60 días) o crearlo como cliente:

- [ ] RUT del cliente
- [ ] Certificado de Cámara de Comercio (no mayor a 30 días)
- [ ] Cédula del representante legal
- [ ] Estados financieros de los últimos 2 años (para cupo de crédito)
- [ ] Referencias comerciales (2) y bancaria (1)
- [ ] Formato de solicitud de crédito / vinculación de cliente (formato Gamma)
- [ ] Pagaré en blanco con carta de instrucciones (si el cupo lo exige)

> **Acción pendiente:** validar con contabilidad/cartera la lista exacta y los montos de cupo que exigen pagaré. Esta lista es el estándar del mercado colombiano — ajustar a la política real de Gamma.

**Regla operativa:** en la primera reunión de negociación avanzada, la comercial pregunta: *"¿Su empresa requiere creación de proveedor? ¿Cuánto tarda ese trámite?"* — y arranca el papeleo EN PARALELO a la negociación, no después del sí. Esto ahorra 2-4 semanas de ciclo.

---

## Parte 4 — Propiedades a Crear en HubSpot (implementación)

Para que las 4 preguntas y los checks se puedan filtrar en vistas, crear estas propiedades de deal (solicitar a Jeison):

| Propiedad | Tipo | Valores |
|---|---|---|
| `BU` | Lista desplegable | AXXIS / Diners / Ambas / Experiencias |
| `Check proveedor` | Lista desplegable | No aplica / Pendiente / En trámite / Completado |
| `Check crédito` | Lista desplegable | No aplica / Pendiente / En trámite / Completado |
| `Fecha de visita realizada` | Fecha | — |
| `Formato ancla` | Texto | Formato de la tabla del Sistema de Ventas |
| `Motivo de pérdida` | Lista desplegable | Precio / Presupuesto congelado / Eligió competidor / Sin respuesta / Timing / Otro |

**Vistas guardadas a crear (una por comercial + una gerencial):**
1. "Mis prospectos fríos" — Prospecto + sin actividad 7 días
2. "Mi seguimiento hoy" — Cita agendada + Seguimiento, orden por próxima tarea
3. "Mis cierres del mes" — En cierre + fecha cierre este mes
4. "Trámites atascados" — Check proveedor o crédito = En trámite + sin actividad 5 días
5. [Gerencial] "Pipeline total por comercial y etapa" — dashboard para Carolina

---

## Parte 5 — Forecast Semanal (viernes, 30 min por comercial)

Cada viernes, cada comercial reporta contra estas metas. Los datos salen de HubSpot — la reunión es para decisiones, no para reconstruir información.

### Objetivos semanales por comercial

| Indicador | Meta semanal | Fuente HubSpot |
|---|---|---|
| Prospectos nuevos contactados (deals creados) | 5 | Deals creados esta semana |
| Visitas / reuniones realizadas | 3 | Deals movidos a "Seguimiento" + fecha visita |
| Cotizaciones enviadas | 2 | Actividad + monto actualizado en deal |
| Deals movidos a "En cierre" | 1 | Cambio de etapa |
| Checks documentales completados | Los que estén en trámite | Propiedades check |

### Objetivos mensuales por comercial

| Indicador | Meta mensual |
|---|---|
| Propuestas/cotizaciones enviadas | 8 |
| Cierres ganados | 2 |
| Tasa de cierre (ganados / propuestas) | >25% |
| Ticket promedio | >$8M |
| Pipeline activo individual (etapas 1-4) | >$25M |

### Formato del reporte de viernes (por comercial, 5 líneas)

```
1. Cerré: [deals ganados esta semana + monto]
2. A punto de cierre: [deals en etapa 4 + qué falta para firmar]
3. Trámites: [estado proveedor/crédito de cada deal en documentación]
4. Pipeline nuevo: [prospectos creados + cuáles tienen cita]
5. Necesito: [decisión, descuento, escalamiento o apoyo que requiero de Carolina]
```

### Revisión gerencial (Carolina)

- Pipeline total activo vs meta ($100M mínimo entre las 4)
- Deals estancados fuera de SLA (lista de la vista "Trámites atascados")
- Forecast ponderado del mes: Σ (monto × probabilidad de etapa)
- Distribución del gap: ¿quién está lejos de su meta y por qué?

---

## Parte 6 — Cadencia de Gestión

| Momento | Qué pasa | Duración |
|---|---|---|
| Diario (mañana) | Cada comercial responde las 4 preguntas en HubSpot y arma su día | 15 min |
| Lunes | Carolina revisa pipeline total y asigna prioridades de la semana | 30 min |
| Viernes | Forecast semanal: reporte de 5 líneas por comercial + decisiones | 30 min/comercial |
| Cierre de mes | Forecast vs real, tasa de cierre, motivos de pérdida, ajuste de metas | 1 hora equipo |

---

## Parte 7 — Plan de Implementación

| # | Acción | Responsable | Cuándo |
|---|---|---|---|
| 1 | Verificar probabilidades de etapa del Pipeline B2B (alerta `closedwon`) | Jeison | Semana del 14 jul |
| 2 | Crear las 6 propiedades de deal + 5 vistas guardadas | Jeison | Semana del 14 jul |
| 3 | Confirmar checklist documental (proveedor y crédito) con contabilidad | Carolina | Semana del 14 jul |
| 4 | Armar carpeta Drive con paquete de proveedor vigente | Contabilidad | Semana del 14 jul |
| 5 | Sesión de entrenamiento: Sistema de Ventas + este plan (2 horas) | Carolina + equipo | Semana del 21 jul |
| 6 | Cada comercial carga su pipeline real actual a HubSpot (todo lo que tiene en curso) | Las 4 comerciales | Semana del 21 jul |
| 7 | Primer forecast de viernes con datos reales | Todas | Viernes 24 jul |

**Criterio de éxito a 30 días (viernes 14 ago):** pipeline activo en HubSpot >$100M distribuido en las 4 etapas, cero deals creados directamente en Closed Won, y el forecast del viernes sale de HubSpot sin reconstrucción manual.

---

## Relacionado

[[Sistema-Ventas-Editorial-2026]] · [[Auditoria-Competencia-Anunciantes-2026]] · [[Forecast Pauta Jun 2026]] · [[Media Kit AXXIS 2026]] · [[Diners_MediaKit_2026]]

---

*Generado por Claude — 2026-07-12, sobre auditoría real del Pipeline B2B en HubSpot.*
