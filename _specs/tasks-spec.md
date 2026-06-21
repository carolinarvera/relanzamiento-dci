---
date: 2026-06-20
type: reference
tags: [spec, tasks, meta]
ai-first: true
---

## For future Claude
Spec completa del sistema de tareas del vault. Leer al crear tareas nuevas o auditar el backlog. Vistas en `Bases/Tasks.base` (equipo) y `Bases/Mis-Tareas.base` (Carolina).

---

# Sistema de Tareas

Cada tarea = un archivo `.md` independiente en `Tasks/YYYY-MM-DD Responsable - Titulo.md`.

## Frontmatter de tarea

```yaml
---
date: YYYY-MM-DD          # fecha en que se originó la tarea
type: task
assigned-to: Nombre Apellido   # sin tildes, coincide con nombre del archivo de persona
unidad-de-negocio: Vision Davivienda | Educacion Financiera | AXXIS | Diners | Libros | Experiencias | Plataformas | Revistas | Empresa
area: Estrategia | Comercial | Legal | Alianzas | Editorial | Tecnologia | Analytics | Growth/Pauta | Cliente | Gestión | Operativo | Herramientas | CX/Plataforma | PMO/Tecnologia | Contenido | Coordinacion
prioridad: alta | media | baja
impacto-kpi: Revenue | UAM | Sesiones | Engagement | Alianzas | Renovaciones | Adopcion beneficios | Riesgo operativo | Leads Davivienda | Eficiencia operativa
status: pendiente | en-proceso | programada | hecho | cancelada
due: YYYY-MM-DD
source: "ruta a la reunión o informe de origen"   # o "skill:[nombre-del-skill]"
tags: [task, bu, area]
ai-first: true
---
```

## Asignación por área (auto-feed)

| Área | Responsable |
|---|---|
| Growth / Pauta / SEO | Carolina Ramirez |
| Editorial / Contenido | Ernesto Rodriguez |
| Plataformas / Tech | Jeison Montero |
| Alianzas / Partnerships | Paola Pantaleon |
| Redes sociales | CM correspondiente a la BU |

## Prioridad por impacto

- **Alta** — afecta Revenue o UAM
- **Media** — afecta Sesiones o Engagement
- **Baja** — optimización interna
