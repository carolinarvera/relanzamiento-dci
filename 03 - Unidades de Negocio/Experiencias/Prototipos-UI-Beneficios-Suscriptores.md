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
Prototipos HTML de la plataforma Beneficios Suscriptores, uno por cada actor definido en [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] (Suscriptor, Aliado, Gamma Admin). Sirven como insumo visual para la tarea de Juan David "Definir funcionalidades del portal + mockups/bocetos" (due 31 jul, ver [[06 - Meetings/Experiencias/2026-07-02 Equipo-Experiencias - Landing Beneficios Suscriptores]]). Son pantallas de inicio ya logueado — no flujos completos. Datos y aliados mostrados son ficticios (ej. "Casa Alma", "María Trujillo"), solo para maquetar; no representan aliados reales prospectados.

---

# Prototipos UI — Beneficios Suscriptores

> **Owner:** [[Carolina Ramirez]] · **Fase:** Fase 1 MVP (sin sistema de reservas — ver decisión 2026-07-02)

## Estado por actor

| Actor | Pantalla | Estado | Link |
|---|---|---|---|
| Suscriptor | Inicio (logueado) | ✅ v1 | https://claude.ai/code/artifact/0d12a42e-527f-4dd7-85e9-4c4edf13e28d |
| Aliado | Inicio (logueado) | ✅ v1 | https://claude.ai/code/artifact/f471ad13-1b16-41c2-b006-934f12e96948 |
| Gamma Admin | Inicio (logueado) | ⏳ pendiente | — |

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
