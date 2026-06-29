---
date: 2026-06-29
type: synthesis
tags: [vault, auditoria, duplicados, optimizacion, meta]
ai-first: true
sources:
  - "Escaneo completo vault 2026-06-29 — 130+ archivos .md"
---

> **For future Claude:** Auditoría de duplicados y fragmentación del vault GammaVault a 2026-06-29. Identifica 6 grupos de archivos con solapamiento, clasifica por severidad, y propone acciones concretas. No modifica archivos fuente — solo diagnóstica. Ejecutar acciones una por una con aprobación de Carolina.

# Auditoría Vault — Duplicados y Optimización
**Fecha:** 2026-06-29 | **Archivos escaneados:** 130+ | **Owner:** [[02 - Personas/Carolina Ramirez]]

---

## Resumen ejecutivo

| Severidad | Grupos | Acción |
|---|---|---|
| 🔴 Duplicado real | 2 grupos | Eliminar copia vieja |
| 🟠 Fragmentación evitable | 3 grupos | Consolidar en 1 archivo |
| 🟡 Overlap parcial | 3 grupos | Delimitar scope de cada uno |
| 🟢 OK por diseño | 1 grupo | No tocar |

---

## 🔴 Duplicados reales (eliminar una copia)

### 1. Visión NorthStar — doble ubicación
- **Copia 1 (VIGENTE):** `Dashboard/Vision_01_NorthStar_2026-06.md` — date: 2026-06-24, actualizado con datos reales, preamble rico
- **Copia 2 (OBSOLETA):** `Informes/2026/Vision_01_NorthStar_2026-06.md` — date: 2026-06-16, versión anterior, fuentes más viejas
- **Acción:** Eliminar la copia en `Informes/2026/`. Mantener `Dashboard/`.

### 2. Visión WebCRO — doble ubicación
- **Copia 1 (VIGENTE):** `Dashboard/Vision_03_WebCRO_2026-06.md`
- **Copia 2 (OBSOLETA):** `Informes/2026/Vision_02_WebCRO_2026-06.md`
- **Acción:** Eliminar la copia en `Informes/2026/`.

### 3. Inteligencia Competitiva Revistas — doble ubicación
- **Copia 1:** `04 - Growth System/2026-06-21 Inteligencia Competitiva Marketing Revistas.md` — type: research
- **Copia 2:** `Research/Deep/2026-06-21 - inteligencia-competitiva-marketing-revistas-axxis-diners.md` — type: research-deep
- **Acción:** Revisar si son idénticos o complementarios. Si idénticos, eliminar el de `Growth System` y dejar `Research/Deep/` (más específico). Si complementarios, agregar cross-link entre ambos.

---

## 🟠 Fragmentación evitable (consolidar)

### 4. Libros H2 2026 — 3 archivos de plan para el mismo tema
- `Plan-Accion-Libros-H2-2026.md` (541 líneas) — type: plan-accion
- `Plan-Marketing-Libros-H2-2026.md` (435 líneas) — type: plan-marketing  
- `Plan-Trabajo-Libros-H2-2026.md` (162 líneas) — type: plan-trabajo
- **Problema:** Claude no sabe cuál consultar para qué pregunta. Triple mantenimiento.
- **Acción recomendada:** Consolidar en `Libros/Plan-Maestro-Libros-H2-2026.md` con secciones `## Plan de Marketing`, `## Plan de Acción`, `## Plan de Trabajo`. Archivar los 3 originales en `Libros/Archivo/`.

### 5. Educación Financiera — 2 estrategias de contenidos
- `Estrategia-Contenidos-EF-2026.md` (639 líneas) — versión extensa
- `Estrategia-Contenidos-EF-Ejecutiva-2026.md` (120 líneas) — versión corta/resumen
- **Problema:** La ejecutiva es un subset de la extensa. Mantenimiento doble.
- **Acción:** Convertir `Ejecutiva` en `## Resumen ejecutivo` dentro de la extensa. Eliminar archivo ejecutiva separado.

### 6. Reunión Experiencias 2026-06-12 — duplicado de minuta
- `2026-06-12 Carolina-Paola - Club Beneficios y Vivir la Revista.md` (158 líneas)
- `2026-06-12-experiencias-Paola-Pantaleon.md` (71 líneas)
- **Probable causa:** La segunda es un borrador o duplicado de la primera (misma fecha, mismos participantes).
- **Acción:** Leer ambas y consolidar en la más completa (158 líneas). Eliminar el borrador.

---

## 🟡 Overlap parcial (delimitar scope)

### 7. Visión SEO — 2 archivos con overlap temático
- `Vision_EstrategiaSEO_2026-06.md` (306 líneas) — estrategia SEO pura
- `Vision_EstrategiaSEO_CRO_2026-06.md` (564 líneas) — SEO + CRO combinado
- **Diagnóstico:** La segunda parece una expansión de la primera, no un duplicado. Diferente scope (SEO vs SEO+CRO).
- **Acción:** Verificar que `Vision_EstrategiaSEO_2026-06.md` no esté obsoleta. Si sí, archivar y dejar solo `Vision_EstrategiaSEO_CRO_2026-06.md`. Si no, agregar `## Relacionado` con wikilink bidireccional.

### 8. AXXIS — 3 archivos estratégicos con roles poco claros
- `AXXIS.md` (type: bu) — ficha BU principal
- `AXXIS Dashboard Estratégico.md` (type: dashboard) — KPIs y métricas
- `Estrategia Growth AXXIS 2026.md` (type: estrategia) — plan de crecimiento
- **Diagnóstico:** Los roles son distintos pero no hay cross-links entre ellos. Claude puede generar respuestas contradictorias si lee uno y no los otros.
- **Acción:** Agregar en `AXXIS.md` una sección `## Documentos relacionados` con wikilinks a los otros dos. No consolidar — los 3 son válidos por diseño.

### 9. Tasks BU (archivos grandes) vs Tasks individuales (archivos fechados)
- `Tasks/AXXIS.md`, `Tasks/Revistas.md` (373 líneas!), `Tasks/Vision Davivienda.md` (220 líneas) — acumuladores sin fecha clara
- `Tasks/2026-06-22 Estefania...`, `Tasks/2026-06-24 Nicolas...` — tareas bien estructuradas por spec
- **Diagnóstico:** Los archivos BU sin fecha son listas de tareas acumuladas que crecen sin control. `Revistas.md` con 373 líneas es una señal de riesgo.
- **Acción:** Revisar `Tasks/Revistas.md` y `Tasks/Vision Davivienda.md`. Cerrar tareas completadas. Migrar tareas activas a archivos fechados por spec. Considerar archivar los BU-tasks o convertirlos en vistas/índices.

---

## 🟢 OK por diseño (no tocar)

### 10. Informes mensuales web AXXIS y Diners
Los archivos `2026-01` a `2026-05` en `Informes/2026/` son registros históricos mes a mes. No son duplicados — son el archivo cronológico. Correcto mantenerlos separados.

---

## Acciones priorizadas

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Eliminar Vision NorthStar duplicado en Informes/ | 2 min | Alto |
| 2 | Eliminar Vision WebCRO duplicado en Informes/ | 2 min | Alto |
| 3 | Verificar y consolidar Inteligencia Competitiva Revistas | 15 min | Medio |
| 4 | Consolidar 3 planes Libros en Plan-Maestro | 30 min | Alto |
| 5 | Absorber EF-Ejecutiva dentro de EF-2026 completa | 10 min | Medio |
| 6 | Consolidar minuta Experiencias 2026-06-12 | 10 min | Bajo |
| 7 | Cross-links entre AXXIS.md / Dashboard / Estrategia | 5 min | Medio |
| 8 | Limpiar Tasks/Revistas.md (373 líneas) | 20 min | Alto |

**Nota:** No ejecutar automáticamente. Confirmar cada acción con Carolina antes de eliminar o mover archivos.
