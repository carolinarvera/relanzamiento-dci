---
date: 2026-06-14
type: task
assigned-to: Jeison Montero
unidad-de-negocio: Educacion Financiera
area: Plataformas
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

En mayo 2026, ese ambiente de pruebas generó **38 sesiones de prueba** — el 3.3% del total reportado. No es un volumen que distorsione gravemente los KPIs, pero es incorrecto que aparezca: es tráfico interno del proveedor contando como si fuera tráfico de usuarios reales.

**En resumen:** el proveedor está mezclando su propio tráfico interno con el nuestro, y eso hace que los números no sean reales.

---

## Qué pedirle al proveedor

1. **Corregir el problema técnico:** excluir el dominio `lbmisfinanzasparaminegocio.spira.co` de Google Analytics para que nunca más aparezca en los reportes.

2. **Confirmar en cada PDF mensual** que ese filtro está activo — una línea simple que diga: *"Dominio de pruebas Spira excluido del tracking GA4."* Así podemos verificar que los datos son limpios mes a mes.

---

Si el proveedor no tiene acceso para hacer el cambio en GA4, escalar a [[Maria Angelica Navarro]].
