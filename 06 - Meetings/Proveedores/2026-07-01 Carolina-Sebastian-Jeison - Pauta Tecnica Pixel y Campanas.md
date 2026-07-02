---
date: 2026-07-01
type: meeting
tags: [meeting, pauta, meta-ads, pixel, conversion-api, landing-pages, suscripciones, libros, linkedin]
related-people: [Carolina Ramirez, Jeison Montero, Sebastian Diaz Caro]
related-projects: [Estrategia-Digital, HubSpot-CRM]
bu: [Revistas, AXXIS, Diners, Libros]
ai-first: true
confidence: high
---

## For future Claude
Reunión técnica de pauta con Sebastián Díaz Caro (Jul 1 2026). Foco: infraestructura base antes de escalar. Meta Pixel + API de Conversiones ya configurados via GTM (servidor gratuito con créditos Google). Embudo llega hasta "realizar pedido" — sin control sobre pasarela IPO/WPI. Estrategia suscripciones: 3 campañas segmentadas (seguidores, lookalike 3-5%, Club Privilegios) + exclusión suscriptores activos y vencidos. 3 landing pages independientes por segmento (no indexadas). Campaña activa NO se apaga — se reemplazan creativos por Reels. LinkedIn B2B para Q4. Ediciones Gama: tráfico libros top + conversión "libro del mes". Pendiente crítico de Carolina: enviar base suscriptores para exclusión.

---

# Reunión Pauta — Técnica Pixel, Campañas y Estrategia
**Fecha:** 2026-07-01
**Asistentes:** [[Carolina Ramirez]] · [[Jeison Montero]] · [[Proveedor Pauta digital Sebastian Diaz]] (diazcarosebastian@gmail.com)
**Lugar:** Gamma Sala Juntas

---

## Estado Infraestructura Técnica

### Meta Pixel + API de Conversiones
- **API de conversiones:** ya configurada via servidor en Google Tag Manager
- Captura datos aunque el píxel sea bloqueado por el dispositivo del usuario
- Mismo ID pixel + servidor → evita duplicidad de datos
- **Costo:** actualmente gratis (créditos Google) → supervisar a futuro

### Embudo de conversión
```
Usuario ve anuncio
     ↓
Landing page / sitio
     ↓
Botón "Realizar pedido" ← LÍMITE DEL TRACKING
     ↓
Pasarela de pago terceros (IPO/WPI) ← sin control aquí
     ↓
[Pendiente] Página de agradecimiento post-compra → medir resultado final
```

---

## Estrategia Campañas Suscripciones (AXXIS + Diners)

### 3 campañas segmentadas
| Campaña | Audiencia |
|---------|-----------|
| Seguidores + visitantes | Remarketing propio |
| Lookalike | 3%-5% Colombia (similares a suscriptores/visitantes) |
| Club de Privilegios | Afiliados (segmento específico) |

**Exclusión en todas las campañas:** suscriptores activos + suscriptores vencidos → optimiza presupuesto, evita impactar a quienes ya compraron.

**Pendiente de Carolina:** enviar base de datos de suscriptores activos a Sebastián para implementar la exclusión.

### Campaña activa — decisión clave
**NO apagar** la campaña de suscripciones actual → preservar aprendizaje del algoritmo Meta.
**Acción:** reemplazar activos de bajo rendimiento con formatos de video (Reels), usando video de portada.

### Landing pages
- **3 páginas independientes** por segmento de audiencia
- No indexadas → trazabilidad precisa en Google Analytics
- Permiten descuentos personalizados por segmento
- Sebastián las desarrolla con Juan (diseño/desarrollo)

---

## Estrategia Ediciones Gama (Libros)

| Tipo | Objetivo | Presupuesto |
|------|----------|-------------|
| Tráfico | Libros más vendidos → visitas al sitio | Normal |
| Conversión | "Libro del mes" → compra directa | Ajustado (menor volumen de datos inicial) |

Segmentación de datos de conversión (finalización de compra) ya avanzada para Libros.

---

## Creativos — Control de Calidad

**Problema identificado:** piezas sin contexto ni CTAs claros → no alinean con objetivo de la campaña.

**Estándar acordado:**
- Sebastián verifica calidad de activos ANTES de publicar
- Rechazar piezas que no se alineen con el objetivo (tráfico vs. conversión)
- Priorizar videos/Reels sobre imágenes estáticas sin propósito
- Exigir mayor nivel creativo al equipo

---

## LinkedIn B2B — Proyección Q4 2026

- **Foco:** ventas corporativas + venta espacios publicitarios revistas
- **Costo mínimo:** $10 USD/campaña
- **Segmentación:** por cargos + ciudades principales (evitar saturación de perfiles)
- **Pendiente:** análisis de viabilidad y segmentación por Sebastián

---

## Prioridad Estratégica — "Barrer la Casa"

> "El objetivo actual es asegurar que los píxeles, las bases de datos y la integración entre redes sociales estén funcionando correctamente ANTES de escalar con presupuestos mayores."
> — Carolina Ramirez, 2026-07-01

**Orden de prioridades:**
1. Infraestructura técnica funcionando (pixel, carrito, datos)
2. Bases de datos limpias y exclusiones activas
3. Creativos de calidad alineados al objetivo
4. Escalar presupuesto y estrategia

---

## Contenido — Alineación Orgánico + Pauta

- Estrategia de contenidos integral requerida (orgánico alinea con pauta)
- Contenido específico a desarrollar: informes descargables, convocatorias para que suscriptores postulen proyectos → captación clientes corporativos

---

## Próximos Pasos

### [[Carolina Ramirez]]
- [ ] 🔴 **Enviar base suscriptores activos a Sebastián** — para exclusión en audiencias de campañas · due 2026-07-04

### [[Proveedor Pauta digital Sebastian Diaz]] (Sebastián Díaz Caro)
- [ ] 🔴 **Cambiar campaña a objetivo conversiones** · due 2026-07-07
- [ ] 🔴 **Actualizar anuncios** — reemplazar activo actual por nuevo formato de video (Reels) · due 2026-07-07
- [ ] 🔴 **Actualizar proceso de suscripciones** según lo acordado en reunión · due 2026-07-07
- [ ] 🔴 **Desarrollar landing page** — reunirse con Juan para diseño y desarrollo · due 2026-07-11
- [ ] 🔴 **Validar pixel** en Ediciones Gama — confirmar recolección adecuada de datos · due 2026-07-07
- [ ] 🔴 **Verificar carrito de compras** — asegurar que el sistema genere datos correctamente · due 2026-07-07
- [ ] 🔴 **Revisar revistas** — verificar sistema sin errores y datos íntegros · due 2026-07-07
- [ ] 🟡 **Analizar LinkedIn Ads** — evaluar viabilidad, segmentación y costos para pauta B2B Q4 · due 2026-07-31

### Grupo
- [ ] 🔴 **Crear 3 landing pages independientes** — una por segmento de audiencia (seguidores, lookalike, Privilegios) · due 2026-07-11

---

## Relacionado
[[Proveedor Pauta digital Sebastian Diaz]] · [[Tasks/Revistas]] · [[Tasks/Libros]] · [[06 - Meetings/Proveedores/2026-06-18 Carolina-Sebastian-PaolaN-Jeison - Estrategia Pauta Meta AXXIS Diners Gamma]]
