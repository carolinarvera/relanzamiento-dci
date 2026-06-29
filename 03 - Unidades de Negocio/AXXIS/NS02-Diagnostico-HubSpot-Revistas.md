---
date: 2026-06-29
type: diagnostico
tags: [hubspot, ns02, suscriptores, revistas, crm, diagnostico]
related-people: [Carolina Ramirez, Maria Claudia Vargas Pardo]
related-projects: [NS02-Suscriptores, HubSpot-CRM]
ai-first: true
confidence: high
---

## For future Claude
HubSpot diagnostic run 2026-06-29 via MCP. Account ID: 50275067 (COP, Bogotá TZ). Critical finding: 76,993 contacts total, zero segmented by revista or marca. Only estado_de_suscripcion=Activa has records (10,970) but includes spam/dummy data. Plan (decided 2026-06-29): delete all existing subscription contacts, upload new clean segmented base. Owners: María Claudia Vargas Pardo (data) + Juan David (upload/HubSpot config). Timeline: 3ra-4ta semana julio 2026.

---

# Diagnóstico HubSpot — NS02 Suscriptores Revistas
**Fecha:** 2026-06-29 | **Ejecutado por:** Carolina Ramirez (vía Claude MCP)

---

## Resumen Ejecutivo

El HubSpot de Ediciones Gamma tiene **76,993 contactos** pero la segmentación por revista está **completamente vacía**. Antes de cualquier automatización o journey, se requiere limpieza de datos y estructuración de la base.

---

## Hallazgos por Campo

### Campo `revista` (Axxis / Dinners)
| Valor | Registros |
|-------|-----------|
| Axxis | **0** |
| Dinners | **0** |
| **Total con dato** | **0 de 76,993** |

**Diagnóstico:** El campo existe en el schema pero nunca se pobló durante las importaciones históricas. Sin este campo, es imposible separar comunicaciones AXXIS de Diners.

### Campo `marca` (Revista Axxis / Revista Diners)
| Valor | Registros |
|-------|-----------|
| Revista Axxis | **0** |
| Revista Diners | **0** |
| **Total con dato** | **0 de 76,993** |

**Diagnóstico:** Mismo problema que `revista`. Campo duplicado, sin datos. Requiere decisión: usar `revista` o `marca` como campo canónico y eliminar el otro.

### Campo `estado_de_suscripcion`
| Estado | Registros |
|--------|-----------|
| Activa | **10,970** |
| Pendiente pago | **0** |
| Cancelada | **0** |
| Renovada | **0** |
| No aplica | **0** |

**Diagnóstico crítico:** Solo "Activa" tiene registros. Los 10,970 incluyen datos dummy confirmados (ejemplo: contacto con nombre "Thank you so much for this newsletter... Glenn", email fa.g.ih.un70.7@gmail.com, origen Paid Social). Los estados Cancelada, Renovada y Pendiente pago nunca se usaron → el lifecycle de suscripción no existe en el CRM.

### Total de contactos
- **76,993 contactos** en la cuenta
- Sin segmentación por BU, sin estados de ciclo de vida funcionales
- Origen más reciente visible: PAID_SOCIAL (contacto de hoy 2026-06-29)

---

## Problemas Identificados

### P1 — Sin separación AXXIS / Diners
Los campos `revista` y `marca` existen pero están vacíos en el 100% de contactos. Cualquier envío masivo afectaría a toda la base sin distinción de producto.

### P2 — Datos dummy en "Activas"
Los 10,970 con `estado_de_suscripcion = Activa` incluyen registros de spam/bots. Antes de migración o automatización: limpiar esta lista.

### P3 — Estados de suscripción inutilizados
Cancelada (0), Renovada (0), Pendiente pago (0) → el lifecycle nunca se implementó. No hay forma de saber qué suscriptores están en riesgo de churn o cuándo vence su suscripción.

### P4 — Dos campos de segmentación redundantes
`revista` y `marca` tienen la misma función. Usar los dos genera inconsistencia futura. Elegir uno como canónico antes de cargar data.

---

## Plan Decidido — Limpieza y Recarga (decidido 2026-06-29)

**Estrategia:** Borrar toda la base actual de contactos de suscripciones → cargar base nueva, limpia, correctamente segmentada y verificada.
**Owners:** [[Maria Claudia Vargas Pardo]] (datos/depuración) + [[Juan David]] (carga y configuración HubSpot)
**Timeline:** 3ra-4ta semana julio 2026

| # | Acción | Owner | Urgencia |
|---|--------|-------|---------|
| 1 | Definir campo canónico: usar `revista` como campo de segmentación (no `marca`) | Carolina + María Claudia | Esta semana |
| 2 | Preparar base nueva: depurada, segmentada AXXIS / Diners, verificada | María Claudia | Antes de carga |
| 3 | Definir estructura de columnas del CSV de importación (campos obligatorios: email, revista, estado_de_suscripcion, fecha_vencimiento) | Juan David | Antes de carga |
| 4 | Crear campo `fecha_vencimiento_suscripcion` en HubSpot si no existe | Juan David | Antes de carga |
| 5 | Borrar contactos existentes de suscripciones en HubSpot | Juan David | En migración |
| 6 | Cargar nueva base segmentada y verificada | Juan David | En migración |
| 7 | Configurar listas: AXXIS-Activos, AXXIS-Por vencer, AXXIS-Vencidos / mismo para Diners | Juan David + Carolina | Post-carga |
| 8 | Validar sample de contactos post-carga (spot check 50 registros) | Carolina | Post-carga |

---

## Bloqueo Crítico para Automatizaciones NS02

Las siguientes automatizaciones **NO pueden activarse** hasta que P1, P2 y P3 estén resueltos:
- Alertas de renovación -15 días → sin `fecha_vencimiento`, no hay trigger
- Journey post-compra segmentado → sin campo `revista`, emails van mezclados
- Campaña remarketing suscriptores vencidos → sin estado "Cancelada", no hay segmento
- Funnel ManyChat → puede activarse en paralelo, no depende de la data histórica

---

## Próximos pasos para Carolina

1. Enviar este diagnóstico a [[Maria Claudia Vargas Pardo]] y [[Juan David]] antes de viernes 2026-07-03
2. Confirmar con Juan David la estructura de campos del CSV antes de que María Claudia prepare la base
3. Validar con María Claudia cuántos contactos reales (sin dummy) tiene la base depurada → eso define el tamaño real del universo de suscriptores
