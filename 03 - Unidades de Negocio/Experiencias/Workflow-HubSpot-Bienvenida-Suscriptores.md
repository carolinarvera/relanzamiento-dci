---
date: 2026-08-09
type: workflow-spec
programa: Beneficios Suscriptores
revista: Diners · AXXIS
estado: borrador — pendiente montar en HubSpot
herramienta: HubSpot
version: v2 — ramificación por apertura (decisión de Carolina, 2026-08-09)
---

## For future Claude
Especificación del workflow de bienvenida en HubSpot. Ramifica **por apertura de correo**, según decisión de Carolina del 2026-08-09. El copy de cada correo vive en [[Journey-Emails-Suscriptores]] y en los dos archivos de bienvenida. La sección final documenta la limitación conocida de esta señal y el plan de migración cuando existan las propiedades de comportamiento.

---

# Workflow HubSpot — Bienvenida Suscriptores

## Organigrama

```
┌──────────────────────────────────────────────────────────┐
│  DISPARADOR DE INSCRIPCIÓN                               │
│  Suscripción confirmada = sí                             │
│  Filtros: email válido · no dado de baja · no rebotado   │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   RAMA POR REVISTA   │
                 └───┬──────────────┬───┘
               Diners│              │AXXIS
                     ▼              ▼
            ┌──────────────┐ ┌──────────────┐
            │ E1 BIENVENIDA│ │ E1 BIENVENIDA│
            │    Diners    │ │    AXXIS     │
            │    DÍA 0     │ │    DÍA 0     │
            └──────┬───────┘ └──────┬───────┘
                   └────────┬───────┘
                            │
                      ESPERA 3 días
                            │
                            ▼
                 ┌──────────────────────┐
                 │    ¿ABRIÓ E1?        │
                 └───┬──────────────┬───┘
                  SÍ │              │ NO
                     ▼              ▼
        ┌──────────────────┐  ┌─────────────────────┐
        │  E2 ACCESOS      │  │  REENVÍO E1         │
        │  ZONA PREMIUM    │  │  asunto alterno     │
        │  DÍA 3           │  │  DÍA 3              │
        └────────┬─────────┘  └──────────┬──────────┘
                 │                       │
           ESPERA 4 días           ESPERA 3 días
                 │                       │
                 ▼                       ▼
      ┌────────────────────┐  ┌──────────────────────┐
      │    ¿ABRIÓ E2?      │  │ ¿ABRIÓ EL REENVÍO?   │
      └───┬────────────┬───┘  └───┬──────────────┬───┘
       SÍ │            │ NO    SÍ │              │ NO
          │            │          │              ▼
          │            │          │      ┌───────────────────┐
          │            │          │      │ LISTA             │
          │            │          │      │ "sin apertura"    │
          │            │          │      │ + tarea al equipo │
          │            │          │      │ DÍA 6             │
          │            │          │      └───────────────────┘
          │            │          │
          │            │          └──────► E2 ACCESOS · DÍA 6
          │            │                   (retoma el camino
          │            │                    principal)
          │            ▼
          │   ┌──────────────────┐
          │   │  REENVÍO E2      │
          │   │  asunto alterno  │
          │   │  DÍA 7           │
          │   └────────┬─────────┘
          │            │
          │      ESPERA 4 días
          │            │
          │            ▼
          │  ┌──────────────────────┐
          │  │ ¿ABRIÓ EL REENVÍO?   │
          │  └───┬──────────────┬───┘
          │   SÍ │              │ NO
          │      │              ▼
          │      │      ┌────────────────────┐
          │      │      │ LISTA "sin acceso" │
          │      │      │ + tarea al equipo  │
          │      │      │ DÍA 11             │
          │      │      └────────────────────┘
          │      │
          ▼      ▼
    ┌──────────────────────┐
    │   ¿QUÉ REVISTA?      │
    └───┬──────────────┬───┘
 Diners │              │ AXXIS
        ▼              ▼
┌───────────────┐  ┌────────┐
│ E3 CÓMO USAR  │  │ SALIR  │
│  BENEFICIOS   │  │ lista  │
│  DÍA 7 u 11   │  │"activo"│
└───────┬───────┘  └────────┘
        │
  ESPERA 5 días
        │
        ▼
┌──────────────────────┐
│    ¿ABRIÓ E3?        │
└───┬──────────────┬───┘
 SÍ │              │ NO
    ▼              ▼
┌────────┐  ┌──────────────────┐
│ SALIR  │  │  REENVÍO E3      │
│ lista  │  │  asunto alterno  │
│"activo"│  │  DÍA 12 o 16     │
└────────┘  └────────┬─────────┘
                     │
                     ▼
                 ┌────────┐
                 │ SALIR  │
                 └────────┘
```

---

## Calendario de retrasos

| Día | Acción | Condición |
|---|---|---|
| 0 | E1 Bienvenida | Ninguna. Versión según revista |
| 3 | Evaluación de apertura de E1 | Espera mínima de 72 horas |
| 3 | E2 Accesos zona premium | Abrió E1 |
| 3 | Reenvío de E1 con asunto alterno | No abrió E1 |
| 6 | Evaluación del reenvío de E1 | Solo rama de no apertura |
| 6 | E2 Accesos zona premium | Abrió el reenvío |
| 6 | Lista "sin apertura" y tarea al equipo | No abrió el reenvío |
| 7 | Evaluación de apertura de E2 | Camino principal |
| 7 | E3 Cómo usar beneficios | Abrió E2 y es Diners |
| 7 | Reenvío de E2 con asunto alterno | No abrió E2 |
| 11 | Evaluación del reenvío de E2 | |
| 11 | E3 Cómo usar beneficios | Abrió el reenvío y es Diners |
| 11 | Lista "sin acceso" y tarea al equipo | No abrió el reenvío |
| 12 o 16 | Reenvío de E3 con asunto alterno | No abrió E3 |

Máximo cinco correos en 16 días, nunca dos en la misma semana calendario.

---

## Asuntos para los reenvíos

Un reenvío repite el correo con asunto distinto. Nunca el mismo asunto: quien no abrió el primero tampoco abrirá el segundo idéntico.

| Correo | Asunto original | Asunto del reenvío |
|---|---|---|
| E1 Diners | Diners tiene lo que vale la pena descubrir | La suscripción a Diners ya está activa |
| E1 AXXIS | La suscripción a AXXIS ya está activa | Todo lo que incluye la suscripción |
| E2 Accesos | Datos de acceso a la zona premium | El acceso a la zona premium sigue pendiente |
| E3 Beneficios | Cómo usar los beneficios de la suscripción | Tres aliados con descuento para suscriptores |

El original y el reenvío cambian de ángulo a propósito: si el primero fue editorial, el segundo es transaccional, y al revés. Repetir el mismo registro desperdicia el segundo intento.

---

## Configuración en HubSpot

**Tipo de workflow:** basado en contactos.

**Disparador:** propiedad de suscripción confirmada. Si la suscripción entra por e-Payco y no por formulario, el disparador debe ser la propiedad que actualiza esa integración.

**Rama por revista:** rama de valor de propiedad, no sí/no. Deja los dos caminos explícitos y permite sumar Libros después sin rehacer el flujo.

**Rama de apertura:** usar el criterio de correo de marketing abierto, referido al correo específico del paso anterior. No usar "abrió cualquier correo", que arrastra actividad de la newsletter y contamina la rama.

**Espera mínima de 72 horas antes de evaluar apertura.** Las aperturas tardan en registrarse y mucha gente abre al segundo o tercer día. Evaluar a las 24 horas manda a la rama de no apertura a personas que sí iban a abrir.

**Excluir del reenvío a quien hizo clic.** Si alguien hizo clic pero la apertura no quedó registrada, el reenvío le llega como correo repetido. Agregar esa exclusión en el filtro del paso de reenvío.

**Un solo reenvío por correo.** Nunca dos.

**Reinscripción:** desactivada.

**Salida automática:** al darse de baja, al rebotar o al llegar a cualquier lista final.

**Horario de envío:** entre 8:00 y 11:00, hora de Bogotá. AXXIS solo días hábiles, por la audiencia profesional. Diners tolera fin de semana.

---

## Qué enviar cuando no abre

La regla de fondo: **escalar según la consecuencia, no según el correo.** Si lo que no abrió era operativo, hay que perseguirlo hasta por otro canal. Si era comercial, un reenvío y se deja.

### No abre E1 (bienvenida)

| Intento | Qué enviar | Cuándo |
|---|---|---|
| 1 | Reenvío con asunto transaccional: "La suscripción a Diners ya está activa" | Día 3 |
| 2 | WhatsApp con la plantilla de bienvenida | Día 6 |
| Fin | Lista "sin apertura" y salida del journey | Día 8 |

El reenvío cambia a registro transaccional a propósito. Quien ignoró un asunto editorial suele abrir uno que parece confirmación de compra.

### No abre E2 (accesos a zona premium)

Este es el caso grave: hay una persona que pagó y no puede entrar.

| Intento | Qué enviar | Cuándo |
|---|---|---|
| 1 | Reenvío: "El acceso a la zona premium sigue pendiente" | Día 7 |
| 2 | WhatsApp con enlace de recuperación de acceso | Día 11 |
| 3 | Tarea de llamada al equipo, con el teléfono de la suscripción | Día 14 |

Aquí sí se justifica llegar hasta la llamada. Un suscriptor sin acceso es churn casi asegurado y reclamo probable, y el costo de una llamada es menor que el de perder la renovación.

### No abre E3 (beneficios)

| Intento | Qué enviar | Cuándo |
|---|---|---|
| 1 | Reenvío con asunto comercial: "Descuentos activos en Oliveto y La Cabrera" | Día 12 o 16 |
| Fin | Salir del journey. El beneficio se vuelve a ofrecer en el correo semanal | |

No escalar más. Es un correo comercial: insistir por WhatsApp o teléfono con un descuento molesta más de lo que convierte.

### Cambios que aumentan la apertura del reenvío

Un reenvío no es el mismo correo otra vez. Además del asunto, conviene cambiar:

**El horario.** Si el original salió un martes a las 9:00, el reenvío va otro día y a otra hora. Puede que el problema haya sido el momento, no el mensaje.

**El nombre del remitente.** Pasar de "Revista Diners" a "Equipo editorial Diners" cambia lo suficiente la línea del remitente como para que se note en la bandeja.

**El preheader.** Es la segunda línea que se ve sin abrir y suele quedar igual por descuido.

### Límite de insistencia

Máximo dos intentos por correo y nunca más de cuatro correos sin apertura seguidos por contacto.

Insistir más allá de eso daña la reputación del dominio: Gmail y Yahoo miden la proporción de correos que nadie abre, y una base con muchos contactos inactivos empuja a promociones o a spam **a toda la lista**, incluidos los suscriptores que sí leen. El contacto que acumula cuatro correos sin abrir debe salir de los envíos masivos hasta que se reactive por otro canal.

Es el argumento para cerrar la escalada por correo y pasar a WhatsApp o teléfono: no es solo que no funcione, es que seguir intentando le cuesta apertura al resto de la base.

---

## Listas finales y tareas internas

**Lista "sin apertura", día 6.** Nunca abrió la bienvenida ni el reenvío. Son suscriptores que pagaron y no han visto nada. Genera tarea al equipo para contacto por otro canal, con el número registrado en la suscripción.

**Lista "sin acceso", día 11.** Abrió la bienvenida pero nunca el correo de credenciales. Tienen suscripción activa y no pueden entrar a la zona premium. Misma tarea de contacto directo.

Estas dos listas son la parte más importante del flujo. Un suscriptor que pagó y no logró entrar es un caso de churn casi asegurado y de reclamo probable. El workflow los identifica, pero resolverlos exige que alguien los llame.

---

## Propiedades que deben existir

Verificar en HubSpot antes de montar. Ninguna está confirmada.

| Propiedad | Tipo | Uso |
|---|---|---|
| `revista` | Desplegable | Rama principal. Sin esto no hay forma de separar AXXIS de Diners |
| `usuario_plataforma` | Texto | Token en E2 |
| `password_temporal` | Texto | Token en E2 |

Este diseño no necesita `primer_login` ni `redenciones`, que es su ventaja práctica: se puede montar esta semana sin esperar desarrollo.

---

## Limitación conocida y plan de migración

La apertura es una señal imperfecta. La Protección de Privacidad de Apple Mail precarga imágenes y HubSpot lo registra como apertura, así que parte de la rama "abrió" corresponde a gente que no vio el correo. El efecto en este flujo es que algunos suscriptores avanzan al siguiente correo sin haber leído el anterior, y no reciben el reenvío que les habría servido.

Las dos listas finales compensan en parte: quien nunca abre queda identificado para contacto humano, que es la red de seguridad real.

**Cuándo migrar.** En cuanto existan `primer_login` y `redenciones` en HubSpot, conviene cambiar las ramas de apertura por ramas de comportamiento, empezando por la de E2: en vez de preguntar si abrió el correo de credenciales, preguntar si entró a la plataforma. Es la misma estructura de flujo, solo cambia el criterio de cada rama, así que la migración no obliga a rehacer el workflow.

**Mientras tanto**, medir clic además de apertura en el reporte mensual. Si la brecha entre ambos es muy alta, es la confirmación de que el efecto de precarga está inflando la rama principal.

---

## Advertencias antes de activar

**Segmentar por revista antes que nada.** Sin la propiedad `revista` funcionando, los suscriptores de AXXIS reciben instrucciones para beneficios que no existen hasta octubre o noviembre.

**Los aliados nombrados vencen el 30 de agosto de 2026.** Oliveto, La Cabrera y Cafeto aparecen en E3. Meterlos en el cuerpo fijo obliga a editar el workflow cada vez que cambie la lista. Mejor un módulo editable o un enlace a la página de beneficios.

**E2 depende de que las credenciales existan al día 3.** Si Jeison las genera a mano, el correo llega con tokens vacíos. Confirmar cómo se crean hoy antes de programar.

**Bandeja monitoreada.** E2 invita a responder. Si nadie atiende esa bandeja, cambiar por un enlace a contacto.

**Probar con contactos internos primero.** Inscribir cuatro contactos de prueba: uno que abra todo, uno que no abra nada, uno que abra la bienvenida y no el de accesos, y uno de AXXIS. Revisar tokens y enrutamiento antes de abrir a la base.

---

## Relacionado

[[Journey-Emails-Suscriptores]] · [[Email-Bienvenida-Beneficios-Diners]] · [[Email-Bienvenida-AXXIS]] · [[Arquitectura-Plataforma-Beneficios]]
