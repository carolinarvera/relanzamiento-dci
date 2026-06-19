---
date: 2026-06-19
type: estrategia-email
tags: [vision-davivienda, email, newsletter, funnel, CTOR, trafico]
related-projects: [vision-davivienda, growth-dashboard]
related-people: [natalia-otalora, carolina-ramirez, estefania, ernesto]
sources:
  - "Vision_PlanContenidos360_2026-06 — dos pistas de contenido"
  - "Vision_01_NorthStar_2026-06 — CTOR 2.5% actual, target 5%"
  - "Benchmarks beehiiv 2025 — 6.17% CTR medios"
  - "vision.davivienda.com — artículos publicados jun 2026"
ai-first: true
confidence: high
---

# Visión Davivienda — Estrategia de Email Newsletter

> **For future Claude:** Estrategia de email en 3 variantes para Visión Davivienda (169K suscriptores). CTOR actual: 2.5%, target: 5%. Email = 51% del tráfico del sitio — es el canal más importante. **Variante 1 (Informe-S):** sale cuando Ernesto publica un informe, 1 CTA directo al artículo, tono especializado. **Variante 2 (Semanal de tráfico):** sale cada lunes, múltiples links curados, diseñado para maximizar clicks al sitio. **Variante 3 (Funnel):** secuencia automatizada de 5 emails para nuevos suscriptores en 15 días — activa, educa y convierte. Estefanía ejecuta. Natalia ausente desde el 28 jun.

---

## CONTEXTO Y DIAGNÓSTICO

| Métrica | Actual | Target | Impacto |
|---------|--------|--------|---------|
| Suscriptores activos | 169,000 | — | Base sólida |
| CTOR (clics/aperturas) | 2.5% | 5%+ | Cada +1pp = +1,355 clics/envío |
| Tráfico desde email | 51% del total | 60% | Canal #1 — nunca comprometer |
| Benchmark industria (beehiiv 2025) | — | 6.17% | El 5% es el piso, no el techo |

**Problema raíz diagnosticado por Natalia (16 jun):** el CTOR bajo no es un problema de audiencia — es un problema de diseño y estructura de los emails. Palancas probadas:
- Un solo CTA por email → +371% clics vs múltiples CTAs
- Botón en lugar de link de texto → +20–30% clics
- CTA en los primeros 3 párrafos → no esperar al final

---

## VARIANTE 1 — INFORME S (ligado al informe)

### Descripción
Email reactivo. Sale cada vez que Ernesto publica un informe en vision.davivienda.com. Es la extensión directa del informe al inbox. No tiene calendario fijo — lo determina la publicación.

### Especificaciones

| Campo | Valor |
|-------|-------|
| Trigger | Publicación de informe en vision.davivienda.com |
| Frecuencia | Variable — promedio 2–3 veces/semana |
| Responsable | Ernesto (redacta resumen) · Estefanía (maqueta y envía) |
| Audiencia | Todos los suscriptores (169K) |
| Ventana de envío | Dentro de las 4h de la publicación |
| Tono | Especializado, profesional, citable |
| Longitud | 200–300 palabras cuerpo + datos |
| CTAs | **1 solo CTA** — "Leer análisis completo →" |

### Estructura del email

```
[ASUNTO] — regla: número + dato + consecuencia
Ej: "ISE abril: Colombia +3.3% — el sector público jalón el crecimiento"
Ej: "Vivienda -18.7%: quinto mes consecutivo de caída"

[PREHEADER] — complementa el asunto, no lo repite
Ej: "Qué sectores ganaron, cuáles perdieron y qué esperar en mayo"

──────────────────────────────────────────
[HEADER] Logo Visión Davivienda · Informe Especial · [fecha]

[INTRO — 2 líneas máx]
El equipo de investigaciones publicó hoy el análisis de [tema].
Lo más importante:

[DATOS CLAVE — 3 a 5 bullets]
• Colombia creció 3.3% en abril — en línea con el consenso Bloomberg
• Administración pública: +8.1% (temporada electoral + nómina Estado)
• Sector primario: -2.4% · Petróleo apenas +0.42%
• Acumulado ene-abr: +2.5%
• Manufactura: +2.0% · Bienes durables en doble dígito

[INTERPRETACIÓN — 1 párrafo]
Lo que significa según el equipo de investigaciones Davivienda Corredores.
Máx 80 palabras. Sin opinión propia — solo la del equipo.

[CTA — botón, no link de texto]
┌─────────────────────────────────────────────┐
│        Leer análisis completo →              │
└─────────────────────────────────────────────┘
URL con UTM: ?utm_source=email&utm_medium=informe&utm_campaign=[slug-articulo]

[FIRMA]
Equipo de Investigaciones | Davivienda Corredores
vision.davivienda.com
──────────────────────────────────────────
```

### Reglas de asunto (Variante 1)
- Siempre incluir el número/dato clave en el asunto
- Máx 50 caracteres (se ve completo en móvil)
- Formato: `[Indicador]: [dato] — [interpretación breve]`
- No usar signos de exclamación
- No usar "URGENTE" ni "IMPORTANTE"

### KPIs objetivo

| KPI | Target V1 |
|-----|-----------|
| Open rate | 35%+ |
| CTOR | 6%+ (contenido de alta intención) |
| Sesiones desde email | 500+ por envío |
| Tiempo en página destino | 2:30+ min |

---

## VARIANTE 2 — EMAIL SEMANAL DE TRÁFICO

### Descripción
Email editorial curado. Sale todos los lunes. Su único objetivo es llevar tráfico de calidad al sitio — que la gente haga click. No compite con el informe diario (Variante 1) — lo complementa como resumen semanal con múltiples puntos de entrada al sitio.

### Especificaciones

| Campo | Valor |
|-------|-------|
| Frecuencia | Todos los lunes a las 7:00 AM (hora Colombia) |
| Responsable | Estefanía (producción) — con checklist pre-aprobado |
| Audiencia | Todos los suscriptores (169K) |
| Tono | Editorial, conversacional, con ganchos |
| Longitud | 400–600 palabras visible + links |
| CTAs | 4–6 CTAs (uno por sección) |
| Objetivo primario | CTOR 5%+ · Sesiones desde email |

### Estructura del email

```
[ASUNTO] — regla: pregunta o tensión, sin revelar la respuesta
Ej: "¿Qué pasó con la economía colombiana esta semana?"
Ej: "El dato que nadie estaba esperando del comercio"
Ej: "5 cosas que debes saber antes del martes"

[PREHEADER] — complementa con el beneficio concreto
Ej: "El ISE, la vivienda y el peso colombiano — en 3 minutos"

──────────────────────────────────────────
[HEADER] Logo · "Esta semana en Visión" · Lunes [fecha]

[SECCIÓN 1 — EL ARTÍCULO DE LA SEMANA]
Imagen de portada + título + 2 líneas de contexto

→ [CTA] "Leer el análisis →"

[SECCIÓN 2 — 3 DATOS QUE DEBERÍAS SABER]
Tres bullets cortos con link embebido en cada uno:
• La vivienda nueva cayó -18.7% en mayo [→ ver datos completos]
• El comercio tuvo su mejor mes en 9 meses: +14.9% [→ leer análisis]
• El peso colombiano sube 16.9% en el año [→ perspectiva semanal]

[SECCIÓN 3 — PREGUNTA DE LA SEMANA]
Una pregunta que abre curiosidad + link al artículo que responde

"¿Por qué Cartagena es la única ciudad donde sube la venta de vivienda?
(La respuesta en el sitio →)"

→ [CTA] "Ver la respuesta →"

[SECCIÓN 4 — LO MÁS LEÍDO ESTA SEMANA]
3 artículos con título + 1 línea + CTA mínimo

1. [Título artículo] — [1 línea] → [Leer →]
2. [Título artículo] — [1 línea] → [Leer →]
3. [Título artículo] — [1 línea] → [Leer →]

[FOOTER]
Visión Davivienda · vision.davivienda.com
[Síguenos en Instagram] [Twitter/X] [LinkedIn]
[Gestionar preferencias] [Desuscribirse]
──────────────────────────────────────────
```

### Reglas de asunto (Variante 2)
- Pregunta o tensión sin revelar el dato
- Máx 50 caracteres
- Alternativas probadas: "El dato que...", "¿Por qué...?", "X cosas que..."
- A/B test: 2 versiones de asunto → enviar al 20% + 20% → ganador al 60%

### Calendario de producción

| Día | Acción | Responsable |
|-----|--------|-------------|
| Jueves | Seleccionar artículos de la semana + escribir secciones 1 y 3 | Estefanía |
| Viernes | Revisar links + UTMs + preheader + asunto A/B | Estefanía |
| Domingo 8pm | Programar envío para lunes 7am | Estefanía |
| Lunes 10am | Revisar apertura primeras 3h + ajustar si hay error | Estefanía |

### KPIs objetivo

| KPI | Actual | Target V2 |
|-----|--------|-----------|
| Open rate | — | 30%+ |
| CTOR | 2.5% | 5%+ |
| Sesiones desde email (lunes) | — | 2,000+ |
| Artículo más clickeado | — | Tracking por UTM |
| Desuscripciones por envío | — | < 0.1% |

---

## VARIANTE 3 — FUNNEL DE EMAIL

### Descripción
Secuencia automatizada de 5 emails para nuevos suscriptores. Se activa el momento en que alguien se suscribe en vision.davivienda.com. Objetivo: activar al suscriptor, mostrar el valor de Visión y convertirlo en lector regular antes de los 15 días.

**Sin este funnel:** el nuevo suscriptor entra directamente al informe diario (Variante 1) sin contexto — alta probabilidad de desorientarse y no abrir.
**Con este funnel:** el suscriptor entiende qué es Visión, por qué debería abrirlo y cuál es el contenido que más le sirve antes de recibir informes técnicos.

### Especificaciones

| Campo | Valor |
|-------|-------|
| Trigger | Suscripción nueva en vision.davivienda.com |
| Duración | 15 días (5 emails) |
| Responsable | Estefanía (setup automatización) · Ernesto (revisión copy) |
| Audiencia | Solo nuevos suscriptores |
| Herramienta | La misma plataforma de email actual (configurar automation) |
| Objetivo | Lector activo antes del día 15 — open rate > 40% en email 5 |

### Los 5 emails del funnel

---

#### EMAIL F1 — Bienvenida y activación (Día 0 — inmediato)

**Asunto:** `Bienvenido a Visión — esto es lo que recibirás`
**Preheader:** `El análisis económico de Davivienda, directo a tu inbox`

**Objetivo:** orientar al nuevo suscriptor. Que sepa exactamente qué es Visión y qué valor va a recibir. CTA: primer artículo de alto impacto.

**Estructura:**
- Párrafo de bienvenida (3 líneas): qué es Visión, quién lo produce, para quién es
- "Esto es lo que recibirás:" — lista de 3 bullets (informe diario, análisis sectorial, perspectiva semanal)
- Artículo de arranque recomendado: el más leído del mes (evergreen de alto tráfico)
- CTA único: "Empieza aquí →" [artículo evergreen más visto]

---

#### EMAIL F2 — Educación y valor (Día 2)

**Asunto:** `El indicador que los analistas colombianos revisan cada mes`
**Preheader:** `Y cómo leerlo en menos de 3 minutos`

**Objetivo:** mostrar que Visión explica lo que otros medios no explican. Posicionar como fuente de referencia, no de noticias.

**Estructura:**
- Hook: "Hay un número que resume la economía colombiana cada mes. Se llama ISE."
- Explicación en 4 líneas: qué mide, cómo se calcula, cuándo sale, para qué sirve
- Dato reciente: "En abril Colombia creció 3.3%. Te explicamos por qué eso importa."
- CTA: "Leer el análisis del ISE de abril →" [artículo ISE del sitio]

---

#### EMAIL F3 — Coyuntura en acción (Día 5)

**Asunto:** `Qué está moviendo la economía colombiana esta semana`
**Preheader:** `3 datos del equipo de investigaciones de Davivienda`

**Objetivo:** mostrar el valor del informe de coyuntura semanal. Que el suscriptor entienda que Visión es urgente y relevante, no solo educativo.

**Estructura:**
- Intro: "Cada semana publicamos lo que el equipo de investigaciones está mirando."
- 3 datos de coyuntura del momento con 1 línea de análisis cada uno + link
- Párrafo de cierre: "Esto es lo que recibirás cada semana — más los informes especiales cuando hay noticias importantes."
- CTA: "Ver la perspectiva completa de esta semana →"

---

#### EMAIL F4 — Autoridad y equipo (Día 10)

**Asunto:** `El equipo que produce el análisis que ya leíste`
**Preheader:** `Economistas de Davivienda Corredores — conoce quiénes son`

**Objetivo:** construir confianza y autoridad. El suscriptor debe saber que el contenido viene de un equipo real con nombre y apellido, no de un algoritmo.

**Estructura:**
- Presentación breve del equipo: Juan David Jaramillo, Mario Acosta (nombres reales)
- Metodología en 3 puntos: cómo analizan, qué fuentes usan, por qué son diferentes
- Artículo de profundidad: uno técnico del equipo para mostrar el nivel
- CTA: "Leer el análisis del equipo →"

---

#### EMAIL F5 — Conversión y preferencias (Día 15)

**Asunto:** `¿Estás recibiendo lo que necesitas de Visión?`
**Preheader:** `Cuéntanos qué temas te interesan más`

**Objetivo:** identificar el nivel de engagement a los 15 días. Re-activar a quien no ha abierto. Recoger preferencias de contenido para personalizar.

**Estructura:**
- Para quienes SÍ abrieron: "Llevas 15 días con nosotros — estos son los contenidos que más le gustaron a gente como tú." (3 artículos + CTAs)
- Para quienes NO abrieron: asunto diferente — "Quizás no era el momento — aquí el mejor de Visión" (reactivación con artículo top)
- Pregunta de preferencias: "¿Qué tema te interesa más?" — links a 4 categorías del sitio
- CTA principal: "Personaliza lo que recibes →" [link a preferencias]

---

### Diagrama del funnel

```
NUEVO SUSCRIPTOR
      │
      ▼ Día 0 (inmediato)
┌─────────────────────────────────────────────┐
│ F1 — BIENVENIDA                             │
│ Qué es Visión · Qué recibirás · Empieza →   │
│ Objetivo: orientación · Open rate target 55%│
└─────────────┬───────────────────────────────┘
              │
      ▼ Día 2
┌─────────────────────────────────────────────┐
│ F2 — EDUCACIÓN                              │
│ El ISE: qué es y por qué importa →          │
│ Objetivo: mostrar valor · Open rate 45%     │
└─────────────┬───────────────────────────────┘
              │
      ▼ Día 5
┌─────────────────────────────────────────────┐
│ F3 — COYUNTURA                              │
│ Qué mueve la economía esta semana →         │
│ Objetivo: urgencia y relevancia · OR 40%    │
└─────────────┬───────────────────────────────┘
              │
      ▼ Día 10
┌─────────────────────────────────────────────┐
│ F4 — AUTORIDAD                              │
│ El equipo que produce el análisis →         │
│ Objetivo: confianza y credibilidad · OR 38% │
└─────────────┬───────────────────────────────┘
              │
      ▼ Día 15
┌─────────────────────────────────────────────┐
│ F5 — CONVERSIÓN                             │
│ ¿Estás recibiendo lo que necesitas? →       │
│ Abiertos → preferencias · No abiertos → RE  │
└─────────────┬───────────────────────────────┘
              │
     ┌────────┴────────┐
     ▼                 ▼
LECTOR ACTIVO     REACTIVACIÓN
(entra a V1+V2)   (secuencia corta 2 emails)
```

### KPIs objetivo del funnel

| Email | Open rate target | CTOR target | Acción esperada |
|-------|-----------------|-------------|-----------------|
| F1 — Bienvenida | 55%+ | 8%+ | Clic en artículo inicial |
| F2 — Educación | 45%+ | 6%+ | Leer artículo ISE/concepto |
| F3 — Coyuntura | 40%+ | 5%+ | Leer perspectiva semanal |
| F4 — Autoridad | 38%+ | 5%+ | Leer análisis de equipo |
| F5 — Conversión | 35%+ | 4%+ | Click en preferencias o artículo |
| Conversión global (15 días) | — | — | 60%+ lectores activos |

---

## COORDINACIÓN ENTRE LAS 3 VARIANTES

### Regla de no colisión
No enviar más de 1 email por día al mismo suscriptor. Prioridad si colisionan:
1. Variante 1 (Informe S) — siempre tiene prioridad
2. Variante 2 (Semanal) — si no hay informe ese lunes
3. Variante 3 (Funnel) — se pausa si el suscriptor recibió V1 ese día

### Mapa de convivencia semanal

| Día | V1 (Informe) | V2 (Semanal) | V3 (Funnel) |
|-----|-------------|-------------|-------------|
| Lunes | Si hay informe | Sí (7am) | Pausa si hubo V1 |
| Martes | Si hay informe | No | Continúa según día del funnel |
| Miércoles | Si hay informe | No | Continúa según día del funnel |
| Jueves | Si hay informe | No | Continúa según día del funnel |
| Viernes | Si hay informe | No | Continúa según día del funnel |

### Métricas consolidadas

| Métrica | V1 Informe | V2 Semanal | V3 Funnel |
|---------|-----------|-----------|-----------|
| Open rate target | 35%+ | 30%+ | 35–55% por email |
| CTOR target | 6%+ | 5%+ | 4–8% por email |
| Sesiones generadas | 500+/envío | 2,000+/lunes | 100+/email funnel |
| Frecuencia | 2–3x/semana | 1x/semana | 5 emails en 15 días |

---

## IMPLEMENTACIÓN — PRÓXIMOS PASOS

| Acción | Responsable | Deadline | Prioridad |
|--------|-------------|----------|-----------|
| Rediseñar plantilla V1 con 1 CTA + botón | Estefanía + diseño | Antes 28 jun | P0 |
| Crear plantilla V2 (estructura semanal) | Estefanía | Antes 28 jun | P0 |
| Configurar secuencia automatizada V3 | Estefanía | Jul 7 | P1 |
| Escribir copy emails F1–F5 | Ernesto | Jul 7 | P1 |
| Implementar UTMs en todos los emails | Estefanía | Inmediato | P0 |
| A/B test asuntos V2 | Estefanía | Jul 14 | P1 |
| Revisar métricas funnel a 30 días | Carolina | Ago 1 | P2 |
