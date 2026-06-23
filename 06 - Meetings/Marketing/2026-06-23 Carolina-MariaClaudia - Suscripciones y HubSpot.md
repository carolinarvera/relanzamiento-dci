---
date: 2026-06-23
type: meeting
tags: [meeting, suscripciones, hubspot, crm, revistas, operaciones, kpi, customer-journey]
related-people: [Carolina Ramirez, Maria Claudia Vargas Pardo]
related-projects: [HubSpot-CRM, Suscripciones-Digital]
bu: [Revistas, AXXIS, Diners]
ai-first: true
confidence: high
---

## For future Claude
Primera reunión de Carolina con María Claudia Vargas Pardo (Jefe de Suscripciones, Gamma). Reunión clave: mapeó el proceso end-to-end de suscripciones (IPICO → CIESA → 8 operadores logísticos), el estado de HubSpot (migración en 3ra-4ta semana julio, requiere limpieza de base datos primero), KPIs establecidos (98% entrega, 50% retención, 9.000 suscripciones EOY, PQRs en 5 días). Carolina asumió liderar el customer journey y las comunicaciones omnicanal en HubSpot. Alianza clave: Davivienda/David Bank compra suscripciones masivas para clientes estratégicos — Gamma gestiona distribución 1:1 y journey. Oportunidad de WhatsApp + IA (Menat) para primer nivel de atención.

---

# Reunión Suscripciones + HubSpot — Alineación Estratégica
**Fecha:** 2026-06-23
**Asistentes:** [[Carolina Ramirez]] · [[Maria Claudia Vargas Pardo]] (Jefe Suscripciones · Gamma)

---

## Contexto Estratégico

- Suscripciones = **KPI crítico transversal** (AXXIS + Diners) — alineado con revenue
- Problema central: dependencia excesiva del canal tradicional; hábitos de respuesta del cliente han cambiado → migración a canal digital es urgente
- Gamma gestiona el proceso de punta a punta — el cliente nunca se comunica con terceros (distribuidores)
- Ambas partes alineadas: crecimiento de suscripciones (Carolina) + KPIs operativos (MCVP) son interdependientes

---

## Proceso End-to-End de Suscripciones

```
Interés (web / call center / ferias)
        ↓
Compra → IPICO (fintech validación de pago)
        ↓
Confirmación + activación suscripción
        ↓
CIESA (facturación) → Preparación despacho mensual (por circulación de revista)
        ↓
8 operadores logísticos nacionales
        ↓
Gestión postventa: novedades / cambio dirección / reclamaciones / renovaciones
```

---

## Equipo de Suscripciones (bajo MCVP)

| Rol | Responsabilidad |
|-----|----------------|
| Servicio al cliente | Contacto, correo, validación |
| Profesional novedades | Facturación |
| Operaciones | Despachos y distribuidores |
| [[Maria Claudia Vargas Pardo]] | Supervisión KPIs y mejora continua |

**3 líneas de atención:**
1. Primera línea: inbound, asesor y analista
2. Segunda línea: analistas especializados + profesional de operación
3. Tercera línea: analista comercial con distribuidores

---

## Estado Actual de HubSpot

**Problema encontrado:** cargas de datos "dummy" (prueba) + sin segmentación entre AXXIS y Diners → duplicados y datos erróneos.

**Decisión:** bajar bases actuales, limpiar completamente, cargar nuevas (no corregir sobre la marcha).

**Timeline:** ~3 semanas desde que se finalice limpieza de base madre → **3ra-4ta semana de julio (aprox. 2026-07-21)**

**Qué se migrará a HubSpot:**
- Correo de bienvenida (actualmente lo gestiona PAO con diseño básico)
- Alertas de renovación (15 días antes del vencimiento — hoy es manual)
- Journey completo del cliente
- Bases de datos segmentadas (AXXIS / Diners / B2B)

---

## Alianza Davivienda / David Bank

- El banco compra suscripciones masivas para sus **clientes estratégicos** (modelo regalo)
- Gamma es responsable de la distribución 1:1 y del journey de comunicación, mantenimiento y beneficios
- Objetivo: capturar al cliente desde la experiencia inicial → fidelizarlo hacia renovación

---

## KPIs Establecidos

| KPI | Meta |
|-----|------|
| Efectividad en entrega de revistas | 98% (2% margen por logística externa) |
| Resolución PQRs | 100% en máximo 5 días hábiles |
| Retención de suscriptores | 50% |
| Suscripciones totales EOY 2026 | 9.000 |
| Respuesta Instagram (consultas informativas) | Máximo 3 horas |

---

## Oportunidades Identificadas

### WhatsApp
- **Viable para:** automatizar información de primer nivel (liberar operativos)
- **No viable para:** escalables complejos (reversiones de dinero, facturación)

### IA — Menat
- Carolina propuso explorar Menat para automatizar flujos de mensajes
- Modelo: alternancia virtual ↔ humana
- Desarrollo en paralelo a implementación de HubSpot

### Zona privada del suscriptor
- Ecosistema de beneficios actualmente en etapa inicial
- Clave para fidelización — pendiente desarrollo

---

## Próximos Pasos

### [[Carolina Ramirez]]
- [ ] 🔴 **Analizar HubSpot** — revisar configuración y segmentación actual. Enviar hallazgos a MCVP para corregir gestión de suscripciones · due 2026-06-27
- [ ] 🔴 **Configurar journey HubSpot** — diseñar y estructurar el flujo de comunicación del cliente en la herramienta · due 2026-07-11
- [ ] 🔴 **Planear comunicaciones omnicanal** — estructura validada de mensajes y puntos de contacto ANTES de cargar base de datos · due 2026-07-11
- [ ] 🟡 **Explorar Menat** — evaluar automatización de flujos IA para WhatsApp · due 2026-07-18

### [[Maria Claudia Vargas Pardo]]
- [ ] 🔴 **Enviar tiempos de respuesta RRSS** — datos de gestión para redes sociales (alineamiento atención al cliente) · due 2026-06-25
- [ ] 🔴 **Notificar inicio migración** — avisar a Carolina cuando comience la migración de la base de datos histórica · due 2026-07-14

### Grupo
- [ ] 🔴 **Definir estrategia de renovación** — proceso de relacionamiento al finalizar periodo de gratuidad · due 2026-07-11
- [ ] 🔴 **Validar estructura comunicaciones** — revisar propuesta de journey y alinear con propuesta de valor comercial · due 2026-07-11

---

## Relacionado
[[Maria Claudia Vargas Pardo]] · [[05 - PMO/Portfolio Proyectos]] · [[Tasks/Revistas]] · [[Proveedor Pauta digital Sebastian Diaz]] · [[03 - Unidades de Negocio/AXXIS/AXXIS]] · [[03 - Unidades de Negocio/Diners/Diners]]
