---
date: 2026-06-20
type: vault-manifest
tags: [vault-manifest, meta]
ai-first: true
---

# Claude Operating Manual — GammaVault

## AI-First (resumen)
Cada nota: contexto autocontenido · preámbulo "For future Claude" (2-3 oraciones EN) · frontmatter rico · fechas en afirmaciones externas · fuentes inline · wikilinks · nivel de confianza. Spec completa: `_specs/frontmatter-spec.md`. Antes de actuar: leer estado real, no especular.

---

## Vault Identity

- **Owner:** Carolina Ramirez · Head of Growth & Business · Ediciones Gamma
- **Propósito:** Business OS — BUs, proyectos, personas, reuniones
- **Reporta a:** [[02 - Personas/Catalina Obregon]] (CEO)

---

## Folder Map

| Carpeta | Propósito |
|---|---|
| `00 - Executive Layer/` | CEO Dashboard, revenue, alertas |
| `01 - Empresa/` | Identidad Ediciones Gamma, organigrama |
| `02 - Personas/` | Una nota por persona |
| `03 - Unidades de Negocio/` | AXXIS, Diners, Libros, Experiencias, Plataformas |
| `04 - Growth System/` | Frameworks, metodologías |
| `05 - PMO/` | Portfolio de proyectos |
| `06 - Meetings/` | Minutas por BU |
| `07 - Marketing y Eventos/` | Plan de marketing transversal, cronograma de eventos, media kits, ayudaventas |
| `Bases/` | Vistas filtradas de personas, proyectos, tareas |
| `Logs/` | Log diario append-only · `CHANGELOG.md` historial del vault |
| `Daily/` | Notas diarias YYYY-MM-DD.md |
| `Tasks/` | Tareas standalone |
| `_specs/` | Specs de frontmatter y tareas (leer al crear notas) |

---

## Key Files

- `[[00 - Executive Layer/CEO Dashboard]]` — navegación, revenue, proyectos activos
- `[[HEAD OF GROWTH AND BUSINESS]]` — objetivos, KPIs, prioridades
- `[[01 - Empresa/Editorial Gamma]]` — identidad, equipo directivo
- `[[05 - PMO/Portfolio Proyectos]]` — proyectos P1/P2/P3
- `[[BUSINESS_UNITS]]` — KPIs por BU
- Mis Tareas (Google Sheets): https://docs.google.com/spreadsheets/d/1YljVvNxeELPr6RglypTv56FyqX-KRbjqRm9fGm56G_o
- Equipo (Google Sheets): https://docs.google.com/spreadsheets/d/1Ta1-fJ4u2JN-7OxdI_higArTa3DN5ggyGAP4pHQYOGA

## ⚠️ Regla index.md — pedir permiso siempre

`index.md` es un fallback de navegación, NO un archivo de inicio.

**Antes de LEER index.md:** preguntar "¿Cargo el index para localizar el archivo?" y esperar confirmación.
**Antes de ACTUALIZAR index.md:** preguntar "¿Actualizo index.md con los cambios de esta sesión?" y esperar confirmación.

**NO leer ni actualizar sin preguntar**, incluso si parece obvio que sería útil. La carga tiene costo de tokens y la actualización puede introducir inconsistencias si no es el momento correcto.

Excepción: si Carolina pide explícitamente "busca X en el vault" o "actualiza el index", proceder sin preguntar.

---

## Active Context (2026-06-24)

- Prioridad: revenue growth + compensar pérdida Privilegios Davivienda (cierra jun 2026)
- Riesgo crítico: Privilegios era 70% ingresos Revistas · brecha $422MM vs meta $1.465MM
- Sesión 2026-06-24: plan de marketing definitivo Revistas + Libros definido por Carolina (22 acciones)
- Pendiente crítico: nombre inspiracional para Beneficios Suscriptores (alianzas) — sin nombre, no hay material externo
- Pendiente crítico: precios Paquetes Legado y Centenario (Libros por Encargo) — los define Nicolás Serna
- Media Kit AXXIS V2 en producción (deadline 5 jul) · Media Kit Diners V1 en producción (deadline 19 jul)

---

## Personas Clave

| Persona | Rol |
|---|---|
| [[02 - Personas/Catalina Obregon]] | CEO · jefa directa de Carolina |
| [[02 - Personas/Carolina Ramirez]] | Head of Growth & Business · owner del vault |
| [[02 - Personas/Jeison Montero]] | Líder de Plataformas · alias "Jason" (informal) |
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
| Consolidación Plataformas | Jeison Montero | P1 | Planificación |
| Revenue Growth (Diners 37% · AXXIS vs meta) | Carolina | P1 | En curso |
| HubSpot CRM | Carolina | P1 | En curso |
| Alianzas post-Privilegios | Paola Pantaleon | P1 | En curso |
| Plan Comercial Libros | Nicolas Serna | P2 | En curso |
| Estrategia Digital | Carolina | P2 | En curso |

---

## Unidades de Negocio

| BU | Tipo | Revenue | Riesgo |
|---|---|---|---|
| [[03 - Unidades de Negocio/AXXIS/AXXIS]] | Revista Arq/Diseño | 66-76% meta | Amarillo |
| [[03 - Unidades de Negocio/Diners/Diners]] | Revista Cultura | Digital 37% meta | Rojo |
| [[03 - Unidades de Negocio/Libros/Libros]] | Editorial | En desarrollo | Naranja |
| [[03 - Unidades de Negocio/Experiencias/Experiencias]] | Eventos/alianzas | En desarrollo | Naranja |
| [[03 - Unidades de Negocio/Plataformas/Vision Davivienda/Vision Davivienda]] | Plataforma financiera | Funciona bien | Verde |
| [[03 - Unidades de Negocio/Plataformas/Educacion Financiera/Educacion Financiera]] | Plataforma educación | Rezago crítico | Rojo |

---

## ⚠️ REGLA — Plataformas Davivienda (NO MEZCLAR)

| Plataforma | Carpeta | Contacto | Formato |
|---|---|---|---|
| **Visión Davivienda** | `Plataformas/Vision Davivienda/` | [[02 - Personas/Natalia Otalora]] | Looker Studio |
| **MFxInvertir** | `Plataformas/Educacion Financiera/Mis Finanzas para Invertir/` | [[02 - Personas/Maria Angelica Navarro]] | PDF mensual |
| **MFxMiNegocio** | `Plataformas/Educacion Financiera/Mis Finanzas para Mi Negocio/` | [[02 - Personas/Maria Angelica Navarro]] | PDF mensual |

Antes de editar cualquier nota de plataforma: verificar carpeta y contacto. NUNCA mezclar KPIs ni tareas entre ellas.

---

## ⚠️ REGLA — Competencia Grupo Bolívar

Ediciones Gamma es filial de Grupo Bolívar (Davivienda, Seguros Bolívar, Constructora Bolívar, Fiduciaria Bolívar).

| Tipo | ¿Válido? |
|---|---|
| Bancos competidores de Davivienda (Bancolombia, BBVA, Banco de Bogotá, Itaú, etc.) | ❌ NUNCA |
| Filiales Grupo Bolívar (Constructora, Fiduciaria, Seguros Bolívar) | ★ Prioridad alta |
| Compiten con filiales (Sura, Liberty, Mapfre, Prodesa, etc.) | ✅ Válidas con (*) |

---

## Convenciones de Nomenclatura

- Minutas: `YYYY-MM-DD Persona - Tema.md` (espacio antes del nombre, no guion)
- Personas: nombre sin tildes · ej. `Catalina Obregon.md`
- Proveedores: `Proveedor [Tipo] [Nombre].md`
- Tareas: `YYYY-MM-DD Responsable - Titulo.md` en `Tasks/`
- Logs: `Logs/YYYY-MM-DD.md` append-only
- **Nunca caracteres especiales en nombres de archivo** (tildes, acentos, doble punto)

---

## Sistema de Tareas

Cada tarea = un `.md` en `Tasks/`. Spec completa: `_specs/tasks-spec.md`.

**Auto-feed (sin que Carolina lo pida):** después de cada reunión o skill de growth, extraer próximos pasos y crear tareas. Responsables: Growth/Pauta/SEO → Carolina · Editorial → Ernesto · Plataformas → Jeison · Alianzas → Paola Pantaleon · RRSS → CM de la BU correspondiente.

**Skills que activan auto-feed:** `growth-engine`, `seo-*`, `analytics`, `cro`, `content-strategy`, `competitive-ads-extractor`, `ads-*`, `benchmark`, `yt-competitive-analysis`.

---

## Auto-Save Rules

**Sin preguntar:** decisiones de conversación · personas nuevas mencionadas · tareas asignadas · resultados de reuniones · updates de revenue o KPIs.
**Preguntar antes:** datos financieros sensibles específicos · notas personales o privadas · borrar o archivar notas existentes.

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

## Git Sync

```bash
git add Tasks/ "06 - Meetings/" _CLAUDE.md index.md && git commit -m "tasks: [desc] — $(date +%Y-%m-%d)" && git push origin main
```

Commitear: `Tasks/`, `06 - Meetings/`, `_CLAUDE.md`, `index.md`, `00 - Executive Layer/`, `03 - Unidades de Negocio/`.
No commitear: `.claude/`, datos financieros con nombres de clientes, credenciales.

---

## Estrategia 2026 — Contexto Crítico

- Privilegios Davivienda cierra jun 2026 · era 70% ingresos Revistas
- "Mundo D" — plataforma sombrilla del banco; Revistas serán puerta de entrada
- CoCrea — incentivo tributario vigente hasta sep 2026 · exige circulación mínima
- 5 plataformas fragmentadas → consolidación P1

---

## Do Not Touch

- `.obsidian/` — nunca modificar
- `.claude/` — solo con intención

---

*Última actualización: 2026-06-20 · Changelog: `Logs/CHANGELOG.md` · Specs: `_specs/`*
