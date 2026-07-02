---
date: 2026-07-01
type: meeting
tags: [experiencias, vive-beneficios, pwa, landing, ux, flujo, reservas, hubspot, gamificacion, desarrollo]
related-people: [Carolina Ramirez, Jeison Montero, Juan David Duran Lerma]
related-projects: [Vive-Beneficios, PWA-360]
ai-first: true
confidence: high
---

## For future Claude
Reunión del 2026-07-01 entre Carolina, Jeison Montero y Juan David Duran Lerma ("Juandy") para definir arquitectura UX, flujo de páginas y operatividad de la plataforma Vive Beneficios. Decisiones clave: ID único en lugar de QR para validación, notificaciones híbridas WhatsApp + email, gamificación de suscriptores con niveles Gold/Premium/Black, autogestión de calendario por aliado, HubSpot conectado a reservas. Quedan abiertos: URL definitiva, método exacto de ID único, y evaluación de si el desarrollo es interno (con Juandy) o externo. Ref: [[Arquitectura-Navegacion-ViveBeneficios]] · [[Experiencias]]

---

# Reunión — Landing & Flujo Vive Beneficios

> **Fecha:** 2026-07-01
> **Participantes:** [[Carolina Ramirez]] · [[Jeison Montero]] · [[Juan David Duran Lerma]] (Juandy)
> **Adjunto revisado:** Flujo WhatsApp

---

## Decisiones Tomadas

### 1. URL centralizada única
- Una sola URL para la plataforma de aliados/beneficios
- Integrada con plataforma de Diners y AXXIS
- Suscriptores acceden con un inicio de sesión único independientemente de la revista origen

### 2. Interfaz y visualización
- Diseño visual tipo **tarjeta o carrusel** para mostrar aliados
- Organización por categorías (restaurantes, experiencias, bienestar, etc.)
- Logos de aliados prominentes para identificación rápida

### 3. Landing suscriptores — contenido definido
- Oferta clara de beneficios
- Directorio completo de aliados
- Categorías de búsqueda + filtros
- Experiencias destacadas
- **Cross-selling AXXIS ↔ Diners:** usuario de AXXIS ve beneficios Diners y viceversa — incentivo suscripción combinada

### 4. Perfil y personalización
- Sección de perfil donde suscriptor selecciona categorías favoritas
- **Top 5 aliados favoritos:** debate entre selección manual vs. automático por historial de uso
  - *Pendiente de decidir:* automático basado en últimas redenciones vs. manual

### 5. Gamificación y niveles de suscriptor ← NUEVO
- Modelo de niveles: **Gold → Premium → Black**
- Nivel sube según: uso de beneficios + referidos efectivos
- Niveles superiores dan acceso a experiencias exclusivas
- Requisito: beneficiarios deben registrarse por canales oficiales para evitar uso indebido

### 6. Sistema de referidos
- Suscriptores generan referidos efectivos → reciben beneficios y experiencias adicionales
- Vinculado al sistema de niveles (gamificación)
- *Pendiente:* definir qué beneficio exacto por referido exitoso

### 7. Flujo de reservas
- Landing de reservas donde suscriptor puede: **agendar · modificar · cancelar**
- **Conectado a HubSpot** para trazabilidad completa
- Información sincronizada entre suscriptores y aliados

### 8. Notificaciones híbridas ← CAMBIO vs. arquitectura anterior
- **WhatsApp + email** (no push notifications como canal primario)
- Aliado recibe confirmación de reserva
- Suscriptor recibe recordatorio y actualizaciones
- Modelo "trampolín" WhatsApp evaluado para MVP (redirección vs. integración total)

### 9. Autogestión del aliado
- Aliados gestionan su calendario de disponibilidad de forma autónoma
- Pueden bloquear fechas y modificar horarios directamente en la plataforma
- Reduce intervención manual del equipo Gamma

### 10. Validación en punto de venta: ID único ← CONFIRMA decisión previa
- **Se descarta QR** — se usará un **ID único** por suscriptor
- Aliado ingresa el ID en la plataforma → sistema muestra estado activo/inactivo + descuento aplicable
- Más simple de implementar, no expone información sensible del suscriptor

---

## Pendientes Abiertos

| Decisión | Responsable | Urgencia |
|----------|-------------|----------|
| Definir URL de la plataforma | Grupo | Alta |
| Definir método exacto de ID único (número suscripción, cédula, código generado) | Grupo | Alta |
| Evaluar alcance técnico con Juandy: ¿desarrollo interno o externo? | Carolina + Juandy | Alta |
| Definir modelo "trampolín" WhatsApp vs. integración total para MVP | Grupo | Media |
| Decidir lógica aliados favoritos: manual vs. automático por historial | Carolina | Media |
| Definir beneficio específico por referido exitoso | Carolina + Nicolás | Media |

---

## Contexto Técnico Discutido

- Se evaluó viabilidad de construir internamente vs. contratar externamente
- "Trampolín" = redirección a WhatsApp como canal de notificación en MVP (más rápido de implementar que integración nativa)
- Integración interna con plataformas Diners y AXXIS como requisito para single sign-on

---

## Relacionado

[[Arquitectura-Navegacion-ViveBeneficios]] · [[Experiencias]] · [[Jeison Montero]] · [[Juan David Duran Lerma]] · [[Experiencias_05_Pipeline_ViveBeneficios.xlsx]]

---

## Tags
#vive-beneficios #landing #ux #flujo #reservas #hubspot #gamificacion #id-unico #whatsapp #pwa #reunion
