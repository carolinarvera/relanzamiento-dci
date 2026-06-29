---
type: tasks-master
scope: all-bus
periodo: H2 2026
last-updated: 2026-06-29
ai-first: true
tags: [tasks, master, h2-2026, axxis, diners, libros, experiencias, ediciones-gamma]
---

## For future Claude
**THIS IS THE ONLY SOURCE OF TRUTH FOR ALL TASKS.** Do not look for tasks in AXXIS.md, Diners.md, Revistas.md, Libros.md or Experiencias.md — those files are now context-only stubs. Adding a task anywhere else creates duplication and hallucination risk. Structure: (1) Ejecución Inmediata = operational tasks with due dates July 2026; (2) H2 strategic tasks by BU = 122 initiatives. Blockers: #7LI and #12LI (precios Libros — Nicolas Serna). Urgentes: 9 tareas. HTML para equipo: `00 - Executive Layer/Tasks-H2-2026-Equipo.html`.

---

# Plan Maestro de Tareas — H2 2026

---

## Ejecución Inmediata — Julio 2026

> Tareas operativas con fecha límite definida. Fuente: reuniones y auditorías jun 2026.

### Carolina Ramirez

- [ ] 🔴 **Limpiar lifecycle stages HubSpot — migrar "Contacto" → "Lead"** · due 2026-07-07 · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · 64,162 contactos atrapados en etapa custom que bloquea todo workflow. Sin esto, nurturing nunca corre.

- [ ] 🔴 **Crear propiedades contacto HubSpot (7 propiedades)** · due 2026-07-07 · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · `subscription_type` · `subscription_start_date` · `subscription_end_date` · `ltv_cumulative_cop` · `nps_score` · `churn_risk` · `referral_source_contact`. Prerequisito de workflows de renovación y LTV.

- [ ] 🔴 **Crear WF-01 Lead Nurturing AXXIS** · due 2026-07-10 · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · Secuencia 4 emails / 7 días. Trigger: lifecycle = Lead. Con 77K leads y CR 5% = ~3,850 suscriptores sin gasto adicional.

- [ ] 🔴 **Crear WF-03 Onboarding 30 días** · due 2026-07-15 · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · 5 emails post-compra: D+0 bienvenida · D+3 top artículos · D+7 beneficios · D+14 equipo editorial · D+30 NPS. Meta NPS >50.

- [ ] 🔴 **Aplicar WF-01 nurturing — adaptar para base Diners** · due 2026-07-15 · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · Una vez activo en AXXIS, adaptar tono a Diners (gastronomía, cultura, lifestyle). Bases AXXIS y Diners NUNCA mezcladas en HubSpot.

- [ ] 🟠 **Crear WF-06 Renovación anticipada** · due 2026-07-20 · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · 4 emails: -60d primer aviso · -30d gancho contenido · -15d urgencia precio · -3d cierre. Meta renewal rate año 1: 65-70%.

### Juan David

- [ ] 🔴 **Embed HubSpot form en landing /suscribirse/ (AXXIS)** · due 2026-07-07 · CRM + Web
  Fuente: HubSpot CRM Audit 2026-06-23 · Sin esto, 100% de clics Meta se pierden sin registro en CRM. Prerequisito: landing URL ya corregida a `/suscribirse/`.

### Sebastián Díaz

- [ ] 🔴 **Activar Meta Lead Ads nativo → HubSpot** · due 2026-07-10 · CRM + Pauta
  Fuente: HubSpot CRM Audit 2026-06-23 · 702 clics en mayo, 0 leads en HubSpot. CPL = ∞. Integrar vía Meta → HubSpot en Configuración de cuenta.

### Natalia Castaño

- [ ] 🔴 **Facturar 9 deals "Listo para facturar" en HubSpot e-Payco** · URGENTE · Revenue
  Fuente: HubSpot CRM Audit 2026-06-23 · Montos: $208K–$322K COP c/u. Ingresos ya cobrados sin factura. Coordinar con Carolina.

### Paola Pantaleon

- [ ] 🔴 **Reunión stakeholders — presentar nuevo modelo Experiencias** · due 2026-07-04 · Dirección
  Fuente: Reunión Unidad Experiencias 2026-06-17 · Dos ramas: Corporativa + Always On. Solicitar a Catalina contacto en Davivienda para viabilidad de alianzas corporativas.

### Paola Nossa

- [ ] 🔴 **Propuestas segmentadas por industria — Experiencias corporativas** · due 2026-07-04 · Comercial
  Fuente: Reunión Unidad Experiencias 2026-06-17 · Sectores: banca Grupo Bolívar (NO competencia Davivienda), automotriz, hoteles, emprendedores. Incluir métricas, perfil VIP, casos de éxito, formatos.

### Nicolas Serna

- [ ] 🔴 **Criterios selección aliados + estructura niveles Club** · due 2026-07-04 · Alianzas
  Fuente: Reunión Unidad Experiencias 2026-06-17 · Formalizar condiciones exclusividad, descuentos y comisiones por nivel Básico/Premium/Plus.

### Natalia Castaño — Experiencias

- [ ] 🔴 **Esquema de comisiones + listado prospección corporativa** · due 2026-07-04 · Contratos
  Fuente: Reunión Unidad Experiencias 2026-06-17 · (1) Modelo de incentivos comerciales con área financiera. (2) Lista inicial de prospectos: Seguros, Automotriz, Constructoras, Farmacéuticas.

---

## Resumen ejecutivo

| BU | Total | Urgente | Bloqueador |
|----|-------|---------|------------|
| AXXIS | 21 | — | — |
| Diners | 20 | — | — |
| Compartidas AX+DI | 45 | 2 | — |
| Ediciones Gamma | 5 | 2 | — |
| Libros | 16 | 3 | 2 |
| Experiencias | 15 | 2 | — |
| **Total** | **122** | **9** | **2** |

**Bloqueadores activos:**
- `#7LI` Definir precios paquetes corporativos — Nicolas Serna
- `#12LI` Definir precios Paquete Legado y Centenario — Nicolas Serna

**Archivos BU:** [[Tasks/AXXIS]] · [[Tasks/Diners]] · [[Tasks/Revistas]] · [[Tasks/Libros]] · [[Tasks/Experiencias]]
**Herramienta equipo:** [[00 - Executive Layer/Tasks-H2-2026-Equipo]]

---

## AXXIS — 21 tareas

> Pipeline: Consideración → Atracción → Conversión → Retención → Infraestructura
> Ver detalle completo: [[Tasks/AXXIS]]

### Paola Nossa — Comercial

- [ ] 🔴 `#1AX` **Recopilar datos e insumos AXXIS Media Kit** · NS01 · Consideración
  Métricas web GA4, casos de éxito de anunciantes actuales y precios de paquetes bundle.

- [ ] 🔴 `#2AX` **Producir AXXIS Media Kit** · NS01 · Consideración
  Documento de venta con bundles, métricas, propuesta de valor y formatos. Ernesto produce el copy; Paola Nossa y equipo comercial coordinan.

### Paola Gordillo — Redes Sociales

- [ ] 🔴 `#3AX` **LinkedIn AXXIS — optimizar página empresa** · NS01 · Atracción
  Bio, foto, links y highlights con datos de audiencia del sector arq/diseño para posicionamiento B2B.

- [ ] 🔴 `#4AX` **Optimizar perfiles de redes sociales AXXIS** · NS01 · Atracción
  Coherencia visual y de bio entre IG, Facebook, LinkedIn y YouTube.

- [ ] 🔴 `#11AX` **Publicación en redes y newsletter — AXXIS** · NS03 · Atracción
  Ejecución del calendario en todos los canales.

- [ ] 🟡 `#12AX` **Métricas de comunidad — baseline AXXIS** · NS03 · Infraestructura
  Levantar seguidores, alcance orgánico y engagement rate por plataforma.

### Juan David + Ernesto Rodriguez — Digital / SEO

- [ ] 🔴 `#5AX` **Landing page suscripción AXXIS (P0)** · NS02 · Conversión
  URL limpia, propuesta de valor, formulario HubSpot y social proof. Juan David desarrolla; Ernesto produce el copy.

- [ ] 🔴 `#16AX` **Plan de contenido SEO editorial — AXXIS** · NS03 · Atracción
  Artículos evergreen arq/diseño. Juan David ejecuta; Ernesto valida la calidad editorial.

- [ ] 🟡 `#17AX` **Embeds y reproductor web — AXXIS** · NS03 · Infraestructura
  Integrar reproductores de video y podcast en axxis.com.co. Juan David implementa.

- [ ] 🔴 `#18AX` **Optimización técnica web AXXIS** · NS03 · Infraestructura
  Core Web Vitals, velocidad mobile, metadatos y schema markup.

- [ ] 🔴 `#19AX` **Auditoría SEO AXXIS** · NS03 · Infraestructura
  Diagnóstico completo: tráfico orgánico, keywords, errores técnicos y velocidad.

- [ ] 🟡 `#20AX` **Link building y autoridad de dominio — AXXIS** · NS03 · Atracción
  Alianzas con medios especializados arq/diseño para backlinks.

### Ernesto Rodriguez + Paola Gordillo — Contenido

- [ ] 🔴 `#6AX` **Plan de Newsletter AXXIS — Suscriptores** · NS02 · Retención
  Newsletter para suscriptores activos. Objetivo: retención y renovación.

- [ ] 🔴 `#7AX` **Plan de Newsletter AXXIS — Lectores sin suscripción** · NS02 · Consideración
  Newsletter gratuito para lectores no-suscriptores. Objetivo: convertir en suscriptor.

- [ ] 🔴 `#8AX` **Ejes de contenido por red social — AXXIS** · NS03 · Atracción
  Pilares temáticos por plataforma. Ernesto define los ejes editoriales.

- [ ] 🔴 `#9AX` **Calendarización de temas AXXIS** · NS03 · Atracción
  Parrilla mensual con temas, fechas, formato y plataforma.

- [ ] 🔴 `#10AX` **Desarrollo de formatos AXXIS (reels, stories, posts)** · NS03 · Atracción
  Ernesto produce el copy y guiones; Paola Gordillo coordina la producción visual.

### Paola Nossa + Ernesto + Mateo Arias Ortiz — Formatos Digitales

- [ ] 🔴 `#13AX` **"Proyectos que hablan" — Podcast AXXIS** · NS03 · Atracción
  Audio + video. YouTube, Spotify y cápsulas 60 seg para IG/TikTok. 1 ep/mes. Invitados = anunciantes potenciales.

- [ ] 🔴 `#14AX` **"Connect And Collab" — Conversatorio AXXIS** · NS03 · Atracción
  Conversatorio presencial + streaming. Empresa protagonista = anunciante.

- [ ] 🔴 `#15AX` **Calendario de producción formatos digitales H2 — AXXIS** · NS03 · Atracción
  Qué se produce, cuándo y con qué presupuesto. Priorizar formatos con potencial de patrocinio.

### Sebastián Díaz — Pauta

- [ ] 🔴 `#21AX` **Pauta brand awareness AXXIS** · NS03 · Atracción
  Campañas visibilidad en Meta a audiencias frías. Objetivo: alcance.

---

## Diners — 20 tareas

> Pipeline: Consideración → Atracción → Conversión → Retención → Infraestructura
> Ver detalle completo: [[Tasks/Diners]]

### Paola Nossa — Comercial

- [ ] 🔴 `#1DI` **Recopilar datos e insumos Diners Media Kit** · NS01 · Consideración
  Métricas web GA4, casos de éxito, precios bundle, audiencia, tiraje y calendario de eventos 2026.

- [ ] 🔴 `#2DI` **Producir Diners Media Kit (16 slides)** · NS01 · Consideración
  Ernesto produce el copy; Paola Nossa coordina. Incluir casos de éxito por sector.

- [ ] 🔴 `#3DI` **Media Kit con formatos digitales segmentados — Diners** · NS01 · Consideración
  Catálogo segmentado: lujo, licores, gastronomía, cultura.

- [ ] 🟡 `#4DI` **One-pager ejecutivo Diners (A4)** · NS01 · Consideración
  Resumen una página para reuniones rápidas. Ernesto produce el copy.

### Paola Gordillo — Redes Sociales

- [ ] 🔴 `#5DI` **LinkedIn Diners — optimizar página empresa** · NS01 · Atracción
  Bio, foto, links y highlights para posicionamiento B2B cultural/gastronómico.

- [ ] 🔴 `#6DI` **Optimizar perfiles de redes sociales Diners** · NS01 · Atracción
  Coherencia visual y de bio entre IG, Facebook, LinkedIn y YouTube.

- [ ] 🟡 `#13DI` **Métricas de comunidad — baseline Diners** · NS03 · Infraestructura
  Seguidores, alcance orgánico y engagement rate por plataforma.

### Juan David + Ernesto — Digital / SEO

- [ ] 🔴 `#7DI` **Landing page suscripción Diners (P0)** · NS02 · Conversión
  Adaptada a identidad Diners. Formulario HubSpot con segmentación Diners.

- [ ] 🟡 `#16DI` **Embeds y reproductor web — Diners** · NS03 · Infraestructura
  Integrar reproductores en revistadiner.com. Juan David implementa.

- [ ] 🔴 `#17DI` **Optimización técnica web Diners** · NS03 · Infraestructura
  Core Web Vitals, velocidad mobile, metadatos y schema markup.

- [ ] 🔴 `#18DI` **Auditoría SEO Diners** · NS03 · Infraestructura
  Diagnóstico completo: tráfico orgánico, keywords, errores y velocidad.

- [ ] 🟡 `#19DI` **Link building y autoridad de dominio — Diners** · NS03 · Atracción
  Alianzas con medios gastronómicos y culturales para backlinks.

- [ ] 🔴 `#15DI` **Plan de contenido SEO editorial — Diners** · NS03 · Atracción
  Artículos evergreen gastronomía/cultura/viajes. Juan David ejecuta; Ernesto valida.

### Ernesto Rodriguez + Paola Gordillo — Contenido

- [ ] 🔴 `#8DI` **Plan de Newsletter Diners — Suscriptores** · NS02 · Retención
  Newsletter para suscriptores activos. Objetivo: retención y renovación.

- [ ] 🔴 `#9DI` **Plan de Newsletter Diners — Lectores sin suscripción** · NS02 · Consideración
  Newsletter gratuito para no-suscriptores. Objetivo: convertir en suscriptor.

- [ ] 🔴 `#10DI` **Ejes de contenido por red social — Diners** · NS03 · Atracción
  IG (gastronomía) · TikTok (pilot julio) · LinkedIn (editorial) · YouTube.

- [ ] 🔴 `#11DI` **Calendarización de temas Diners** · NS03 · Atracción
  Parrilla mensual. Incluye pilot TikTok julio 2026.

- [ ] 🔴 `#12DI` **Desarrollo de formatos Diners (reels, stories, posts)** · NS03 · Atracción
  Ernesto produce el copy y guiones; Paola Gordillo coordina. Incluye pilot TikTok.

### Ernesto + Simon Granja — Formatos Digitales

- [ ] 🔴 `#14DI` **Calendario de producción formatos digitales H2 — Diners** · NS03 · Atracción
  Priorizar La Mesa de Diners y Detrás de la barra. Ernesto coordina; Simón Granja ejecuta.

### Sebastián Díaz — Pauta

- [ ] 🔴 `#20DI` **Pauta brand awareness Diners** · NS03 · Atracción
  Campañas visibilidad en Meta a audiencias frías. Ernesto produce los copies.

---

## Compartidas AXXIS + Diners — 45 tareas

> Aplican a ambas revistas. Ver detalle completo: [[Tasks/Revistas]]

### Equipo Comercial + Paola Nossa — Venta B2B

- [ ] 🔴 `#1RE` **Listado de clientes y segmentación** · NS01 · Infraestructura
  Clasificar base actual: recurrentes, inactivos, nuevas categorías.

- [ ] 🔴 `#2RE` **Propuesta de paquetes comerciales flexibles** · NS01 · Consideración
  Paquetes de bajo riesgo para marcas nuevas con opción de escalar. Bundles print + digital + redes.

- [ ] 🔴 `#3RE` **Ofertas de entrada "rompe hielo" con opción de upgrade** · NS01 · Conversión
  Oferta accesible para marcas que nunca han pautado. Escalable a paquete mayor.

- [ ] 🟡 `#10RE` **Revisión tarifaria y kits de venta (combos print + digital)** · NS01 · Infraestructura
  Analizar tarifarios actuales y kits.

### Ernesto Rodriguez — Argumentos de Venta

- [ ] 🔴 `#4RE` **Generar informes para fortalecer argumentos de venta** · NS01 · Consideración
  Análisis de tendencias sectoriales, inversión de competidores y estudios de lecturabilidad.

- [ ] 🔴 `#6RE` **Casos de contenido B2B LinkedIn** · NS01 · Consideración
  Casos de éxito adaptados para LinkedIn.

- [ ] 🔴 `#7RE` **Media Kit interactivo — versión digital navegable** · NS01 · Consideración
  El anunciante explora formatos, audiencias y precios desde un link. Juan David desarrolla.

- [ ] 🔴 `#8RE` **Nuevos formatos digitales B2B** · NS01 · Atracción
  Webinars co-patrocinados, masterclasses y transmisiones en vivo.

- [ ] 🔴 `#9RE` **Eventos y Experiencias B2B co-patrocinados** · NS01 · Atracción
  Webinars y masterclasses con anunciantes como protagonistas.

### Carolina — Comercial

- [ ] 🔴 `#5RE` **Identificar sectores con mayor inversión y asignar leads** · NS01 · Consideración
  Mapear sectores con mayor inversión en pauta. Cruzar con audiencia de cada revista.

### Paola Pantaleon — Alianzas

- [ ] 🔴 `#11RE` **Estrategia Macropauta y Alianzas banco (post-Privilegios Davivienda)** · NS01 · Fidelización
  Estructurar ofertas donde Gamma aporte audiencia y los aliados del banco asuman beneficios.

### Jeison Montero + Carolina — CRM y Journeys

- [ ] 🔴 `#12RE` **Auditar HubSpot — config y segmentación actual** · NS02 · Infraestructura
  Cargas 'dummy' sin separación AXXIS/Diners. Auditar estructura, propiedades y listas.

- [ ] 🔴 `#13RE` **Configurar journey HubSpot suscriptores** · NS02 · Infraestructura
  Email bienvenida (D+0), onboarding (D+3, D+7), alerta renovación (-15 días).

- [ ] 🔴 `#14RE` **Planear comunicaciones omnicanal + customer journey** · NS02 · Consideración
  Mapear todos los touchpoints: email, WhatsApp, RRSS, web.

- [ ] 🔴 `#15RE` **Automatizar alertas de renovación HubSpot (-15 días)** · NS02 · Retención
  Email + WhatsApp automáticos 15 días antes del vencimiento.

- [ ] 🔴 `#16RE` **Funnel ManyChat — lead a suscripción** · NS02 · Consideración
  Captura desde IG/FB vía ManyChat. Paola Gordillo gestiona; Jeison integra con HubSpot.

- [ ] 🟡 `#17RE` **Automatización IA + WhatsApp** · NS02 · Consideración
  Primer nivel por IA (renovaciones, FAQs). Escala a humano para casos complejos.

- [ ] 🔴 🚨 `#18RE` **[URGENTE] Revisar tokenización IO — validar renovación automática** · NS02 · Infraestructura
  Sospecha activa: la renovación automática vía pasarela IO no opera.

- [ ] 🔴 `#19RE` **Plan newsletter como puerta de entrada a suscripción** · NS02 · Consideración
  Secuencia: newsletter (sem 1) → contenido exclusivo (sem 2) → oferta suscripción (sem 3).

- [ ] 🔴 `#20RE` **Definir propuesta de valor diferenciada para retener suscriptores** · NS02 · Consideración
  Qué obtiene el suscriptor que no obtiene el lector casual.

- [ ] 🔴 `#26RE` **Validar estructura de comunicaciones y customer journey** · NS02 · Infraestructura
  Ejecutar ANTES de cargar bases en HubSpot.

- [ ] 🔴 `#27RE` **Definir estrategia de renovación HubSpot** · NS02 · Retención
  Acciones automatizadas + intervención humana si no responde.

- [ ] 🟡 `#28RE` **Notificar inicio migración base de datos histórica** · NS02 · Infraestructura
  Avisar a Carolina cuando comience la carga a HubSpot.

- [ ] 🔴 `#29RE` **SLA de atención RRSS — tiempos de respuesta** · NS02 · Infraestructura
  Meta: máximo 3 horas para consultas en Instagram.

- [ ] 🔴 `#30RE` **Integración HubSpot ↔ pasarela IO** · NS02 · Infraestructura
  Cuando se confirma un pago en IO, el contacto se actualiza a 'Cliente' en HubSpot.

- [ ] 🔴 `#31RE` **Embeds formularios HubSpot en webs** · NS02 · Infraestructura
  Integrar formularios en axxis.com.co y revistadiner.com.

- [ ] 🔴 `#32RE` **Pixel Meta → HubSpot: sincronizar audiencias** · NS02 · Infraestructura
  Sebastián gestiona Meta, Juan David el pixel web, Jeison las listas en HubSpot.

- [ ] 🔴 `#24RE` **[URGENTE] Solicitar base de datos de renovaciones pendientes** · NS02 · Retención
  Pedir a María Claudia la base con suscripciones vencidas o próximas a vencer.

### Sebastián Díaz — Pauta / Campañas

- [ ] 🔴 `#21RE` **Campaña remarketing a suscriptores vencidos** · NS02 · Retención
  Segmento extraído de base IO con vencimiento reciente. Oferta de reactivación.

- [ ] 🔴 `#22RE` **Campaña winback — reactivar suscriptores inactivos** · NS02 · Retención
  Oferta escalonada: 30d → 60d → 90d+.

- [ ] 🔴 `#23RE` **Piezas remarketing y display suscripciones** · NS02 · Retención
  Mínimo 3 piezas por tipología para usuarios que interactuaron sin convertir.

- [ ] 🔴 `#33RE` **Pauta Meta conversión suscripciones** · NS02 · Conversión
  Campañas conversión. LAL desde base de suscriptores. Creativos diferenciados AXXIS vs Diners.

### Ernesto + Paola Gordillo — Distribución Contenido

- [ ] 🔴 `#25RE` **Estrategia de contenido orgánico — CTA a suscripción** · NS02 · Consideración
  Stories y posts con link directo a landing.

- [ ] 🟡 `#34RE` **Estrategia de distribución multiplataforma** · NS03 · Atracción
  YouTube (largo), Spotify (audio), IG/TikTok (cortos). Adaptación por plataforma.

- [ ] 🟡 `#35RE` **Presencia en medios externos y relaciones con prensa** · NS03 · Atracción
  Notas sobre ediciones especiales, eventos y lanzamientos.

### Jeison Montero + Carolina — HubSpot Config

- [ ] 🔴 `#36RE` **Crear propiedad HubSpot "Revista de interés"** · HubSpot · Infraestructura
  Propiedad AXXIS / Diners / Ambas. Crítica para disparar journeys diferenciados.

- [ ] 🔴 `#37RE` **Separar listas B2B y B2C en HubSpot** · HubSpot · Infraestructura
  Crear listas limpias: anunciantes (B2B) vs suscriptores (B2C).

- [ ] 🔴 `#38RE` **Configurar lead scoring B2B en HubSpot** · HubSpot · Infraestructura
  Puntuación por comportamiento: email (+5), visita (+3), media kit (+10), cotización (+20).

- [ ] 🔴 `#39RE` **Configurar pipeline de deals B2B** · HubSpot · Infraestructura
  Etapas: Prospecto → Contactado → Propuesta → Negociación → Ganado/Perdido.

- [ ] 🔴 `#40RE` **Configurar alerta anunciantes inactivos +45 días** · HubSpot · Retención
  Notificar al ejecutivo comercial si un anunciante no tiene actividad en 45 días.

- [ ] 🔴 `#41RE` **[Tarea principal] Emails en el funnel HubSpot** · HubSpot · Consideración
  Ernesto produce el copy. Jeison y Juan David configuran. Subtareas: D+0 Bienvenida · D+3 Caso de éxito · D+7 Oferta rompe hielo · Alerta -15 días · Winback 3 toques.

- [ ] 🔴 `#42RE` **Configurar score de engagement B2C** · HubSpot · Infraestructura
  Puntuar comportamiento del suscriptor. Identifica suscriptores en riesgo de churn.

- [ ] 🔴 `#43RE` **Workflow post-cierre B2B** · HubSpot · Retención
  Al marcar un deal ganado: email bienvenida al anunciante + cronograma publicación.

- [ ] 🔴 `#44RE` **Integración ManyChat → HubSpot** · HubSpot · Infraestructura
  Leads desde IG/FB entran como nuevos contactos con propiedad 'fuente: ManyChat'.

- [ ] 🟡 `#45RE` **Integración WhatsApp (Menat) ↔ HubSpot** · HubSpot · Infraestructura
  Conversaciones de WhatsApp registradas en el timeline del contacto en HubSpot.

---

## Ediciones Gamma — 5 tareas

> Ver detalle: [[03 - Unidades de Negocio/Ediciones Gamma]]

### Carolina

- [ ] 🔴 🚨 `#2EG` **[URGENTE] Club de Beneficios — definir nombre inspiracional** · NS01 · Fidelización
  Sin nombre no hay material externo ni propuesta para aliados. CRÍTICO para todo el lanzamiento.

- [ ] 🔴 🚨 `#3EG` **[URGENTE] CoCrea — gestionar incentivo tributario hasta septiembre 2026** · NS01 · Atracción
  Incentivo tributario Davivienda que vence sep 2026. Definir qué actividades califican.

- [ ] 🔴 `#4EG` **"Mundo D" — alineación Gamma con plataforma sombrilla Davivienda** · NS01 · Atracción
  Revistas serán puerta de entrada al ecosistema Mundo D. Definir rol y monetización.

### Carolina + Ernesto Rodriguez

- [ ] 🔴 `#1EG` **Estrategia contenidos sombrilla Ediciones Gamma — pauta Meta** · NS01 · Conversión
  Anunciar libros/colecciones específicas. LAL de suscriptores AXXIS y Diners como audiencia base.

- [ ] 🟡 `#5EG` **Brand guidelines Ediciones Gamma — identidad sombrilla** · NS01 · Infraestructura
  Guía de identidad visual y verbal para alinear AXXIS, Diners, Libros y Experiencias.

---

## Libros — 16 tareas

> Ver detalle completo: [[Tasks/Libros]] · [[03 - Unidades de Negocio/Libros/Libros]]

### ⚠️ BLOQUEADORES — Nicolas Serna (resolver primero)

- [ ] 🔴 🚧 `#7LI` **[BLOQUEADOR] Definir precios paquetes corporativos (Básico / Premium / Elite)** · NS01 · Infraestructura
  Sin precio no hay media kit ni campaña a los 77 anunciantes. Básico: 50u · Premium: 100u · Elite: 200u.

- [ ] 🔴 🚧 `#12LI` **[BLOQUEADOR] Definir precios Paquete Legado y Centenario** · NS01 · Infraestructura
  Sin precio no hay deck de pitch ni propuesta a Ecopetrol. Ref. Villegas: $140K–$546K COP/ejemplar.

### Carolina + Nicolas Serna — URGENTE

- [ ] 🔴 🚨 `#15LI` **[URGENTE — antes del 10 julio] Primer contacto Ecopetrol (75 años agosto 2026)** · NS01 · Conversión
  Score HTAC 17/20. Diferenciador: libro + medios AXXIS/Diners. Requiere precios Legado definidos.

### Nicolas Serna — Foco 1: Venta Directa / Catálogo

- [ ] 🟡 `#4LI` **Revisar flujo de empaque regalo en tienda online** · NS02 · Conversión
  Validar que el flujo comunique claramente la opción de regalo. Mejora directa en conversión.

- [ ] 🟡 `#5LI` **Descuento exclusivo 10-15% para suscriptores AXXIS/Diners** · NS02 · Fidelización
  Cross-sell estratégico. Coordinar mecánica web con Juan David.

- [ ] 🔴 `#6LI` **Media Kit catálogo B2B — intermediarios** · NS01 · Consideración
  29 títulos por categoría, precios unitarios, descuentos por volumen y opciones de empaque.

### Nicolas Serna — Foco 2: Gift Book Corporativo

- [ ] 🔴 `#8LI` **Media Kit Corporativo Gift Book — PDF 2 páginas** · NS01 · Consideración
  3 paquetes con precios, condiciones y opciones de brandeo. Requiere #7LI resuelto.

- [ ] 🟡 `#11LI` **Activar intermediarios — hoteles boutique, inmobiliarias, clubs** · NS01 · Atracción
  Descuento escalado por cantidad. Activar primeros intermediarios en Bogotá.

- [ ] 🟡 `#10LI` **Campaña Gift Book a 77 anunciantes HubSpot** · NS01 · Conversión
  Relación preexistente = conversión más fácil. Email en octubre para compras de diciembre.

### Nicolas Serna — Foco 3: Caza de Aniversarios

- [ ] 🔴 `#13LI` **Investigación 20 empresas en años hito** · NS01 · Atracción
  Supersociedades + LinkedIn: fundadas en 1951 (75 años), 1976 (50 años), 1926 (100 años). Filtro $5.000M COP.

- [ ] 🔴 `#14LI` **Scoring HTAC + carga prospectos en HubSpot** · NS01 · Consideración
  H+T+A+C. Prospectos A (17-20 pts) → contacto inmediato.

- [ ] 🔴 `#16LI` **Deck pitch Libros por Encargo** · NS01 · Consideración
  Portfolio 3 libros, proceso editorial 6 fases, paquetes Legado/Centenario. Requiere #12LI resuelto.

### Carolina + Nicolas Serna — Alianzas

- [ ] 🔴 `#9LI` **Propuesta Grupo Bolívar — libros como regalo VIP** · NS01 · Conversión
  Davivienda Banca Privada + Seguros Bolívar + Fiduciaria Bolívar. Arte y Arq/Diseño. Paquete Elite.

### Juan David + Ernesto — Digital

- [ ] 🔴 `#1LI` **SEO 29 páginas de producto — sinopsis + keywords longtail** · NS03 · Atracción
  Arq/Diseño, Arte, Turismo, Cocina, Crianza. Juan David ejecuta; Ernesto valida.

### Paola Nossa — Digital

- [ ] 🔴 `#2LI` **WhatsApp Business catálogo — 29 títulos** · NS02 · Conversión
  Flujo: consulta → ficha del libro → precio → link pago.

- [ ] 🔴 `#3LI` **Instagram Shop — catálogo vinculado + tags en contenido** · NS03 · Conversión
  29 títulos en Instagram Shop con tags en Reels y Stories.

---

## Experiencias & Alianzas — 15 tareas

> Ver detalle completo: [[Tasks/Experiencias]] · [[03 - Unidades de Negocio/Experiencias/Experiencias]]

### Carolina — Urgentes y Estrategia

- [ ] 🔴 🚨 `#9EX` **[URGENTE] PWA plataforma 360 — seleccionar proveedor y cotizar** · NS02 · Infraestructura
  Decisión tomada: PWA. Cotizaciones en proceso. Seleccionar y firmar. Base tecnológica del Club.

- [ ] 🔴 `#8EX` **Reunión con María Claudia — método de identificación suscriptores** · NS02 · Infraestructura
  Definir cómo verifica el aliado si una persona es suscriptor: cédula, QR, credencial o PWA.

- [ ] 🔴 `#15EX` **Consulta legal — responsabilidad civil aliados, contratos y datos** · NS01 · Infraestructura
  (1) Responsabilidad si aliado causa daño, (2) estructura contratos, (3) datos personales compartibles.

- [ ] 🟡 `#7EX` **Integración beneficios Davivienda medios de pago** · NS01 · Fidelización
  Descuentos adicionales al pagar con tarjeta Davivienda. Explorar con Catalina antes de avanzar.

### Paola Pantaleon — Rama 1: Corporativas

- [ ] 🔴 🚨 `#1EX` **[URGENTE] Confirmar calendario Experiencias H2 2026** · NS01 · Retención
  JD Gutiérrez + Vicky Turbay (julio) · ARBO (agosto) · Galería El Dorado.

- [ ] 🔴 `#3EX` **Portafolio comercializable Experiencias 2026** · NS01 · Consideración
  Catálogo de experiencias: arte y cultura, bienestar, gastronomía, legacy.

- [ ] 🔴 `#5EX` **Expansión Experiencias más allá de Davivienda** · NS01 · Atracción
  Sectores objetivo: Seguros Bolívar, Constructora Bolívar, sector automotriz, farmacéutico.

- [ ] 🔴 `#11EX` **Red de alianzas gastronómicas — primeros aliados Diners** · NS01 · Fidelización
  Prospectar y activar restaurantes, bares y chefs premium en Bogotá.

### Natalia Castaño — Contratos

- [ ] 🔴 `#2EX` **Modelo de contrato anual corporativo** · NS01 · Infraestructura
  Contrato único con múltiples fechas y valores. Términos generales + anexos operativos.

### Nicolas Serna — Sistema de Aliados Club

- [ ] 🔴 `#10EX` **Sistema de niveles aliados (Básico / Premium / Plus)** · NS01 · Infraestructura
  Básico: menor %, landing. Premium: % medio + mailing. Plus: mayor % + todos los canales.

### Jeison Montero — Tech Club

- [ ] 🔴 `#6EX` **Pipeline comercial Experiencias en HubSpot** · HubSpot · Infraestructura
  Prospectos corporativos: empresa, tipo de experiencia, valor, fecha y estado.

- [ ] 🟡 `#12EX` **QR editorial "Vive la Revista" — suscriptor accede a beneficios** · NS02 · Fidelización
  QR en impreso y digital que conecta con el beneficio editorial de esa edición.

### Ernesto + Paola Nossa — Kit Comercial

- [ ] 🔴 `#4EX` **Kit comercial Experiencias para empresas** · NS01 · Consideración
  Propuesta de valor para marcas patrocinadoras: formatos, audiencia, alcance digital y precios.

- [ ] 🔴 `#13EX` **Media kit aliados Club de Beneficios** · NS01 · Consideración
  Propuesta para marcas que quieran unirse al Club: qué obtienen por nivel, visibilidad editorial.

- [ ] 🔴 `#14EX` **Newsletter onboarding Club de Beneficios** · NS02 · Retención
  Bienvenida al Club: cómo activar beneficios y reporte de ahorros. Ernesto copy; Jeison journey.
