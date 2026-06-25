---
type: tasks-consolidado
unidad-de-negocio: AXXIS
last-updated: 2026-06-24
ai-first: true
tags: [tasks, axxis]
---

## For future Claude
Archivo consolidado de tareas activas y completadas para la unidad **AXXIS**. Revista de arquitectura, diseño y decoración. Foco actual: SEO técnico, suscriptores digitales, content creator. 84.8K clics orgánicos / año. Leer este archivo para conocer el estado actual de pendientes antes de cualquier sesión de trabajo con Carolina.

# Tasks — AXXIS

## ⏳ Pendientes

### Carolina Ramirez

- [ ] 🔴 **Sesion innovacion AXXIS** · due 2026-06-27 · Estrategia Editorial · KPI: Revenue, Renovaciones
  - Fecha: 2026-06-12
  - Fuente: [[06 - Meetings/Experiencias/2026-06-12 Carolina-Paola - Club Beneficios y Vivir la Revista]]
  Liderar sesión de innovación de AXXIS el **2026-06-27**. [[Catalina Obregon]] pidió explícitamente que Carolina lidere esta sesión con la misma metodología de la sesión DINERS (que concluyó: revista experiencial, 6 ediciones premium anuales). Objetivo: definir hacia dónde va AXXIS.

- [ ] 🟡 **Elevar solicitud content creator AXXIS a Catalina** · due 2026-06-27 · Contenido · KPI: Alcance digital, Suscriptores activos
  - Fecha: 2026-06-17
  - Fuente: [[06 - Meetings/AXXIS/2026-06-17 Carolina-Ramon - Reunion Inicial AXXIS]]
  Elevar a [[Catalina Obregon]] la solicitud de contratación de un content creator para AXXIS. Perfil: distinto al videógrafo actual, enfocado en volumen diario de contenido para redes sociales (recorridos locales, eventos, contenido orgánico del día a día). Si no hay cupo presupuestal para cargo fijo, proponer prestación de servicios con viáticos y desplazamiento cubiertos. ⚠️ Requiere aprobación y asignación de presupuesto por parte de Catalina — no aprobar ni registrar contratación hasta confirmación formal.

### Jeison Montero

- [ ] 🔴 **Investigar marketplace AXXIS estado y viabilidad legal** · due 2026-06-27 · Digital · KPI: Ingresos digitales, Suscriptores activos
  - Fecha: 2026-06-17
  - Fuente: [[06 - Meetings/AXXIS/2026-06-17 Carolina-Ramon - Reunion Inicial AXXIS]]
  Investigar el estado actual del marketplace de AXXIS y consultar el marco legal para determinar viabilidad de lanzar por fases. Fase 1 propuesta: catálogo sin pasarela de pagos. Pendiente revisión con asesor jurídico ("J") antes de comprometer recursos. Definir qué se necesita para avanzar y qué bloquea la fase 1.

### Juan David — SEO + Web

- [ ] 🔴 **Embed HubSpot form en landing /suscribirse/** · due 2026-07-07 · CRM · KPI: Leads capturados en HubSpot
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  Instalar el snippet `hubspot.js` en la landing de suscripción para capturar el lead antes de que el usuario llegue a Triario. Prerequisito: landing URL corregida a `/suscribirse/` (Jun 23). El formulario debe crear el contacto en HubSpot con lifecycle stage "Lead" y disparar WF-01 de nurturing automáticamente. Sin esto, 100% de los clics de Meta se pierden sin registro en CRM.

### Sebastián Díaz — Pauta Digital

- [ ] 🔴 **Activar Meta Lead Ads nativo → HubSpot** · due 2026-07-10 · CRM + Pauta · KPI: Leads desde pauta en HubSpot, CPL
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  Conectar las campañas de Meta Ads con HubSpot vía integración nativa (Meta → HubSpot en Configuración de la cuenta HubSpot). Cada lead que complete el Lead Ad form de Meta debe entrar automáticamente al CRM con source "Paid Social" y lifecycle "Lead". Actualmente: 702 clics en mayo, 0 leads registrados en HubSpot. CPL = ∞.

### Carolina Ramirez — HubSpot Journey Suscripción

- [ ] 🔴 **Limpiar lifecycle stages — migrar "Contacto" → "Lead"** · due 2026-07-07 · CRM · KPI: Funnel activo HubSpot
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  La etapa "Contacto" es una etapa custom que bloquea el funnel estándar de HubSpot. 64,162 contactos atrapados en ella sin ningún workflow activo. Migrar a "Lead" (etapa estándar) para que los workflows de nurturing empiecen a correr sobre toda la base.

- [ ] 🔴 **Crear WF-01 Lead Nurturing** · due 2026-07-10 · CRM · KPI: Conversion rate lead → suscriptor
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  Secuencia de 4 emails en 7 días para convertir leads en suscriptores. Hora 0: urgencia + valor. Día 2: testimonio real. Día 4: precio + beneficios. Día 7: cierre con bonus (acceso Anuario 2026). Trigger: contacto entra a lifecycle "Lead". Con la base actual de 77K leads y CR del 5%, son ~3,850 suscriptores potenciales sin gastar en nueva captación.

- [ ] 🔴 **Crear WF-03 Onboarding 30 días** · due 2026-07-15 · CRM · KPI: Activación, NPS día 30
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  5 emails post-compra: día 0 (bienvenida + acceso), día 3 (top 5 artículos), día 7 (beneficios ocultos), día 14 (equipo editorial), día 30 (NPS). Trigger: lifecycle → Customer. Los primeros 30 días determinan si el suscriptor renueva en año 1. Meta NPS >50.

- [ ] 🟠 **Crear WF-06 Renovación anticipada** · due 2026-07-20 · CRM · KPI: Renewal rate año 1
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  4 emails: 60 días antes (-60d primer aviso), -30d (contenido gancho), -15d (urgencia precio), -3d (cierre). Trigger: 60 días antes de `subscription_end_date`. Meta renewal rate año 1: 65-70%.

- [ ] 🔴 **Crear propiedades contacto HubSpot (7 propiedades)** · due 2026-07-07 · CRM · KPI: Datos para LTV y segmentación
  - Fecha: 2026-06-23
  - Fuente: [[task.md]] · HubSpot CRM Audit 2026-06-23
  Crear en HubSpot → Propiedades de Contacto: `subscription_type` (Digital/Impresa/Combo/Corporativa) · `subscription_start_date` · `subscription_end_date` · `ltv_cumulative_cop` · `nps_score` · `churn_risk` (Alto/Medio/Bajo) · `referral_source_contact`. Sin estas propiedades los workflows no pueden segmentar ni calcular LTV.
