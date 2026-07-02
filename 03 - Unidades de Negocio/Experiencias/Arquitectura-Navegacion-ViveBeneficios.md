---
date: 2026-06-30
type: product-spec
tags: [experiencias, vive-beneficios, pwa, arquitectura, ux, navegacion, suscriptores, aliados, admin]
related-people: [Jeison Montero, Carolina Ramirez, Paola Pantaleon, Nicolas Serna]
related-projects: [Vive-Beneficios, PWA-360]
ai-first: true
confidence: high
status: borrador
version: v1.0
---

## For future Claude
Arquitectura de navegación completa de la PWA Vive Beneficios para los 3 actores del programa (2026-06-30). Cada actor tiene acceso diferenciado post-login. Suscriptor: explorar beneficios, reservar, ver ahorros, carnet QR, referidos. Aliado: gestionar reservas, métricas, oferta publicada, proponer experiencias, materiales de marca, plan. Gamma Admin: vista 360, gestión aliados/suscriptores/categorías, comunicaciones, revenue, reportes. Esta arquitectura es el input de diseño para Jeison Montero al contratar el proveedor de desarrollo PWA. Ref: [[Experiencias]] · [[Experiencias_05_Pipeline_ViveBeneficios.xlsx]]

---

# Arquitectura de Navegación — Vive Beneficios PWA

> Versión 1.0 · 2026-06-30 · Input para desarrollo PWA
> **Owner técnico:** [[Jeison Montero]] · **Owner producto:** [[Carolina Ramirez]]

---

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| v1.0 | 2026-06-30 | Arquitectura inicial — 3 actores, 26 módulos |
| v1.1 | 2026-07-01 | Reunión con Jeison + Juandy: QR → ID único · notificaciones WhatsApp + email · gamificación niveles suscriptor · cross-selling AXXIS↔Diners · autogestión calendario aliado · HubSpot conectado a reservas |

---

## Principios de Diseño

- **Login diferenciado:** cada actor ve solo lo que le corresponde desde el primer pantalla post-login
- **Mobile-first:** PWA sin descarga, funciona desde navegador móvil · URL única centralizada
- **Acción principal siempre visible:** Suscriptor → Reservar / Aliado → Confirmar reservas / Admin → Alertas
- **Datos en tiempo real:** validación de ID único, estado reservas y redenciones deben ser live
- **Cross-selling integrado:** suscriptor AXXIS ve beneficios Diners y viceversa — incentiva suscripción combinada

---

## Actor 1: Suscriptor

**Acceso:** ID único por suscriptor (método exacto pendiente: número suscripción, cédula, o código generado) · decisión tomada 2026-07-01: se descarta QR

### Módulos

| Módulo | Funcionalidades clave |
|--------|----------------------|
| **Home / Dashboard** | Beneficios destacados del mes · beneficio editorial activo · próximas reservas · ahorro acumulado mes · CTA referir amigo |
| **Explorar Beneficios** | Catálogo por categoría (Gastronomía, Arte, Bienestar, Moda, Viajes, Hogar) · filtro por descuento mínimo · beneficios guardados · beneficios temporales editoriales · filtro por revista (AXXIS / Diners) |
| **Perfil del Aliado** | Nombre · descripción · galería fotos · descuento activo · dirección + mapa · horario · contacto · **CTA Reservar** · calificación y reseñas |
| **Reservas** | Flujo: fecha → personas → notas → QR de confirmación · Mis Reservas: próximas / pendientes / historial · cancelar o reagendar · calificar post-visita |
| **Mis Ahorros** | Ahorro total acumulado COP · ahorro este mes vs. anterior · por categoría · historial redenciones · comparar vs. costo suscripción (driver de retención) |
| **Mi ID de Suscriptor** | ID único personal (no QR) · nombre + revista + nivel · estado activo/vencido · fecha renovación · ~~QR descartado 2026-07-01~~ · *V2: wallet Apple/Google* |
| **Referir a un Amigo** | Link personal de referido · compartir WhatsApp/email · estado de mis referidos (enviado → registrado → suscrito) · beneficio por referido exitoso |
| **Asistencia** | FAQ · problema con reserva · problema con aliado · chat/formulario → equipo Gamma · reportar aliado (PQRS) |
| **Mi Perfil** | Datos personales · revista vinculada · preferencias de notificaciones (push + email) · preferencias de categorías · *V2: vincular familia/beneficiarios* |

---

## Actor 2: Aliado

**Acceso:** NIT + email registrado en contrato → cada aliado ve solo sus propios datos

### Módulos

| Módulo | Funcionalidades clave |
|--------|----------------------|
| **Dashboard Principal** | Reservas pendientes hoy · suscriptores atendidos mes · ahorro generado · descuento activo · próxima aparición editorial · alertas |
| **Reservas** | Nuevas solicitudes (alerta push + email) · confirmar / rechazar con mensaje · reservas del día/semana · historial · marcar como atendida · bloquear fechas o capacidad |
| **Mi Oferta & Descuentos** | Descuento fijo activo · crear oferta temporal (fechas + condiciones) · vincular oferta a edición editorial · historial · preview cómo se ve en catálogo |
| **Mis Métricas** | Redenciones totales · suscriptores únicos · ahorro generado · reservas completadas/canceladas · día y hora pico · calificación promedio · benchmark vs. categoría (anónimo) · exportar reporte |
| **Mi Perfil Público** | Editar nombre, descripción, fotos (hasta 8), horario, dirección, contacto · solicitar cambio de categoría · vista previa del perfil como suscriptor |
| **Proponer Experiencia** | Formulario: tipo, capacidad, fecha, precio, descripción, adjuntos → va directo a equipo Comercial Gamma (Nicolás Serna) · trazabilidad del estado · historial |
| **Mis Materiales** | Logo y sello "Aliado Vive Beneficios" · sticker QR imprimible para el local · piezas para redes · media kit · guía de protocolo de validación de carnet |
| **Mi Plan & Facturación** | Plan actual (Básico/Premium/Plus) · beneficios incluidos · **CTA Upgrade** con comparativa · fecha renovación · historial de pagos · descargar factura · contactar cuenta manager |
| **Calendario Editorial** | Cuándo aparezco en newsletter · en redes AXXIS/Diners · en qué edición de la revista · solicitar contenido adicional (solo Plus) |

---

## Actor 3: Gamma Admin

**Acceso:** Email Gamma con rol asignado
**Roles granulares:**
- **Comercial:** aliados + solicitudes comerciales
- **Comunicaciones:** newsletters + calendario editorial
- **Finanzas:** revenue + facturación
- **Super Admin:** acceso total (Carolina, Jeison, Paola P.)

*Toda acción queda en log de auditoría.*

### Módulos

| Módulo | Funcionalidades clave |
|--------|----------------------|
| **Dashboard Global** | KPIs ejecutivos · suscriptores activos por revista · aliados activos por nivel/categoría · redenciones totales · revenue membresías · solicitudes pendientes · gráficas de tendencia |
| **Gestión Suscriptores** | Lista completa (activos/vencidos) · perfil individual (reservas, redenciones, ahorros) · marcar activo/inactivo · enviar notificación individual · segmentar y exportar (CSV) · suscriptores por vencer (alerta retención) |
| **Gestión Aliados** | Lista por categoría/nivel · perfil editable · aprobar onboarding · cambiar nivel de plan · suspender/reactivar · métricas individuales · alerta aliados sin redenciones en 60 días · exportar directorio |
| **Categorías & Catálogo** | Ver/agregar/desactivar categorías · reordenar posición en catálogo · definir aliados destacados · gestionar beneficios temporales · vincular beneficio a edición revista · gestionar QR por edición impresa |
| **Solicitudes Comerciales** | Propuestas de experiencia de aliados · aprobar → publica / rechazar con comentario · asignar a ejecutivo comercial · solicitudes de upgrade de plan · historial gestionado |
| **Revenue & Facturación** | Membresías activas y valor mensual · revenue por nivel · renovaciones próximas (30/60/90 días) · generar factura electrónica · historial pagos · proyección Q3/Q4 · exportar a contabilidad |
| **Comunicaciones** | Newsletter suscriptores (HubSpot — segmentar por revista) · newsletter aliados · notificaciones push segmentadas · calendario editorial de aliados · historial de comunicaciones |
| **Reportes & Analytics** | Reporte mensual ejecutivo (PDF) · top aliados y suscriptores · análisis churn riesgo · ahorro total generado · tasa de uso por suscriptor · exportar CSV/Excel · dashboard embebible para CEO |

---

## Flujos de Conexión entre Actores

```
Suscriptor ──reserva──────────────────────────────► Aliado (alerta push)
                                                         │ confirma/rechaza
                                                         ▼
                                                    Suscriptor (notificación)
                                                         │ asiste
                                                         ▼
                                                    Aliado marca "atendida"
                                                         │
                                                         ▼
                                               Gamma Admin ve redención + calificación

Aliado ──propone experiencia──► Gamma Admin (Comercial) ──aprueba──► catálogo público
Aliado ──solicita upgrade──────► Gamma Admin (Finanzas) ──gestiona──► nuevo contrato
Suscriptor ──reporta aliado───► Gamma Admin ──investiga──► suspensión si aplica
```

---

## Actualizaciones v1.1 (2026-07-01)

Cambios desde la reunión con Jeison + Juandy:

| Tema | Antes (v1.0) | Ahora (v1.1) |
|------|-------------|--------------|
| Validación suscriptor | QR dinámico | **ID único** (método exacto pendiente) |
| Notificaciones | Push web (FCM) | **WhatsApp + email** · "trampolín" en MVP |
| Niveles suscriptor | No contemplado | **Gold / Premium / Black** según uso + referidos |
| Reservas | Sistema propio básico | Conectado a **HubSpot** para trazabilidad |
| Calendario aliado | Bloqueo de fechas simple | **Autogestión autónoma** de horarios y disponibilidad |
| Cross-selling | No contemplado | **AXXIS ↔ Diners** en una sola plataforma |
| Aliados favoritos | Manual (guardar) | **Top 5 automático** por historial + opción manual (pendiente de decidir) |

### Pendientes de esta reunión

- [ ] URL definitiva de la plataforma
- [ ] Método exacto de ID único (cédula / número suscripción / código generado)
- [ ] Carolina + Juandy: evaluar fases y alcance — ¿interno o externo?
- [ ] Definir modelo trampolín WhatsApp vs. integración total para MVP
- [ ] Decidir lógica aliados favoritos: manual vs. automático por historial
- [ ] Beneficio específico por referido exitoso (con Nicolás)

---

## Versiones

| Versión | Alcance | Target |
|---------|---------|--------|
| **V1 Beta (Sep 2026)** | Suscriptores Diners · auth + catálogo + validación QR · reservas básicas · 10-30 aliados piloto | Sep 2026 |
| **V1 Full (Oct 2026)** | Expansión AXXIS · mis ahorros · métricas aliados · calendario editorial | Oct-Nov 2026 |
| **V2 (Ene 2027)** | Wallet digital · vincular familia · benchmark categoría · programa referidos gamificado · integración Mastercard/Visa | Ene 2027 |

---

## Relacionado

[[Experiencias]] · [[Jeison Montero]] · [[Paola Pantaleon]] · [[Nicolas Serna]] · [[Carolina Ramirez]] · [[Experiencias_05_Pipeline_ViveBeneficios.xlsx]]

---

## Tags
#pwa #arquitectura #navegacion #vive-beneficios #suscriptores #aliados #admin #ux #producto #experiencias
