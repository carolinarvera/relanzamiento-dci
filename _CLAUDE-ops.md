---
date: 2026-07-06
type: vault-ops
tags: [vault-manifest, meta, ops, reference]
ai-first: true
---

# Claude Ops Reference — GammaVault

> Leer este archivo solo cuando necesites: convenciones de naming, personas del equipo, reglas de tareas, propagation rules, git sync, o configuración de plataformas.
> El manual de inicio rápido está en `_CLAUDE.md`.

---

## Personas Clave

| Persona | Rol |
|---|---|
| [[02 - Personas/Catalina Obregon]] | CEO · jefa directa de Carolina |
| [[02 - Personas/Carolina Ramirez]] | Head of Growth & Business · owner del vault |
| [[02 - Personas/Jeison Montero]] | Líder de Plataformas · alias "Jason" (informal) · PM transversal cross-área |
| [[02 - Personas/Ernesto Rodriguez]] | Contenido Editorial |
| [[02 - Personas/Estefania Ochoa Fonseca]] | CM Visión Davivienda · Braze/email SOLO para Visión |
| [[02 - Personas/Paola Gordillo]] | CM redes AXXIS y Diners · NO Visión |
| [[02 - Personas/Paola Nossa]] | Marketing y Alianzas Revistas |
| [[02 - Personas/Paola Pantaleon]] | Experiencias y Alianzas |
| [[02 - Personas/Nicolas Serna]] | Comercial Libros |
| [[02 - Personas/Natalia Otalora]] | Cliente Davivienda — Visión (aprueba estrategias) |
| [[02 - Personas/Maria Angelica Navarro]] | Cliente Davivienda — Ed. Financiera |
| [[02 - Personas/Natalia Castaño]] | Ejecutiva Comercial AXXIS/Diners + logística Experiencias |
| [[02 - Personas/Proveedor Agencia Leo]] | Agencia 11 recursos · PM Viviana · UX/UI/SEO/Dev/Pauta |
| [[02 - Personas/Proveedor Pauta digital Sebastian Diaz]] | Meta Ads y AdSense AXXIS/Diners |

---

## Proyectos Activos

| Proyecto | Owner | Prioridad | Estado |
|---|---|---|---|
| HubSpot CRM — migración y journeys | Carolina | P1 | En curso (Jul semana 3-4) |
| Beneficios Suscriptores — MVP alianzas | Paola Pantaleon | P1 | 5% — nombre TBD |
| Relevancia Digital Revistas | Carolina | P1 | Auditoría en curso |
| Suscripciones — landing + funnel | Carolina | P1 | P0 pendiente (pasarela rota) |
| Arquitectura Medición First-Party | Jeison Montero (PM) | P2 | Fase 1 sin bloqueantes |
| Consolidación Plataformas | Jeison Montero | P1 | Planificación |
| Plan Comercial Libros H2 | Nicolas Serna | P2 | Bloqueado por precios |

---

## Unidades de Negocio — Estado

| BU | Nota principal | Revenue | Riesgo |
|---|---|---|---|
| AXXIS | `03 - Unidades de Negocio/AXXIS/AXXIS` | Impreso 100% semestral · digital 103% | Amarillo |
| Diners | `03 - Unidades de Negocio/Diners/Diners` | Digital 17% anual · pasarela rota | Rojo |
| Libros | `03 - Unidades de Negocio/Libros/Libros` | En desarrollo | Naranja |
| Experiencias | `03 - Unidades de Negocio/Experiencias/Experiencias` | 1/10 exp completadas | Naranja |
| Visión Davivienda | `Plataformas/Vision Davivienda/Vision Davivienda` | Funciona bien | Verde |
| Educación Financiera | `Plataformas/Educacion Financiera/Educacion Financiera` | Rezago crítico | Rojo |

---

## Convenciones de Nomenclatura

- Minutas: `YYYY-MM-DD Persona - Tema.md`
- Personas: nombre sin tildes · ej. `Catalina Obregon.md`
- Proveedores: `Proveedor [Tipo] [Nombre].md`
- Tareas: `YYYY-MM-DD Responsable - Titulo.md` en `Tasks/`
- Logs: `Logs/YYYY-MM-DD.md` append-only
- **Nunca caracteres especiales en nombres de archivo** (tildes, acentos, doble punto)

---

## Sistema de Tareas

- `Tasks/00-Tareas-Hot.md` — solo urgentes y esta semana (leer primero)
- `Tasks/00-Tareas-Master-H2-2026.md` — archivo completo 122 tareas (leer solo cuando necesites el plan completo)
- Cada tarea standalone = `.md` en `Tasks/`. Spec completa: `_specs/tasks-spec.md`
- **Auto-feed:** después de cada reunión o skill de growth, extraer próximos pasos y crear tareas.

---

## Propagation Rules

| Evento | Actualizar también |
|---|---|
| Nueva reunión | `06 - Meetings/[BU]/` + CEO Dashboard si es estratégica |
| Decisión crítica | Nota de proyecto + CEO Dashboard |
| Update proyecto | `05 - PMO/Portfolio Proyectos` + nota proyecto |
| Nueva persona | `02 - Personas/[Nombre].md` |
| Update revenue | CEO Dashboard tabla Revenue |
| Nueva alianza | Nota BU + Portfolio |

---

## Auto-Save Rules

**Sin preguntar:** decisiones de conversación · personas nuevas mencionadas · tareas asignadas · resultados de reuniones · updates de revenue o KPIs.
**Preguntar antes:** datos financieros sensibles específicos · notas personales o privadas · borrar o archivar notas existentes.

---

## Git Sync

```bash
git add Tasks/ "06 - Meetings/" _CLAUDE.md _CLAUDE-ops.md index.md && git commit -m "tasks: [desc] — $(date +%Y-%m-%d)" && git push origin main
```

Commitear: `Tasks/`, `06 - Meetings/`, `_CLAUDE.md`, `_CLAUDE-ops.md`, `index.md`, `00 - Executive Layer/`, `03 - Unidades de Negocio/`.
No commitear: `.claude/`, datos financieros con nombres de clientes, credenciales.

---

## Skills que activan auto-feed de tareas

`growth-engine`, `seo-*`, `analytics`, `cro`, `content-strategy`, `competitive-ads-extractor`, `ads-*`, `benchmark`, `yt-competitive-analysis`

---

## Do Not Touch

- `.obsidian/` — nunca modificar
- `.claude/` — solo con intención

---

*Slim manifest: `_CLAUDE.md` · Última actualización: 2026-07-06*
