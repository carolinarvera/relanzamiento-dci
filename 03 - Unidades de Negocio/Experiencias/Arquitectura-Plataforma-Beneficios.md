---
date: 2026-07-01
type: product-spec
tags: [experiencias, beneficios-suscriptores, pwa, arquitectura, mvp, producto, tech-stack, kpis, gamificacion, navegacion, ux]
related-people: [Carolina Ramirez, Jeison Montero, Juan David Duran Lerma, Catalina Obregon, Paola Pantaleon, Nicolas Serna]
related-projects: [Beneficios-Suscriptores]
ai-first: true
confidence: high
status: borrador
version: v1.1
---

## For future Claude
Documento maestro único de la Plataforma de Programa de Beneficios (Beneficios Suscriptores). **Alcance: solo Rama Alianzas (always-on).** El BU Experiencias tiene 2 ramas diferenciadas: (1) Alianzas = club de beneficios suscriptores always-on — es lo que cubre este doc; (2) Experiencias = banca privada + VIP corporativo = one-time, NO vive en esta plataforma. Hay 2 tipos de aliado: Aliado Beneficios (long-term, siempre en catálogo) y Aliado VIP/Banca Privada (one-time, no en catálogo). Decisiones 2026-07-03: desarrollo interno confirmado (se rechaza proveedor externo), QR descartado, se prefieren billeteras virtuales (Apple/Google Wallet) — puede anticiparse a V1 en lugar de V2. Ref: [[06 - Meetings/Experiencias/2026-07-03 Review-Avances-Experiencias]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]] · [[06 - Meetings/Experiencias/2026-07-01 Equipo-Catalina - Propuesta Plataforma Lealtad]]

---

# Arquitectura — Plataforma de Programa de Beneficios
### Beneficios Suscriptores · Ediciones Gamma · v1.3 · 2026-07-03

> **Producto:** Club de beneficios always-on para suscriptores de Revista Diners y AXXIS
> **Tipo de beneficios:** Descuentos y alianzas con restaurantes, comercios y experiencias curadas
> **Alcance inicial:** MVP web y móvil (PWA — Progressive Web App) · desarrollo interno (Juandy)
> **Owner producto:** [[Carolina Ramirez]] · **Owner técnico:** [[Jeison Montero]]

---

## Contexto BU — Las 3 Líneas de Experiencias

El BU Experiencias opera con **3 líneas diferenciadas**. Esta plataforma cubre **solo la Línea 3**.

| Línea | Nombre | Modelo | Aliado | Plataforma |
|---|---|---|---|---|
| **L1** | Experiencias VIP Corporativas | B2B — venta de experiencias a empresas, aseguradoras, banca | Colaboración puntual por evento | No aplica — operación directa |
| **L2** | Experiencias Banca Privada | One-time — eventos exclusivos para clientes premium | One-time — **no** vive en catálogo | No aplica — operación directa |
| **L3** | Beneficios Suscriptores (always-on) | Club de beneficios permanente para suscriptores Diners/AXXIS | Contrato largo plazo · siempre en catálogo | **Este documento** |

### Dos tipos de aliado

| Tipo | Nombre | Relación | En catálogo | Onboarding |
|---|---|---|---|---|
| **Aliado Beneficios** | Always-on | Contrato largo plazo · descuentos permanentes · cobertura nacional | Sí — siempre activo | Proceso estándar (formulario + docs) |
| **Aliado VIP / Banca Privada** | One-time | Colaboración puntual para experiencia específica | No — evento puntual | Proceso ágil diferenciado |

> **Criterio de prospección (2026-07-03):** exclusividad del servicio + cobertura/ubicación nacional. NO prospectar solo por descuentos. Intercambio comercial: visibilidad y pauta a cambio de mejores tasas.

---

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| v1.0 | 2026-06-30 | Arquitectura inicial — 3 actores, 26 módulos |
| v1.1 | 2026-07-01 | Reunión Jeison + Juandy: QR → ID único · notificaciones WhatsApp + email · gamificación Gold/Premium/Black · cross-selling AXXIS↔Diners · autogestión calendario aliado · HubSpot conectado a reservas |
| v1.1b | 2026-07-01 | Fusión con doc de producto: KPIs, user journeys, stack tecnológico, fases |
| v1.2 | 2026-07-02 | Benchmark competitivo Club Vivamos (El Tiempo) — geolocalización de aliados y beneficiarios familiares como consideraciones adicionales para el MVP |
| v1.3 | 2026-07-03 | Reunión review avances: estructura 3 líneas BU + 2 tipos aliado · desarrollo interno confirmado · billeteras virtuales preferidas sobre QR · prospección por exclusividad, no descuentos |

---

## 1. Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                 PLATAFORMA BENEFICIOS SUSCRIPTORES               │
│                        (URL única — PWA)                        │
├──────────────┬──────────────────────┬───────────────────────────┤
│  SUSCRIPTOR  │       ALIADO         │    GAMMA ADMIN            │
│  (Diners /   │  (comercio, rest.,   │  (Carolina, Jeison,       │
│   AXXIS)     │   experiencia)       │   Paola P., Nidia)        │
├──────────────┴──────────────────────┴───────────────────────────┤
│                     CAPA DE SERVICIOS                           │
│   Reservas · Validación ID · Notificaciones · HubSpot CRM       │
├─────────────────────────────────────────────────────────────────┤
│                   INTEGRACIONES EXTERNAS                        │
│   HubSpot · WhatsApp Business API · Email · Wompi (pagos)       │
└─────────────────────────────────────────────────────────────────┘
```

### Principios de Diseño

- **Login diferenciado:** cada actor ve solo lo que le corresponde desde la primera pantalla post-login
- **Mobile-first:** PWA sin descarga, funciona desde el navegador del celular — URL única centralizada
- **Acción principal siempre visible:** Suscriptor → Reservar / Aliado → Confirmar reservas / Admin → Alertas
- **Datos en tiempo real:** validación de ID único, estado de reservas y redenciones deben ser live
- **Cross-selling integrado:** suscriptor AXXIS ve beneficios Diners y viceversa — incentiva suscripción combinada
- **Single sign-on:** un login por suscriptor, independiente de si es Diners o AXXIS
- **Validación sin QR:** aliado digita el ID único del suscriptor → sistema confirma estado + descuento

---

## 2. Tipología de Usuarios

### Suscriptor

| Atributo | Detalle |
|---|---|
| **Quién es** | Persona con suscripción activa a Revista Diners o AXXIS |
| **Acceso** | ID único personal (método: por definir — número suscripción, cédula, o código) |
| **Objetivo** | Descubrir y redimir beneficios exclusivos por su suscripción |
| **Canal principal** | Celular (PWA) + WhatsApp + email |
| **Niveles** | Gold → Premium → Black (gamificación) |

### Aliado Beneficios (always-on)

> Este es el único tipo de aliado que tiene acceso a la plataforma. Los aliados VIP/Banca Privada se gestionan por fuera (operación directa).

| Atributo | Detalle |
|---|---|
| **Quién es** | Restaurante, comercio o proveedor con contrato long-term · siempre activo en catálogo |
| **Acceso** | NIT + email registrado en contrato — cada aliado ve solo sus propios datos |
| **Objetivo** | Recibir y gestionar reservas · validar suscriptores · medir su desempeño |
| **Canal principal** | Web (desktop) + WhatsApp/email para alertas |
| **Planes** | Básico · Premium · Plus |
| **Prospección** | Por exclusividad del servicio + cobertura nacional · intercambio: visibilidad/pauta por mejores descuentos |

### Gamma Admin

| Atributo | Detalle |
|---|---|
| **Quién es** | Equipo interno de Ediciones Gamma |
| **Roles** | Super Admin (Carolina, Jeison, Paola P.) / Comercial / Comunicaciones / Finanzas (Nidia) |
| **Objetivo** | Vista 360 del programa: aliados, suscriptores, revenue, métricas |
| **Canal principal** | Web (desktop) |

> *Toda acción del admin queda registrada en log de auditoría.*

---

## 3. Módulos Principales

### 3.1 Suscriptor

**Acceso:** ID único por suscriptor — método exacto pendiente de definir (número suscripción, cédula o código generado). QR descartado en reunión 2026-07-01.

| Módulo | Funcionalidades clave |
|--------|----------------------|
| **Home / Dashboard** | Beneficios destacados del mes · beneficio editorial activo · próximas reservas · ahorro acumulado mes · CTA referir amigo |
| **Explorar Beneficios** | Catálogo en tarjetas/carrusel · filtro por categoría (Gastronomía, Arte, Bienestar, Moda, Viajes, Hogar) · filtro por descuento mínimo · filtro por revista (AXXIS / Diners) · beneficios guardados · beneficios temporales editoriales |
| **Perfil del Aliado** | Nombre · descripción · galería fotos · descuento activo · dirección + mapa · horario · contacto · **CTA Reservar** · calificación y reseñas |
| **Reservas** | Flujo: fecha → personas → notas → confirmación · Mis Reservas: próximas / historial · cancelar o reagendar · calificar post-visita · conectado a HubSpot |
| **Mi Perfil** | Hub personal con 4 tabs: **Mi ID** (carnet digital, número único, nivel, estado) · **Mis Ahorros** (total COP, desglose categoría, historial, comparar vs. costo suscripción) · **Referidos** (link único, estado referidos, progreso nivel) · **Configuración** (datos personales, categorías favoritas, notificaciones WhatsApp/email, cuenta) · *V2: vincular familia/beneficiarios · wallet Apple/Google* |
| **Asistencia** | FAQ · problema con reserva · problema con aliado · formulario → equipo Gamma · reportar aliado (PQRS) |

### 3.2 Aliado

**Acceso:** NIT + email registrado en contrato.

| Módulo | Funcionalidades clave |
|--------|----------------------|
| **Dashboard Principal** | Reservas pendientes hoy · suscriptores atendidos mes · ahorro generado a sus clientes · descuento activo · próxima aparición editorial · alertas |
| **Reservas** | Nuevas solicitudes (alerta WhatsApp + email) · confirmar / rechazar con mensaje · reservas del día/semana · historial · marcar como atendida |
| **Validar Suscriptor** | Campo para digitar ID del suscriptor → sistema muestra: nombre, estado activo/inactivo, descuento aplicable, nivel Gold/Premium/Black |
| **Mi Oferta & Descuentos** | Descuento fijo activo · crear oferta temporal (fechas + condiciones) · vincular oferta a edición editorial · historial · preview cómo se ve en catálogo |
| **Calendario** | Gestión autónoma de disponibilidad · bloquear fechas o capacidad · modificar horarios sin intermediación de Gamma |
| **Mis Métricas** | Redenciones totales · suscriptores únicos · ahorro generado · reservas completadas/canceladas · día y hora pico · calificación promedio · benchmark vs. categoría (anónimo) · exportar reporte |
| **Mi Perfil Público** | Editar nombre, descripción, fotos (hasta 8), horario, dirección, contacto · solicitar cambio de categoría · vista previa del perfil como suscriptor |
| **Proponer Experiencia** | Formulario: tipo, capacidad, fecha, precio, descripción, adjuntos → va directo a equipo Comercial Gamma (Nicolás Serna) · trazabilidad del estado · historial |
| **Mi Plan & Facturación** | Plan actual (Básico/Premium/Plus) · beneficios incluidos · **CTA Upgrade** con comparativa · fecha renovación · historial de pagos · descargar factura · contactar cuenta manager |
| **Materiales** | Logo y sello "Aliado Beneficios Suscriptores" · piezas para redes · media kit · guía de protocolo de validación de ID |

### 3.3 Gamma Admin

**Acceso:** Email Gamma con rol asignado.

| Módulo | Funcionalidades clave |
|--------|----------------------|
| **Dashboard Global** | KPIs ejecutivos en tiempo real · suscriptores activos por revista · aliados activos por nivel/categoría · redenciones totales · revenue membresías · solicitudes pendientes · gráficas de tendencia |
| **Gestión Suscriptores** | Lista completa (activos/vencidos) · perfil individual (reservas, redenciones, ahorros) · marcar activo/inactivo · enviar notificación individual · segmentar y exportar (CSV) · suscriptores por vencer (alerta retención) |
| **Gestión Aliados** | Lista por categoría/nivel · perfil editable · aprobar onboarding · cambiar nivel de plan · suspender/reactivar · métricas individuales · alerta aliados sin redenciones en 60 días · exportar directorio |
| **Catálogo & Categorías** | Ver/agregar/desactivar categorías · reordenar posición en catálogo · definir aliados destacados · gestionar beneficios temporales · vincular beneficio a edición revista |
| **Solicitudes Comerciales** | Propuestas de experiencia de aliados · aprobar → publica / rechazar con comentario · asignar a ejecutivo comercial · solicitudes de upgrade de plan · historial gestionado |
| **Revenue & Facturación** | Membresías activas y valor mensual · revenue por nivel · renovaciones próximas (30/60/90 días) · generar factura electrónica · historial pagos · proyección Q3/Q4 · exportar a contabilidad |
| **Comunicaciones** | Newsletter suscriptores (HubSpot — segmentar por revista) · newsletter aliados · notificaciones WhatsApp segmentadas · calendario editorial de aliados · historial de comunicaciones |
| **Reportes & Analytics** | Reporte mensual ejecutivo (PDF) · top aliados y suscriptores · análisis churn riesgo · ahorro total generado · tasa de uso por suscriptor · exportar CSV/Excel · dashboard embebible para CEO |

---

## 4. Flujos del Usuario (User Journeys)

### 4.1 Suscriptor — De Login a Redención Exitosa

```
PASO 1 — ACCESO
  Suscriptor ingresa a la URL de la plataforma
  → Pantalla de login: ingresa su ID único (número suscripción o cédula)
  → Sistema valida estado: activo ✓ / vencido ✗
  → Si vencido: mensaje de renovación + link para suscribirse

PASO 2 — DESCUBRIMIENTO
  Llega al Home: ve beneficios destacados del mes
  → Navega al catálogo: filtra por categoría (ej. Gastronomía)
  → Explora tarjetas de aliados con logo, nombre, descuento y categoría
  → Selecciona un aliado → abre perfil completo

PASO 3 — DECISIÓN
  Lee perfil: descripción, galería, horarios, ubicación
  → Ve el descuento exacto según su nivel de suscriptor
  → Lee reseñas de otros suscriptores
  → Hace clic en "Reservar"

PASO 4 — RESERVA
  Elige fecha y hora disponible (calendario del aliado)
  → Selecciona número de personas → deja notas opcionales → confirma
  → Recibe confirmación por WhatsApp + email (automático)
  → La reserva queda registrada en HubSpot

PASO 5 — VISITA AL ALIADO
  Llega al local → aliado le solicita su ID único
  → Aliado digita el ID en la plataforma → pantalla muestra:
       ✓ Nombre del suscriptor
       ✓ Estado: ACTIVO
       ✓ Descuento aplicable: XX%
       ✓ Nivel: Gold / Premium / Black
  → Se aplica el descuento · aliado marca reserva como "Atendida"

PASO 6 — POST-VISITA
  Suscriptor recibe WhatsApp/email: "¿Cómo fue tu experiencia?"
  → Califica aliado (1-5 estrellas + comentario opcional)
  → Plataforma actualiza ahorro acumulado · redenciones del aliado · progreso de nivel
  → Si hay referido activo: avanza su estado
```

### 4.2 Aliado — De Alerta a Atención

```
PASO 1 — ALERTA DE RESERVA
  Suscriptor reserva → aliado recibe WhatsApp + email
  → Aliado entra a la plataforma → ve solicitud en "Reservas pendientes"

PASO 2 — GESTIÓN
  Confirma o rechaza (con mensaje al suscriptor)
  → Si confirma: suscriptor recibe confirmación por WhatsApp + email
  → Bloquea capacidad para esa fecha/hora si es necesario

PASO 3 — VALIDACIÓN EN LOCAL
  Suscriptor llega · aliado digita ID
  → Sistema valida · muestra descuento aplicable
  → Aplica descuento y marca como "Atendida"

PASO 4 — MÉTRICAS
  Gamma Admin ve la redención en tiempo real
  → Se actualiza el ahorro del suscriptor
  → Alimenta el reporte mensual del aliado
```

### 4.3 Admin Gamma — Ciclo de Gestión

```
ONBOARDING ALIADO
  Aliado firma contrato → Admin crea cuenta en plataforma
  → Asigna nivel (Básico/Premium/Plus)
  → Aliado recibe acceso y completa su perfil público

MONITOREO CONTINUO
  Dashboard global muestra KPIs en tiempo real
  → Alerta si aliado sin redenciones en 60 días
  → Alerta de suscriptores próximos a vencer (30 días)
  → Reporte mensual generado automáticamente para CEO

COMUNICACIONES
  Crea newsletter en HubSpot segmentado por revista
  → Programa notificaciones WhatsApp a suscriptores
  → Gestiona calendario editorial de aliados destacados
```

### 4.4 Flujos de Conexión entre Actores

```
Suscriptor ──reserva──────────────────────────────► Aliado (alerta WhatsApp + email)
                                                          │ confirma/rechaza
                                                          ▼
                                                     Suscriptor (notificación)
                                                          │ asiste
                                                          ▼
                                                     Aliado valida ID → aplica descuento
                                                          │ marca "atendida"
                                                          ▼
                                                Gamma Admin ve redención + calificación

Aliado ──propone experiencia──► Gamma Admin (Comercial) ──aprueba──► catálogo público
Aliado ──solicita upgrade──────► Gamma Admin (Finanzas)  ──gestiona──► nuevo contrato
Suscriptor ──reporta aliado───► Gamma Admin ──investiga──► suspensión si aplica
```

---

## 5. KPIs — Métricas de Éxito

### 5.1 Suscriptores

| Métrica | Descripción | Frecuencia |
|---|---|---|
| **Suscriptores activos en plataforma** | % de base suscrita con al menos 1 login | Mensual |
| **Tasa de redención** | % de activos que redimieron en el mes | Mensual |
| **Frecuencia de uso** | Promedio de redenciones por suscriptor activo | Mensual |
| **Ahorro promedio generado** | COP ahorrado por suscriptor activo | Mensual |
| **Churn risk** | Activos en plataforma → inactivos en suscripción | Mensual |
| **Referidos efectivos** | Nuevas suscripciones generadas por referidos | Mensual |
| **NPS del programa** | Net Promoter Score (encuesta) | Trimestral |

### 5.2 Aliados

| Métrica | Descripción | Frecuencia |
|---|---|---|
| **Aliados activos** | Con al menos 1 redención en el mes | Mensual |
| **Redenciones por aliado** | Tráfico de suscriptores generado | Mensual |
| **Calificación promedio** | Rating 1-5 por aliado | Mensual |
| **Tiempo de respuesta reservas** | Horas entre solicitud y confirmación | Semanal |
| **Tasa de confirmación** | % reservas confirmadas vs. rechazadas | Mensual |
| **Aliados en riesgo** | Sin redenciones en 60 días → alerta comercial | Semanal |
| **Upgrades de plan** | Básico → Premium → Plus | Trimestral |

### 5.3 Revenue y Programa

| Métrica | Descripción | Frecuencia |
|---|---|---|
| **MRR membresías aliados** | Ingreso mensual recurrente por planes | Mensual |
| **Revenue total programa** | Membresías + comisiones | Mensual |
| **Costo por redención** | Costo operativo / total redenciones | Mensual |
| **Ahorro total generado** | Suma del ahorro entregado a suscriptores | Mensual |
| **LTV suscriptor** | Valor de vida amplificado por uso de beneficios | Trimestral |
| **Retención vinculada** | Diferencia de churn entre usuarios que usan vs. no usan la plataforma | Trimestral |

---

## 6. Gamificación

### 6.1 Sistema de Niveles

| Nivel | Cómo se alcanza | Beneficios adicionales |
|---|---|---|
| **Gold** (entrada) | Suscripción activa · primer login | Acceso al catálogo completo · descuentos estándar |
| **Premium** | 5+ redenciones acumuladas O 3 referidos efectivos | Beneficios temporales exclusivos · descuentos mejorados en aliados seleccionados |
| **Black** | 15+ redenciones acumuladas O 8 referidos efectivos | Acceso a experiencias VIP Línea 1 (cupos limitados) · beneficio de bienvenida en aliados Black · invitaciones a eventos editoriales |

> **Regla de protección:** para subir de nivel, los referidos deben registrarse por el link único oficial para evitar uso indebido.

### 6.2 Mecánicas de Activación

- **Rachas de uso:** "Llevas 3 meses seguidos usando tu beneficio" → badge en el perfil
- **Primer beneficio del mes:** notificación proactiva el día 1 recordando que hay beneficios disponibles
- **Aniversario de suscripción:** regalo sorpresa — experiencia o beneficio temporal exclusivo
- **Aliado favorito:** si el suscriptor visita 3+ veces el mismo aliado, aparece fijado como "Favorito" en su home
- **Reto mensual:** "Este mes: visita 2 aliados nuevos → desbloquea un beneficio especial"
- **Logro visible:** "Has ahorrado $X COP con tu suscripción este año" — driver de retención

### 6.3 Sistema de Referidos

```
Suscriptor genera link personal
  → Comparte por WhatsApp / redes
  → Amigo se suscribe usando el link
  → Sistema detecta la vinculación
  → Suscriptor recibe beneficio (por definir — alinear con Nicolás Serna)
  → Estado visible: Enviado → Registrado → Suscrito ✓
  → Contabiliza para progreso de nivel (Gold → Premium → Black)
```

---

## 7. Stack Tecnológico

### 7.1 Diagrama de Capas

```
                    ┌─────────────────────────────┐
                    │       FRONTEND (PWA)         │
                    │   Next.js + Tailwind CSS     │
                    │   Desplegado en Vercel        │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       BACKEND / API          │
                    │   Next.js API Routes         │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                         │
┌─────────▼────────┐  ┌───────────▼──────────┐  ┌──────────▼────────┐
│   BASE DE DATOS  │  │        AUTH          │  │  NOTIFICACIONES   │
│   Supabase       │  │   Supabase Auth      │  │ WhatsApp Biz API  │
│   (PostgreSQL)   │  │   (JWT + RLS)        │  │ + Email (Resend)  │
└──────────────────┘  └──────────────────────┘  └───────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │         INTEGRACIONES EXTERNAS         │
               │   HubSpot CRM · Wompi (pagos aliados)  │
               └───────────────────────────────────────┘
```

### 7.2 Decisiones por Capa

#### Frontend
| Tecnología | Justificación |
|---|---|
| **Next.js 14+** | PWA nativa · SSR/SSG · routing por rol de usuario · excelente DX |
| **Tailwind CSS** | Velocidad de UI sin design system complejo para MVP |
| **Vercel** | Deploy continuo · preview por PR · dominio propio fácil de configurar |

#### Backend y Base de Datos
| Tecnología | Justificación |
|---|---|
| **Supabase** | PostgreSQL gestionado + Auth + Storage + Row Level Security por rol |
| **Supabase Auth** | Login por email/teléfono · JWT · roles (suscriptor/aliado/admin) sin código extra |
| **Row Level Security** | Cada aliado ve solo sus datos · cada suscriptor solo el suyo — enforceado en DB |

#### Notificaciones
| Tecnología | Justificación |
|---|---|
| **WhatsApp Business API** (Twilio o 360dialog) | Canal principal — alta tasa de apertura · "trampolín" viable en MVP |
| **Resend** | Email transaccional moderno · plantillas HTML · fácil integración |
| *Push nativo* | Diferir a V2 — WhatsApp cubre la necesidad en MVP |

#### Integraciones
| Tecnología | Justificación |
|---|---|
| **HubSpot** | Ya conectado al stack de Gamma · registra reservas para trazabilidad completa |
| **Wompi** | Pasarela colombiana · integración sencilla · para cobro de membresías aliados |

### 7.3 Seguridad

- **JWT con refresh token seguro** — Supabase Auth lo maneja nativo
- **Row Level Security en DB** — ningún aliado accede a datos de otro
- **ID único:** no expone información personal; el sistema hace el lookup internamente
- **HTTPS obligatorio** — Vercel provee SSL automático en todos los ambientes
- **Logs de auditoría** — toda acción del admin queda registrada (quién, qué, cuándo)
- **Habeas Data** — formulario de consentimiento al registro · opción de solicitar eliminación

---

## 8. Fases de Desarrollo

| Fase | Alcance | Target |
|---|---|---|
| **MVP Beta** | Auth + catálogo + validación ID · reservas básicas · WhatsApp/email trampolín · 10-30 aliados piloto Diners · look & feel aprobado por Catalina | Sep 2026 |
| **V1 Full** | Expansión AXXIS · mis ahorros · métricas aliados · calendario editorial · gamificación niveles · programa referidos | Oct-Nov 2026 |
| **V2** | Wallet digital · vincular familia · benchmark por categoría · integración pago membresías · push nativo · posible app nativa | Ene 2027 |

---

## 9. Benchmark — Club Vivamos (El Tiempo Casa Editorial)

Precedente directo (2026-07-02, sugerido por Carolina): casa editorial multi-marca (El Tiempo, Portafolio, Aló, Bocas) con club de beneficios para suscriptores — mismo modelo de negocio que Beneficios Suscriptores. [clubvivamos.com](https://www.clubvivamos.com/), [eltiempo.com/zona-usuario/club-vivamos](https://www.eltiempo.com/zona-usuario/club-vivamos).

| Elemento | Club Vivamos (El Tiempo) | Beneficios Suscriptores (Gamma) |
|---|---|---|
| Categorías | Hogar y Servicios, Entretenimiento, Gastronomía, Salud y Bienestar, Turismo, Ropa y Accesorios (6) | Gastronomía, Arte, Bienestar, Moda, Viajes, Hogar — prácticamente equivalente |
| Validación | ID/cédula + carnet digital vía app | ID único sin QR — misma dirección, ya decidido |
| Cross-marca | Beneficios cruzados entre El Tiempo, Portafolio, Aló, Bocas | Cross-selling AXXIS↔Diners ya en el spec |
| Red de aliados | 130+ marcas, descuentos hasta 50% | Sin cifra objetivo aún — 10-30 aliados piloto Diners en MVP |
| Geolocalización | App ubica aliados cercanos por ciudad | **No contemplado** — hoy solo filtro por categoría |
| Beneficiarios familiares | Incluidos sin costo dentro de la misma suscripción, disponible ya | Marcado como V2 — Club Vivamos lo tiene desde el arranque |
| Monetización adicional | Alianza con tarjeta de crédito co-branded (El Tiempo–AV Villas) | No mapeado aún |

**Implicaciones a considerar (no decididas):**
1. Evaluar si geolocalización de aliados debería entrar al MVP en vez de diferirse — es la feature de descubrimiento central del precedente más cercano.
2. Revisar si "vincular beneficiarios/familia" (hoy V2) es viable adelantar al MVP — El Tiempo lo ofrece desde el día uno sin fricción aparente.
3. Explorar si una alianza de tarjeta co-branded (banca Grupo Bolívar) es una palanca de monetización adicional para Beneficios Suscriptores, en línea con la relación con Davivienda.

---

## 10. Decisiones Pendientes (bloquean MVP)

| Decisión | Responsable | Urgencia |
|---|---|---|
| Definir look & feel del MVP — moodboard y referencias visuales | Carolina + Juandy | **Alta** — validar con Catalina |
| URL definitiva de la plataforma | Carolina + Jeison | **Alta** |
| Método exacto de ID único: número suscripción / cédula / código generado | Grupo | **Alta** |
| ¿Desarrollo interno (Juandy) o externo? Evaluar fases y alcance | Carolina + Juandy | **Alta** |
| Proveedor WhatsApp Business API (Twilio / 360dialog / Meta directo) | Jeison | Media |
| Beneficio específico por referido exitoso | Carolina + Nicolás Serna | Media |
| Lógica aliados favoritos: manual vs. automático por historial | Carolina | Media |
| Rol exacto de María Claudia Vargas en el proyecto | Carolina | Media |

---

## Relacionado

[[Experiencias]] · [[Jeison Montero]] · [[Juan David Duran Lerma]] · [[Paola Pantaleon]] · [[Nicolas Serna]] · [[Carolina Ramirez]] · [[Nidia Alexandra Rodriguez Linares]] · [[Experiencias_05_Pipeline_ViveBeneficios.xlsx]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]] · [[06 - Meetings/Experiencias/2026-07-01 Equipo-Catalina - Propuesta Plataforma Lealtad]]

---

## Tags
#arquitectura #mvp #beneficios-suscriptores #pwa #producto #tech-stack #kpis #gamificacion #suscriptores #aliados #admin #experiencias #navegacion #ux
