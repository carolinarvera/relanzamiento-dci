---
date: 2026-07-01
type: product-spec
tags: [experiencias, vive-beneficios, pwa, arquitectura, mvp, producto, tech-stack, kpis, gamificacion]
related-people: [Carolina Ramirez, Jeison Montero, Juan David Duran Lerma, Catalina Obregon, Paola Pantaleon]
related-projects: [Vive-Beneficios]
ai-first: true
confidence: high
status: borrador-v1
version: v1.0
---

## For future Claude
Documento maestro de arquitectura de la Plataforma de Programa de Beneficios de Ediciones Gamma (nombre propuesto: Vive Beneficios). Consolida decisiones de reuniones del 2026-07-01 (Jeison + Juandy + Carolina / Catalina presencial). Cubre: tipología de usuarios, módulos, flujos, KPIs, gamificación y stack tecnológico. Es el input definitivo para cotizar desarrollo externo o evaluar alcance con Juandy. Ref: [[Arquitectura-Navegacion-ViveBeneficios]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]] · [[06 - Meetings/Experiencias/2026-07-01 Equipo-Catalina - Propuesta Plataforma Lealtad]]

---

# Arquitectura — Plataforma de Programa de Beneficios
### Vive Beneficios · Ediciones Gamma · v1.0 · 2026-07-01

> **Producto:** Programa de beneficios exclusivos para suscriptores de Revista Diners y AXXIS
> **Tipo de beneficios:** Descuentos y alianzas con restaurantes, comercios y experiencias curadas
> **Alcance inicial:** MVP web y móvil (PWA — Progressive Web App)
> **Owner producto:** [[Carolina Ramirez]] · **Owner técnico:** [[Jeison Montero]]

---

## 1. Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLATAFORMA VIVE BENEFICIOS                   │
│                        (URL única — PWA)                        │
├──────────────┬──────────────────────┬───────────────────────────┤
│  SUSCRIPTOR  │       ALIADO         │    GAMMA ADMIN            │
│  (Diners /   │  (comercio, rest.,   │  (Carolina, Jeison,       │
│   AXXIS)     │   experiencia)       │   Paola P.)               │
├──────────────┴──────────────────────┴───────────────────────────┤
│                     CAPA DE SERVICIOS                           │
│   Reservas · Validación ID · Notificaciones · HubSpot CRM       │
├─────────────────────────────────────────────────────────────────┤
│                   INTEGRACIONES EXTERNAS                        │
│   HubSpot · WhatsApp · Email · Pasarela de pago (Niveles)       │
└─────────────────────────────────────────────────────────────────┘
```

**Principios clave:**
- **Single sign-on:** un login por suscriptor, independiente de si es Diners o AXXIS
- **Cross-selling nativo:** suscriptor AXXIS ve beneficios Diners y viceversa
- **Validación sin QR:** aliado digita el ID único del suscriptor → sistema confirma estado + descuento
- **Mobile-first:** funciona desde el navegador del celular sin descarga de app

---

## 2. Tipología de Usuarios

### 2.1 Suscriptor

| Atributo | Detalle |
|---|---|
| **Quién es** | Persona con suscripción activa a Revista Diners o AXXIS |
| **Acceso** | ID único personal (método: por definir — número suscripción, cédula, o código) |
| **Objetivo** | Descubrir y redimir beneficios exclusivos por su suscripción |
| **Canal principal** | Celular (PWA) + WhatsApp + email |
| **Niveles** | Gold → Premium → Black (gamificación) |

### 2.2 Aliado

| Atributo | Detalle |
|---|---|
| **Quién es** | Restaurante, comercio o proveedor de experiencias con contrato vigente |
| **Acceso** | NIT + email registrado en contrato |
| **Objetivo** | Recibir y gestionar reservas · validar suscriptores · medir su desempeño |
| **Canal principal** | Web (desktop) + WhatsApp/email para alertas |
| **Planes** | Básico · Premium · Plus |

### 2.3 Gamma Admin

| Atributo | Detalle |
|---|---|
| **Quién es** | Equipo interno de Ediciones Gamma |
| **Roles** | Super Admin / Comercial / Comunicaciones / Finanzas |
| **Objetivo** | Vista 360 del programa: aliados, suscriptores, revenue, métricas |
| **Canal principal** | Web (desktop) |

---

## 3. Módulos Principales

### 3.1 Módulos del Suscriptor

| Módulo | Qué hace |
|---|---|
| **Home / Dashboard** | Beneficios destacados del mes · próximas reservas · ahorro acumulado · CTA referir amigo |
| **Explorar Beneficios** | Catálogo en tarjetas/carrusel · filtros por categoría (Gastronomía, Bienestar, Arte, Moda, Viajes) · filtro por revista · búsqueda por nombre |
| **Perfil del Aliado** | Descripción · galería · descuento activo · dirección + mapa · horario · reseñas · **CTA Reservar** |
| **Reservas** | Agendar · modificar · cancelar · historial · calificar post-visita · conectado a HubSpot |
| **Mi ID** | Número único personal · nombre · revista · nivel activo · fecha vencimiento |
| **Mis Ahorros** | Total acumulado COP · ahorro este mes · por categoría · comparar vs. costo suscripción |
| **Referir un Amigo** | Link personal · estado de referidos · beneficio por referido exitoso |
| **Mi Perfil** | Datos · preferencias de categorías · configuración de notificaciones |
| **Asistencia** | FAQ · reporte de problema con aliado · chat con equipo Gamma |

### 3.2 Módulos del Aliado

| Módulo | Qué hace |
|---|---|
| **Dashboard** | Reservas pendientes hoy · suscriptores atendidos · ahorro generado a sus clientes · alertas |
| **Reservas** | Confirmar / rechazar solicitudes · marcar como atendida · bloquear fechas · historial |
| **Mi Oferta** | Descuento fijo activo · crear oferta temporal · preview de cómo se ve en catálogo |
| **Validar Suscriptor** | Campo para digitar ID del suscriptor → sistema muestra: nombre, estado activo/inactivo, descuento aplicable |
| **Mis Métricas** | Redenciones · suscriptores únicos · calificación promedio · día/hora pico · exportar reporte |
| **Mi Perfil Público** | Editar nombre, fotos (hasta 8), horario, categoría · vista previa como suscriptor |
| **Calendario** | Gestión autónoma de disponibilidad y horarios sin intermediación de Gamma |
| **Proponer Experiencia** | Formulario → llega al equipo Comercial de Gamma (Nicolás Serna) |
| **Mi Plan** | Plan actual · comparativa con planes superiores · **CTA Upgrade** · historial de facturación |
| **Materiales** | Logo "Aliado Vive Beneficios" · guía de protocolo de validación |

### 3.3 Módulos del Administrador (Gamma)

| Módulo | Qué hace |
|---|---|
| **Dashboard Global** | KPIs ejecutivos en tiempo real · suscriptores activos · aliados activos · revenue · alertas |
| **Gestión Suscriptores** | Lista completa · perfil individual · activar/desactivar · notificar · segmentar · exportar |
| **Gestión Aliados** | Onboarding · cambiar nivel · suspender · métricas · alertas de aliados sin redenciones en 60 días |
| **Catálogo & Categorías** | Administrar categorías · aliados destacados · beneficios temporales · orden de aparición |
| **Solicitudes Comerciales** | Propuestas de experiencia de aliados · aprobar/rechazar · asignar ejecutivo |
| **Revenue & Facturación** | Membresías activas · renovaciones próximas · generar factura electrónica · exportar a contabilidad |
| **Comunicaciones** | Newsletter (HubSpot) segmentado por revista · notificaciones WhatsApp · calendario editorial |
| **Reportes** | Reporte mensual ejecutivo · top aliados/suscriptores · análisis churn · exportar CSV/Excel |

---

## 4. Flujo del Usuario — User Journey Completo

### 4.1 Suscriptor: De Login a Redención Exitosa

```
PASO 1 — ACCESO
  ↓
  Suscriptor ingresa a la URL de la plataforma
  → Pantalla de login: ingresa número de suscripción (o cédula)
  → Sistema valida estado: activo ✓ / vencido ✗
  → Si vencido: mensaje de renovación + link para suscribirse

PASO 2 — DESCUBRIMIENTO
  ↓
  Llega al Home: ve beneficios destacados del mes
  → Navega al catálogo: filtra por categoría (ej. Gastronomía)
  → Explora tarjetas de aliados con logo, nombre, descuento y categoría
  → Aplica filtros: tipo, zona, descuento mínimo
  → Selecciona un aliado → abre perfil completo

PASO 3 — DECISIÓN
  ↓
  Lee perfil del aliado: descripción, galería, horarios, ubicación
  → Ve el descuento exacto que aplica a su nivel de suscriptor
  → Lee reseñas de otros suscriptores
  → Hace clic en "Reservar"

PASO 4 — RESERVA
  ↓
  Elige fecha y hora disponible (calendario del aliado)
  → Selecciona número de personas
  → Deja notas opcionales
  → Confirma la reserva
  → Recibe confirmación por WhatsApp + email (automático)
  → La reserva queda registrada en HubSpot

PASO 5 — VISITA AL ALIADO
  ↓
  Llega al local
  → Aliado le solicita su ID único (número de suscripción o cédula)
  → Aliado ingresa el ID en la plataforma
  → Pantalla del aliado muestra:
       ✓ Nombre del suscriptor
       ✓ Estado: ACTIVO
       ✓ Descuento aplicable: XX%
       ✓ Nivel: Gold / Premium / Black
  → Se aplica el descuento
  → Aliado marca la reserva como "Atendida"

PASO 6 — POST-VISITA
  ↓
  Suscriptor recibe WhatsApp/email: "¿Cómo fue tu experiencia?"
  → Califica aliado (1-5 estrellas + comentario opcional)
  → Plataforma actualiza:
       - Ahorro acumulado del suscriptor
       - Redenciones del aliado
       - Progreso de nivel (Gold → Premium si aplica)
  → Si hay referido activo: progresa el estado del referido
```

### 4.2 Aliado: De Alerta a Atención

```
PASO 1 — ALERTA DE RESERVA
  ↓
  Suscriptor reserva → aliado recibe WhatsApp + email
  → Aliado entra a la plataforma
  → Ve solicitud en "Reservas pendientes"

PASO 2 — GESTIÓN
  ↓
  Confirma o rechaza (con mensaje al suscriptor)
  → Si confirma: suscriptor recibe confirmación
  → Bloquea capacidad para esa fecha/hora si es necesario

PASO 3 — VALIDACIÓN EN LOCAL
  ↓
  Suscriptor llega · aliado digita ID
  → Sistema valida · muestra descuento aplicable
  → Aplica descuento y marca como "Atendida"

PASO 4 — MÉTRICAS
  ↓
  Administrador Gamma ve la redención en tiempo real
  → Se actualiza el ahorro del suscriptor
  → Alimenta el reporte mensual del aliado
```

### 4.3 Admin Gamma: Ciclo de Gestión

```
ONBOARDING ALIADO
  ↓
  Aliado firma contrato → Admin crea cuenta en plataforma
  → Asigna nivel (Básico/Premium/Plus)
  → Aliado recibe acceso y completa perfil

MONITOREO CONTINUO
  ↓
  Dashboard global muestra KPIs en tiempo real
  → Alerta si aliado sin redenciones en 60 días
  → Alerta de suscriptores próximos a vencer (30 días)
  → Reporte mensual generado automáticamente para CEO

COMUNICACIONES
  ↓
  Crea newsletter en HubSpot segmentado por revista
  → Programa notificaciones push a suscriptores
  → Gestiona calendario editorial de aliados destacados
```

---

## 5. Métricas de Éxito (KPIs)

### 5.1 KPIs de Suscriptores

| Métrica | Descripción | Frecuencia |
|---|---|---|
| **Suscriptores activos en plataforma** | % de base suscrita que ha hecho login al menos 1 vez | Mensual |
| **Tasa de redención** | % de suscriptores activos que redimieron en el mes | Mensual |
| **Frecuencia de uso** | Promedio de redenciones por suscriptor activo | Mensual |
| **Ahorro promedio generado** | COP ahorrado por suscriptor activo | Mensual |
| **Churn risk** | Suscriptores activos en plataforma → inactivos en suscripción | Mensual |
| **Referidos efectivos** | Nuevas suscripciones generadas por programa de referidos | Mensual |
| **NPS del programa** | Net Promoter Score del programa (encuesta trimestral) | Trimestral |

### 5.2 KPIs de Aliados

| Métrica | Descripción | Frecuencia |
|---|---|---|
| **Aliados activos** | Aliados con al menos 1 redención en el mes | Mensual |
| **Redenciones por aliado** | Tráfico suscriptores generado a cada aliado | Mensual |
| **Calificación promedio** | Rating 1-5 por aliado | Mensual |
| **Tiempo de respuesta reservas** | Horas entre solicitud y confirmación del aliado | Semanal |
| **Tasa de confirmación** | % reservas confirmadas vs. rechazadas | Mensual |
| **Aliados en riesgo** | Sin redenciones en 60 días → alerta comercial | Semanal |
| **Upgrades de plan** | Aliados Básico → Premium → Plus | Trimestral |

### 5.3 KPIs de Revenue y Programa

| Métrica | Descripción | Frecuencia |
|---|---|---|
| **MRR membresías aliados** | Ingreso mensual recurrente por planes de aliados | Mensual |
| **Revenue total programa** | Ingresos por membresías + comisiones | Mensual |
| **Costo por redención** | Costo operativo dividido entre total de redenciones | Mensual |
| **Ahorro total generado** | Suma total de ahorro entregado a suscriptores | Mensual |
| **LTV suscriptor** | Valor de vida del suscriptor amplificado por uso de beneficios | Trimestral |
| **Retención vinculada** | Diferencia en churn entre suscriptores que usan vs. no usan la plataforma | Trimestral |

---

## 6. Gamificación

### 6.1 Sistema de Niveles

| Nivel | Cómo se alcanza | Beneficios adicionales |
|---|---|---|
| **Gold** (entrada) | Suscripción activa · primer login | Acceso al catálogo completo · descuentos estándar |
| **Premium** | 5+ redenciones acumuladas O 3 referidos efectivos | Acceso a beneficios temporales exclusivos · descuentos mejorados en aliados seleccionados |
| **Black** | 15+ redenciones acumuladas O 8 referidos efectivos | Acceso a experiencias VIP de Línea 1 (cupos limitados) · beneficio de bienvenida en aliados Black · invitaciones a eventos editoriales |

> **Regla de protección:** para subir de nivel, los referidos deben registrarse por canales oficiales (link de referido único) para evitar uso indebido.

### 6.2 Mecánicas de Activación

- **Rachas de uso:** "Llevas 3 meses seguidos usando tu beneficio" → badge en el perfil
- **Primer beneficio del mes:** notificación proactiva el día 1 recordando que hay beneficios disponibles
- **Aniversario de suscripción:** regalo sorpresa (experiencia o beneficio temporal exclusivo)
- **Aliado favorito:** si un suscriptor visita 3+ veces al mismo aliado, el aliado aparece fijado como "Favorito" en su home
- **Reto mensual:** "Este mes: visita 2 aliados nuevos → desbloquea un beneficio especial"
- **Logros visibles:** contador en el perfil — "Has ahorrado $X COP con tu suscripción este año"

### 6.3 Sistema de Referidos

```
Suscriptor genera link personal
  → Comparte por WhatsApp / redes
  → Amigo se suscribe usando el link
  → Sistema detecta la vinculación
  → Suscriptor recibe beneficio (por definir con Nicolás Serna)
  → Estado visible en plataforma: Enviado → Registrado → Suscrito ✓
  → Contabiliza para progreso de nivel
```

**Beneficio por referido exitoso:** *pendiente de definir — alinear con Nicolás Serna.*

---

## 7. Stack Tecnológico Sugerido

### 7.1 Visión General

```
                    ┌─────────────────────────────┐
                    │     FRONTEND (PWA)           │
                    │   Next.js + Tailwind CSS     │
                    │   Desplegado en Vercel        │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     BACKEND / API            │
                    │   Next.js API Routes         │
                    │   (o Node.js separado)       │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                         │
┌─────────▼────────┐  ┌───────────▼──────────┐  ┌──────────▼────────┐
│   BASE DE DATOS  │  │      AUTH            │  │   NOTIFICACIONES  │
│   Supabase       │  │   Supabase Auth      │  │  WhatsApp API     │
│   (PostgreSQL)   │  │   (JWT + RLS)        │  │  + Email (Resend) │
└──────────────────┘  └──────────────────────┘  └───────────────────┘
          │
┌─────────▼────────────────────────────────┐
│         INTEGRACIONES EXTERNAS           │
│  HubSpot CRM · Pasarela de pago (Wompi)  │
└──────────────────────────────────────────┘
```

### 7.2 Decisiones por Capa

#### Frontend
| Tecnología | Justificación |
|---|---|
| **Next.js 14+** | PWA nativa, SSR/SSG, routing por rol de usuario, excelente DX |
| **Tailwind CSS** | Velocidad de UI sin design system complejo para MVP |
| **Vercel** | Deploy continuo, preview por PR, dominio propio fácil de configurar |

#### Backend y Base de Datos
| Tecnología | Justificación |
|---|---|
| **Supabase** | PostgreSQL gestionado + Auth + Storage + Row Level Security por rol de usuario |
| **Supabase Auth** | Login por email/teléfono, JWT, roles (suscriptor/aliado/admin) sin código extra |
| **Row Level Security** | Cada aliado ve solo sus datos; cada suscriptor ve solo el suyo — enforceado en DB |

#### Notificaciones
| Tecnología | Justificación |
|---|---|
| **WhatsApp Business API** (vía Twilio o 360dialog) | Canal principal de alertas para aliados y suscriptores — alta tasa de apertura |
| **Resend** (email) | Transaccional moderno, fácil de integrar, plantillas HTML |
| *Push nativo (V2)* | Diferir a V2 — WhatsApp cubre la necesidad en MVP |

#### CRM e Integraciones
| Tecnología | Justificación |
|---|---|
| **HubSpot** | Ya conectado al stack de Gamma; registra reservas para trazabilidad |
| **Wompi** (pasarela de pago) | Colombiana, integración sencilla, para cobro de membresías aliados |

#### Gestión del Proyecto
| Tecnología | Justificación |
|---|---|
| **GitHub** | Control de versiones, PRs, CI/CD |
| **Vercel** | Ambientes staging + producción separados |
| **Linear o Notion** | Gestión de tareas de desarrollo (si es desarrollo externo) |

### 7.3 Consideraciones de Seguridad

- **Autenticación:** JWT con expiración corta + refresh token seguro (Supabase Auth maneja esto)
- **Roles en DB:** Row Level Security garantiza que ningún aliado accede a datos de otro
- **ID único suscriptor:** no expone información personal directamente; el sistema hace el lookup internamente
- **HTTPS obligatorio:** Vercel provee SSL automático
- **Logs de auditoría:** toda acción del admin queda registrada (quién hizo qué y cuándo)
- **GDPR / Habeas Data:** formulario de consentimiento al registro; opción de solicitar eliminación de datos

---

## 8. Fases de Desarrollo (MVP → Escala)

| Fase | Alcance | Target | Prioridad |
|---|---|---|---|
| **MVP Beta** | Auth + catálogo + validación ID + reservas básicas + 10-30 aliados piloto Diners · WhatsApp/email trampolín · look & feel aprobado por Catalina | Sep 2026 | P0 |
| **V1 Full** | Expansión AXXIS · mis ahorros · métricas aliados · calendario editorial · gamificación niveles | Oct-Nov 2026 | P1 |
| **V2** | Referidos gamificados · wallet digital · benchmark por categoría · integración pago membresías en plataforma · posible app nativa | Ene 2027 | P2 |

---

## 9. Decisiones Pendientes (Bloquean MVP)

| Decisión | Responsable | Urgencia |
|---|---|---|
| Definir look & feel del MVP — moodboard y referencias visuales | Carolina + Juandy | **Alta** · validar con Catalina |
| URL definitiva de la plataforma | Carolina + Jeison | **Alta** |
| Método exacto de ID único: número suscripción / cédula / código | Grupo | **Alta** |
| ¿Desarrollo interno (Juandy) o externo? Evaluar fases y alcance | Carolina + Juandy | **Alta** |
| Beneficio por referido exitoso | Carolina + Nicolás Serna | Media |
| Lógica aliados favoritos: manual vs. automático por historial | Carolina | Media |
| Proveedor WhatsApp Business API para MVP (Twilio / 360dialog / Meta directo) | Jeison | Media |
| Rol exacto de María Claudia Vargas en proyecto | Carolina | Media |

---

## Relacionado

[[Arquitectura-Navegacion-ViveBeneficios]] · [[Experiencias]] · [[Jeison Montero]] · [[Juan David Duran Lerma]] · [[Paola Pantaleon]] · [[Nicolas Serna]] · [[Experiencias_05_Pipeline_ViveBeneficios.xlsx]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]] · [[06 - Meetings/Experiencias/2026-07-01 Equipo-Catalina - Propuesta Plataforma Lealtad]]

---

## Tags
#arquitectura #mvp #vive-beneficios #pwa #producto #tech-stack #kpis #gamificacion #suscriptores #aliados #admin #experiencias
