---
date: 2026-07-03
type: task
status: pending
priority: P2
owner: Jeison Montero
requester: Carolina Ramirez
tags: [task, medicion, tracking, hubspot, first-party-data, suscripciones, pauta, jeison]
related-bu: [AXXIS, Diners, Suscripciones]
related-projects: [HubSpot-CRM, Relevancia-Digital-Revistas]
deadline: 2026-08-15
ai-first: true
---

## For future Claude
Tarea asignada a Jeison Montero como PM conector para implementar arquitectura de medición first-party en Ediciones Gamma. Contexto: hoy las plataformas (Meta, Google) reportan conversiones con conflicto de interés; el 30-40% de la señal se pierde por cookieless + iOS restrictions. La solución requiere conectar HubSpot (fuente de verdad) con server-side tracking. Jeison coordina la parte técnica; Carolina define los eventos de negocio a trackear.

---

# Tarea: Arquitectura de Medición First-Party Data

**Owner:** [[02 - Personas/Jeison Montero]]
**Solicitante:** [[02 - Personas/Carolina Ramirez]]
**Fecha asignación:** 2026-07-03
**Deadline:** 2026-08-15
**Prioridad:** P2 (depende de P0: landing suscripciones funcional)

---

## Contexto

Hoy Gamma toma decisiones de presupuesto de pauta con datos de plataforma (Meta Ads, Google AdSense) que tienen conflicto de interés en el número que reportan. El 30-40% de la señal de conversión se pierde por:
- iOS 14+: solo el 23% de usuarios permite tracking
- Cookies Chrome extintas desde Q4 2025
- Cada plataforma define "conversión" a su favor

El resultado: Facebook dice 100 conversiones, Google dice 85, el negocio registró 120. Ninguno es confiable como fuente única.

**HubSpot ya es la decisión correcta como fuente de verdad.** Esta tarea implementa la arquitectura que lo hace real.

---

## Alcance de Jeison (PM conector)

Jeison no implementa todo — coordina y conecta. Su rol es:
1. Definir la arquitectura técnica con la agencia Leo
2. Validar que HubSpot puede recibir los eventos necesarios
3. Coordinar implementación con Sebastián Díaz (pauta digital)
4. Asegurar que la señal llega limpia antes de que Carolina active campañas

---

## Entregables por fase

### Fase 1 — Survey + campo HubSpot (antes 15 jul)
**Sin bloqueantes técnicos. Más fácil de lo que parece.**

- [ ] Agregar campo "Fuente de origen" en HubSpot para contactos (suscriptores y anunciantes)
  - Opciones para suscriptores: Instagram, Facebook, Google, referido, call center outbound, feria/evento, otro
  - Opciones para anunciantes B2B: referido de marca, media kit recibido, ejecutiva contactó, evento, otro
- [ ] Coordinar con María Claudia Vargas (suscripciones) para que el call center registre la fuente al cierre de cada suscripción
- [ ] Coordinar con Natalia Castaño para que el equipo comercial registre fuente de origen al crear deal en HubSpot

### Fase 2 — Server-side tracking suscripciones (antes 15 ago)
**Bloqueante: requiere landing de suscripciones funcional (P0 con agencia Leo)**

- [ ] Implementar Meta CAPI conectado a HubSpot via webhook
  - Evento a enviar: "suscripción completada" con email hasheado
  - Incluir conversiones de call center que tuvieron touchpoint Meta previo
- [ ] Implementar Google Enhanced Conversions en landing de suscripciones
- [ ] Validar con Sebastián Díaz que los eventos llegan correctamente a Meta Business Manager y Google Ads

### Fase 3 — MER mensual (Q4 2026)
**Solo cuando fases 1 y 2 tienen datos reales**

- [ ] Definir fórmula MER para suscripciones: nuevas suscripciones netas / gasto total Meta+AdSense ese mes
- [ ] Crear reporte mensual simple (puede ser Google Sheets) que Carolina revise junto con el informe de Sebastián

---

## Lo que Carolina define (no Jeison)

- Qué eventos de negocio cuentan como conversión (Carolina + María Claudia)
- Cuándo está lista la landing para activar Fase 2 (depende de agencia Leo)
- Umbral de MER aceptable por canal (Carolina define en Q4)

---

## Coordinación requerida

| Persona | Rol en esta tarea |
|---|---|
| [[02 - Personas/Jeison Montero]] | PM conector — arquitectura técnica y coordinación |
| [[02 - Personas/Carolina Ramirez]] | Define eventos de negocio, aprueba arquitectura |
| [[02 - Personas/Proveedor Agencia Leo]] | Implementación técnica CAPI + Enhanced Conversions |
| [[02 - Personas/Proveedor Pauta digital Sebastian Diaz]] | Validación Meta + Google, reportes de señal |
| [[02 - Personas/Maria Claudia Vargas]] | Protocolo call center — registro fuente origen |
| [[02 - Personas/Natalia Castaño]] | Protocolo equipo comercial — fuente origen en deals |

---

## Definition of Done

- [ ] Campo "fuente de origen" activo en HubSpot para suscriptores y anunciantes
- [ ] Call center registrando fuente en cada suscripción nueva
- [ ] CAPI Meta conectado y validado (signal recovery > 60%)
- [ ] Enhanced Conversions Google activo en landing suscripciones
- [ ] Primer reporte MER disponible con datos reales (no de plataforma)
