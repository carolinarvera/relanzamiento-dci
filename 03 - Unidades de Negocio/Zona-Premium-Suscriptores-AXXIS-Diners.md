---
date: 2026-07-02
type: project
tags: [suscriptores, axxis, diners, zona-premium, paywall, beneficios-suscriptores, retencion, valor-percibido]
related-people: [Carolina Ramirez, Sandra Martinez, Jeison Montero, Maria Claudia Vargas Pardo, Paola Pantaleon, Nicolas Serna, Catalina Obregon]
related-projects: [Zona-Premium-Suscriptores, Beneficios-Suscriptores, NS02-Suscriptores]
ai-first: true
confidence: high
status: borrador
---

## For future Claude
Documento maestro que conecta 2 iniciativas hoy fragmentadas — paywall blando digital y Beneficios Suscriptores — bajo una sola estrategia de "Zona Premium de Suscriptores" para AXXIS y Diners. El newsletter premium (antes un tercer pilar aquí) se sacó el 2026-07-02: es estratégico pero pertenece a la estrategia de marketing y digital, no a este marco de valor no-precio — se sigue en [[03 - Unidades de Negocio/Diners/Diners]] y el plan de marketing. No duplica el detalle técnico de cada fuente, lo referencia. Usar como punto de entrada único antes de tocar cualquiera de los pilares o reportar avance a Catalina.

---

# Zona Premium de Suscriptores — AXXIS y Diners

> **Owner:** [[Carolina Ramirez]] · **Estado:** borrador de síntesis · **Última actualización:** 2026-07-02

---

## 1. Qué es la Zona Premium

María Claudia Vargas Pardo (Jefe Suscripciones) confirmó el 2026-07-01 que no hay más margen para bajar precios ni aumentar descuentos — el precio está en su límite operativo (ver [[Suscripciones-Revistas-2024-2026]]). Sumado a la caída de Privilegios Davivienda (AXXIS -72%, Diners -57% desde 2024), la única palanca de conversión y retención que queda es **valor percibido**, no precio.

La "Zona Premium de Suscriptores" es el paraguas que agrupa las iniciativas que construyen ese valor percibido para AXXIS y Diners. No es un solo producto: son pilares independientes que comparten el mismo objetivo — dar al suscriptor una razón para pagar y renovar que no sea un descuento.

> **Nota de alcance (2026-07-02):** el newsletter premium ("La Mesa de Diners") se sacó de este marco. Es una iniciativa estratégica, pero corresponde a la estrategia de marketing y contenido digital, no a la zona premium de valor no-precio. Se sigue en [[03 - Unidades de Negocio/Diners/Diners]] y en `07 - Marketing y Eventos/Plan de Marketing Revistas y Libros 2026.md`.

| Pilar | Qué es | Estado |
|---|---|---|
| 1. Contenido exclusivo digital (paywall blando) | Artículos gratis limitados/mes → registro → contenido premium (ebooks, guías, directorios) | Benchmark hecho, sin implementación |
| 2. Beneficios Suscriptores | Plataforma de beneficios y alianzas para suscriptores AXXIS+Diners | Arquitectura aprobada, 8 decisiones pendientes bloquean MVP |

---

## 2. Los pilares

### Pilar 1 — Contenido exclusivo digital (paywall blando)

**Concepto:** X artículos gratis por mes con registro, luego contenido premium detrás de muro — ebooks, guías, directorios, planos. Referentes: Condé Nast (20% de lectores de newsletter termina pagando), P&M Premium.

**Estado:** identificado como táctica #6 en el benchmark competitivo, sin fecha de implementación. Depende de la plataforma web (coordinación con [[Jeison Montero]]).

**Lo que falta — bloqueante crítico:** la tarea "Hablar con Sandra Martínez para definir contenido exclusivo suscriptores premium" venció el 2026-06-27 y sigue pendiente (ver `task.md`). Sin esa conversación con Editorial no hay claridad de qué contenido va detrás del muro.

**Fuente:** [[04 - Growth System/2026-06-21 Inteligencia Competitiva Marketing Revistas]] (táctica #6).

### Pilar 2 — Beneficios Suscriptores

**Concepto:** plataforma PWA de beneficios exclusivos para suscriptores AXXIS+Diners — descuentos y alianzas con restaurantes, comercios y experiencias, con gamificación (Gold/Premium/Black) y sistema de referidos.

**Estado:** arquitectura de producto completa y aprobada (v1.1, 2026-07-01) — 3 actores, 26+ módulos, user journeys, KPIs, stack (Next.js + Supabase + WhatsApp Business API), fases de desarrollo. MVP Beta target sep 2026.

**No se duplica aquí** — la arquitectura completa vive en [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]]. Este documento solo trae a la matriz de la sección 3 las decisiones que bloquean el MVP.

---

## 3. Matriz de decisiones pendientes (consolidada)

| Decisión | Pilar | Responsable | Urgencia | Bloquea |
|---|---|---|---|---|
| Contenido exclusivo a definir con Editorial | 1 | [[Sandra Martinez]] + Carolina | 🔴 Alta — vencida jun 27 | Arranque de todo el pilar 1 |
| Nombre inspiracional definitivo para Beneficios Suscriptores (más allá del nombre de trabajo actual) | 2 | Carolina + equipo Marketing | 🟡 Media | Producción de material externo |
| Look & feel MVP — moodboard y referencias visuales | 2 | Carolina + Juandy → validar con [[Catalina Obregon]] | 🔴 Alta | Cotización de desarrollo |
| Desarrollo interno (Juandy) vs. externo | 2 | Carolina + Juan David Duran Lerma | 🔴 Alta | Timeline y presupuesto MVP |
| Método de ID único (número suscripción / cédula / código) | 2 | Grupo (Carolina, Jeison, María Claudia) | 🔴 Alta | Módulo de validación en aliado |
| Beneficio específico por referido exitoso | 2 | Carolina + [[Nicolas Serna]] | 🟡 Media | Mecánica de referidos |
| URL definitiva de la plataforma | 2 | Carolina + [[Jeison Montero]] | 🔴 Alta | Lanzamiento MVP |

---

## 4. Cronograma consolidado (jul–oct 2026)

| Mes | Pilar 1 — Contenido exclusivo | Pilar 2 — Beneficios Suscriptores |
|---|---|---|
| **Jul 2026** | Conversación con Sandra Martínez (vencida, pendiente cerrar) | Resolver decisiones bloqueantes (look & feel, ID único, build interno/externo) |
| **Ago 2026** | Sin fecha — depende de definición de contenido | Desarrollo MVP en curso (10-30 aliados piloto) |
| **Sep 2026** | Sin fecha | MVP Beta lanzado (look & feel aprobado por Catalina) |
| **Oct–Nov 2026** | — | V1 Full: expansión AXXIS, gamificación, programa de referidos |

---

## 5. Próximos pasos inmediatos (30 días)

1. **Cerrar la conversación con Sandra Martínez** — desbloquea el pilar 1, vencida desde jun 27.
2. **Resolver look & feel de Beneficios Suscriptores con Catalina** — es la decisión de mayor apalancamiento: bloquea la cotización de desarrollo y, por extensión, la fecha de MVP de sep 2026.
3. **Decidir build interno vs. externo con Juandy** — condiciona presupuesto y timeline real del pilar 2.
4. **Definir método de ID único** — bloquea el diseño del módulo de validación que usan tanto suscriptor como aliado.

---

## Relacionado

[[Suscripciones-Revistas-2024-2026]] · [[04 - Growth System/2026-06-21 Inteligencia Competitiva Marketing Revistas]] · [[03 - Unidades de Negocio/Diners/Diners]] (newsletter premium — estrategia de marketing/digital) · [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] · [[Carolina Ramirez]] · [[Sandra Martinez]] · [[Jeison Montero]] · [[Maria Claudia Vargas Pardo]] · [[Paola Pantaleon]] · [[Nicolas Serna]] · [[Catalina Obregon]]

---

## Tags
#suscriptores #axxis #diners #zona-premium #paywall #beneficios-suscriptores #retencion #valor-percibido
