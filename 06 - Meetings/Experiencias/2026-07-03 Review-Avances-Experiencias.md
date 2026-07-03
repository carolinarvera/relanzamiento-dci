---
date: 2026-07-03
type: meeting
tags: [experiencias, aliados, beneficios-suscriptores, banca-privada, corporativo, contratos, plataforma, figma]
related-people: [Carolina Ramirez, Jeison Montero, Paola Pantaleon, Paola Nossa, Natalia Castaño, Nicolas Serna]
related-projects: [Beneficios-Suscriptores, Experiencias]
ai-first: true
confidence: medium
nota-calidad: Notas auto-generadas por Gemini — complementadas con transcript. Confianza media.
---

## For future Claude
Reunión de review de avances del BU Experiencias del 2026-07-03. Decisiones clave: (1) confirma modelo de 2 ramas — Alianzas (always-on beneficios) y Experiencias (banca privada / VIP corporativo); (2) prospección de aliados por exclusividad y cobertura nacional, NO por descuentos; (3) desarrollo interno de plataforma confirmado — se rechaza proveedor externo; (4) QR descartado, se prefieren billeteras virtuales (Apple/Google Wallet); (5) hay que estandarizar proceso de contratación con Nancy y Camilo (roles por confirmar) para el jueves 2026-07-10. Pendientes importantes: enviar doc Grupo Smile a Catalina + Nidia para firma, onboarding newsletter aliados, entrar a Figma para prototipos. Ref: [[Arquitectura-Plataforma-Beneficios]] · [[Experiencias]]

---

# Review de Avances y Tareas — Experiencias

> **Fecha:** 2026-07-03
> **Sala:** Juntas Gamma
> **Participantes:** [[Carolina Ramirez]] · [[Jeison Montero]] · [[Paola Pantaleon]] · [[Paola Nossa]] · [[Natalia Castaño]] · [[Nicolas Serna]]
> **Fuente:** Notas + transcript Gemini · confianza media

---

## Decisiones Tomadas

### 1. Estructura del BU Experiencias — 2 ramas definitivas

Las tareas del BU se separan en dos categorías formales:

| Rama | Nombre | Foco | Aliado |
|---|---|---|---|
| **Alianzas** | Beneficios Suscriptores (always-on) | Club de beneficios con descuentos continuos para suscriptores | Contrato largo plazo · siempre en catálogo |
| **Experiencias** | Banca Privada + VIP Corporativo | Eventos y experiencias exclusivas one-time (aseguradoras, banca, convenciones) | Colaboración puntual · no vive en catálogo |

> Esto mejora la visibilidad del tablero de control y los procesos de contratación diferenciados.

### 2. Tipología y prospección de aliados

- **Criterio de prospección:** exclusividad del servicio + cobertura/ubicación nacional — **no** simples descuentos
- **Aliado Beneficios (always-on):** gastronomía, bienestar, arte, moda, viajes con descuentos permanentes. Ejemplo citado: **MOMA** (descuentos en entradas arte exclusivo)
- **Aliado Black/VIP:** experiencias diferenciales de alto valor — procesos de onboarding distintos y más ágiles
- **Intercambio comercial:** a aliados con presupuesto limitado, se les ofrece **visibilidad y pauta** a cambio de mejores tasas de descuento

### 3. Desarrollo tecnológico interno confirmado

- El equipo interno asume el desarrollo de la plataforma — **se rechaza el proveedor externo**
- **QR definitivamente descartado** — se prefieren **billeteras virtuales** (Apple Wallet / Google Wallet) como método de validación
- Implica actualizar la arquitectura: el ID único puede evolucionar a wallet digital desde el MVP o V1

### 4. Fase 2 — Experiencias VIP Corporativas

- Incluye aseguradoras, banca privada, convenciones
- Contactos de referencia: proporcionados por **Santiago** (pendiente identificar rol completo)
- Calendario anual de experiencias aprobado por La Vivienda (confirmado en reunión)
- Presentación a interesados: mostrar el modelo dividido en 2 ramas (corporativa B2B + always-on)

### 5. Estandarización de procesos de contratación

- Involucra a **Nancy**, **Camilo** (internos — roles por confirmar) y [[Nicolas Serna]]
- Proceso debe ser estándar y sencillo: formulario web + documentos definidos + vigencias + requisitos comerciales
- Meta: sin retrocesos en la comunicación con aliados

---

## Próximos Pasos (pendientes de esta reunión)

| Acción | Owner | Fecha límite | Urgencia |
|---|---|---|---|
| Organizar lista de aliados prospectados para Carolina | [[Jeison Montero]] | Por definir | Alta |
| Enviar doc Grupo Smile a Catalina + Nidia para firma (cc Nancy + Carolina RV) | [[Carolina Ramirez]] | Inmediato | **Crítico** |
| Consolidar procesos de contratación con Camilo para presentar el jueves | [[Carolina Ramirez]] | 2026-07-10 | Alta |
| Organizar información de la plataforma de beneficios visualmente para el equipo | [[Carolina Ramirez]] | En curso | Alta |
| Crear newsletter / boletín de bienvenida para aliados (onboarding) | [[Carolina Ramirez]] | Por definir | Media |
| Entrar a Figma para colaborar en prototipos visuales del MVP | [[Carolina Ramirez]] | Por definir | Media |
| Notificar al proveedor externo que no se procede con su cotización | [[Carolina Ramirez]] | Inmediato | Media |

---

## Personas por Confirmar

- **Nancy** — involucrada en procesos de contratación. Rol exacto desconocido.
- **Camilo** — involucrado en contratos y procesos internos. Diferente de [[Juan Camilo Perdomo]] (Babel/PR). Rol exacto desconocido.
- **Santiago** — proporcionó contactos de aseguradoras y banca para fase 2. Rol desconocido.

---

## Implicaciones para la Plataforma

| Decisión | Impacto en arquitectura |
|---|---|
| Billeteras virtuales preferidas sobre QR | "Mi ID" puede evolucionar a Apple/Google Wallet desde V1 (no V2 como estaba) |
| Desarrollo interno confirmado | Juandy lidera — evaluar capacidad vs. alcance del MVP |
| 2 tipos de aliado con procesos distintos | El módulo Admin debe diferenciar onboarding Aliado Beneficios vs. Aliado VIP |
| Proceso de contratación estándar (formulario web) | Crear formulario de registro de aliados como primer entregable de la plataforma |

---

## Relacionado

[[Arquitectura-Plataforma-Beneficios]] · [[Experiencias]] · [[Jeison Montero]] · [[Nicolas Serna]] · [[Paola Pantaleon]] · [[Juan David Duran Lerma]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]]

---

## Tags
#experiencias #aliados #beneficios-suscriptores #banca-privada #vip #contratos #plataforma #figma #desarrollo-interno #reunion
