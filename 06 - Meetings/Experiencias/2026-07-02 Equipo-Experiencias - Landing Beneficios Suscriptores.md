---
date: 2026-07-02
type: meeting
tags: [experiencias, beneficios-suscriptores, pwa, landing, ux, filtros, geolocalizacion, aliados, roadmap, silos]
related-people: [Carolina Ramirez, Paola Pantaleon, Jeison Montero, Nicolas Serna, Juan David Duran Lerma, Natalia Castaño]
related-projects: [Beneficios-Suscriptores, Experiencias]
ai-first: true
confidence: high
nota-calidad: Notas auto-generadas por Gemini a partir de transcripción — resumen y detalles con timestamps.
---

## For future Claude
Reunión de equipo completo del 2026-07-02 ("Página web beneficios suscriptores") donde se presentó una primera propuesta de arquitectura del portal. **Punto de atención:** esta reunión propuso redención por **código QR** generado al "activar" un beneficio — esa decisión fue **revertida al día siguiente** en [[06 - Meetings/Experiencias/2026-07-03 Review-Avances-Experiencias]] ("QR definitivamente descartado, se prefieren billeteras virtuales"). No usar el QR de esta reunión como arquitectura vigente. Lo que sí queda vigente: geolocalización de aliados, filtros de búsqueda ampliados, badges visuales, formulario Excel para carga de aliados, flujo simplificado de fase 1 (activación simple, reservas/calendario diferido a fase 2), calificación 1-5 estrellas sin comentarios por ahora, y el deadline del 31 de julio para la propuesta 360°. La reunión también expuso fricción interna: Paola Pantaleon, Nicolás Serna y Natalia Castaño sintieron que no fueron reconocidos como autores de ideas ya trabajadas previamente — se resolvió en la misma sesión, pero es una señal de silos y falta de liderazgo unificado que vale la pena que Carolina monitoree. Ref: [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]]

---

# Reunión — Página Web Beneficios Suscriptores

> **Fecha:** 2026-07-02
> **Sala:** Gamma Sala Juntas
> **Participantes:** [[Paola Pantaleon]] (Paola Andrea Pantaleon Allan) · [[Jeison Montero]] · [[Nicolas Serna]] (Nicolas Serna Diaz) · [[Carolina Ramirez]] · [[Juan David Duran Lerma]] (Juanda) · [[Natalia Castaño]] (Natalia Maria Castano Barrios)
> **Adjunto:** Página web beneficios suscriptores — PROYECTO: Plataforma de Beneficios-Lealtad
> **Fuente:** Notas + transcripción Gemini

---

## Resumen

El equipo definió una primera arquitectura del portal de beneficios y resolvió una fricción interna sobre autoría de la propuesta mediante alineación explícita. Fecha límite fijada: **31 de julio** para la propuesta integral (portal + alianzas + fases + responsables).

---

## Decisiones y Contenido Discutido

### 1. Arquitectura del portal — zona privada + landing pública
- Modelo con **página de aterrizaje pública** (landing) + **zona privada** para suscriptores logueados
- Landing debe ser atractiva y destacar los mejores beneficios para motivar la suscripción — referencia: modelo de El Tiempo
- Login se valida con **número de identificación** del suscriptor (consistente con decisión previa de ID único)

### 2. Geolocalización (⭐ nuevo — valida el benchmark Club Vivamos)
- Geolocalización **automática y manual** para ubicar aliados cercanos
- Objetivo: experiencia amigable y centralizada
- Esto resuelve la brecha señalada en el benchmark de Club Vivamos/El Tiempo del 2026-07-02 (ver [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] sección 9) — Gamma decide incorporarla

### 3. Búsqueda y filtros ampliados
- Filtro por categoría, % de descuento (mínimo/máximo), relevancia, fecha de adición, calificación del aliado
- Amplía el filtro simple por categoría que existía en la arquitectura anterior

### 4. Elementos visuales — badges tipo Amazon
- Distintivos en las tarjetas de beneficios: % de descuento (ej. 20%, 30%), "experiencia nueva", "destacado"
- Lógica de descubrimiento inspirada en plataformas de e-commerce

### 5. Redención — propuesta con QR (⚠️ revertida al día siguiente)
- Propuesta: suscriptor "activa" un beneficio → sistema genera **código QR único** + notificación
- Aliado escanea el QR para validar la redención
- Objetivo declarado: centralizar fechas de uso y valoraciones
- **Nota crítica:** esta propuesta fue descartada en la reunión del 2026-07-03 ("QR definitivamente descartado — se prefieren billeteras virtuales Apple/Google Wallet"). No es la arquitectura vigente.

### 6. Flujo de fase 1 vs. fase 2
- **Fase 1 (MVP):** flujo simple de "activar beneficio" → genera código/notificación. Sin sistema de reservas.
- **Fase 2:** calendario y disponibilidad en tiempo real (reservas) — se difiere por complejidad técnica
- Esto es una simplificación de alcance respecto a la arquitectura previa, que incluía "Reservas" (flujo fecha→personas→confirmación) como módulo MVP completo — **revisar si sigue vigente o si el flujo de reservas pasa a V1/fase 2**

### 7. Sistema de calificación — simplificado
- Escala de 1 a 5 estrellas para medir satisfacción
- Se evita **por ahora** comentarios escritos o sistema de PQR en la calificación post-redención, para mantener la operación inicial controlada
- (Distinto del módulo "Asistencia" que sí mantiene PQRS para reportar problemas con aliados)

### 8. Perfil del suscriptor
- Número de identificación, estado del plan (activo/vencido), fecha de vencimiento, histórico de redenciones

### 9. Gestión de aliados — formulario Excel estándar
- Mientras no exista panel administrador propio, se usará un **formulario Excel estandarizado** (nombre, servicios, categoría) para la carga inicial de datos de aliados
- Evita desorden en la fase de arranque

### 10. Contenido premium — sigue sin resolver
- Aún no se define cómo integrar o vincular el contenido premium de las revistas con la plataforma de beneficios
- Consistente con el bloqueante ya conocido: conversación pendiente con Sandra Martínez (Editorial)

### 11. Actualización de alianzas (Nicolás Serna)
- Kit de medios compartido con equipo de **Treme** para su próxima reunión
- Gestiones en curso con **Hilton Corferias** y **Hotel W** para brunches y alianzas
- Meta: retomar contacto con aliados previos (Oliveto, Noe Cabrales, La Cabrera, entre otros) para llegar a **10-15 aliados** activos al cierre de mes

---

## Fricción Interna — Autoría de la Propuesta

Natalia Castaño, Nicolás Serna y Paola Pantaleon expresaron frustración al ver presentada una propuesta sobre la que ya habían trabajado previamente, sintiendo que no fueron reconocidos como parte del desarrollo de la idea. Se atribuyó a silos comunicativos y falta de liderazgo unificado en meses anteriores. El equipo acordó dejar de lado el malentendido y trabajar de forma unificada.

**Para Carolina:** esto es una señal de que la coordinación entre Paola (Alianzas), Nicolás (Comercial) y Jeison (Plataforma) necesita un canal más explícito antes de presentar avances — vale la pena revisar cómo se están comunicando los avances entre las áreas para que no se repita.

---

## Próximos Pasos

| Acción | Owner | Notas |
|---|---|---|
| Definir funcionalidades del portal | Juan David Duran Lerma | Basado en necesidades del equipo |
| Crear formulario Excel de aliados | Juan David Duran Lerma | Carga inicial estandarizada |
| Revisar integración de contenido premium de revistas | Juan David Duran Lerma | Aún sin resolver |
| Desarrollar bocetos/mockups | Juan David Duran Lerma | Sobre el esquema de arquitectura definido |
| Definir si el sistema opera con reservas o activación simple | Grupo | Ver punto 6 — impacta fases MVP/V1 |
| Coordinar mesas de trabajo entre áreas | Grupo | Evitar trabajo en silos |
| Definir categorías del catálogo de aliados | Juan David Duran Lerma | — |
| Enviar lista de pendientes por el grupo de chat | [[Jeison Montero]] | — |
| Agendar reunión de empaquetamiento y gestión de aliados | [[Paola Pantaleon]] | — |
| Crear roadmap (fases, tiempos, tareas, responsables) | [[Jeison Montero]] | Para la propuesta de fin de mes |
| Revisar dashboards y dar feedback | Grupo | — |
| Retomar contacto con aliados para llegar a 15 alianzas activas | [[Nicolas Serna]] | Cierre de mes |

**Deadline general: propuesta integral 360° (portal + alianzas + fases + responsables) — 31 de julio 2026.**

---

## Relacionado

[[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] · [[Experiencias]] · [[06 - Meetings/Experiencias/2026-07-01 Carolina-Jeison-Juandy - Landing Vive Beneficios]] · [[06 - Meetings/Experiencias/2026-07-03 Review-Avances-Experiencias]] · [[Paola Pantaleon]] · [[Jeison Montero]] · [[Nicolas Serna]] · [[Juan David Duran Lerma]] · [[Natalia Castaño]] · [[Carolina Ramirez]]

---

## Tags
#beneficios-suscriptores #landing #ux #filtros #geolocalizacion #aliados #roadmap #silos #reunion
