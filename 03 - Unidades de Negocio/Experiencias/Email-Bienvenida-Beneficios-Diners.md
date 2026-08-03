---
date: 2026-08-03
type: draft-email
programa: Beneficios Suscriptores
revista: Diners
estado: borrador — pendiente aprobación
herramienta: HubSpot
---

# Email de Bienvenida — Beneficios Suscriptores (Diners)

**Asunto:** Ya tienes acceso a Beneficios Suscriptores
**Preheader:** Descuentos y experiencias curadas, solo para suscriptores Diners.

---

Hola {{contact.firstname}},

Ser suscriptor de Diners siempre ha significado algo más. Ahora también significa acceso.

Te damos la bienvenida a **Beneficios Suscriptores**: una selección curada de restaurantes, comercios y experiencias que hemos elegido pensando en lo que a ti te interesa. Nada masivo, nada genérico — solo lugares y marcas que merecen tu tiempo.

**¿Cómo funciona?**
Al presentarte en cualquiera de nuestros aliados, valida tu beneficio con tu número de suscriptor {{contact.numero_suscripcion}}. Así de simple.

**Algunos de los aliados disponibles hoy:**
— Oliveto
— La Cabrera
— Cafeto

*(seguimos sumando nuevos aliados cada mes)*

[Ver todos los beneficios →]

Esto es apenas el comienzo. En las próximas semanas iremos ampliando la lista de aliados y las formas de acceder a tu beneficio.

Bienvenido a un Diners que se vive, no solo se lee.

Revista Diners
Ediciones Gamma

---

## Notas para Carolina (no enviar)

- **Variable `numero_suscripcion`**: confirmar con Jeison si esa propiedad existe en HubSpot o si el ID de validación es cédula (mecánica aún sin decidir según Arquitectura-Plataforma-Beneficios.md). Ajustar antes de enviar.
- **Link "Ver todos los beneficios"**: apunta a landing en zona privada Diners o al prototipo `beneficios-suscriptores-prototipo.vercel.app` — definir cuál está activo al momento del envío.
- Tono validado contra `Estrategia-WhatsApp-Gamma-2026.md` (sección Diners: cálido, aspiracional, "acceso no notificación").
- Falta por definir: frecuencia y trigger de envío (¿automático al activar suscripción, o campaña única a base actual?).
- Pendiente crear versión AXXIS (tono directo/funcional) cuando confirmes seguir.
