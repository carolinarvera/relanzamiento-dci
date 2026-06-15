---
date: 2026-06-14
type: task
assigned-to: Jeison Montero
unidad-de-negocio: Educacion Financiera
area: PMO/Tecnologia
prioridad: alta
impacto-kpi: Sesiones, Usuarios
status: pendiente
due: 2026-06-20
source: "03 - Unidades de Negocio/Plataformas/Educacion Financiera/Mis Finanzas para Mi Negocio/Informes 2026/2026-05 Informe Mayo - Mis Finanzas para Mi Negocio"
tags: [task, educacion-financiera, mi-negocio, ga4, spira, calidad-datos]
ai-first: true
---

## Qué está pasando

Spira es el ambiente de pruebas que usa el proveedor para desarrollar y testear la plataforma Mis Finanzas para Mi Negocio. Cuando los desarrolladores entran al sitio de pruebas para revisar cambios, esas visitas se están contando como si fueran visitas de usuarios reales en el reporte de analytics.

En mayo 2026, ese ambiente de pruebas generó **381 sesiones falsas** — el 33% del total reportado.

Esto significa que:
- El informe dice 1,149 sesiones reales
- La realidad: ~768 sesiones reales + 381 de los desarrolladores del proveedor
- Todas las métricas del mes están distorsionadas: rebote, duración, usuarios — todo inflado o alterado por tráfico que no es nuestro

**En resumen:** el proveedor está mezclando su propio tráfico interno con el nuestro, y eso hace que los números no sean reales.

---

## Qué pedirle al proveedor

1. **Corregir el problema técnico:** excluir el dominio `lbmisfinanzasparaminegocio.spira.co` de Google Analytics para que nunca más aparezca en los reportes.

2. **Confirmar en cada PDF mensual** que ese filtro está activo — una línea simple que diga: *"Dominio de pruebas Spira excluido del tracking GA4."* Así podemos verificar que los datos son limpios mes a mes.

---

Si el proveedor no tiene acceso para hacer el cambio en GA4, escalar a [[Maria Angelica Navarro]].
