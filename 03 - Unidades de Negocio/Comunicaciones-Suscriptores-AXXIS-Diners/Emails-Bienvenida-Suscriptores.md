---
date: 2026-08-09
type: draft-email
programa: Beneficios Suscriptores
revista: Diners · AXXIS
estado: revisado — pendiente confirmar redes y accesos
herramienta: HubSpot
version: v2 (AXXIS) / v7 (Diners) — revisión editorial sobre versiones de Carolina
---

## For future Claude
Los dos correos de bienvenida (E1 del journey) en un solo archivo — antes vivían separados como `Email-Bienvenida-AXXIS.md` y `Email-Bienvenida-Beneficios-Diners.md` bajo Experiencias, mal ubicados porque son comunicaciones de suscriptores de Diners y AXXIS, no de Experiencias (movido y fusionado 2026-08-29). El resto del journey (E2 en adelante) vive en [[Journey-Emails-Suscriptores]]; el workflow de disparo en HubSpot en [[Workflow-HubSpot-Bienvenida-Suscriptores]]. AXXIS es directo y funcional, Diners es cálido y aspiracional — ver comparación de tono al final.

---

# Email de Bienvenida — Suscriptores Diners

**Asunto:** Diners tiene lo que vale la pena descubrir
**Preheader:** Revista impresa, plataforma digital y beneficios.

---

Hola {{contact.firstname}}, la suscripción ya está activa y trae una selección editorial en cada edición.

Un restaurante, un destino, un artista. Hay demasiado por leer, probar, ver y disfrutar.

Cada crónica reúne gastronomía, viajes, cultura y estilo de vida: historias, entrevistas y recomendaciones para aprovechar cada experiencia.

**La suscripción incluye:**

• Revista impresa a domicilio, sin costo de envío
• Artículos exclusivos en la web y ediciones digitales completas de la revista
• Beneficios, experiencias y descuentos con marcas seleccionadas
• 35% de descuento en todo el catálogo de Ediciones Gamma con el código GAMMADINERS

**Cada semana llega al correo:**

• Historias y entrevistas con protagonistas de la cultura
• Ideas de viaje y planes para inspirarse
• Tendencias en bienestar, arte y estilo de vida

En los próximos días llega la información de acceso a la zona premium.

[LEER MÁS] — Encontrar más artículos en la plataforma digital

Vale la pena seguir las redes de Diners: recomendaciones, adelantos de artículos y novedades.

[Facebook] · [Instagram] · [LinkedIn] · [X] · [Threads]

Gracias por ser parte de esta comunidad.

Equipo editorial · Revista Diners

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

## Por qué AXXIS no menciona beneficios ni código de descuento

Dos razones, ambas de disponibilidad real:

**Beneficios Suscriptores todavía no cubre AXXIS.** Según [[Arquitectura-Plataforma-Beneficios]], el MVP de septiembre es piloto solo con aliados Diners y la expansión AXXIS es V1 Full, entre octubre y noviembre de 2026. Cuando esté live se agrega la línea al listado. *(Nota: el catálogo de aliados revisado en [[Email-Recordacion-Beneficios]] cierra con Diners y AXXIS juntos — hay que confirmar cuál de los dos documentos está desactualizado antes de tocar este correo.)*

**GAMMADINERS es código de Diners.** No hay constancia de un equivalente para AXXIS. Si Nicolás Serna confirma que existe uno, se suma al listado.

---

## Diferencia de tono entre las dos revistas

AXXIS es directo y funcional; Diners es cálido y aspiracional (base documentada en `04 - Growth System/Estrategia-WhatsApp-Gamma-2026.md`). El correo de AXXIS abre con la definición de la revista y va al listado sin narrativa previa. El de Diners abre con una escena ("Un restaurante, un destino, un artista") antes de entrar en materia.

La audiencia también difiere: AXXIS es profesional (arquitectos, diseñadores, constructores), Diners es lifestyle premium.

**Consistencia aplicada entre ambos:** personalización con `{{contact.firstname}}` en los dos, firma "Equipo editorial · Revista [Nombre]" en los dos, bloque de redes en los dos (con cuentas propias — AXXIS y Diners son perfiles independientes, no compartir @).

---

## Pendientes que bloquean el envío

1. **Redes sociales.** AXXIS propone Instagram, Facebook y LinkedIn (audiencia profesional, LinkedIn B2B es needle mover). Diners enlaza cinco: Facebook, Instagram, LinkedIn, X y Threads. Confirmar con Paola Gordillo cuáles están activas para cada revista y con qué @ — mejor tres vivas que cinco a medias.
2. **URLs de los CTA** — "Explorar los últimos contenidos" (AXXIS) y "Leer más" (Diners).
3. **Token de nombre:** definir valor por defecto en HubSpot para contactos sin nombre, para que no salga "Hola ,".
4. **Zona premium en AXXIS:** confirmar que está habilitada — si hoy solo funciona para Diners, la línea de acceso no puede ir en el correo de AXXIS.
5. **Registro (usted o impersonal):** ambos correos están en impersonal. El catálogo de beneficios (ver [[Email-Recordacion-Beneficios]]) está en usted — decisión pendiente de unificar en toda la comunicación de suscriptores.

---

## Relacionado

[[Journey-Emails-Suscriptores]] · [[Workflow-HubSpot-Bienvenida-Suscriptores]] · [[Email-Recordacion-Beneficios]] · [[Arquitectura-Plataforma-Beneficios]]
