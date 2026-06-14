---
date: 2026-06-12
type: vault-manifest
tags: [vault-manifest, meta]
ai-first: true
---

# Claude Operating Manual - GammaVault

> Lee este archivo antes de hacer cualquier cosa en este vault.
> Es la fuente de verdad de como Claude opera aqui.

---

## Section 0 - AI-First Vault Rule (leer primero, aplica a toda nota)

Este vault esta disenado para que **future-Claude** lo lea y razone sobre el, no para revision humana. La duena raramente lee notas directamente - llama a Claude para recuperar, sintetizar y conectar puntos a traves del conocimiento acumulado.

**Cada nota que Claude escriba en este vault debe seguir estas reglas:**

1. **Contexto autocontenido** - Cada nota debe explicarse a si misma. Future-Claude puede traer esta nota en aislamiento.
2. **Preambulo "For future Claude"** - Cada nota comienza con un resumen de 2-3 oraciones en ingles claro para que Claude decida relevancia en 10 segundos.
3. **Frontmatter rico y consistente** - Metadatos filtrables: `type`, `date`, `tags`, `related-people`, `related-projects`, `sources`, `confidence`. Todo con `ai-first: true`.
4. **Marcadores de recencia por afirmacion** - Hechos externos llevan fecha: "X sucedio (as of 2026-06, source.com)".
5. **Fuentes preservadas verbatim** - Cada afirmacion externa tiene su URL inline.
6. **Cross-links obligatorios** - Cada persona, proyecto, idea o decision usa `[[wikilinks]]`.
7. **Niveles de confianza** - Donde aplique: `stated | high | medium | speculation`.

Ver especificacion completa en `~/.claude/skills/obsidian-second-brain/references/ai-first-rules.md`.

---

## Section 0.5 - Verificar Estado Real Antes de Actuar

Antes de declarar un estado, hacer un plan o escribir arquitectura: lee el codigo, esquema o dato real. La especulacion desde contexto desactualizado produce borradores que contradicen la realidad.

---

## Vault Identity

- **Owner:** Carolina Ramirez
- **Rol:** Head of Growth & Business
- **Empresa:** Ediciones Gamma (Grupo Bolivar / Banco Davivienda)
- **Proposito:** Business OS para Ediciones Gamma - gestion de unidades de negocio, proyectos estrategicos, personas del equipo y reuniones
- **Ultimo actualizado:** 2026-06-13

---

## Folder Map

| Carpeta | Proposito |
|---|---|
| `00 - Executive Layer/` | CEO Dashboard, vista ejecutiva consolidada, alertas criticas y revenue |
| `01 - Empresa/` | Identidad de Ediciones Gamma, organigrama, contexto corporativo |
| `02 - Personas/` | Una nota por persona - equipo, stakeholders, proveedores |
| `03 - Unidades de Negocio/` | Notas por BU: AXXIS, Diners, Libros, Experiencias, Plataformas |
| `04 - Growth System/` | Frameworks de growth, metodologias y sistemas operativos |
| `05 - PMO/` | Portfolio de proyectos estrategicos, estados y blockers |
| `06 - Meetings/` | Minutas organizadas por BU: CEO/, Experiencias/, Vision/, Proveedores/ |
| `Bases/` | Bases de datos Obsidian (vistas filtradas de personas, proyectos, tareas) |
| `Logs/` | Log de operaciones diarias del vault (append-only, por fecha) |
| `Daily/` | Notas diarias YYYY-MM-DD.md (crear cuando se necesite) |
| `Tasks/` | Notas de tareas standalone (crear cuando se necesite) |

---

## Key Files

- **Dashboard:** `[[00 - Executive Layer/CEO Dashboard]]` - navegacion principal, revenue, proyectos activos, alertas criticas
- **Rol de Carolina:** `[[HEAD OF GROWTH AND BUSINESS]]` - objetivos, frameworks, KPIs, prioridades estrategicas
- **Empresa:** `[[01 - Empresa/Editorial Gamma]]` - identidad, equipo directivo, contexto estrategico
- **Portfolio:** `[[05 - PMO/Portfolio Proyectos]]` - todos los proyectos P1/P2/P3 con owners y estados
- **KPIs BU:** `[[BUSINESS_UNITS]]` - KPIs por unidad de negocio
- **Indice vault:** `[[index]]` - catalogo completo de notas
- **Mis Tareas (Google Sheets):** https://docs.google.com/spreadsheets/d/1YljVvNxeELPr6RglypTv56FyqX-KRbjqRm9fGm56G_o — solo Carolina (18 tareas)
- **Equipo (Google Sheets):** https://docs.google.com/spreadsheets/d/1Ta1-fJ4u2JN-7OxdI_higArTa3DN5ggyGAP4pHQYOGA — todo el equipo (33 tareas)

---

## Active Context (as of 2026-06-12)

**Prioridad actual:** Revenue growth + compensar perdida programa Privilegios Davivienda (cierra junio 2026)
**Cargo:** Head of Growth & Business en Ediciones Gamma
**Reporta a:** [[02 - Personas/Catalina Obregon]] - Gerente General / CEO
**Riesgo critico:** Programa Privilegios Davivienda cierra junio 2026 - representaba 70% de ingresos de Revistas

---

## Personas Clave

| Persona | Rol | Notas |
|---|---|---|
| [[02 - Personas/Catalina Obregon]] | Gerente General / CEO | Jefa directa de Carolina. +25 anos en medios. Directora Diners y AXXIS. |
| [[02 - Personas/Carolina Ramirez]] | Head of Growth & Business | Owner de este vault. Lidera growth, digital, RevOps. |
| [[02 - Personas/Jeison Montero]] | PMO / Lider Plataformas | Owner Consolidacion Plataformas. **Alias confirmado: "Jason"** en reuniones informales. |
| [[02 - Personas/Ernesto Rodriguez]] | Contenido Editorial | Produccion de contenido. Vision funciona bien. Ed. Financiera en rezago. |
| [[02 - Personas/Estefania Ochoa Fonseca]] | CM Vision Davivienda | Community Manager plataformas Davivienda. Reporta a Ernesto Rodriguez. |
| [[02 - Personas/Nicolas Serna]] | Comercial Libros | Owner Plan Comercial Libros. |
| [[02 - Personas/Paola Nossa]] | Marketing y Alianzas Revistas | Marketing revistas AXXIS y Diners. |
| [[02 - Personas/Paola Pantaleon]] | Experiencias y Alianzas | Owner Plan Nuevas Alianzas post-Privilegios. Podcast AXXIS. |
| [[02 - Personas/Paola Gordillo]] | Community Manager | CM de redes sociales Libros/AXXIS/Diners. Trabaja con Ernesto. |
| [[02 - Personas/Proveedor Agencia Leo]] | Proveedor Agencia | 11 recursos. PM Viviana. Ejecuta UX/UI, SEO, Dev, pauta plataformas. |
| [[02 - Personas/Proveedor Pauta digital Sebastian Diaz]] | Proveedor Pauta Digital | Meta Ads y AdSense para AXXIS y Diners. Reporte mensual. |
| [[02 - Personas/Natalia Otalora]] | Cliente Davivienda — Visión | Contacto estratégico Visión Davivienda. Aprueba estrategias. Seguimiento compromisos. Recibe resultados. |
| [[02 - Personas/Maria Angelica Navarro]] | Cliente Davivienda — Ed. Financiera | Jefe Educación Financiera. Aprueba estrategias. Seguimiento compromisos. Recibe resultados. |
| [[02 - Personas/Natalia Castaño]] | Ejecutiva Comercial AXXIS y Diners | Comercial revistas impreso/digital. Co-operadora logística Experiencias Corredores Davivienda con Paola Pantaleon. Reporta a Carolina y Catalina. |

---

## Proyectos Activos

- `[[05 - PMO/Portfolio Proyectos]]#Consolidacion-Plataformas` - Unificar 5 plataformas digitales. Owner: Jeison. P1. Estado: planificacion.
- `[[05 - PMO/Portfolio Proyectos]]#Revenue-Growth` - Revenue Diners 37% y AXXIS vs meta. Owner: Carolina. P1.
- `[[05 - PMO/Portfolio Proyectos]]#HubSpot` - CRM central para pipeline, forecast y reporting. Owner: Carolina. P1.
- `[[05 - PMO/Portfolio Proyectos]]#Alianzas-post-Privilegios` - Compensar perdida 70% ingresos Revistas. Owner: Paola Pantaleon. P1.
- `[[05 - PMO/Portfolio Proyectos]]#Plan-Comercial-Libros` - Canales de comercializacion. Owner: Nicolas. P2.
- `[[05 - PMO/Portfolio Proyectos]]#Estrategia-Digital` - Estrategia digital Gamma. Owner: Carolina. P2.

---

## Unidades de Negocio

| BU | Tipo | Estado Revenue | Riesgo |
|---|---|---|---|
| [[03 - Unidades de Negocio/AXXIS/AXXIS]] | Revista Arquitectura y Diseno | 66-76% meta | Amarillo |
| [[03 - Unidades de Negocio/Diners/Diners]] | Revista Cultura y Estilo | Digital 37% meta | Rojo |
| [[03 - Unidades de Negocio/Libros/Libros]] | Editorial gran formato | En desarrollo | Naranja |
| [[03 - Unidades de Negocio/Experiencias/Experiencias]] | Eventos, beneficios, alianzas | En desarrollo | Naranja |
| [[03 - Unidades de Negocio/Plataformas/Vision Davivienda/Vision Davivienda]] | Plataforma digital financiera | Funciona bien | Verde |
| [[03 - Unidades de Negocio/Plataformas/Educacion Financiera/Educacion Financiera]] | Plataforma educacion | Rezago critico | Rojo |

---

## Convenciones de Nomenclatura

- Minutas: `YYYY-MM-DD Persona - Tema.md` (espacio entre fecha y nombre, no guion)
- Personas: Nombre completo sin tildes (ej. `Catalina Obregon.md`, `Paola Pantaleon.md`)
- Proveedores: `Proveedor [Tipo] [Nombre].md` (ej. `Proveedor Agencia Leo.md`)
- Notas diarias: `YYYY-MM-DD.md` en `Daily/`
- Tareas: `YYYY-MM-DD Responsable - Titulo corto.md` en `Tasks/` (sin tildes en nombre de archivo)
- Logs: `Logs/YYYY-MM-DD.md` - append-only
- **REGLA:** Nunca usar caracteres especiales en nombres de archivo (tildes, doble punto, acentos). Usar version sin acento en el nombre del archivo, acento en el contenido.

## Alias y Nombres Informales Confirmados

| Nombre formal | Alias informal | Confirmado en |
|---|---|---|
| [[02 - Personas/Jeison Montero]] | Jason | Reunion CEO 2026-06-05 (descripcion de rol coincide) |

---

## Frontmatter Estandar por Nota

```yaml
---
date: YYYY-MM-DD
type: person | meeting | project | dashboard | bu | company | reference | index | log | log-pointer | research
tags: [tipo, subtipo]
related-people: [Nombre Apellido]      # sin tildes, igual que el nombre del archivo
related-projects: [Nombre-Proyecto]
sources: [url]                         # solo si aplica
ai-first: true
confidence: high | medium | stated | speculation
---

## For future Claude
[2-3 oraciones en ingles. Que es, por que importa, cuando es relevante.]

---
```

**Cobertura actual: 44/44 notas principales con frontmatter (100% — auditado 2026-06-13, +Natalia Castaño +Meeting Libros). Tasks/ contiene notas tipo task con frontmatter propio.**

## Sistema de Tareas

Cada tarea es un archivo `.md` independiente en `Tasks/`. Las vistas se generan automáticamente desde `Bases/Tasks.base` (equipo) y `Bases/Mis-Tareas.base` (solo Carolina).

**Frontmatter estándar de tarea:**
```yaml
---
date: YYYY-MM-DD          # fecha en que se originó la tarea
type: task
assigned-to: Nombre Apellido   # sin tildes, coincide con nombre del archivo de persona
unidad-de-negocio: Vision Davivienda | Educacion Financiera | AXXIS | Diners | Libros | Experiencias | Plataformas | Revistas | Empresa
area: Estrategia | Comercial | Legal | Alianzas | Editorial | Tecnologia | Analytics | Growth/Pauta | Cliente | Gestión | Operativo | Herramientas | CX/Plataforma | PMO/Tecnologia | Contenido | Coordinacion
prioridad: alta | media | baja
impacto-kpi: Revenue, UAM, Sesiones, Engagement, Alianzas, Renovaciones, Adopcion beneficios, Riesgo operativo, Leads Davivienda, Eficiencia operativa
status: pendiente | en-proceso | programada | hecho | cancelada
due: YYYY-MM-DD
source: "ruta a la reunion o informe de origen"
tags: [task, bu, area]
ai-first: true
---
```

**Regla de alimentación:** Después de cada reunión de equipo o informe de seguimiento, Claude extrae los próximos pasos y crea tareas en `Tasks/` sin que Carolina lo pida. Una tarea = un archivo.

---

## Skills → Tasks Auto-Feed

Cuando Claude corra cualquier skill de growth o análisis, al finalizar debe extraer las recomendaciones accionables y convertirlas en tareas del vault.

**Skills que activan este protocolo:** `growth-engine`, `seo-*`, `analytics`, `competitive-ads-extractor`, `ads-*`, `benchmark`, `yt-competitive-analysis`, `competitor-profiling`, `cro`, `content-strategy`.

**Protocolo (ejecutar sin que Carolina lo pida):**
1. Extrae las recomendaciones accionables del output del skill.
2. Por cada acción concreta: crea un archivo `Tasks/YYYY-MM-DD Responsable - Titulo.md`.
3. Usa `source: "skill:[nombre-del-skill]"` en el frontmatter.
4. Asigna responsable según área:
   - Growth / Pauta / SEO → `Carolina Ramirez`
   - Editorial / Contenido → `Ernesto Rodriguez`
   - Plataformas / Tech → `Jeison Montero`
   - Alianzas / Partnerships → `Paola Pantaleon`
   - Redes sociales → persona CM correspondiente
5. Prioridad según impacto en KPIs: alta si afecta Revenue o UAM, media si afecta Sesiones/Engagement, baja si es optimización interna.
6. Siempre incluir `impacto-kpi` con los KPIs concretos que mueve esa acción.

**Resultado esperado:** cada sesión de un skill de growth deposita 3-10 tareas en el vault listos para ver en la Vercel app.

---

## Git Sync Protocol

El vault está conectado a un repo privado de GitHub. Claude debe mantener los commits limpios después de operaciones relevantes.

**Comandos de sync (ejecutar desde `/Users/carolinaramirezvera/Documents/GammaVault`):**
```bash
# Después de crear/modificar tareas o reuniones
git add Tasks/ "06 - Meetings/" _CLAUDE.md index.md
git commit -m "tasks: [descripcion breve] — $(date +%Y-%m-%d)"
git push origin main
```

**Qué commitear:** `Tasks/`, `06 - Meetings/`, `_CLAUDE.md`, `index.md`, `00 - Executive Layer/`, `03 - Unidades de Negocio/`.

**Qué NO commitear:** `.claude/`, datos financieros específicos con nombres de clientes, credenciales.

**Cuándo hacer push:** Al final de cada sesión que haya creado o modificado notas. No hace falta push por cada tarea individual — agrúpalas.

---

## Auto-Save Rules

Claude debe guardar automaticamente SIN PREGUNTAR:
- Decisiones tomadas en conversacion - nota de proyecto relevante
- Personas nuevas mencionadas - `02 - Personas/` (crear stub si no existe)
- Tareas asignadas o comprometidas - `Tasks/` o seccion del proyecto
- Resultado de reuniones - `06 - Meetings/[BU]/`
- Actualizaciones de revenue o KPIs - CEO Dashboard

Claude debe PREGUNTAR ANTES de guardar:
- Cualquier dato financiero sensible especifico
- Notas personales o privadas
- Borrar o archivar notas existentes

---

## Propagation Rules

| Evento | Actualizar tambien |
|---|---|
| Nueva reunion | `06 - Meetings/[BU]/` + CEO Dashboard si es estrategica |
| Decision critica | Nota de proyecto + CEO Dashboard Decisiones Pendientes |
| Update de proyecto | `05 - PMO/Portfolio Proyectos` + nota de proyecto |
| Nueva persona | `02 - Personas/[Nombre].md` |
| Update revenue | CEO Dashboard tabla Revenue |
| Nueva alianza | Nota BU relevante + Portfolio |

---

## Do Not Touch

- `.obsidian/` - Configuracion de Obsidian. Nunca modificar.
- `.claude/` - Configuracion de Claude Code. Solo modificar con intencion.

---

## Estrategia 2026 - Contexto Critico

- **Privilegios Davivienda** cierra junio 2026 - era 70% ingresos Revistas. Plan urgente de alianzas.
- **Brecha revenue** $422 MM vs meta $1.465 MM en Revistas (a 15 jun 2026).
- **"Mundo D"** - nueva plataforma sombrilla del banco que unificara contenido, experiencias y relacionamiento para clientes. Revistas seran puerta de entrada.
- **CoCrea** - incentivo tributario vigente hasta septiembre 2026. Exige nivel minimo de circulacion.
- **5 plataformas fragmentadas** - costo duplicado. Consolidacion como proyecto P1.

---

## Historial de Auditorias y Cambios

| Fecha | Accion | Detalle |
|---|---|---|
| 2026-06-12 | Init vault | Creacion de _CLAUDE.md, index.md, notas base |
| 2026-06-13 | Auditoria completa | 8 wikilinks rotos corregidos |
| 2026-06-13 | Frontmatter | 27 notas sin frontmatter actualizadas → 100% cobertura |
| 2026-06-13 | Persona nueva | Estefania Ochoa Fonseca (CM Vision) creada y enlazada |
| 2026-06-13 | Alias confirmado | Jason = [[02 - Personas/Jeison Montero]] documentado |
| 2026-06-13 | Archivo corregido | `Proveedor Pauta digital Sebastian Diaz..md` → sin doble punto |
| 2026-06-13 | Organigrama | Estefania Ochoa agregada bajo Ernesto Rodriguez |
| 2026-06-13 | _CLAUDE.md | Estandares, alias, historial actualizados |
| 2026-06-13 | Persona nueva | Natalia Otalora (cliente estrategico Vision Davivienda) creada y enlazada |
| 2026-06-13 | Persona nueva | Maria Angelica Navarro (Jefe Ed. Financiera / cliente estrategico) creada y enlazada |
| 2026-06-13 | Experiencias.md | Archivo madre actualizado con estrategia completa de la reunion 2026-06-12 Carolina-Paola |
| 2026-06-13 | Frontmatter cobertura | 42/42 notas (100%) |
| 2026-06-13 | Sistema tareas | Tasks.base + Mis-Tareas.base rediseñados. 28 tareas creadas desde 4 reuniones. |
| 2026-06-13 | Informe plataforma | Mis Finanzas para Invertir mayo 2026 cargado. 3 tareas derivadas creadas. |
| 2026-06-13 | Informe plataforma | Mis Finanzas para Mi Negocio mayo 2026 cargado. 4 tareas derivadas creadas. Alerta Spira. |
| 2026-06-13 | Git sync | vault conectado a GitHub privado (gamma-vault). .gitignore configurado. Commit inicial 98 archivos. |
| 2026-06-13 | Skills protocol | Protocolo Skills → Tasks Auto-Feed añadido. Growth skills depositan tareas automaticamente. |
| 2026-06-13 | Google Sheets | Mis Tareas (Carolina, 18 tareas) y Equipo (33 tareas) creados en Google Drive via MCP. |
| 2026-06-13 | Persona nueva | Natalia Castaño (Ejecutiva Comercial AXXIS/Diners + logística Experiencias) creada y enlazada |
| 2026-06-13 | Nicolas Serna.md | Frontmatter duplicado corregido. For future Claude añadido. Wikilinks añadidos. Alianzas activas documentadas. |
| 2026-06-13 | Libros.md | Frontmatter duplicado corregido. For future Claude añadido. Wikilinks añadidos (Nicolas, Carolina/Jason, Ernesto, Paola Gordillo). |
| 2026-06-13 | Libros meeting | 06 - Meetings/libros/2026-06-11 estandarizada (frontmatter + For future Claude + wikilinks) |
| 2026-06-13 | Tareas Libros | 6 tareas creadas desde reunión 2026-06-11 (Nicolas Serna × 5, Paola Gordillo × 1) |
| 2026-06-13 | Experiencias meeting | Contenido corrupto (tabla Libros pegada por error) limpiado. PWA section header restaurado. |
| 2026-06-13 | Conexiones Natalia Castaño | Propagada a: Organigrama, index, _CLAUDE.md, AXXIS.md, Diners.md, Experiencias.md |

---

*Ultima actualizacion manual: 2026-06-13*
*Regenerar con: "Claude, actualiza mi _CLAUDE.md"*
