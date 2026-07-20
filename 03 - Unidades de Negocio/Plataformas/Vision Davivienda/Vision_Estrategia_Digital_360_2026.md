---
date: 2026-07-19
type: estrategia
tags: [vision-davivienda, growth, seo, email, social, pauta, youtube, estrategia-360]
status: activo
owner: Carolina Ramirez
related-people: [natalia-otalora, carolina-ramirez, estefania-ochoa, jeison-montero, leo-brace, alejandro-bojaca-performix]
related-projects: [vision-davivienda]
sources:
  - "GA4 Análisis Web jun 2026 — sesiones, fuentes, dispositivos, top páginas"
  - "GA4 Informes y Suscripciones jun 2026 — conteo suscriptores, rebote por sección"
  - "GA4 Informes de interés jun 2026 — evento tracking (2M+ events)"
  - "GSC Resumen_Vision.md — 700+ URLs con clics/impresiones/CTR/posición"
  - "Vision_AuditoriaRRSS_2026-06.md"
  - "Vision_EstrategiaEmail_2026-06.md"
  - "Vision_EstrategiaPauta_2026-06.md"
  - "Vision_EstrategiaSEO_2026-06.md"
ai-first: true
confidence: high
---

# Estrategia Digital 360 — Visión Davivienda
**Tráfico al sitio (90%) + Suscriptores newsletter (10%)**

Basado en auditoría real a jun 30, 2026: GA4, GSC, auditoría RRSS, email Eloqua, pauta Performix/Starcom. No es un plan genérico — cada acción está anclada a un número real.

---

## 0. Diagnóstico consolidado — los 3 hallazgos que cambian todo

### Hallazgo 1: El tráfico viene casi exclusivamente de email. Google apenas pesa.
| Canal | Sesiones jun 2026 | % del total |
|---|---|---|
| Email (Eloqua) | ~8,136 | 45.2% |
| Google orgánico | ~4,176 | 23.2% |
| Directo | ~2,610 | 14.5% |
| Redes sociales | ~1,800 | ~10% |
| Pauta (Performix) | estimado <5% | Parcialmente no atribuido |
| **(not set) / sin atribución** | ~1,080 | **6% — principalmente pauta con UTMs rotos** |

**Consecuencia:** El email está cargando solo el crecimiento. Si Eloqua falla o los suscriptores se van, el sitio colapsa. Google orgánico (23%) debería ser el canal dominante — hoy está 3x debajo de lo posible.

### Hallazgo 2: El sitio no invita a quedarse ni a seguir leyendo.
- Páginas/sesión: **1.34** — casi nadie lee un segundo artículo
- No existen botones "compartir" ni "leer más relacionados" en los artículos
- OG tags incompletas: cuando alguien comparte un artículo en WhatsApp o X, no aparece imagen ni resumen
- La sección con más tráfico (Para empezar el día, 130K sesiones/año) tiene **solo 6,327 suscriptores** — tasa de conversión implícita: 4.8%

### Hallazgo 3: Los datos de contenido están ciegos.
- **2,046,282 eventos GA4** con `article_id = (not set)` — el evento "informe de interés" dispara pero no pasa el parámetro del artículo. Nadie sabe qué artículos específicos generan más engagement.
- **~6,013 sesiones** con source `(not set)` y 98% de rebote — tráfico de pauta (Performix) sin UTMs correctos entra como sin fuente.
- Nombres de eventos de email en Eloqua incluyen números ("12.0 Cerrar", "8.0 Abrir") — imposible comparar campañas automáticamente.

---

## Fase 0 — Destapar los datos (Semana 1, bloqueante)

Ninguna optimización de pauta, contenido ni SEO tiene sentido hasta resolver esto. Los datos rotos hacen invisible qué funciona.

| # | Acción | Owner | Por qué |
|---|---|---|---|
| 1 | **Leo/Brace:** pasar `informe_id` y `article_title` como parámetro en el evento GA4 "informe_de_interes" | Leo (Brace CMS) | Sin esto, 2M+ events son inútiles — no sabemos qué contenido genera interés |
| 2 | **Performix/Jeison:** estandarizar UTMs de pauta — `utm_source=performix&utm_medium=paid_social&utm_campaign=[nombre]` en todos los creativos | Jeison + Alejandro Bojacá | $9.9M de presupuesto sin atribución válida = decisión ciega de inversión |
| 3 | **Estefanía/Eloqua:** renombrar eventos de email: "Apertura_Informe_[nombre]", "Clic_CTA_[nombre]" — sin números | Estefanía | Actual "12.0 Cerrar" no es comparable entre campañas |

**Checkpoint:** Carolina verifica con Jeison que los 3 fixes están en producción antes de liberar Fase 1.

---

## Fase 1 — Canal por canal: acciones de alto impacto

### Canal 1: Sitio Web (vision.davivienda.com)
**Owner técnico: Leo (Brace CMS) | Owner estratégico: Carolina + Natalia**

#### Los 5 bugs que más cuestan (owner: Leo)
Estos no son mejoras — son bugs activos que limitan indexación y CTR:

| Código | Bug | Impacto | Deadline |
|---|---|---|---|
| C1 | Canonical tags ausentes en todo el sitio | Google divide PageRank, puede rankear URL equivocada | Semana 1 |
| C2 | Títulos duplicados (todas las páginas usan título del homepage) | CTR bajo, Google no distingue páginas | Semana 1 |
| C3 | Meta descriptions ausentes o truncadas | Sin descripción en SERP = menor CTR | Semana 2 |
| C4 | JS rendering delay — 988 páginas en soft 404 | 24% del sitio indexado (2,676 / ~11,000 páginas) | Semana 2-3 |
| C5 | Sitemap.xml retorna 403 | Google no puede descubrir páginas nuevas sistemáticamente | Semana 1 |

#### Oportunidades SEO inmediatas (CTR y título)
Las páginas con más impresiones y CTR bajo son las primeras a optimizar — sin crear contenido nuevo:

| URL (fragmento) | Impresiones | CTR actual | CTR meta | Clics adicionales |
|---|---|---|---|---|
| déficit-fiscal-colombia-2026 | 26,183 | **0.15%** | 2% | +471 |
| Colombia-2025-crecimiento-inflacion | 14,268 | **0.4%** | 2% | +228 |
| utilidades-bancos-colombia-enero-2026 | 7,110 | **0.25%** | 2% | +124 |
| dividendos-ecopetrol-2026 | 9,055 | **0.96%** | 3% | +182 |
| seguimiento-banco-republica (varias) | ~15,000 | ~0.3% | 2% | +255 |
| **Total potencial** | | | | **+1,260 clics/mes** |

**Acción concreta:** Reescribir títulos y meta descriptions de estas páginas con promesa explícita + keyword principal al inicio. Ejemplo: `"Déficit fiscal Colombia 2026: meta 5.1% del PIB — análisis Davivienda"` reemplaza cualquier título genérico.

#### Páginas con CTR alto pero pocas impresiones (expandir)
Estas páginas ya tienen tráfico de alta intención — necesitan más volumen de contenido similar:

| Categoría | CTR actual | Señal |
|---|---|---|
| Así Cierran los Mercados (categoría) | **43%** | 72 imp — casi nadie la encuentra, pero quien la encuentra hace clic |
| Expectativa Semanal (categoría) | **25%** | 60 imp — mismo patrón |
| Calendario Dividendos Colombia 2026 | **13.3%** | 660 imp — oportunidad de escalar con más calendarios |

**Acción:** Más artículos del tipo "así cierran los mercados [fecha]" y "expectativa semanal [fecha]" — formato estandarizado con fecha en título, publicación constante.

#### Capa IA/LLMs (Leo)
ChatGPT, Perplexity y Google AI Overviews ya responden preguntas de economía colombiana. Visión tiene el mejor análisis primario — solo falta que los bots lo encuentren:

| Acción | Detalle |
|---|---|
| Verificar robots.txt: NO bloquear GPTBot, ClaudeBot, PerplexityBot | Si están bloqueados, los LLMs no pueden citarnos |
| Schema NewsArticle + Person en todos los artículos | Author = nombre del analista visible + credenciales |
| Crear `/llms.txt` con descripción del sitio y lista de analistas | Protocolo adoptado por Claude, ChatGPT, Perplexity |
| Resumen ejecutivo en primeras 2-3 oraciones de cada artículo | Lo que los LLMs extraen cuando citan una fuente |

---

### Canal 2: Email (Eloqua)
**Owner: Estefanía Ochoa | 135,000 suscriptores activos | Open rate: 61% | CTOR: 2.5%**

#### El diagnóstico
61% de open rate es excepcional — la base quiere leer. El problema es CTOR (2.5% vs meta 5%): los emails no están convirtiendo apertura en clic al sitio.

#### Dos tipos de email — estructura y reglas

**Tipo A: Email de informe (trigger)**
- Se activa cuando se publica un informe en el sitio
- Delay: 1-2 horas post-publicación
- A/B test de asunto obligatorio: 10% A + 10% B → esperar 2h → ganador al 80%
- Formato: hallazgo principal + 2-3 bullets de datos + CTA a artículo completo
- CTA debe ser botón, no texto plano, con URL trackeada

**Tipo B: Email semanal (todos los martes 8:00 AM)**
- 2-3 artículos curados de la semana
- Módulo fijo: "Dato de la semana" (un número + una oración de contexto)
- Eje EEAT rotativo: semana 1 = Autoridad, semana 2 = Educación, semana 3 = Datos, semana 4 = Confianza

#### Acciones para subir CTOR de 2.5% a 5%

| Acción | Impacto esperado |
|---|---|
| A/B test de asunto en cada envío (no omitir) | +1-2 puntos de open rate → más clics |
| CTA como botón prominente, texto "Leer análisis completo" | +0.5-1 punto de CTOR |
| Resumen del artículo en email (2-3 oraciones de gancho, no el artículo completo) | Da razón de clic; no lo reemplaza |
| Segmentar por sector de interés (macro, acciones, renta fija) | +0.5-1 punto CTOR para segmentos relevantes |
| Limpiar lista: desuscribir inactivos >180 días | Mejora deliverability, métricas más reales |

**Acción esta semana:** Medir CTR de los últimos 3 emails en Eloqua por tipo de contenido (macro vs empresas vs mercados) y reportar a Carolina.

---

### Canal 3: Redes Sociales
**Owner: Estefanía Ochoa (redes + email Visión) | Apoyo: Paola Gordillo (NO para Visión)**

#### Estado actual

| Canal | Seguidores | Fortaleza | Brecha |
|---|---|---|---|
| X / Twitter | 25,500 | Canal más grande | Frecuencia irregular; sin estrategia de hilos |
| Instagram | 6,005 (→ 2,077 activos según auditoría reciente) | Carruseles funcionan | Baja frecuencia; sin CTA al sitio |
| YouTube | Sin datos de subs | 252K views orgánicas históricas | 77 videos sin link al sitio; 4 eventos/año |
| LinkedIn | Sin presencia activa | — | Canal sin activar |

**Regla de oro para todos los canales:** ningún post, hilo o video se publica sin un artículo vivo en vision.davivianda.com que lo respalde. El artículo es la fuente — el post es el gancho.

#### Instagram (Estefanía)

| Acción | Frecuencia | Formato prioritario |
|---|---|---|
| Carrusel derivado de artículo publicado | 4-5/semana | Carrusel (4.4x más efectivo que fotos estáticas según auditoría) |
| Stories con CTA a artículo | Daily cuando haya publicación | Stories con link sticker |
| Reels educativos (1 dato + contexto) | 1-2/semana | Reel |

**Regla:** Último slide del carrusel siempre incluye "Análisis completo en vision.davivianda.com/[slug]"

#### X / Twitter (Estefanía)

| Acción | Frecuencia | Formato |
|---|---|---|
| Hilo del informe semanal (6-7 tweets) | 1 hilo/semana | Thread — link al artículo en el ÚLTIMO tweet |
| Tweet de dato aislado ("Dato del día") | 3-4/semana | Tweet simple con número destacado |
| Responder conversaciones de macro Colombia | Continuo | Menciones, replies |

**Por qué el link va en el último tweet:** el algoritmo de X penaliza tweets con link en el primer tweet. El hilo distribuye primero, el link cierra.

#### YouTube (Leo + Analistas)
- Acción inmediata: agregar link a vision.davivianda.com en descripción de los 77 videos existentes (priorizar por vistas)
- Actualizar títulos con keywords de GSC en los 10 videos con más impresiones
- Meta mínima: 1 video por informe mensual (los analistas graban basado en el artículo ya publicado — no desde cero)

#### LinkedIn (pendiente de activar)
- 3 posts/semana (lunes, miércoles, viernes)
- Link en el PRIMER COMENTARIO (no en el cuerpo del post — el algoritmo de LinkedIn penaliza links en el cuerpo)
- Posts 300-500 palabras con primer párrafo como gancho fuerte
- Publicación en perfil personal del analista + página de Visión

---

### Canal 4: Pauta (Performix / Starcom)
**Owner: Alejandro Bojacá (Performix) | Coordinación: Natalia Otálora + Jeison**

#### El diagnóstico de pauta
De $27M de presupuesto total, $9.9M gastados en objetivos que no alimentan el norte estratégico:
- Campañas con objetivo "interacción" → generan likes, no tráfico
- Campañas con objetivo "visitas al perfil" → llevan a IG, no al sitio
- Campañas con objetivo "lead gen" → suscriptores a formulario de IG, no al newsletter de Eloqua

#### Acciones correctivas

| Acción | Detalle |
|---|---|
| Redirigir 100% de pauta paid social hacia objetivo "tráfico al sitio" | Clic debe llegar a artículo específico en vision.davivianda.com — no a homepage |
| Eliminar campañas de "interacción" y "visitas al perfil" | No alimentan ninguno de los 2 objetivos estratégicos |
| Implementar UTMs en todos los creativos (ver Fase 0) | Sin UTMs, el presupuesto es invisible en GA4 |
| Pauta solo se activa sobre artículos publicados | Primero el artículo, luego el paid — nunca al revés |
| Meta de pauta: CPV ≤ $350 COP | Actual: $395 COP — revisar segmentación de audiencia |

#### Segmentación sugerida (Colombia, finanzas)
- Intereses: economía, inversiones, bolsa de valores, banca
- Comportamiento: usuarios que visitan sitios de noticias económicas
- Lookalike: de la base de suscriptores Eloqua (exportar lista y subir a Meta/Google)
- Excluir: audiencias de banco competidor (regla Grupo Bolívar)

---

## Fase 2 — Conversión: de tráfico a suscriptor

### Funnel VS01 — Suscriptor Newsletter
**Norte:** 10% de los visitantes nuevos se suscriben al newsletter de Eloqua

#### El problema de conversión actual
La sección con más tráfico (Para empezar el día) tiene 130K sesiones y solo 6,327 suscriptores convertidos: **4.8% de conversión implícita**. El formulario de suscripción no está siendo promovido activamente en el punto de mayor tráfico.

#### Acciones de conversión por punto de contacto

| Punto | Acción | Owner |
|---|---|---|
| Artículo (cualquier página) | Módulo de suscripción inline (al 50% del scroll) + al final del artículo | Leo/Brace |
| Para empezar el día (top de tráfico) | CTA fija arriba del artículo: "Recíbelo a las 6 AM — suscríbete gratis" | Leo/Brace |
| Email trigger | Cada informe nuevo enviado incluye "¿Lo recibiste de un colega? Suscríbete aquí" | Estefanía/Eloqua |
| RRSS | Bio Instagram + Bio X con link directo al formulario de suscripción | Estefanía |
| Pop-up de salida | Cuando detecta que el usuario va a abandonar — oferta: newsletter semanal | Leo/Brace |

#### Meta de suscripción
- Baseline: ~6,327 suscriptores desde "Para empezar el día" (dato jun 2026)
- Meta julio: +500 suscriptores nuevos
- Meta dic: +5,000 suscriptores nuevos (total 140,000+ activos en Eloqua)

---

## KPIs consolidados — qué medimos y cuándo

### Canal Sitio Web (north star: tráfico)
| Métrica | Baseline (jun 2026) | Meta jul | Meta dic |
|---|---|---|---|
| Sesiones totales/mes | ~18,000 | 22,000 | 45,000 |
| Sesiones orgánicas Google/mes | ~4,176 | 6,000 | 15,000 |
| Páginas/sesión | 1.34 | 1.7 | 2.5 |
| CTR medio GSC | 1.5% | 2% | 3% |
| Páginas indexadas | 2,676 | 3,500 | 7,000 |

### Canal Email
| Métrica | Baseline | Meta |
|---|---|---|
| CTOR | 2.5% | 5% |
| Open rate | 61% | Mantener >55% |
| Sesiones desde email/mes | ~8,136 | 10,000 |

### Canal Social
| Métrica | Baseline | Meta jul | Meta dic |
|---|---|---|---|
| Sesiones desde RRSS/mes | ~1,800 | 2,500 | 5,000 |
| Guardados IG | ~39 | 60 | 150 |
| Impresiones X (hilo semanal) | 0 (sin estrategia) | 10,000 | 40,000 |
| Videos YouTube con link sitio | 0/77 | 40/77 | 77/77 |

### Canal Suscripción (conversión)
| Métrica | Baseline | Meta |
|---|---|---|
| Suscriptores nuevos/mes | Desconocido (dato GA4 roto) | 500/mes |
| Tasa conversión visita→suscriptor | 4.8% implícita (PPED) | 8% |

### Señales de alerta
- CTOR email < 3% por 4 semanas consecutivas → revisar asuntos y formato
- CTR GSC < 1.5% → C1-C5 no implementados → escalar a Jeison
- Sesiones/mes < 15,000 en dic 2026 → plan de recuperación con pauta

---

## Mapa de responsabilidades

| Canal | Owner estratégico | Owner técnico/ejecución | Coordinación |
|---|---|---|---|
| Sitio web / SEO | Carolina | Leo (Brace CMS) | Jeison (escalada técnica) |
| Email | Carolina | Estefanía Ochoa (Eloqua) | Natalia Otálora |
| Instagram | Carolina | Estefanía Ochoa | — |
| X / Twitter | Carolina | Estefanía Ochoa | — |
| YouTube | Carolina | Leo (técnico) + Analistas (grabación) | Natalia |
| LinkedIn | Carolina | Por definir | — |
| Pauta | Carolina | Alejandro Bojacá (Performix) / Starcom | Natalia Otálora + Jeison |
| GA4 / datos | Carolina | Leo (implementación) | Jeison |

---

## Lo que NO hace este plan

- CTAs a productos bancarios de Davivienda — solo tráfico editorial y suscripción
- Contenido de otras BUs (MFxInvertir, MFxMiNegocio) — son plataformas separadas
- Datos de otras plataformas mezclados — Vision = Vision únicamente
- Mencionar banca competidora (Bancolombia, BBVA, Banco de Bogotá, Itaú)
- HubSpot — Visión usa Eloqua como plataforma de email

---

## Relacionado

[[Vision_EstrategiaSEO_2026-06]] · [[Vision_EstrategiaSEO_CRO_2026-06]] · [[Vision_EstrategiaEmail_2026-06]] · [[Vision_EstrategiaPauta_2026-06]] · [[Vision_AuditoriaRRSS_2026-06]] · [[Vision Dashboard Estratégico]] · [[VS01-Funnel-Trafico-Suscriptores]]

#vision-davivienda #estrategia-360 #growth #seo #email #social #pauta #h2-2026
