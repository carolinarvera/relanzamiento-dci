---
date: 2026-07-03
type: reference
tags: [experiencias, beneficios-suscriptores, ux, prototipo, mockup]
related-people: [Carolina Ramirez, Juan David Duran Lerma]
related-projects: [Beneficios-Suscriptores]
ai-first: true
confidence: high
status: en-construccion
---

## For future Claude
Prototipos HTML de la plataforma Beneficios Suscriptores, uno por cada actor definido en [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] (Suscriptor, Aliado, Gamma Admin). Sirven como insumo visual para la tarea de Juan David "Definir funcionalidades del portal + mockups/bocetos" (due 31 jul, ver [[06 - Meetings/Experiencias/2026-07-02 Equipo-Experiencias - Landing Beneficios Suscriptores]]). Son pantallas de inicio ya logueado (Suscriptor, Aliado) más una landing pública (Inicio) — no flujos completos. Datos y aliados mostrados son ficticios (ej. "Casa Alma", "María Trujillo"), solo para maquetar; no representan aliados reales prospectados. El sitio se unificó a **3 páginas únicas** en un solo sistema de diseño (2026-07-10) — ya no existen páginas separadas de "mejoras"; las 5 mejoras propuestas por feedback a la base alterna quedaron integradas directamente en Inicio y Suscriptor.

---

# Prototipos UI — Beneficios Suscriptores

> **Owner:** [[Carolina Ramirez]] · **Fase:** Fase 1 MVP (sin sistema de reservas — ver decisión 2026-07-02)

## Estado por actor

**Sitio en vivo (Vercel):** https://beneficios-suscriptores-prototipo.vercel.app — **3 páginas únicas**, un solo sistema de diseño (piedra cálida/bronce/vino).

| Actor | Pantalla | Estado | Link directo |
|---|---|---|---|
| — | Inicio (landing pública) | ✅ v1 | https://beneficios-suscriptores-prototipo.vercel.app/ |
| Suscriptor | Inicio (logueado) | ✅ v2 — mejoras integradas | https://beneficios-suscriptores-prototipo.vercel.app/suscriptor |
| Aliado | Inicio (logueado) | ✅ v1 | https://beneficios-suscriptores-prototipo.vercel.app/aliado |
| Gamma Admin | Inicio (logueado) | ⏳ pendiente | — |

Código fuente local: `~/Documents/beneficios-suscriptores-prototipo/` (proyecto Vercel independiente `caro8/beneficios-suscriptores-prototipo`, fuera del vault). Versiones anteriores como Artifact: [Suscriptor](https://claude.ai/code/artifact/0d12a42e-527f-4dd7-85e9-4c4edf13e28d) · [Aliado](https://claude.ai/code/artifact/f471ad13-1b16-41c2-b006-934f12e96948).

### Feedback a la base alterna ("Vive Beneficios") — mejoras ya integradas

Otro equipo construye en paralelo una base con naming "Vive Beneficios" y validación por QR — ambos contradicen decisiones ya tomadas (nombre unificado Beneficios Suscriptores; QR descartado 2026-07-03 a favor de billeteras virtuales). En estos mockups la credencial usa ID sin QR — pendiente avisarles del naming y del QR en su propia base.

Las 5 mejoras propuestas para su pantallazo (2026-07-06) se llevaron directo al sistema de diseño propio de Gamma, sin páginas paralelas de "mejoras" ni el naming/paleta de ellos:

**`/suscriptor`**
1. Mis ahorros (total ahorrado vs. valor de suscripción + desglose por categoría) — tras el saludo
2. Filtros ampliados (ordenar + % descuento por rango, calificación 4.5+, cerca de mí) — panel de dos filas sobre el catálogo
3. Calificación y distancia — ya presentes en las tarjetas del catálogo
4. Referir y ganar — banner de ancho completo al final de la página

**`/` (Inicio)**
3. Calificación y ciudad en "Experiencias destacadas del mes"
5. FAQ — después de "Cómo funciona", antes del CTA final (resuelve objeciones antes del registro)

## Decisiones de producto reflejadas en los prototipos

- **Sin QR** — validación de suscriptor por ID único digitado por el aliado (QR descartado 2026-07-03).
- **Sin reservas en Fase 1** — flujo es "activar beneficio" → notificación/registro de actividad, no calendario de disponibilidad (calendario queda para Fase 2).
- **Geolocalización** de aliados (automática y manual) — confirmada 2026-07-02.
- **Filtros de catálogo:** categoría, % descuento, relevancia, fecha de adición, calificación.
- **Badges tipo Amazon:** "% dto", "Nuevo", "Destacado" — decisión 2026-07-02.
- **Gamificación:** niveles Gold → Premium → Black, por redenciones o referidos.
- **Login:** número de identificación del suscriptor/aliado.
- Nombre unificado del proyecto: **Beneficios Suscriptores** (no usar Vive Beneficios / Club de Beneficios / Carnet Digital).

## Sistema de diseño usado (consistente entre pantallas)

- **Paleta:** piedra cálida (`#EDEAE2` claro / `#17171A` oscuro) + acento bronce (`#7F5719` / `#D2A855`) + vino como secundario (`#7A2E2E` / `#D08181`) — validada por contraste WCAG AA en ambos temas, no genérica de IA.
- **Tipografía:** serif editorial (Iowan Old Style/Georgia) para títulos, sans de sistema para UI, monoespaciada para IDs y cifras.
- **Tokens compartidos** entre las pantallas de Suscriptor y Aliado — mismo masthead, mismo radio de esquina (3px, look arquitectónico), mismo lenguaje de tarjetas.

## Próximo paso

Construir la pantalla de inicio de **Gamma Admin** (Dashboard Global: KPIs ejecutivos, suscriptores/aliados activos, redenciones, revenue) siguiendo el mismo sistema de diseño.

---

## Relacionado

[[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] · [[06 - Meetings/Experiencias/2026-07-02 Equipo-Experiencias - Landing Beneficios Suscriptores]] · [[Carolina Ramirez]] · [[Juan David Duran Lerma]]

---

## Tags
#experiencias #beneficios-suscriptores #ux #prototipo #mockup
