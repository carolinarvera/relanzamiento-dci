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

- [ ] 🔴 **Enviar base suscriptores activos a Sebastián** · due 2026-07-04 · Pauta
  Fuente: Reunión pauta técnica 2026-07-01 · Necesaria para excluir suscriptores activos y vencidos de las campañas Meta. Sin esto, presupuesto impacta a quienes ya compraron.

- [ ] 🔴 **Limpiar lifecycle stages HubSpot — migrar "Contacto" → "Lead"** · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · 64,162 contactos atrapados en etapa custom que bloquea todo workflow. Sin esto, nurturing nunca corre.

- [ ] 🔴 **Crear propiedades contacto HubSpot (7 propiedades)** · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · `subscription_type` · `subscription_start_date` · `subscription_end_date` · `ltv_cumulative_cop` · `nps_score` · `churn_risk` · `referral_source_contact`. Prerequisito de workflows de renovación y LTV.

- [ ] 🔴 **Crear WF-01 Lead Nurturing AXXIS** · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · Secuencia 4 emails / 7 días. Trigger: lifecycle = Lead. Con 77K leads y CR 5% = ~3,850 suscriptores sin gasto adicional.

- [ ] 🔴 **Crear WF-03 Onboarding 30 días** · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · 5 emails post-compra: D+0 bienvenida · D+3 top artículos · D+7 beneficios · D+14 equipo editorial · D+30 NPS. Meta NPS >50.

- [ ] 🔴 **Aplicar WF-01 nurturing — adaptar para base Diners** · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · Una vez activo en AXXIS, adaptar tono a Diners (gastronomía, cultura, lifestyle). Bases AXXIS y Diners NUNCA mezcladas en HubSpot.

- [ ] 🟠 **Crear WF-06 Renovación anticipada** · CRM
  Fuente: HubSpot CRM Audit 2026-06-23 · 4 emails: -60d primer aviso · -30d gancho contenido · -15d urgencia precio · -3d cierre. Meta renewal rate año 1: 65-70%.

- [ ] 🔴 **Implementar registro centralizado de compromisos comerciales** · due 2026-07-10 · Comercial
  Fuente: Review Revistas 2026-07-06 · Documento: cliente + ejecutivo + tipo contenido + estado. Elimina silos entre comercial y editorial.

- [ ] 🔴 **Agendar reunión HubSpot automatizaciones** · due 2026-07-10 · CRM
  Fuente: Review Revistas 2026-07-06 · Ejecutivos comerciales = responsables de contactos completos. IA (ChatGPT/Gemini) para enriquecer prospectos.

- [ ] 🔴 **Preparar propuesta editorial integral para Catalina** · due 2026-07-20 · Estrategia
  Fuente: Review Revistas 2026-07-06 · Integra comercial + editorial: "lujo accesible" + nuevos formatos digitales + campañas transmedia. Con datos sólidos.

- [ ] 🔴 **Mapear recursos Visión — inventario tareas + costos + tiempos** · due Esta semana · Plataformas
  Fuente: Reunión Contratos Plataformas 2026-07-08 con Catalina · Base para la nueva propuesta comercial Davivienda. Incluir Carolina + Jeison + Ernesto. Deadline duro pre-vacaciones.

- [ ] 🔴 **Negociar contrato Leo — basado en inventario de recursos** · due Esta semana · Plataformas
  Fuente: Reunión Contratos Plataformas 2026-07-08 · Espira = servidor+seguridad / Leo = SEO+WordPress. No negociar sin tener datos de inventario. Brecha técnica entre ambos a resolver.

- [ ] 🔴 **Reunirse con Torres (Davivienda) — propuesta recursos + estrategia Visión** · due Esta semana · Plataformas
  Fuente: Reunión Contratos Plataformas 2026-07-08 · Presentar nuevo esquema: fee recurrente + proyectos especiales. KPIs: tráfico + suscripciones + relevancia digital.

- [ ] 🟠 **Contactar abogada — reemplazo RRHH de María Isabel** · due Esta semana · RRHH
  Fuente: Reunión Contratos Plataformas 2026-07-08 · Proceso de personal pendiente.

### Juan David

- [ ] 🔴 **Embed HubSpot form en landing /suscribirse/ (AXXIS)** · CRM + Web
  Fuente: HubSpot CRM Audit 2026-06-23 · Sin esto, 100% de clics Meta se pierden sin registro en CRM. Prerequisito: landing URL ya corregida a `/suscribirse/`.

### Sebastián Díaz

- [ ] 🔴 **Activar Meta Lead Ads nativo → HubSpot** · due 2026-07-10 · CRM + Pauta
  Fuente: HubSpot CRM Audit 2026-06-23 · 702 clics en mayo, 0 leads en HubSpot. CPL = ∞. Integrar vía Meta → HubSpot en Configuración de cuenta.

- [ ] 🔴 **Cambiar campaña a objetivo conversiones** · due 2026-07-07 · Pauta
  Fuente: Reunión pauta técnica 2026-07-01 · Campaña activa NO se apaga — preservar aprendizaje algoritmo Meta.

- [ ] 🔴 **Actualizar anuncios — reemplazar activo por video (Reels)** · due 2026-07-07 · Pauta
  Fuente: Reunión pauta técnica 2026-07-01 · Reemplazar activos de bajo rendimiento (imágenes sin CTA) por Reels usando video de portada.

- [ ] 🔴 **Actualizar proceso de suscripciones** según acordado · due 2026-07-07 · Pauta
  Fuente: Reunión pauta técnica 2026-07-01

- [ ] 🔴 **Desarrollar landing pages** — reunirse con Juan para diseño · due 2026-07-11 · Pauta + Web
  Fuente: Reunión pauta técnica 2026-07-01 · 3 páginas independientes por segmento (seguidores, lookalike, Privilegios). No indexadas. Con descuentos personalizados por segmento.

- [ ] 🔴 **Validar pixel Ediciones Gama** — confirmar recolección adecuada de datos · due 2026-07-07 · Técnico
  Fuente: Reunión pauta técnica 2026-07-01

- [ ] 🔴 **Verificar carrito de compras** — asegurar que el sistema genere datos correctamente · due 2026-07-07 · Técnico
  Fuente: Reunión pauta técnica 2026-07-01

- [ ] 🔴 **Revisar sistema revistas** — integridad de datos · due 2026-07-07 · Técnico
  Fuente: Reunión pauta técnica 2026-07-01

- [ ] 🟡 **Analizar LinkedIn Ads** — viabilidad, segmentación y costos para B2B Q4 · due 2026-07-31 · Pauta
  Fuente: Reunión pauta técnica 2026-07-01 · Costo mínimo $10 USD/campaña. Segmentar por cargos + ciudades principales.

### Natalia Castaño

- [ ] 🔴 **Subir contenidos J Albornos + Jorge Lisarazo** · due 2026-07-10 · Contenido
  Fuente: Review Revistas 2026-07-06 · Contenido sobre pisos del proyecto con Jorge Lisarazo. Publicar esta semana.

### Paola Nossa

- [ ] 🔴 **Alinear proceso solicitudes/realización/ejecución de contenidos** · due 2026-07-10 · Coordinación
  Fuente: Review Revistas 2026-07-06 · Toda solicitud incluye: J (Jeison) + Sebastián + Mateo + editores correspondientes.

- [ ] 🔴 **Listar formatos digitales disponibles para pauta comercial** · due 2026-07-10 · Comercial
  Fuente: Review Revistas 2026-07-06 · Insumo para Media Kit AXXIS y propuesta a Catalina.

### Paola Gordillo

- [ ] 🔴 **Auditar web empresa y Diners + plan de acción** · due 2026-07-13 · Digital
  Fuente: Review Revistas 2026-07-06

- [ ] 🔴 **Crear calendario transversal RRSS** · due 2026-07-13 · Contenido
  Fuente: Review Revistas 2026-07-06 · Carruseles + historias + encuestas. Transversal AXXIS + Diners.

- [ ] 🔴 **Listar e ingresar competidores en Metricool** (hasta 10) · due 2026-07-10 · Analytics
  Fuente: Review Revistas 2026-07-06 · Revistas arq/diseño + creadores de contenido relevantes.

- [ ] 🟡 **Fijar fechas optimización perfiles RRSS** · due 2026-07-13 · Digital
  Fuente: Review Revistas 2026-07-06

### Grupo Revistas

- [ ] 🔴 **Crear formulario B2B para eventos/ferias** · due 2026-07-15 · Comercial
  Fuente: Review Revistas 2026-07-06 · Captura estandarizada B2B (ej. Expocamacol).

- [ ] 🔴 **Propuesta nuevos formatos digitales → Catalina** · due 2026-07-20 · Estrategia
  Fuente: Review Revistas 2026-07-06 · Ejemplos transmedia. Sin precios en el PDF.

- [ ] 🔴 **Proponer sección "lujo accesible" a Catalina** · due 2026-07-20 · Comercial
  Fuente: Review Revistas 2026-07-06 · Nueva sección AXXIS. Agrupa talento joven/small biz con paquetes digitales accesibles.

### Paola Pantaleon

- [ ] 🔴 **Reunión stakeholders — presentar nuevo modelo Experiencias** · Dirección
  Fuente: Reunión Unidad Experiencias 2026-06-17 · Dos ramas: Corporativa + Always On.

- [ ] 🔴 **Criterios selección aliados + estructura niveles Club** · due 2026-07-30 · Alianzas
  Fuente: Reunión Unidad Experiencias 2026-06-17 · Formalizar condiciones exclusividad, descuentos y comisiones por nivel Básico/Premium/Plus.

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
  Artículos evergreen informes del sector arq/diseño. Juan David ejecuta; Ernesto realiza el contenido.

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

- [ ] 🔴 `#9AX` **Calendario parrilla AXXIS** · NS03 · Atracción
  Parrilla mensual con temas, fechas, formato y plataforma.

- [ ] 🔴 `#10AX` **Desarrollo de formatos AXXIS (reels, stories, posts)** · NS03 · Atracción
  Ernesto produce el copy y guiones; Paola Gordillo coordina la producción visual.

### Paola Nossa + Ernesto + Mateo Arias Ortiz — Formatos Digitales

- [ ] 🔴 `#13AX` **"Proyectos que hablan" — Podcast AXXIS** · NS03 · Atracción
  Audio + video. YouTube, Spotify y cápsulas 15/30/60 seg para IG/TikTok. 1 ep/mes. Invitados = anunciantes potenciales.

- [ ] 🔴 `#14AX` **"Definición Connect And Collab" — Conversatorio AXXIS** · NS03 · Atracción
  Conversatorio presencial + streaming. Empresa protagonista = anunciante.

- [ ] 🔴 `#15AX` **Calendario de producción formatos digitales H2 — AXXIS** · NS03 · Atracción
  Qué se produce, cuándo y con qué presupuesto. Priorizar formatos con potencial de patrocinio. 

### Sebastián Díaz — Pauta

- [ ] 🔴 `#21AX` **Pauta AXXIS** · NS03 · Atracción
  Campañas visibilidad en Meta a audiencias frías. Objetivo: alcance. Asegurar configuración Meta y Google Ads.

---

## Diners — 20 tareas

> Pipeline: Consideración → Atracción → Conversión → Retención → Infraestructura
> Ver detalle completo: [[Tasks/Diners]]

### Paola Nossa — Comercial

- [ ] 🔴 `#1DI` **Recopilar datos e insumos Diners Media Kit** · NS01 · Consideración
  Métricas web GA4, casos de éxito, precios bundle, audiencia, tiraje y calendario de eventos 2026.

- [ ] 🔴 `#2DI` **Producir Diners Media Kit** · NS01 · Consideración
  Paola Nossa coordina. Comercial apoya. Incluir casos de éxito por sector.

- [ ] 🔴 `#3DI` **Media Kit con formatos digitales segmentados — Diners** · NS01 · Consideración
  Catálogo segmentado: lujo, licores, gastronomía, cultura.

- [ ] 🟡 `#4DI` **One-pager ejecutivo Diners (A4)** · NS01 · Consideración
  Resumen una página para reuniones rápidas. Paola Noss coordina. Ernesto produce el copy. Juan David implementa

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

### Paola Nossa + Simon Granja — Formatos Digitales

- [ ] 🔴 `#14DI` **Calendario de producción formatos digitales H2 — Diners** · NS03 · Atracción
  Definir nuevos formatos como La Mesa de Diners y Detrás de la barra. Retomar formatos anteriores. Paola Nossa coordina; Simón Granja ejecuta.

### Sebastián Díaz — Pauta

- [ ] 🔴 `#20DI` **Pauta brand awareness Diners** · NS03 · Atracción
  Campañas visibilidad en Meta a audiencias frías. Ernesto produce los copies.

---

## Compartidas AXXIS + Diners — 45 tareas

> Aplican a ambas revistas. Ver detalle completo: [[Tasks/Revistas]]

### Jeison Montero (PM) + Equipo Comercial — Venta B2B

- [ ] 🔴 `#1RE` **Listado de clientes y segmentación** · NS01 · Infraestructura
  Clasificar base actual: recurrentes, inactivos, nuevas categorías. Jeison Montero coordina proceso; equipo comercial ejecuta y valida.

- [ ] 🔴 `#2RE` **Propuesta de paquetes comerciales flexibles** · NS01 · Consideración
  Paquetes de bajo riesgo para marcas nuevas con opción de escalar. Bundles print + digital + redes. Jeison Montero coordina entre comercial, editorial y digital.

- [ ] 🔴 `#3RE` **Ofertas de entrada "rompe hielo" con opción de upgrade** · NS01 · Conversión
  Oferta accesible para marcas que nunca han pautado. Escalable a paquete mayor. Jeison Montero PM; equipo comercial define precios con Carolina.

- [ ] 🟡 `#10RE` **Revisión tarifaria y kits de venta (combos print + digital)** · NS01 · Infraestructura
  Analizar tarifarios actuales y kits. Jeison Montero coordina entre comercial, Sebastián Díaz y Juan David.

### Ernesto Rodriguez — Argumentos de Venta

- [ ] 🔴 `#4RE` **Generar informes para fortalecer argumentos de venta** · NS01 · Consideración
  Análisis de tendencias sectoriales, inversión de competidores y estudios de lecturabilidad.

- [ ] 🔴 `#6RE` **Casos de contenido B2B LinkedIn** · NS01 · Consideración
  Casos de éxito adaptados para LinkedIn.

- [ ] 🔴 `#7RE` **Media Kit interactivo — versión digital navegable** · NS01 · Consideración
  El anunciante explora formatos, audiencias y precios desde un link. **Jeison Montero PM** — coordina: Paola Nossa (comercial), Ernesto (tono), Juan David (desarrollo).

- [ ] 🔴 `#8RE` **Nuevos formatos digitales B2B** · NS01 · Atracción
  Webinars co-patrocinados, masterclasses y transmisiones en vivo. **Jeison Montero PM** — coordina: Paola Nossa (producción), Ernesto (contenido), Juan David (plataforma).

- [ ] 🔴 `#9RE` **Experiencias B2B co-patrocinados** · NS01 · Atracción
  Visitas en sitio. Temática editorial. **Jeison Montero PM** — coordina: Paola Nossa, Mateo Arias Ortiz, Ernesto.

### Carolina — Comercial

- [ ] 🔴 `#5RE` **Identificar sectores con mayor inversión y asignar leads** · NS01 · Consideración
  Mapear sectores con mayor inversión en pauta. Cruzar con audiencia de cada revista.

### Paola Pantaleon — Alianzas

- [ ] 🔴 `#11RE` **Estrategia Alianzas Beneficios Suscriptores (post-Privilegios Davivienda)** · NS01 · Fidelización
  Estructurar ofertas donde Gamma aporte audiencia y los aliados del banco asuman beneficios. Se debe aterrizar precios.y paquetes foco % descuento / $ valor pauta

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

- [ ] 🔴 🚨 `#18RE` **[URGENTE] Revisar y validar renovación automática** · NS02 · Infraestructura
  Sospecha activa: la renovación automática vía pasarela IO no opera.

- [ ] 🔴 `#19RE` **Seguimiento funnel newsletter a suscriptores** · NS02 · Consideración
  Secuencia: newsletter (sem 1) → contenido exclusivo (sem 2) → oferta suscripción (sem 3).

- [ ] 🔴 `#20RE` **Propuesta de valor para suscriptores** · NS02 · Consideración
  Qué obtiene el suscriptor que no obtiene el lector casual. Paola Nossa define contenido; **Jeison Montero coordina** con HubSpot y plataforma.

- [ ] 🔴 `#26RE` **Validar estructura de comunicaciones y customer journey** · NS02 · Infraestructura
  Ejecutar ANTES de cargar bases en HubSpot.

- [ ] 🔴 `#27RE` **Estrategia de renovación HubSpot** · NS02 · Retención
  Acciones automatizadas + intervención humana si no responde. Carolina Define, Jeison Implementa

- [ ] 🟡 `#28RE` **Migración base de datos a HS** · NS02 · Infraestructura
  Avisar a Carolina cuando comience la carga a HubSpot.

- [ ] 🔴 `#29RE` **SLA de atención RRSS — tiempos de respuesta CM** · NS02 · Infraestructura
  Meta: máximo 3 horas para consultas en Instagram.

- [ ] 🔴 `#31RE` **Embeds formularios HubSpot en webs** · NS02 · Infraestructura
  Integrar formularios en revistaaxxis.com.co y revistadiner.com. Juan David implementa

- [ ] 🔴 `#32RE` **Pixel Meta → HubSpot: sincronizar audiencias** · NS02 · Infraestructura
  Sebastián gestiona Meta, Juan David el pixel web, Jeison Coordina.

- [ ] 🔴 `#24RE` **Plan de renovaciones pendientes** · NS02 · Retención
  Validar subida de información a HubSpot. Coordinar con Sebastian campaña de META, coordinar envio de newsletter. Paola Nossa coordina el descuento.


### Sebastián Díaz — Pauta / Campañas

- [ ] 🔴 `#21RE` **Campaña remarketing a suscriptores vencidos** · NS02 · Retención
  Segmento extraído de base IO con vencimiento reciente. Oferta de reactivación. Mínimo 3 piezas por tipología para usuarios que interactuaron sin convertir. Jeison coordina el desarrollo de piezas. Paola Gordillo apoya 

- [ ] 🔴 `#22RE` **Campaña winback — suscriptores inactivos** · NS02 · Retención
  Oferta escalonada: 30d → 60d → 90d+.

- [ ] 🔴 `#23RE` **Estrategia de campañas actuales y links de aterrizaje** · NS02 · Retención
  Mínimo 3 piezas por tipología para usuarios que interactuaron sin convertir. Jeison coordina el desarrollo de piezas. Paola Gordillo apoya 

- [ ] 🔴 `#33RE` **Pauta Meta conversión suscripciones** · NS02 · Conversión
  Campañas conversión. LAL desde base de suscriptores. Creativos diferenciados AXXIS vs Diners.

### Ernesto + Paola Gordillo — Distribución Contenido

- [ ] 🔴 `#25RE` **Estrategia de contenido orgánico — CTA a suscripción** · NS02 · Consideración
  Stories y posts con link directo a landing.

- [ ] 🟡 `#34RE` **Estrategia de distribución multiplataforma** · NS03 · Atracción
  YouTube (largo), Spotify (audio), IG/TikTok (cortos). **Jeison Montero PM** — coordina Ernesto (contenido) + Paola Gordillo (canales) + Juan David (plataforma).

- [ ] 🟡 `#35RE` **Presencia en medios externos y relaciones con prensa** · NS03 · Atracción
  Notas sobre ediciones especiales, eventos y lanzamientos. **Jeison Montero PM** — coordina Ernesto (copy) + Paola Nossa (relaciones).

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

- [ ] 🔴 `#41RE` **Emails en el funnel HubSpot** · HubSpot · Consideración
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


### Carolina + Ernesto Rodriguez

- [ ] 🔴 `#1EG` **Estrategia contenidos sombrilla Ediciones Gamma — pauta Meta** · NS01 · Conversión
  Libros / colecciones específicas. Gamma como especialistas del sector: Arquitectura, Diseño y cultural. Carolina define; Ernesto produce.

### Jeison Montero (PM) — Cross-BU

- [ ] 🟡 `#5EG` **Brand guidelines Ediciones Gamma — identidad sombrilla** · NS01 · Infraestructura
  Guía de identidad visual y verbal para alinear AXXIS, Diners, Libros y Experiencias. **Jeison Montero PM** — coordina: Ernesto (tono verbal), Juan David (identidad digital), Paola Nossa (materiales comerciales).

---

## Libros — 16 tareas

> Ver detalle completo: [[Tasks/Libros]] · [[03 - Unidades de Negocio/Libros/Libros]]

### ⚠️ BLOQUEADORES — Nicolas Serna (resolver primero)

- [ ] 🔴 🚧 `#7LI` **[BLOQUEADOR] Definir precios paquetes corporativos (Básico / Premium / Elite)** · NS01 · Infraestructura
  Sin precio no hay media kit ni campaña a los 77 anunciantes. Básico: 50u · Premium: 100u · Elite: 200u.

- [ ] 🔴 🚧 `#12LI` **[BLOQUEADOR] Definir precios Paquete Legado y Centenario** · NS01 · Infraestructura
  Sin precio no hay deck de pitch ni propuesta a Ecopetrol. Ref. Villegas: $140K–$546K COP/ejemplar.
### Nicolas Serna — Foco 1: Venta Directa / Catálogo

- [ ] 🟡 `#4LI` **Revisar flujo de empaque regalo en tienda online** · NS02 · Conversión
  Validar que el flujo comunique claramente la opción de regalo. Mejora directa en conversión.

- [ ] 🟡 `#5LI` **Validación de Descuento exclusivo 10-15% para suscriptores AXXIS/Diners** · NS02 · Fidelización
  Cross-sell estratégico. Coordinar mecánica web con Juan David.

- [ ] 🔴 `#6LI` **Media Kit catálogo B2B — intermediarios** · NS01 · Consideración
  29 títulos por categoría, precios unitarios, descuentos por volumen y opciones de empaque.
  
- [ ]  🟡 `#2LI` **WhatsApp Business catálogo — 29 títulos** · NS02 · Conversión
  Flujo: consulta → ficha del libro → precio → link pago.

### Nicolas Serna — Foco 2: Gift Book Corporativo

- [ ] 🔴 `#8LI` **Media Kit Corporativo Gift Book — PDF 2 páginas** · NS01 · Consideración
  3 paquetes con precios, condiciones y opciones de brandeo. Requiere #7LI resuelto.

- [ ] 🟡 `#11LI` **Activar intermediarios — hoteles boutique, inmobiliarias, clubs** · NS01 · Atracción
  Descuento escalado por cantidad. Activar primeros intermediarios en Bogotá.

- [ ] 🟡 `#10LI` **Campaña Gift Book a 77 anunciantes HubSpot** · NS01 · Conversión
  Relación preexistente = conversión más fácil. Email en octubre para compras de diciembre.

### Nicolas Serna — Libros por encargo

- [ ] 🔴 `#13LI` **Precios de paquetes** · NS01 · Atracción
  Diferenciadores de lbrs sobre pedidos

- [ ] 🔴 `#14LI` **Lista de empresas Scoring HTAC + carga prospectos en HubSpot** · NS01 · Consideración
  H+T+A+C. Prospectos A (17-20 pts) → contacto inmediato.

- [ ] 🔴 `#16LI` **Media KIT y deck presentación Libros por Encargo** · NS01 · Consideración
  Requiere Definición de precios Paquetes y segmentación de empresas con propuesta definida
- [ ] 🔴 🚨 `#15LI` **Lista de empresas con Score HTC ** · NS01 · Conversión
  Score HTAC 17/20. Diferenciador: libro sobre pedido. Requiere precios definidos.

### Juan David + Ernesto — Digital

- [ ] 🔴 `#1LI` **SEO 29 páginas de producto — sinopsis + keywords longtail** · NS03 · Atracción
  Arq/Diseño, Arte, Turismo, Cocina, Crianza. Juan David ejecuta; Ernesto Valida y pasa ajustes.


---

## Experiencias Banca Privada & Experiencias VIP — 15 tareas

> Ver detalle completo: [[Tasks/Experiencias]] · [[03 - Unidades de Negocio/Experiencias/Experiencias]]


### Paola Pantaleon — Experiencias Corporativas (Banca Privada + expansión)

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

### Paola Pantaleon — Aliados Beneficios Suscriptores (suscriptores AXXIS y Diners)

- [ ] 🔴 `#10EX` **Sistema de niveles aliados (Básico / Premium / Plus)** · NS01 · Infraestructura
  Básico: menor %, landing. Premium: % medio + mailing. Plus: mayor % + todos los canales.

- [ ] 🔴 `#15EX` **Consulta legal — responsabilidad civil aliados, contratos y datos** · NS01 · Infraestructura
  (1) Responsabilidad si aliado causa daño, (2) estructura contratos, (3) datos personales compartibles.

- [ ] 🟡 `#12EX` **Definición de plataforma Beneficios Suscriptores** · NS02 · Fidelización
  Validar 3 tipos de accesos: Suscriptor, Aliado y Editorial Gamma.

- [ ] 🔴 `#13EX` **Media kit aliados Beneficios Suscriptores** · NS01 · Consideración
  Propuesta para marcas que quieran unirse al Club: qué obtienen por nivel, visibilidad editorial.

- [ ] 🔴 `#14EX` **Newsletter onboarding Beneficios Suscriptores** · NS02 · Retención
  Bienvenida al Club: cómo activar beneficios y reporte de ahorros. Ernesto copy; Jeison journey.