---
date: 2026-08-09
type: draft-email
programa: Beneficios Suscriptores
revista: Diners
estado: borrador — pendiente aprobación
herramienta: HubSpot
version: v4 — versión con catálogo real, reemplaza 3 iteraciones anteriores
---

## For future Claude
Campaña recurrente de recordación de beneficios a la base activa de suscriptores Diners. No es parte del journey de bienvenida: va a toda la base, no se dispara por evento. El copy del journey vive en [[Journey-Emails-Suscriptores]]. **Esta es la versión final** — reemplaza tres iteraciones previas (borrador inicial, versión "sibarita premium", versión "comercial y humana") que se descartaron por probar ángulos que el catálogo real de aliados terminó de resolver; quedan en el historial de git, no en este archivo. Movido desde Experiencias 2026-08-29 — es comunicación de suscriptores Diners, no de Experiencias.

---

# Email de Recordación de Beneficios — Suscriptores Diners

**Segmento:** suscriptores Diners activos
**Excluir:** quienes entraron al journey de bienvenida en los últimos 30 días, para que no reciban lo mismo dos veces
**Frecuencia sugerida:** mensual, atado a la entrada de nuevos aliados — si un mes no hay aliados nuevos, saltarse el envío es mejor que mandarlo igual

**Asunto:** $190.000 en bonos para suscriptores
**Preheader:** Oliveto, La Cabrera, Sauvage y trece aliados más.

---

Hola {{contact.firstname}},

La suscripción incluye un plan de beneficios con dieciséis aliados activos. Solo en bonos de restaurante suman $190.000.

**Los imperdibles del mes**

**Oliveto** · Bono de $50.000 por consumos desde $250.000
Bogotá, presencial. Hasta el 31 de agosto.

**La Cabrera** · Bono de $50.000 por consumos desde $250.000
Zona G, Bogotá. Hasta el 31 de agosto.

**Kaffeto Gourmet** · 20% en toda la tienda en línea
Hasta el 31 de agosto.

**Nuevos este mes**

**Sauvage** · Bono de $50.000, redimible de inmediato desde $270.000. Lunes a jueves.
**Frenchie Bistró Bar** · Bono de $40.000 desde $200.000. Martes a jueves.
**Oka Grill House** · Brunch con open bar por $150.000, en vez de $200.000. Sábados de 12 a 4.
**Kyva** · Membresía Elite gratis y hasta 25% en licores y vinos de alta gama.
**Maestri** · Hasta 27% en compras, experiencias y catas.

Y nueve más: Tremé, Mundo Orgánico, Granel Gourmet, Casa Oromazo, Noé Cabrales, Merlada Vivant, #Pollos, y descuentos en boletería para El Mesías de Handel y Wanderlust.

[VER TODOS LOS BENEFICIOS]

**Así de fácil es usarlo**

Al llegar al aliado basta con dar el número de cédula. El aliado confirma la suscripción y aplica el beneficio en el momento. En los aliados en línea, el descuento se aplica con el código.

**Además, todo el año**

35% en el catálogo de Ediciones Gamma con el código GAMMADINERS, y acceso a la zona premium con artículos exclusivos y ediciones digitales completas.

[VER TODOS LOS BENEFICIOS]

Gracias por ser parte de esta comunidad.

Equipo editorial · Revista Diners

---

## Por qué esta versión es la vigente

El catálogo real cambia el argumento: con dieciséis aliados y bonos concretos, el correo no tiene que insinuar valor, lo puede sumar. $190.000 solo en bonos de Oliveto, La Cabrera, Sauvage y Frenchie compite de frente con el precio de la suscripción y sirve de asunto. Dieciséis aliados no caben en un correo — los tres destacados y cinco nuevos prueban que la lista es real, el resto va por nombre y el catálogo completo detrás del botón.

**#Pollos se dejó fuera del cuerpo del correo** (combos desde $20.000 desentonan al lado de vinos de alta gama y catas) aunque sigue en el catálogo completo. Vale la pena revisar con Paola Pantaleon el criterio de prospección — el documento de arquitectura dice que se prospecta por exclusividad del servicio, no por descuento.

**El registro es usted**, porque el catálogo de aliados que ve el suscriptor al hacer clic está escrito en usted ("Disfrute las experiencias que hemos elegido para usted"). Si el correo habla distinto a la página a la que lleva, se nota. La decisión de registro venía pendiente desde la bienvenida y esto la resuelve para toda la comunicación de suscriptores.

---

## Correcciones que trajo el catálogo real

- **El aliado se llama Kaffeto Gourmet, no Cafeto.** Corregido aquí; pendiente corregir también en [[Journey-Emails-Suscriptores]] (E3, E5).
- **La vigencia es el 31 de agosto, no el 30** — toda la urgencia de versiones anteriores usaba la fecha equivocada.
- **Sauvage vence el 30 de agosto de 2027, no 2026** — es el único con vigencia larga, vale la pena aprovecharlo cuando los demás venzan.
- **El código de Wanderlust en el catálogo dice DINNERS15 (dos enes).** Verificar cuál está cargado realmente en el sistema de canje — si el código real es DINERS15, cada persona que copie el del correo va a fallar y a reclamar.
- **La mecánica descrita en el catálogo no coincide con la del journey.** El catálogo dice que el paso a paso llega "tan pronto como realice su suscripción"; el journey lo manda al día 7. Alinear los dos.

---

## Advertencia sin resolver: recordación o anuncio

El programa arrancó en modo manual alrededor del 11 de julio de 2026. Cualquiera que se haya suscrito antes de esa fecha **nunca supo que estos beneficios existían** — para buena parte de la base este correo no es un recordatorio sino un anuncio. El copy actual no asume conocimiento previo (no dice "recuerda que" ni "como ya sabes"), así que funciona para los dos públicos. Separar en dos versiones (antes/después del 11 de julio) solo vale la pena si la base anterior es grande — revisar en HubSpot.

## Advertencia sin resolver: los beneficios, ¿cubren AXXIS?

El catálogo de aliados cierra mencionando Revista Diners **y** Revista AXXIS, mientras que [[Arquitectura-Plataforma-Beneficios]] dice que la expansión a AXXIS es de octubre o noviembre. Uno de los dos documentos está desactualizado — confirmar antes de escalar este correo o crear su versión AXXIS. Si se confirma que AXXIS aún no tiene acceso, revisar que no haya quedado ninguna mención cruzada suelta en el journey o el workflow.

---

## Objeción sin resolver: la cédula

El correo pide dar el número de cédula en el restaurante. En una base que promedia 45 años y en un país con sensibilidad al uso de datos personales, es una fricción real que el correo no responde. Hoy el aliado busca la cédula en un Google Sheets compartido. Antes de agregar cualquier frase tranquilizadora, confirmar con Jeison qué ve exactamente el aliado y si queda registro de la consulta — si el aliado ve la base completa de suscriptores en vez de solo confirmar un estado, es un problema de habeas data que se resuelve antes de escribir más copy.

---

## Pendientes

1. **Vigencia después del 31 de agosto** de Oliveto, La Cabrera y Kaffeto Gourmet — define si el próximo envío lleva urgencia. Confirmar con Paola Pantaleon.
2. **Alcance del 35% en libros:** exclusiones, mínimo de compra y vencimiento del código. Con Nicolás Serna.
3. **Código de Wanderlust** — DINERS15 vs DINNERS15, verificar en el sistema.
4. **Enlace de recuperación de acceso** a la zona premium y **URL de la página de beneficios** para el CTA.
5. **Redes activas y sus @** — con Paola Gordillo.
6. **Tamaño de la base suscrita antes del 11 de julio** — para decidir si conviene separar anuncio y recordatorio.
7. **Resolver si AXXIS ya tiene beneficios** — impacta este correo, el journey y el workflow por igual.

---

## Relacionado

[[Journey-Emails-Suscriptores]] · [[Emails-Bienvenida-Suscriptores]] · [[Arquitectura-Plataforma-Beneficios]]
