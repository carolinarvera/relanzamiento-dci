---
date: 2026-08-09
type: draft-email
programa: Suscriptores
revista: AXXIS
estado: revisado — pendiente confirmar redes y acceso
herramienta: HubSpot
version: v2 — revisión editorial sobre versión de Carolina
---

# Email de Bienvenida — Suscriptores AXXIS

**Asunto:** La suscripción a AXXIS ya está activa
**Preheader:** Revista impresa, contenido web y correo semanal.

---

Hola {{contact.firstname}},

AXXIS es la revista colombiana de arquitectura, diseño e interiorismo. Cada edición reúne proyectos, entrevistas y tendencias: lo que está definiendo la manera de construir y habitar espacios en Colombia y el mundo.

**La suscripción incluye:**

• Revista impresa a domicilio, sin costo de envío
• Artículos exclusivos en la web y ediciones digitales completas de la revista

**Cada semana llega al correo:**

• Proyectos arquitectónicos y espacios que vale la pena conocer
• Entrevistas con arquitectos, diseñadores y creativos
• Tendencias en diseño, interiorismo y materiales
• Ideas para transformar espacios

En los próximos días llega la información de acceso a la zona premium.

[EXPLORAR LOS ÚLTIMOS CONTENIDOS]

Vale la pena seguir las redes de AXXIS: proyectos en detalle, adelantos de artículos y novedades.

[Instagram] · [Facebook] · [LinkedIn]

Gracias por ser parte de esta comunidad.

Equipo editorial · Revista AXXIS

---

## Correcciones aplicadas

| Original | Ajuste | Razón |
|---|---|---|
| "Hola," | "Hola {{contact.firstname}}," | El correo de Diners personaliza y este no. Debe ser consistente entre las dos revistas |
| Sin firma | "Equipo editorial · Revista AXXIS" | Diners cierra con firma editorial; AXXIS quedaba sin remitente visible |
| Sin redes | Bloque de redes agregado | Diners invita a seguir redes y AXXIS no. Misma lógica, canales distintos |

---

## Pendientes que bloquean el envío

1. **Redes sociales.** Se proponen Instagram, Facebook y LinkedIn por la audiencia profesional y porque LinkedIn B2B es needle mover de AXXIS. Confirmar con Paola Gordillo cuáles están activas y con qué @. Cuentas de AXXIS y Diners son independientes: verificar cada una por separado.
2. **URL del CTA** "Explorar los últimos contenidos".
3. **Token de nombre:** definir valor por defecto en HubSpot para contactos sin nombre.
4. **Zona premium en AXXIS:** confirmar que está habilitada. El proyecto `Zona-Premium-Suscriptores-AXXIS-Diners` cubre las dos revistas, pero si el acceso hoy solo funciona para Diners, esta línea no puede ir en el correo de AXXIS.

---

## Por qué AXXIS no menciona beneficios ni código de descuento

Dos razones, ambas de disponibilidad real:

**Beneficios Suscriptores todavía no cubre AXXIS.** Según `Arquitectura-Plataforma-Beneficios.md`, el MVP de septiembre es piloto solo con aliados Diners y la expansión AXXIS es V1 Full, entre octubre y noviembre de 2026. Cuando esté live se agrega la línea al listado.

**GAMMADINERS es código de Diners.** No hay constancia de un equivalente para AXXIS. Si Nicolás Serna confirma que existe uno, se suma al listado.

---

## Diferencia de tono frente a Diners

AXXIS es directo y funcional; Diners es cálido y aspiracional (base documentada en `04 - Growth System/Estrategia-WhatsApp-Gamma-2026.md`). Este correo abre con la definición de la revista y va al listado sin narrativa previa. El de Diners abre con una escena ("Un restaurante, un destino, un artista") antes de entrar en materia.

La audiencia también difiere: AXXIS es profesional (arquitectos, diseñadores, constructores), Diners es lifestyle premium.

---

## Relacionado

[[Email-Bienvenida-Beneficios-Diners]] · [[Arquitectura-Plataforma-Beneficios]]
