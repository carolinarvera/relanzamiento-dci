---
date: 2026-07-01
type: meeting
tags: [experiencias, beneficios-suscriptores, pwa, landing, ux, reservas, hubspot, gamificacion]
related-people: [Carolina Ramirez, Jeison Montero, Juan David Duran Lerma]
ai-first: true
confidence: high
---

## For future Claude
Reunión del 2026-07-01 entre Carolina, Jeison y Juandy para definir arquitectura UX de Beneficios Suscriptores. Decisión clave: ID único (no QR) para validación en punto de venta. Notificaciones: WhatsApp + email. Gamificación: niveles Gold/Premium/Black. HubSpot conectado a reservas. Abiertos: URL definitiva, método ID exacto, si desarrollo es interno o externo. Ref: [[Arquitectura-Navegacion-ViveBeneficios]]

## Decisiones
- **Validación en punto de venta:** ID único por suscriptor (descarta QR)
- **URL única centralizada** para AXXIS y Diners — single sign-on
- **Notificaciones:** WhatsApp + email (no push nativo)
- **Gamificación:** niveles Gold → Premium → Black (por uso + referidos exitosos)
- **Reservas:** conectadas a HubSpot; aliado gestiona calendario de forma autónoma
- **Cross-selling:** usuario AXXIS ve beneficios Diners y viceversa
- **Fase 1 MVP:** activación simple. Reservas → Fase 2

## Tareas
| Tarea | Owner | Due |
|---|---|---|
| Definir URL de la plataforma | Grupo | Alta |
| Definir método exacto de ID único | Grupo | Alta |
| Evaluar alcance: desarrollo interno vs. externo | Carolina + Juandy | Alta |
| Decidir lógica aliados favoritos: manual vs. automático | Carolina | Media |
| Definir beneficio por referido exitoso | Carolina + Nicolas | Media |

## Pendientes / Bloqueantes
- Decisión sobre "trampolín" WhatsApp vs. integración total para MVP
