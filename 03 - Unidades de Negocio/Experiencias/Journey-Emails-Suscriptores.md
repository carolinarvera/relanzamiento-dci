---
date: 2026-08-09
type: email-journey
programa: Beneficios Suscriptores
revista: Diners · AXXIS
estado: borrador — pendiente aprobación
herramienta: HubSpot
version: v1
---

## For future Claude
Journey completo de correos a suscriptores de Diners y AXXIS. El correo de bienvenida vive en archivos aparte ([[Email-Bienvenida-Beneficios-Diners]] y [[Email-Bienvenida-AXXIS]]). Este documento cubre del segundo correo en adelante. Todo el copy va en voz impersonal, sin exagerar y sin emojis. La mecánica de beneficios descrita aquí es la **manual real** (aliado verifica cédula en Google Sheets), no la del MVP de septiembre.

---

# Journey de Correos — Suscriptores

## Mapa

| # | Correo | Disparador | Segmento | KPI |
|---|---|---|---|---|
| E1 | Bienvenida | Suscripción confirmada | Todos | Apertura |
| E2 | Accesos zona premium | 48 h después de E1, o al generar credenciales | Todos | Primer login |
| E3 | Cómo usar los beneficios | Día 7 | Solo Diners | Primera redención |
| E4 | Recordatorio de acceso | Día 15, solo si no hubo login | Condicional | Login tardío |
| E5 | Beneficios sin estrenar | Día 45, solo si no hubo redención | Condicional Diners | Redención |
| E6 | Nueva edición | Al publicar cada edición | Todos | Clic a plataforma |
| E7 | Renovación anticipada | 45 días antes del vencimiento | Por vencer | Renovación |
| E8 | Último aviso de renovación | 15 días antes del vencimiento | Por vencer | Renovación |
| E9 | Recuperación | 15 días después del vencimiento | Vencidos | Reactivación |

---

## E2 — Accesos a la zona premium

**Disparador:** 48 horas después de la bienvenida, o en cuanto se generen las credenciales
**Segmento:** todos los suscriptores nuevos

**Asunto:** Datos de acceso a la zona premium
**Preheader:** Usuario y contraseña para la plataforma digital.

---

Hola {{contact.firstname}},

Estos son los datos para ingresar a la zona premium:

Usuario: {{contact.usuario_plataforma}}
Contraseña temporal: {{contact.password_temporal}}

Conviene cambiar la contraseña en el primer ingreso, desde Mi perfil.

En la zona premium están los artículos exclusivos, las ediciones digitales completas y el archivo de ediciones anteriores.

[INGRESAR A LA ZONA PREMIUM]

Si el acceso no funciona, basta con responder este correo.

Equipo editorial · Revista Diners

---

## E3 — Cómo usar los beneficios

**Disparador:** día 7
**Segmento:** solo Diners. AXXIS no tiene beneficios hasta la expansión de octubre o noviembre

**Asunto:** Cómo usar los beneficios de la suscripción
**Preheader:** Basta con el número de cédula al llegar al aliado.

---

Hola {{contact.firstname}},

La suscripción incluye descuentos en restaurantes y comercios seleccionados. Usarlos toma tres pasos:

1. Elegir un aliado de la lista.
2. Al llegar, dar el número de cédula.
3. El aliado verifica la suscripción y aplica el descuento.

No hace falta carnet, código ni aplicación.

**Aliados disponibles:**

• Oliveto
• La Cabrera
• Cafeto

La lista crece cada mes con restaurantes y comercios elegidos por el equipo editorial.

[VER TODOS LOS BENEFICIOS]

Equipo editorial · Revista Diners

---

## E3 alterno — Versión comercial

Mismo disparador y segmento. Registro comercial: el beneficio primero, la instrucción después.

**Asunto:** Restaurantes, libros y zona premium
**Preheader:** Tres beneficios incluidos, sin costo adicional.

---

Hola {{contact.firstname}},

La suscripción a Diners no termina en la revista impresa. Incluye tres beneficios más, activos desde ya y sin costo adicional.

**Descuentos en restaurantes**

Oliveto · {{descuento_oliveto}}
La Cabrera · {{descuento_cabrera}}
Cafeto · {{descuento_cafeto}}

Restaurantes que ya estaban en la lista de recomendados de la revista. Ahora, además, cuestan menos. Para usarlo basta con dar el número de cédula al llegar: el aliado verifica la suscripción y aplica el descuento. Sin carnet, sin código, sin aplicación.

La lista crece cada mes con nuevos aliados.

**35% en el catálogo de Ediciones Gamma**

El código GAMMADINERS aplica en los libros del catálogo, durante toda la vigencia de la suscripción.

**Zona premium**

Artículos exclusivos, ediciones digitales completas y el archivo de ediciones anteriores. Los datos de acceso llegaron por correo hace unos días.

[VER TODOS LOS BENEFICIOS]

Equipo editorial · Revista Diners

---

### Qué hace comercial a esta versión

Presenta los tres beneficios juntos, que es el argumento más fuerte disponible: por separado cada uno se ve pequeño, sumados justifican la suscripción. El asunto nombra las tres categorías en cuatro palabras, así que el valor se entiende sin abrir. Los aliados van con nombre propio porque Oliveto y La Cabrera cargan su propio prestigio. Y la línea sobre los recomendados de la revista conecta el beneficio con la autoridad editorial, que es lo único que un club de descuentos cualquiera no puede copiar.

### Lo que falta para que funcione

**Los porcentajes de los restaurantes.** Sin la cifra real este correo pierde su fuerza. Están como tokens para completarlos sin reescribir el copy. Pedirlos a Paola Pantaleon.

**El alcance del 35% en libros.** El correo dice "los libros del catálogo". Confirmar con Nicolás Serna si aplica a todo el catálogo o hay exclusiones, y si existe mínimo de compra. También si el código tiene fecha de vencimiento: el texto dice que dura toda la vigencia de la suscripción, y eso hay que respaldarlo.

**La vigencia de los aliados.** Los tres beneficios destacados vencen el 30 de agosto de 2026. Si no se renuevan, este correo queda desactualizado en tres semanas. Alternativa comercial: poner la fecha explícita y usar el vencimiento como urgencia, aunque ese recurso solo funciona una vez.

**Zona premium en el día 7.** El bloque asume que el correo de credenciales ya llegó, lo cual es cierto según el calendario del workflow. Si alguien nunca abrió ese correo, este bloque le sirve de segundo recordatorio, que es una ventaja adicional de sumarlo aquí.

### Sobre el argumento de retorno

La línea que más convertiría es cuantificar cuánto de la suscripción devuelven los beneficios: dos visitas al mes con determinado descuento, más un libro con el 35%, equivalen a una porción concreta de lo que costó. Con los tres beneficios juntos ese cálculo es mucho más contundente que solo con restaurantes.

Hacen falta dos datos que no están en el vault: los porcentajes reales de los aliados y el valor de la suscripción. Con eso la línea se calcula y se agrega, y el mensaje pasa de "beneficios simpáticos" a "la suscripción se paga sola".

### Asuntos alternativos

| Asunto | Caracteres |
|---|---|
| Restaurantes, libros y zona premium | 35 |
| Tres beneficios incluidos en la suscripción | 43 |
| La suscripción incluye más que la revista | 41 |
| Descuentos activos en Oliveto y La Cabrera | 42 |

---

## E4 — Recordatorio de acceso

**Disparador:** día 15, solo si no hubo primer login
**Segmento:** condicional, ambas revistas

**Asunto:** La zona premium sigue sin estrenar
**Preheader:** Los datos de acceso siguen disponibles.

---

Hola {{contact.firstname}},

La suscripción da acceso a la zona premium, donde están los artículos exclusivos, las ediciones digitales completas y el archivo de ediciones anteriores.

Los datos de acceso llegaron hace unos días. Si se perdieron entre el correo, aquí está el enlace para recuperarlos:

[RECUPERAR ACCESO]

Y si algo no funciona, basta con responder este correo.

Equipo editorial · Revista Diners

---

## E5 — Beneficios sin estrenar

**Disparador:** día 45, solo si no hubo ninguna redención
**Segmento:** condicional, solo Diners

**Asunto:** Tres aliados con descuento para suscriptores
**Preheader:** El beneficio se activa con el número de cédula.

---

Hola {{contact.firstname}},

Los descuentos de la suscripción están disponibles en:

• **Oliveto**
• **La Cabrera**
• **Cafeto**

Para usarlos basta con dar el número de cédula al llegar. El aliado verifica la suscripción y aplica el descuento.

[VER LOS BENEFICIOS]

Equipo editorial · Revista Diners

---

## E6 — Nueva edición

**Disparador:** al publicar cada edición
**Segmento:** todos, versión por revista

**Asunto:** Ya está la edición de {{mes}}
**Preheader:** Disponible en la zona premium y camino a casa.

---

Hola {{contact.firstname}},

La edición de {{mes}} ya está en la zona premium, y la versión impresa va camino a la dirección registrada.

En esta edición:

• {{titular_1}}
• {{titular_2}}
• {{titular_3}}

[LEER LA EDICIÓN]

Equipo editorial · Revista Diners

---

## E7 — Renovación anticipada

**Disparador:** 45 días antes del vencimiento
**Segmento:** suscripciones por vencer

**Asunto:** La suscripción vence el {{fecha_vencimiento}}
**Preheader:** Renovar toma un minuto y evita la interrupción.

---

Hola {{contact.firstname}},

La suscripción vence el {{fecha_vencimiento}}. Renovarla ahora evita que se interrumpa la entrega de la revista y el acceso a la zona premium.

Durante este año la suscripción incluyó {{ediciones_recibidas}} ediciones impresas, acceso completo a la plataforma y descuentos en los aliados del programa.

[RENOVAR LA SUSCRIPCIÓN]

Equipo editorial · Revista Diners

---

## E8 — Último aviso de renovación

**Disparador:** 15 días antes del vencimiento
**Segmento:** por vencer, sin renovación registrada

**Asunto:** Quedan 15 días de suscripción
**Preheader:** Después del {{fecha_vencimiento}} se suspende el acceso.

---

Hola {{contact.firstname}},

La suscripción vence el {{fecha_vencimiento}}. Después de esa fecha se suspenden la entrega de la revista impresa, el acceso a la zona premium y los descuentos con aliados.

[RENOVAR LA SUSCRIPCIÓN]

Si hay alguna duda sobre la renovación, basta con responder este correo.

Equipo editorial · Revista Diners

---

## E9 — Recuperación

**Disparador:** 15 días después del vencimiento
**Segmento:** vencidos sin renovar

**Asunto:** La suscripción quedó vencida
**Preheader:** Reactivarla restablece el acceso completo.

---

Hola {{contact.firstname}},

La suscripción venció el {{fecha_vencimiento}} y con ella se suspendió el acceso a la zona premium, la entrega de la revista y los descuentos con aliados.

Reactivarla restablece todo desde la siguiente edición.

[REACTIVAR LA SUSCRIPCIÓN]

Y si la decisión fue no continuar, vale la pena saber por qué. Dos preguntas, un minuto:

[CONTAR POR QUÉ]

Equipo editorial · Revista Diners

---

## Secuenciación recomendada

No construir los nueve de una vez. El orden por retorno:

**Primero: E2, E3 y E6.** Son los que sostienen el uso del producto. E2 desbloquea el acceso, E3 activa el beneficio y E6 mantiene el contacto sin depender de campañas. Los tres se pueden montar sin depender de nada externo.

**Después: E4 y E5.** Son condicionales y necesitan que HubSpot tenga bien registrados el primer login y las redenciones. Hoy las redenciones viven en un Google Sheets manual, así que E5 no se puede automatizar todavía: habría que cargarlo a mano o esperar al MVP de septiembre.

**Al final: E7, E8 y E9.** Ver la advertencia siguiente.

---

## Advertencias antes de construir

**La pasarela de pago de Diners está rota.** Según el contexto de la BU, nueve personas llegaron a checkout y generaron cero ingresos. Los correos E7, E8 y E9 mandan tráfico directo a ese checkout. Construirlos antes de arreglar la pasarela es gastar la mejor oportunidad de retención del año en una página que no cobra, y encima quema la credibilidad del remitente con quien sí quería renovar. Arreglar primero, enviar después.

**Los tres beneficios destacados vencen el 30 de agosto de 2026.** Oliveto, La Cabrera y Cafeto aparecen nombrados en E3 y E5. Si no se renueva la vigencia, ambos correos quedan desactualizados en tres semanas. Conviene confirmar con Paola Pantaleon antes de programarlos, o dejar la lista de aliados en un módulo editable y no en el cuerpo fijo.

**AXXIS no tiene beneficios hasta octubre o noviembre.** E3 y E5 son solo para Diners. Segmentar por revista en HubSpot antes de activar el journey, o los suscriptores de AXXIS recibirán instrucciones para un beneficio que no tienen.

**E2 depende de credenciales reales.** Si el usuario y la contraseña no se generan de forma automática al confirmar la suscripción, este correo no se puede disparar a las 48 horas. Confirmar con Jeison cómo se crean hoy y si HubSpot puede leer esos campos.

**Los correos invitan a responder.** E2, E4 y E8 dicen "basta con responder este correo". Eso exige una bandeja monitoreada y una persona a cargo. Si no la hay, cambiar por un enlace a la página de contacto.

---

## Pendientes transversales

1. Registro: impersonal o usted. Decisión pendiente desde la bienvenida, aplica a todo el journey.
2. Redes activas por revista, con @ verificados. Cuentas de AXXIS y Diners son independientes.
3. URLs de destino de cada CTA.
4. Valor por defecto del token de nombre en HubSpot.
5. Propiedades de HubSpot que hacen falta y hay que verificar que existan: `usuario_plataforma`, `password_temporal`, `fecha_vencimiento`, `ediciones_recibidas`, primer login y redenciones.
6. Frecuencia total: entre journey, correo semanal y E6, revisar que un suscriptor nuevo no reciba más de dos correos en la misma semana.

---

## Relacionado

[[Email-Bienvenida-Beneficios-Diners]] · [[Email-Bienvenida-AXXIS]] · [[Arquitectura-Plataforma-Beneficios]] · [[Zona-Premium-Suscriptores-AXXIS-Diners]]
