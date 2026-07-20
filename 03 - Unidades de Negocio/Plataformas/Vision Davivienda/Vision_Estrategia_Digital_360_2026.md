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

Basado en auditoría real a jun 30, 2026: GA4, GSC, auditoría RRSS, email Braze, pauta Performix/Starcom. No es un plan genérico — cada acción está anclada a un número real.

---

## 0. Diagnóstico consolidado — los 4 hallazgos que cambian todo

### Hallazgo 1: Social es el canal de adquisición. Email es el canal de retención. Son roles distintos.

| Canal | Sesiones | % sesiones | Usuarios nuevos | % nuevos | Sesiones/usuario nuevo |
|---|---|---|---|---|---|
| Organic Social | 15,427 | **35.5%** | 12,804 | **52.9%** | 1.2 — casi de una visita |
| Email | 12,974 | **29.9%** | 3,047 | **12.6%** | **4.3 — usuarios que vuelven** |
| Direct | 4,375 | 10.1% | 2,361 | 9.8% | 1.9 |
| Organic Search | 4,336 | 9.9% | 1,463 | 6.0% | 3.0 |
| Paid Search | 4,149 | 9.6% | 3,582 | 14.8% | 1.2 |
| Unassigned | 1,223 | 2.8% | 455 | 1.9% | — |
| AI Assistant | 59 | 0.1% | 42 | 0.2% | — |

**Total sesiones: ~43,400 | Total usuarios nuevos: ~24,210**

**Lectura:** Social trae nuevos usuarios que no vuelven (1.2 sesiones). Email fideliza: cada suscriptor genera 4.3 sesiones. Son dos máquinas distintas — optimizarlas con la misma métrica es un error. SEO orgánico (6% nuevos, 9.9% sesiones) es el canal con mayor potencial sin explotar.

**Dato inesperado:** AI Assistant ya genera 59 sesiones y 42 usuarios nuevos — ChatGPT, Perplexity y Google AI Overviews ya están citando Visión. Hay que acelerar esa capa.

### Hallazgo 2: La conversión a suscriptor es casi inexistente.
- `form_start` total en el período: **64 eventos** — en un sitio con 43,400 sesiones
- Tasa de inicio de formulario: **0.14%** — el CTA de suscripción no está siendo visto
- `file_download`: 1 evento total — el contenido no está siendo descargado ni compartido
- `click` trackeable: solo 143 — casi no hay navegación interna
- La tabla de **eventos clave está vacía** — GA4 no tiene ninguna conversión configurada. La pauta (4,149 sesiones pagadas) es completamente ciega: nadie sabe si convierte

### Hallazgo 3: La retención desde redes sociales es mínima.
Análisis de cohorte (últimas 6 semanas):
- Semana 0 (nuevos): ~5,000 usuarios/semana
- Semana 1: ~100-200 (2-4% retención)
- Semana 4: 40-84 (0.8-1.7%)

Los usuarios de Social llegan una vez y no vuelven. El loop de fidelización está roto: llegan por un artículo compartido, leen, y no encuentran razón para quedarse (sin artículos relacionados, sin CTA de newsletter).

### Hallazgo 4: Los datos de contenido están ciegos.
- **2,046,282 eventos GA4** con `article_id = (not set)` — el evento dispara pero no pasa el parámetro del artículo. Nadie sabe qué artículos específicos generan más engagement.
- **UTMs de pauta rotos** (1,223 sesiones Unassigned) — presupuesto de Paid Search invisible en GA4.
- Nombres de eventos Braze con números ("12.0 Cerrar") — imposible comparar campañas. Naming de campañas usa código "20250828" (agosto 2025) — no actualizado en casi un año.
- **Página no encontrada: 151 vistas** — hay links rotos o páginas movidas sin redirect.

---

## Fase 0 — Destapar los datos (Semana 1, bloqueante)

Ninguna optimización de pauta, contenido ni SEO tiene sentido hasta resolver esto. Los datos rotos hacen invisible qué funciona.

| # | Acción | Owner | Por qué |
|---|---|---|---|
| 1 | **Leo/Brace:** pasar `informe_id` y `article_title` como parámetro en el evento GA4 "informe_de_interes" | Leo (Brace CMS) | Sin esto, 2M+ events son inútiles — no sabemos qué contenido genera interés |
| 2 | **Leo/Brace:** configurar eventos clave (conversiones) en GA4 — mínimo: `form_start`, `form_submit` (suscripción), `EventosVision` | Leo (Brace CMS) | La tabla de eventos clave está vacía — 4,149 sesiones de pauta pagada sin saber si convierten |
| 3 | **Performix/Jeison:** estandarizar UTMs — `utm_source=performix&utm_medium=paid_social&utm_campaign=[nombre]` en todos los creativos | Jeison + Alejandro Bojacá | Presupuesto de pauta invisible en GA4 (Unassigned = 1,223 sesiones) |
| 4 | **Leo:** redirigir (301) las páginas con "Página no encontrada" (151 vistas) — auditar con GSC Coverage report | Leo (Brace CMS) | Links rotos dañan SEO y experiencia del usuario |
| 5 | **Estefanía/Braze:** renombrar campañas y eventos de email con fecha actual: "[YYYYMMDD]_[tipo]_[tema]" — eliminar código "20250828" que lleva activo desde ago 2025 | Estefanía | Sin naming correcto no hay comparación cross-campaign |

**Checkpoint:** Carolina verifica con Jeison que los 5 fixes están en producción antes de liberar Fase 1.

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

#### Métricas SEO actuales (junio 2026)

| Métrica | Actual | KPI target | Estado |
|---|---|---|---|
| Sesiones orgánicas/mes | 4,336 | — | -9.1% vs período anterior |
| Usuarios orgánicos | 1,944 | — | -9.8% |
| AVR Position | 7.01 | 6.62 | Fuera de meta |
| % Rebote orgánico | 46.31% | <44.3% | Fuera de meta |
| **Tiempo en visita** | **5:47** | — | **+20.7% — señal positiva** |
| Sesiones orgánicas acumuladas 2026 | ~30,807 | 138,000 anual | 22.3% del año |

El tiempo en visita de 5:47 confirma que el contenido es bueno — el problema es atraer al usuario, no retenerlo.

#### El activo oculto: 918 queries en posición #1

Visión rankea primero para ~918 consultas y en las posiciones 4-10 para otras 1,317. El problema: CTR bajo porque los títulos no son clicables. Quien llega, se queda (5:47 avg). El cuello de botella está antes del clic.

Muestra de queries en posición #1:
- "inflacion del 2024 al 2025", "deficit fiscal en colombia en los últimos 10 años", "cuando bajan las tasas de interés en colombia", "proyeccion inflacion junio 2026", "puede subir el dolar en colombia", "que deuda dejo petro"

Ninguna de estas tiene un título en SERP que invite a hacer clic — están ahí por relevancia de contenido, no por optimización de título.

**Dato inesperado:** "inflacion el salvador 2025" e "inflacion de el salvador 2025" → posición #1. Visión tiene presencia orgánica internacional (Centroamérica) sin haberla buscado. Confirma la fortaleza editorial — los analistas generan EEAT natural.

#### Oportunidades CTR — artículos con títulos a reescribir (prioridad por impacto)

Ranking actualizado con datos CSV completo de GSC (19-jul-2026):

| # | URL (fragmento) | Query principal | Impresiones | CTR actual | CTR meta | Clics ganados |
|---|---|---|---|---|---|---|
| 1 | inflacion-en-colombia-2025 | "inflacion en colombia 2025" | **1,390** | **0.07%** | 3% | **+41** directos pero es el peor rendimiento del sitio |
| 2 | déficit-fiscal-colombia-2026 | "deficit fiscal colombia 2026" | **686 + 450** | 1.3-1.8% | 5% | **+55** (400x más impresiones en GSC completo: 26,183) |
| 3 | dividendos-ecopetrol-2026 | "dividendos ecopetrol 2026" | **673** | 1.49% | 8% | **+44** |
| 4 | Colombia-2025-crecimiento-inflacion | varias | estimado 14,268 | 0.4% | 2% | +228 |
| 5 | marco-fiscal-mediano-plazo-2026 | "marco fiscal de mediano plazo 2026" | 450 en CSV / 10,026 GSC | 6.9% en CSV | mejorar | — |

**Nota sobre la discrepancia de datos:** Los números de impresiones del CSV de consultas son menores que los de la vista de páginas en GSC — es normal, porque una página puede rankear para miles de consultas y el CSV solo muestra las principales. El artículo de déficit fiscal aparece con 26,183 impresiones vía páginas pero la consulta "deficit fiscal colombia 2026" específica tiene 686 imp en el CSV de queries.

**Caso más urgente: "inflacion en colombia 2025" = 1,390 impresiones, 0.07% CTR**

Este artículo rankea para una de las búsquedas más frecuentes del sitio pero no convierte. Diagnóstico probable: el título es genérico o usa el del homepage (bug C2). Acción: reescribir como `"Inflación en Colombia 2025: ¿cuánto subieron los precios? Datos BanRep"`.

**Título ejemplo — déficit fiscal antes/después:**
- Antes: `"Déficit Fiscal Colombia 2026 - Meta 5.1% PIB"` (genérico)
- Después: `"Déficit fiscal Colombia 2026: el gobierno sube la meta a 5.1% del PIB — ¿qué significa?"` (número + pregunta + implicación)

**Regla para todos los títulos:** keyword principal en las primeras 3 palabras + número concreto o fecha + promesa explícita.

#### Hallazgo de ruido: queries de conversión y operadores en GSC — señal de alerta de autoridad temática

El CSV contiene queries como "3500 cop", "29*3600", "3800 usd to cop", "25000 pesos chilenos a colombianos", y queries con operadores de investigación de medios (`""banco de occidente"" -site:reddit.com...`). Esto significa:

1. **Google piensa que Visión es relevante para conversión de moneda** — porque los artículos mencionan cifras en pesos sin contexto suficiente para distinguirlos de una calculadora
2. **Herramientas de media intelligence** están scrappeando Google con Visión en los resultados — señal de presencia pero ruido en GSC

Impacto: diluye la señal de especialización temática. Google no puede construir un perfil limpio de "sitio de análisis económico" si también rankea para conversiones de moneda.

**Acción (Leo):** Verificar si hay páginas con tablas de tipos de cambio o convertidores implícitos. Si existen, agregar canonical o noindex a esas páginas. Si no existen, el problema es que artículos mencionan precios y números sin suficiente contexto editorial — los analistas deben escribir "el tipo de cambio USD/COP fue de $3,500" (con contexto) en lugar de solo "3,500".

#### Confusión de marca: "davivienda es grupo aval" — necesita corrección editorial

| Query | Impresiones | CTR | Posición |
|---|---|---|---|
| davivienda es grupo aval | 135 | 0.7% | 7.3 |
| davivienda pertenece al grupo aval | 177 | 0.6% | 9.2 |

312 personas por mes buscan si Davivienda es Grupo Aval (es Grupo Bolívar). Visión aparece sin dar la respuesta correcta con claridad. Los artículos que rankean para estas queries deben incluir una oración explícita: "Davivienda es parte del Grupo Bolívar, no del Grupo Aval."

#### Páginas con CTR alto pero pocas impresiones (expandir con contenido)

| Categoría | CTR actual | Impresiones | Señal |
|---|---|---|---|
| Así Cierran los Mercados (sección) | **43.06%** | 72 | Casi nadie la encuentra; quien la encuentra siempre hace clic |
| Para empezar el día (artículos específicos) | **9.2%** | 348 | El formato diario genera alta intención |
| Calendario dividendos Colombia 2026 | **13.33%** | 660 | Escalable: agregar más calendarios por empresa |
| Para empezar el día (sección) | 3.22% | 807 | Posición 1.81 — ya en top |

**Acción:** Publicar "así cierran los mercados [fecha]" y "para empezar el día [fecha]" con URL y formato estándar todos los días hábiles. Cada publicación genera un URL nuevo indexable — el volumen acumulado construye el canal orgánico.

#### Cluster de dividendos — el nicho más fuerte de Visión en orgánico

Visión domina las búsquedas de dividendos en Colombia. Datos exactos del CSV de consultas GSC:

| Query | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| calendario dividendos colombia 2026 | 13 | 53 | **24.5%** | 2.49 |
| calendario dividendos 2026 colombia | 9 | 33 | **27.3%** | 2.61 |
| dividendos colombia 2026 | 6 | 27 | **22.2%** | 3.19 |
| dividendos 2026 colombia | 2 | 14 | **14.3%** | 2.64 |
| fecha dividendos ecopetrol 2026 | 2 | 7 | **28.6%** | 3.29 |
| dividendos bvc 2026 | 2 | 8 | **25%** | 7.38 |
| dividendos 2026 | 2 | 22 | 9.1% | 3.68 |
| dividendos ecopetrol 2026 | 10 | 673 | **1.49%** | 4.26 |
| pago dividendos ecopetrol 2026 | 4 | 224 | 1.79% | 4.67 |
| cuando pagan los dividendos de ecopetrol 2026 | 2 | 62 | 3.23% | 2.68 |

**Lectura clave:** Las queries con formato "calendario dividendos" tienen 22-28% CTR (excelente). Las queries de Ecopetrol específico tienen 1.5-3% CTR — el mismo tema pero el formato de artículo no convierte. El hub consolidado resuelve ambos.

**"vision davivienda corredores" = 14 clics, pos 1.08** — dato nuevo del CSV: hay usuarios que buscan específicamente "vision davivienda corredores" como sub-marca. La página `/en-que-invertir/davivienda-corredores` propuesta abajo captura este query además del referral.

**Acción:** Crear un hub de dividendos — página consolidada actualizada mensualmente con todos los pagos de dividendos del año (Ecopetrol, Grupo Sura, Bancolombia, etc.) con fechas ex-dividendo, fechas de pago y monto por acción. Este hub puede capturar el 80% de estas búsquedas desde una sola URL.

#### Queries en posición 11 a empujar a página 1

| Query | Posición | Por qué importa |
|---|---|---|
| finanzas en colombia | 11 | Query genérico de alto volumen — entrar a top 10 = salto de tráfico |
| banrep tasas | 11 | Alta intención financiera — Visión debería ser la referencia |
| ipc y ipp | 11 | Terminología técnica = audiencia de analistas |
| interés bancario corriente colombia 2026 | 11 | Query con fecha = alta intención actual |

Para estos, pasar de posición 11 a posición 7-10 típicamente duplica el CTR.

#### "corredores davivienda": la conexión entre SEO y referral

- Query: "corredores davivienda" → posición 7.08 → 1,184 impresiones → **0.08% CTR** (1 clic)
- Este mismo usuario llega por referral desde daviviendacorredores.com

**Diagnóstico:** Visión aparece para búsquedas de Davivienda Corredores pero el título no dice nada relevante para ese usuario. El usuario busca Corredores, encuentra Visión, no hace clic porque el título no matchea.

**Acción:** Crear una página `/en-que-invertir/davivienda-corredores` con análisis de mercados orientado a clientes de corredora. Beneficio doble: +tráfico orgánico "corredores davivienda" + pieza de partnership para la propuesta a Davivienda Corredores.

#### Queries a NO optimizar (intención incorrecta)

Visión aparece en posición 4 para "noticias de colombia última hora" — ese usuario quiere breaking news, no análisis. No añadir este keyword en ningún título ni meta description. Lo mismo aplica para "y quienes son los dueños", "dame porcentajes", "como reaccionaron" — queries conversacionales sin intención editorial definida.

**Acción concreta:** Reescribir títulos y meta descriptions de estas páginas con promesa explícita + keyword principal al inicio. Ejemplo: `"Déficit fiscal Colombia 2026: meta 5.1% del PIB — análisis Davivienda"` reemplaza cualquier título genérico.

#### Capa IA/LLMs (Leo)
ChatGPT, Perplexity y Google AI Overviews ya responden preguntas de economía colombiana. Visión tiene el mejor análisis primario — solo falta que los bots lo encuentren:

| Acción | Detalle |
|---|---|
| Verificar robots.txt: NO bloquear GPTBot, ClaudeBot, PerplexityBot | Si están bloqueados, los LLMs no pueden citarnos |
| Schema NewsArticle + Person en todos los artículos | Author = nombre del analista visible + credenciales |
| Crear `/llms.txt` con descripción del sitio y lista de analistas | Protocolo adoptado por Claude, ChatGPT, Perplexity |
| Resumen ejecutivo en primeras 2-3 oraciones de cada artículo | Lo que los LLMs extraen cuando citan una fuente |

---

### Canal 2: Email (Braze)
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

**Acción esta semana:** Medir CTR de los últimos 3 emails en Braze por tipo de contenido (macro vs empresas vs mercados) y reportar a Carolina. Confirmar naming vigente de campañas.

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

#### El diagnóstico real (datos GA4 — sesiones por campaña)

Los AON de Facebook son el peor tráfico de todo el sitio — peor que bots:

| Campaña | Sesiones | Tiempo engagement | Rebote | Landing page |
|---|---|---|---|---|
| 2-AON-VISION_CSD / FB Social | 8,955 + 4,427 + 261 = **13,643** | **0-1 segundo** | **80-85%** | `/`, `/estar-actualizado`, `/monedas` |
| 4-AON-VISION_CSD / FB Social | 793 + 588 = **1,381** | **2-3 segundos** | **77-81%** | `/macroeconomia`, `/estar-actualizado` |
| **Total FB Social AON** | **~15,024 sesiones** | **<3s** | **~83%** | Páginas de categoría genéricas |

Comparado con Google CPC (misma campaña AON, distinto canal):

| Landing page CPC | Sesiones | Tiempo | Rebote |
|---|---|---|---|
| /en-que-invertir (categoría) | 2,561 | 14s | 42.9% |
| /en-que-invertir/renta-fija | 335 | 28s | **0%** |
| /en-que-invertir/acciones | 260 | 28s | **0%** |
| /en-que-invertir/monedas | 147 | 18s | **0%** |

**Diagnóstico:** El problema no es el canal de Facebook — es que las campañas AON mandan tráfico a categorías genéricas (`/`, `/estar-actualizado`) sin contenido específico. Un usuario que llega a `/macroeconomia` no sabe qué leer y rebota en 2 segundos. Google CPC funciona donde llega a subcategorías con artículos visibles.

#### Acciones correctivas — pauta

| # | Acción | Detalle | Impacto |
|---|---|---|---|
| 1 | **Cambiar landing pages de todos los AON de Facebook** | Nunca a `/` ni categorías genéricas — siempre a artículo específico publicado en las últimas 48h | Es el fix más importante; elimina el rebote de 83% sin cambiar el presupuesto |
| 2 | **Pauta FB solo sobre artículo específico** | El creativo lleva la imagen del artículo, el CTA lleva al artículo — no a la home | Reduce rebote de 83% a proyección 50-60% |
| 3 | **Corregir /en-que-invertir (categoría)** de CPC | 2,561 sesiones con 42.9% rebote — cambiar a subcategoría o artículo | Ya funciona bien en subcategorías (0% rebote) |
| 4 | **Implementar UTMs estándar (Fase 0)** | Campaña AON actualmente sin diferenciación de artículo en UTMs | Sin esto no se puede saber qué creativos generan engagement |
| 5 | **Configurar conversión en GA4 antes de optimizar CPC** | 0 eventos clave = Google Ads no puede hacer smart bidding real | Prioridad de Fase 0 |

#### Naming de campañas email — problema detectado
Las campañas `20250828` en Braze = código de agosto 28, **2025** — los naming no se han actualizado en casi un año. Esto impide comparar campañas por fecha y por tipo. Parte del fix de Fase 0 de Estefanía.

#### Mejor contenido por canal (dato empírico de esta tabla)
| Tipo de contenido | Canal | Rebote | Engagement | Acción |
|---|---|---|---|---|
| Para empezar el día | Email/Braze | **40-43%** | 38s-1:19 | Ampliar frecuencia — es el mejor formato |
| Boletin quincenal | Email/Braze | **55.8%** | **1:33** | El mayor engagement del sitio — escalar |
| Expectativa semanal | Email/Braze | 57-63% | 54s-59s | Mantener |
| Artículo específico | CPC (subcategoría) | **0%** | 18-28s | Modelo correcto para CPC |
| Categoría genérica | FB Social | **80-85%** | 0-3s | Eliminar como landing |

#### Presupuesto y ejecución (junio 2026 — dato oficial Performix)

| Métrica | Valor |
|---|---|
| Presupuesto planeado | $5.749M COP |
| Presupuesto consumido | $2.997M COP |
| **% ejecución presupuestal** | **52%** — pacing roto |
| Meta sesiones mensual | 19,355 |
| Sesiones logradas | 19,206 |
| Cumplimiento sesiones | ~99% mensual / ~36% acumulado anual |
| Split canal pagado | FB/Social 70.3% · Google CPC 29.5% · GOSEM 0.2% |

$2.75M sin gastar en junio = no es eficiencia, es problema de entrega. Revisar con Performix si el presupuesto restante se puede redirigir a Google CPC (mejor calidad de tráfico) o acumular para julio.

#### Evolución mensual sesiones pagadas (ene-jul 2026)

| Mes | Sesiones | Vistas |
|---|---|---|
| Enero | 14,831 | 17,235 |
| Febrero | **3,491** | 6,407 |
| Marzo | 3,480 | 6,619 |
| Abril | 8,200 | 12,050 |
| Mayo | 12,937 | 18,844 |
| Junio | 19,376 | 25,466 |
| Julio (parcial al 19/7) | 8,296 | 9,968 |

**Alerta: caída feb-marzo de 14,831 → 3,491 = -76% en un mes.** No es estacional. Pedir a Performix explicación de qué pasó en febrero (¿pausa de campañas? ¿presupuesto bloqueado? ¿cambio de plataforma?).

#### Análisis de keywords Search (Google CPC)

**Keywords que funcionan (CTR alto + intención clara):**
| Keyword | Clics | CTR | Impresiones | Audiencia |
|---|---|---|---|---|
| cdt davivienda | 757 | **41%** | 1,859 | INVERSIÓN |
| vision davivienda (ind.) | 2,636 | **38%** | 6,891 | INDICADORES |
| cdt simulador | 1,131 | **27%** | 4,214 | INVERSIÓN |
| vision davivienda (2) | 680 | 32% | 2,145 | INVERSIÓN |
| vision davivienda (3) | 361 | 31% | 1,160 | VISION |
| cdt | 1,657 | **13%** | 12,817 | INVERSIÓN |
| fondos indexados | 3,473 | 7% | 51,645 | INVERSIÓN |

**Keywords que desperdician presupuesto (CTR bajo + intención incorrecta):**
| Keyword | Clics | CTR | Impresiones | Problema |
|---|---|---|---|---|
| noticias economicas | 3,455 | 2% | 199,337 | Buscan noticias, no análisis |
| en que puedo invertir mi dinero... | 745 | 2% | 30,761 | Consulta genérica, no Visión |
| noticias de hoy | 435 | 2% | 28,639 | Off-topic |
| noticias | 384 | **1%** | 26,681 | El peor CTR — cortar |
| economia colombiana | 360 | 2% | 17,440 | Bajo intent |

"Noticias economicas" sola consume 199K impresiones con 2% CTR. El usuario que busca "noticias" no busca análisis financiero de profundidad — ese es un keyword equivocado para Visión.

**Acciones sobre keywords:**
1. Pausar o excluir "noticias", "noticias de hoy" inmediatamente
2. Aumentar bid en CDT keywords (41%, 27% CTR — audiencia de alto valor)
3. Redirigir presupuesto liberado a "fondos indexados" y branded
4. Agregar negativos: "breaking news", "última hora", "hoy", "Colombia hoy"

#### Segmentación sugerida (Colombia, finanzas)
- Intereses: economía, inversiones, bolsa de valores, banca
- Lookalike: de la base de suscriptores Braze (exportar lista y subir a Meta)
- Excluir: audiencias de banco competidor (regla Grupo Bolívar)
- Meta de pauta: CPV ≤ $350 COP (actual: $395 COP)

### Canal 5: Referral Estratégico — daviviendacorredores.com

Dato nuevo de GA4 sesiones por campaña:

| Fuente | Sesiones | Engagement | Rebote |
|---|---|---|---|
| daviviendacorredores.com / referral | 211 | 21s | 50.7% |
| davivienda-corredores / redirected | 126 | 17s | 25.4% |

**337 sesiones combinadas** de Davivienda Corredores — audiencia financiera altamente calificada (clientes de corredora de bolsa de Davivienda). 25.4% de rebote en el canal redirected es el más bajo de todo el sitio excepto subcategorías de CPC.

**Acción:** Proponer a Natalia Otálora formalizar la relación con Davivienda Corredores: banner permanente en su sitio, sección compartida de análisis, o boletín cruzado. Ya están enviando tráfico — solo falta un acuerdo formal.

#### Bing Organic — no medido, ya genera tráfico
- 107 sesiones / 19% rebote — audiencia de calidad
- Sin intervención activa (cero esfuerzo dedicado)
- Acción: pedir acceso a Bing Webmaster Tools + enviar sitemap (1 hora de trabajo, resultado permanente)

---

## Fase 2 — Conversión: de tráfico a suscriptor

### Funnel VS01 — Suscriptor Newsletter
**Norte:** 10% de los visitantes nuevos se suscriben al newsletter de Braze

#### El problema de conversión actual
La sección con más tráfico (Para empezar el día) tiene 130K sesiones y solo 6,327 suscriptores convertidos: **4.8% de conversión implícita**. El formulario de suscripción no está siendo promovido activamente en el punto de mayor tráfico.

#### Acciones de conversión por punto de contacto

| Punto | Acción | Owner |
|---|---|---|
| Artículo (cualquier página) | Módulo de suscripción inline (al 50% del scroll) + al final del artículo | Leo/Brace |
| Para empezar el día (top de tráfico) | CTA fija arriba del artículo: "Recíbelo a las 6 AM — suscríbete gratis" | Leo/Brace |
| Email trigger | Cada informe nuevo enviado incluye "¿Lo recibiste de un colega? Suscríbete aquí" | Estefanía/Braze |
| RRSS | Bio Instagram + Bio X con link directo al formulario de suscripción | Estefanía |
| Pop-up de salida | Cuando detecta que el usuario va a abandonar — oferta: newsletter semanal | Leo/Brace |

#### Meta de suscripción
- Baseline: ~6,327 suscriptores desde "Para empezar el día" (dato jun 2026)
- Meta julio: +500 suscriptores nuevos
- Meta dic: +5,000 suscriptores nuevos (total 140,000+ activos en Braze)

---

## KPIs consolidados — qué medimos y cuándo

### Canal Sitio Web (north star: tráfico)
| Métrica | Baseline (panorámico jul 2026) | Meta dic |
|---|---|---|
| Sesiones totales/mes | ~43,400 | 70,000 |
| Sesiones orgánicas Google/mes | ~4,336 | 15,000 |
| Sesiones desde Social/mes | ~15,427 | 20,000 |
| Sesiones desde Email/mes | ~12,974 | 18,000 |
| CTR medio GSC | 1.5% | 3% |
| Páginas indexadas | 2,676 | 7,000 |
| Páginas no encontradas | 151 vistas | 0 |

### Canal Email
| Métrica | Baseline | Meta |
|---|---|---|
| CTOR | 2.5% | 5% |
| Open rate | 61% | Mantener >55% |
| Sesiones/usuario email | 4.3 (retención fuerte) | Mantener >4.0 |
| Sesiones desde email/mes | ~12,974 | 18,000 |

### Canal Social
| Métrica | Baseline | Meta dic |
|---|---|---|
| Sesiones desde Social/mes | 15,427 | 20,000 |
| Sesiones/usuario nuevo desde social | 1.2 (una sola visita) | 1.8 (conversión a suscriptor) |
| Videos YouTube con link sitio | 0/77 | 77/77 |

### Canal Suscripción (conversión — el más roto)
| Métrica | Baseline | Meta |
|---|---|---|
| form_start eventos/mes | **64** en ~43K sesiones | 2,000/mes |
| Tasa form_start/sesión | **0.14%** | 5% |
| Eventos clave configurados en GA4 | **0** (tabla vacía) | Mínimo 3 |
| AI Assistant sesiones | 59 | 500 |

### Señales de alerta
- CTOR email < 3% por 4 semanas consecutivas → revisar asuntos y formato
- CTR GSC < 1.5% → C1-C5 no implementados → escalar a Jeison
- Sesiones/mes < 15,000 en dic 2026 → plan de recuperación con pauta

---

## Mapa de responsabilidades

| Canal | Owner estratégico | Owner técnico/ejecución | Coordinación |
|---|---|---|---|
| Sitio web / SEO | Carolina | Leo (Brace CMS) | Jeison (escalada técnica) |
| Email | Carolina | Estefanía Ochoa (Braze) | Natalia Otálora |
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
- HubSpot — Visión usa Braze como plataforma de email (no Eloqua, no HubSpot)

---

## Relacionado

[[Vision_EstrategiaSEO_2026-06]] · [[Vision_EstrategiaSEO_CRO_2026-06]] · [[Vision_EstrategiaEmail_2026-06]] · [[Vision_EstrategiaPauta_2026-06]] · [[Vision_AuditoriaRRSS_2026-06]] · [[Vision Dashboard Estratégico]] · [[VS01-Funnel-Trafico-Suscriptores]]

#vision-davivienda #estrategia-360 #growth #seo #email #social #pauta #h2-2026
