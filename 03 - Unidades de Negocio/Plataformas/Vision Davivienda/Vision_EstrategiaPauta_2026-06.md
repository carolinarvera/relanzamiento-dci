---
date: 2026-06-19
type: estrategia-pauta
tags: [vision-davivienda, pauta, meta-ads, google-ads, segmentacion, creativos, performix, plan-de-accion]
related-projects: [vision-davivienda, growth-dashboard]
related-people: [natalia-otalora, carolina-ramirez, alejandro-bojaca, jeison-montero, estefania, ernesto]
sources:
  - "Vision_04_PautaDigital_2026-06.xlsx — datos reales AON/Starcom enero–junio 2026"
  - "Reunión Natalia Otálora 2026-06-16 — diagnóstico + 4 ejes aprobados"
  - "GA4 Visión Davivienda — sesiones por canal 2026"
  - "Google Search Console — impressions/CTR mayo 2026"
  - "Braze — 135,500 suscriptores activos segmento 3189_IEC_NEW_BOLETÍN_QUINCENAL"
ai-first: true
confidence: high
---

# Visión Davivienda — Estrategia Completa de Pauta Digital 2026

> **For future Claude:** Estrategia integral de pauta pagada para Visión Davivienda (vision.davivienda.com). El problema central no es de presupuesto — es de objetivos equivocados: $9.9M COP del presupuesto 2026 financian campañas de Interacción/Registros/Visitas al perfil que NO generan sesiones web medibles en GA4. Con los mismos $27M y un cambio de estructura, el target es pasar de 12,778 sesiones/mes (mayo 2026) a 20,000+/mes. Agencia: Performix (Alejandro Bojacá vía Starcom). Carolina sin acceso Meta BM todavía — urgente antes del 20 jun. Natalia Otálora sale el 28 jun — toda propuesta debe estar aprobada antes.

---

## 1. DIAGNÓSTICO — DÓNDE ESTÁ EL DINERO Y POR QUÉ RINDE POCO

### 1.1 Historial de sesiones vs presupuesto (2026)

| Mes | Sesiones pauta | Contexto | Signal |
|-----|---------------|----------|--------|
| Enero | 14,489 | Pauta activa · algoritmo entrenado | **Mejor mes — esta es la línea base real** |
| Febrero | 2,742 | Pauta pausada o muy reducida | El algoritmo pierde aprendizaje en 2 semanas |
| Marzo | 3,613 | Reactivación parcial | Recuperación lenta — cuesta volver a arrancar |
| Abril | 7,960 | Escalando nuevamente | Algoritmo reaprendiendo |
| Mayo | 12,778 | 134% vs AON · $6,010,158 ejecutados | 88% de enero con más presupuesto — algo no cuadra |
| Junio | ~7,939 est. | En curso — 42% Meta / 58% Google | Sin auditoría posible sin acceso BM |

**Conclusión del historial:** El mejor resultado (enero, 14,489 sesiones) se logró con algoritmo maduro y sin pausas. Mayo llegó al 88% de ese record con más inversión y más presupuesto anual. La diferencia no es la cantidad de dinero — es la continuidad del algoritmo y la calidad de los objetivos.

---

### 1.2 El problema raíz — $9,900,000 COP en objetivos sin sesiones

| Objetivo activo | Canal | COP/mes | ¿Genera sesiones en GA4? | Por qué es el problema |
|----------------|-------|---------|--------------------------|------------------------|
| Interacción de publicaciones | Meta | $1,500,000 | **NO** | Genera likes/comments/shares. Meta reporta "interacciones", GA4 no ve nada. Vanity metric pura. |
| Registros (Lead Gen) | Meta | $4,600,000 | **NO** | Formularios nativos de Meta — el usuario nunca visita el sitio web. No impacta GA4 ni Braze directamente. |
| Visitas al perfil de Instagram | Meta | $3,800,000 | **NO** | Lleva al perfil IG, no al sitio. Meta cobra por esa visita, GA4 no la cuenta. |
| **Subtotal desperdicio** | | **$9,900,000** | | **37% del presupuesto anual sin retorno medible en sesiones** |
| Sesiones web (Google GOSEM) | Google | $8,409,212 | ✅ Sí | Funciona — CDT al 12% CTR, fondos indexados al 7% |
| Sesiones web (Meta) | Meta | $8,690,000 | ✅ Sí | Funciona pero CPV inflado a ~$395 vs target <$350 |

> **La palanca más rápida disponible:** cambiar el objetivo de "Interacción" a "Sesiones" en Meta no requiere nuevo presupuesto, no requiere nuevos creativos, no requiere aprobación de presupuesto adicional. Solo requiere instrucción a Performix. **El CPV caería inmediatamente de ~$395 a <$350 porque Meta optimiza para la métrica correcta.**

---

### 1.3 Problemas estructurales adicionales

**Lookalike Audiences obsoletas**
La base de email creció 103% — de ~66K (2024) a 135,500 (2026). Si las LAL activas se entrenaron con la lista vieja, Meta está buscando perfiles similares a una audiencia que ya no representa quién es el suscriptor hoy. Esto explica parcialmente el CPV inflado.

**Custom Audience CA-01 no cargada en Meta**
La lista de 135,500 emails no está subida como Custom Audience en Meta Business Manager. Sin ella:
- No se pueden excluir suscriptores activos de las campañas de adquisición (se paga para adquirir gente que ya es suscriptora)
- No se pueden crear LAL sobre la lista real
- No se puede hacer remarketing preciso al segmento email inactivo

**Sin UTMs estandarizados**
Sin UTMs consistentes en los creativos, GA4 mezcla el tráfico de pauta con "Unassigned" o lo atribuye mal. Resultado: no se sabe con precisión qué creativos o audiencias generan las sesiones reales.

**Sin Pixel Meta configurado correctamente**
Los eventos de conversión en el Pixel (Suscripción confirmada, Lectura >2min, Newsletter signup) no están activados como eventos personalizados. Sin esto, Meta no puede optimizar para la métrica que importa — solo para clicks genéricos.

**42,000 visitantes de mayo sin remarketing activo**
En mayo llegaron ~42K visitantes únicos al sitio. Sin remarketing activo, ese pool se va sin una segunda oportunidad de impacto. Es el segmento más caliente del funnel y no se está tocando.

---

## 2. ESTRATEGIA — 3 TIPOS DE CAMPAÑA

La lógica del funnel: alguien que no conoce Visión → Tipo 1. Alguien que conoce pero no lee seguido → Tipo 2. Alguien que ya llegó al sitio o abrió un email → Tipo 3.

---

### TIPO 1 — ADQUISICIÓN DE SUSCRIPTORES (Top of Funnel)

**Objetivo estratégico:** convertir desconocidos con perfil financiero en suscriptores del newsletter. Cada suscriptor nuevo entra al ecosistema de retención (email, CRM) y tiene un LTV mucho mayor que una sesión anónima.

**Hipótesis:** la base de 135K suscriptores ya prueba que hay demanda. Con LAL de calidad sobre esa base, Meta puede encontrar perfiles similares en Colombia eficientemente. El benchmark del sector para CPL de newsletters financieros en LATAM es $300–$700 COP.

| Campo | Detalle |
|-------|---------|
| Objetivo Meta | Leads (formulario nativo Lead Gen) — o Conversión si se tiene landing dedicada |
| Objetivo Google | Search — keywords alta intención de búsqueda financiera |
| Budget Meta propuesto | $5,000,000 COP/mes |
| Budget Google propuesto | $3,000,000 COP/mes |
| KPI primario | CPL (costo por suscriptor nuevo) — target **<$500 COP** |
| KPI secundario | **5,000+ suscriptores nuevos/mes** |
| Frecuencia objetivo | <2 impresiones/usuario/semana (es prospección, no remarketing) |
| Exclusiones obligatorias | CA-01 (suscriptores activos) — no pagar por adquirir lo que ya es tuyo |

**Audiencias Meta para Tipo 1:**
1. LAL-01: 1% similares a CA-01 (lista 135K) — mayor calidad, menor escala
2. LAL-02: 2% similares a CA-01 — balance calidad/escala
3. Intereses financieros Colombia: economía + inversión + banca + finanzas personales — para escalar si LAL se agota

**Google Search — Keywords prioritarias Tipo 1:**

| Grupo | Keywords | Intención | Bid sugerido |
|-------|----------|-----------|-------------|
| Marca | "visión davivienda", "vision davivienda newsletter" | Branded | Máximo — eficiencia garantizada |
| Análisis económico | "análisis económico colombia 2026", "perspectiva económica colombia" | Alta | Alto |
| Indicadores macro | "ISE colombia", "inflación colombia 2026", "tasa BanRep hoy" | Alta | Alto |
| Inversión personal | "donde invertir en colombia", "cdts en colombia", "fondos de inversión colombia" | Alta | Alto |
| Conquista | "bloomberg línea colombia", "portafolio noticias economía" | Conquista | Bajo — test |

---

### TIPO 2 — TRÁFICO AL SITIO — ARTÍCULOS (Mid Funnel)

**Objetivo estratégico:** llevar al sitio a personas con perfil financiero que aún no son suscriptoras, o profundizar el engagement de las que ya lo son. El artículo es el gancho — la suscripción es la conversión natural al final de la lectura.

**Hipótesis:** el artículo semanal de Ernesto (Pista A) es el activo editorial más poderoso. Pautar ese artículo la semana que sale maximiza la relevancia y la CTR porque el dato es reciente. Un Reel de 30s con el dato principal del artículo funciona mejor que cualquier anuncio genérico porque ya tiene el hook integrado.

| Campo | Detalle |
|-------|---------|
| Objetivo Meta | **Traffic / Sessions** — NOT Interacción (ese es el error actual de $1.5M) |
| Objetivo Google | Display contextual + Search branded |
| Budget Meta propuesto | $4,900,000 COP/mes |
| Budget Google propuesto | $3,000,000 COP/mes |
| KPI primario | CPV (costo por visita) — target **<$350 COP** (actual ~$395) |
| KPI secundario | **15,000+ sesiones desde pauta/mes** |
| Contenido pautado | Artículo de la semana (Pista A Ernesto) — 1 Reel nuevo por semana |
| Frecuencia objetivo | <3 impresiones/usuario/semana — rotar si se supera |

**Audiencias Meta para Tipo 2:**
1. LAL-03: 3% similares a CA-03 (visitantes 90 días) — alta escala
2. LAL-04: 1% similares a CA-03 — calidad máxima
3. Intereses + comportamiento: lectores de medios económicos colombianos
4. CA-01 suscriptores activos como inclusión (re-engagement de la base)

**Google Display — Tipo 2:**
- Sites contextuales: La República, Portafolio, Bloomberg Línea CO, El Tiempo Economía, Dinero
- Formato: banner responsivo — imagen del artículo + titular + "Leer análisis" + logo Visión
- Remarketing: todos los visitantes últimos 90 días

---

### TIPO 3 — REMARKETING Y REACTIVACIÓN (Bottom Funnel)

**Objetivo estratégico:** capturar al visitante que llegó, miró, y se fue sin convertir. Es la audiencia más caliente del funnel y la más eficiente desde el punto de vista de CAC. También incluye suscriptores que abren el email pero no hacen click — señal de interés sin conversión completa.

**Hipótesis:** un visitante que llegó a Visión y leyó 2+ minutos ya tiene alta intención. Un anuncio de remarketing 3-7 días después con el artículo que leyó (o el más popular de esa semana) tiene CPV potencial de <$200 COP — mucho más eficiente que prospección.

| Campo | Detalle |
|-------|---------|
| Objetivo Meta | Traffic / Sessions → landing de suscripción o artículo |
| Objetivo Google | Remarketing Display + Search branded |
| Budget Meta propuesto | $3,800,000 COP/mes |
| Budget Google propuesto | $2,409,212 COP/mes |
| KPI primario | Costo por reactivación (visita o apertura de email) |
| KPI secundario | Tasa de conversión a suscriptor desde remarketing |
| Ventanas | Visitantes: 30 días · Email inactivos: 90 días |
| Frecuencia objetivo | <4 impresiones/usuario/semana — es remarketing, puede ser más frecuente |

**Audiencias Meta para Tipo 3:**
- CA-02: visitantes últimos 30 días que NO son suscriptores activos
- CA-05: export Braze — email abierto sin click (segmento de alta intención no convertida)
- CA-04: visitantes de artículo específico de alto tráfico

---

## 3. PRESUPUESTO — REASIGNACIÓN PROPUESTA

### Antes vs Después — mismos $27M COP anuales

| Objetivo actual | Canal | COP/año | → | Tipo propuesto | Canal | COP/año |
|----------------|-------|---------|---|----------------|-------|---------|
| Interacción | Meta | $18,000,000 | → | Tipo 1 Adquisición | Meta | $60,000,000 |
| Registros | Meta | $55,200,000 | → | Tipo 2 Tráfico | Meta | $58,800,000 |
| Visitas al perfil | Meta | $45,600,000 | → | Tipo 3 Remarketing | Meta | $45,600,000 |
| Google GOSEM | Google | $100,910,544 | → | Google Search (Tipo 1+2) | Google | $72,000,000 |
| — | — | — | → | Google Display+Rmkt (Tipo 3) | Google | $28,910,544 |

> Nota: los montos anuales son aproximados asumiendo la misma tasa mensual. El punto clave es la redistribución de los $9.9M/mes de objetivos sin sesiones.

### Distribución mensual propuesta

| Tipo | Canal | COP/mes | % del total | KPI target |
|------|-------|---------|-------------|------------|
| Tipo 1 — Adquisición | Meta | $5,000,000 | 23% | CPL <$500 · 5K suscript nuevos |
| Tipo 1 — Search | Google | $3,000,000 | 14% | CPC <$400 |
| Tipo 2 — Tráfico | Meta | $4,900,000 | 22% | CPV <$350 |
| Tipo 2 — Display/Search | Google | $3,000,000 | 14% | CPV <$300 |
| Tipo 3 — Remarketing | Meta | $3,800,000 | 17% | CPA conversión |
| Tipo 3 — Rmkt Google | Google | $2,409,212 | 11% | CPA conversión |
| **TOTAL** | | **$22,109,212** | **100%** | |
| **Ahorro para tests** | | **$4,890,788** | | TikTok Ads · LinkedIn · tests nuevos formatos |

---

## 4. SEGMENTACIONES — MAPA COMPLETO DE AUDIENCIAS

### Custom Audiences (CA) — datos propios de Visión

| ID | Fuente | Tamaño estimado | Uso primario | Estado | Acción |
|----|--------|-----------------|--------------|--------|--------|
| CA-01 | Lista email Braze 135,500 | 120K+ matcheables en Meta | Exclusión Tipo 1 · Inclusión Tipo 3 | **NO activa en Meta** | Subir lista esta semana — Performix |
| CA-02 | Pixel Meta — visitantes 30 días | ~42K (mayo) | Remarketing Tipo 3 — más urgente | Verificar estado Pixel | 42K sin tocar — oportunidad perdida/mes |
| CA-03 | Pixel Meta — visitantes 90 días | ~100K | Source para LAL Tipo 2 | Verificar estado Pixel | Crear si CA-03 tiene >1K |
| CA-04 | URL visitantes artículo X | Variable | Remarketing artículo individual | Por crear | Crear por artículo top de tráfico |
| CA-05 | Export Braze — abrió sin click | ~28K/envío | Remarketing email inactivo Tipo 3 | Por crear | Export segment Braze → cargar Meta |

### Lookalike Audiences (LAL) — derivadas de CA

| ID | Source | % | Tamaño est. Colombia | Uso | Prioridad |
|----|--------|---|---------------------|-----|-----------|
| LAL-01 | CA-01 (135K) | 1% | ~200K | Tipo 1 — máxima similitud | P0 — regenerar YA |
| LAL-02 | CA-01 (135K) | 2% | ~400K | Tipo 1 — escala | P0 — regenerar YA |
| LAL-03 | CA-03 (visitantes 90d) | 3% | ~600K | Tipo 2 — alcance amplio | P1 |
| LAL-04 | CA-03 (visitantes 90d) | 1% | ~200K | Tipo 2 — alta calidad | P1 |

> **Acción urgente:** las LAL actuales probablemente se entrenaron con la lista de 2024 (<70K). La base creció 103%. Regenerar LAL-01 y LAL-02 con la lista de 135K **antes de lanzar cualquier campaña nueva de adquisición**.

### Segmentación por intereses (complementaria)

| Segmento | Intereses Meta | Tamaño Colombia | Uso |
|----------|---------------|-----------------|-----|
| Entusiasta financiero | Inversión · Bolsa · Economía · Finanzas personales | 1–2M | Tipo 2 Tráfico broad |
| Profesional económico | Economía · Banca · Análisis financiero + cargo | 200–500K | Tipo 1 Adquisición |
| Asesor/ejecutivo Davivienda | Banca · Negocios · seguidores Davivienda + cargo | 300–600K | Tipo 1 Adquisición |
| Lector medios económicos | Portafolio · El Tiempo Economía · La República + comportamiento | 500K–1M | Tipo 2 Tráfico |

### Exclusiones obligatorias

1. **Excluir CA-01 de toda campaña Tipo 1** — no pagar para adquirir lo que ya es tuyo
2. **Frequency cap en Tipo 1:** pausar impresiones a usuario con >3 en la semana
3. **Excluir visitantes <7 días del remarketing ventana larga** — ya los cubre remarketing inmediato
4. **Excluir competencia Grupo Bolívar y ecosistema Bancolombia** — regla absoluta de negocio

---

## 5. CREATIVOS — BIBLIOTECA COMPLETA

### Principios no negociables

1. **Dato económico real en los primeros 3 segundos** — el número ES el hook
2. **Economista en cámara cuando es posible** — cara visible = +CTR + credibilidad
3. **Texto superpuesto siempre** — 85% de videos en Meta se ven sin audio
4. **Un CTA, un destino** — el creativo de Tipo 1 va solo a suscripción. Tipo 2 va solo al artículo.
5. **Urgencia real, no artificial** — "Colombia creció 3.3% en abril" es mejor hook que "¡No te lo pierdas!"
6. **Rotar antes de que fatiguen** — medir frecuencia semanal en BM. Si >3: cambiar.

---

### TIPO 1 — Creativos de Adquisición

#### C1-A: Reel "Prueba social" — 30 segundos
- **Formato:** 9:16 vertical · 30s máximo
- **Hook visual (0–3s):** número grande en pantalla → `"169,000 colombianos reciben este análisis cada semana. Gratis."`
- **Cuerpo (3–25s):** economista en cámara → `"El equipo de investigaciones de Davivienda publica cada semana lo que mueve la economía colombiana. Inflación, dólar, tasas, sectores. Sin rodeos. Sin paywalls."`
- **CTA (25–30s):** `"Suscríbete gratis → link en bio / link en el anuncio"`
- **Copy del anuncio:** `"El análisis económico de Colombia que leen 169,000 personas. Gratis en tu inbox. Suscríbete →"`
- **Audiencia:** LAL-01 + LAL-02 · excluir CA-01
- **Rotación:** cada 3 semanas o cuando CTR cae >30%

#### C1-B: Carrusel "Lo que recibirás" — 6 slides
- **Slide 1 (hook):** `"El análisis económico de Colombia. Gratis en tu inbox."`
- **Slide 2:** `"📊 Informe semanal de mercados — qué mueve el dólar, las tasas y los sectores"`
- **Slide 3:** `"🏗️ Análisis sectorial — vivienda, comercio, industria, energía"`
- **Slide 4:** `"📈 Perspectiva macroeconómica — PIB, inflación, BanRep, TRM"`
- **Slide 5:** `"169,000 suscriptores. Investigaciones Davivienda Corredores."` + logo
- **Slide 6 (CTA):** `"Suscríbete gratis"` + botón visible
- **Audiencia:** LAL-01 + intereses financieros profesional
- **Nota:** el carrusel funciona mejor para audiencias que ya conocen el tema — no como primera exposición

#### C1-C: Post estático "Dato récord" — imagen 1:1 o 4:5
- **Cuándo producir:** cuando hay un dato económico histórico o récord (BanRep sube/baja tasa, dólar en máximo, PIB sorprende)
- **Fórmula:** `[Dato récord grande] + [1 línea de contexto] + [Logo Visión] + [CTA suscripción]`
- **Ejemplo:** `"3.3% — Colombia superó las expectativas en abril. Análisis completo, gratis →"`
- **Audiencia:** intereses broad · excluir CA-01
- **Tiempo de producción:** <2 horas desde el dato oficial

---

### TIPO 2 — Creativos de Tráfico

#### C2-A: Reel "Dato + análisis" — 30 segundos (EL MÁS IMPORTANTE)
- **Cadencia:** **1 nuevo por semana** — anclado en el artículo de Pista A de Ernesto
- **Formato:** 9:16 · 25–30s
- **Hook (0–3s):** dato principal del artículo en texto grande
- **Cuerpo (3–22s):** extracto de 15–20s del análisis · economista en cámara o voz off · infografía con el dato
- **CTA (22–30s):** `"Lee el análisis completo → link en bio"`
- **Ejemplos de hooks reales:**
  - `"Colombia creció 3.3% en abril. Pero el motor fue el gobierno, no el petróleo."`
  - `"La vivienda lleva 5 meses cayendo. Solo Cartagena crece. ¿Por qué?"`
  - `"El comercio tuvo su mejor mes en 9 meses. Lo que hay detrás del dato."`
  - `"El dólar tocó $4,400. Qué significa para tu ahorro y tu deuda."`
- **Audiencia:** LAL-03 + LAL-04 + CA-01 (suscriptores activos — re-engagement)
- **Copy del anuncio:** `"[Dato del artículo]. El análisis completo del equipo de investigaciones de Davivienda →"`

#### C2-B: Post estático "Número de impacto" — imagen
- **Fórmula:** número grande + contexto breve + logo Visión
- **Ejemplos:**
  - `"+3.3% — Así creció Colombia en abril"`
  - `"-18.7% — Las ventas de vivienda en mayo"`
  - `"+14.9% — El comercio en abril: mejor dato en 9 meses"`
- **Copy del anuncio:** `"[Dato]. El análisis completo del equipo de investigaciones de Davivienda Corredores →"`
- **CTA:** `"Leer análisis"`
- **Audiencia:** LAL-03 + intereses broad (mayor alcance)
- **Rotación:** cada 2 semanas

#### C2-C: Story "Breaking" — imagen o video corto
- **Trigger:** evento macro urgente — BanRep decide, dólar rompe nivel clave, dato PIB sorprende
- **Estructura:** [Dato en texto grande] / [1 línea de análisis inmediato] / [Link sticker o swipe up]
- **Tiempo de producción:** **<30 minutos desde el dato oficial** — la ventana de atención es corta
- **Ejemplos de trigger:** `"BanRep baja tasa a 9.5%"` / `"Dólar supera $4,500 por primera vez"` / `"PIB Q1 supera 3%"`
- **Audiencia:** CA-02 visitantes recientes + LAL-01
- **Frecuencia:** solo cuando hay evento real — no fabricar urgencia

---

### TIPO 3 — Creativos de Remarketing

#### C3-A: Reel "Volviste" — 20 segundos
- **Hook:** `"Te perdiste el análisis más leído de la semana. Todavía puedes leerlo."`
- **Cuerpo:** resumen de los 3 artículos más leídos de la semana · thumbnails con datos
- **CTA:** `"Volver a Visión →"` [URL del artículo más popular]
- **Audiencia:** CA-02 visitantes 30 días que NO convirtieron a suscriptores
- **Rotación:** cada 2 semanas

#### C3-B: Post estático "Recordatorio" — imagen
- **Copy:** `"Mientras no estabas, esto pasó en la economía colombiana:"` + 3 bullets con datos reales de la semana
- **CTA:** `"Lee el análisis →"`
- **Audiencia:** CA-05 (email abierto sin click) + CA-02 visitantes sin conversión
- **Rotación:** cada 2 semanas

#### C3-C: Carrusel "Lo que te perdiste" — 4 slides
- **Slide 1:** `"Esta semana en la economía colombiana:"`
- **Slides 2–4:** 1 artículo por slide · dato principal + título + thumbnail
- **Slide final:** `"Leer en Visión →"` + CTA suscripción
- **Audiencia:** visitantes 7–30 días sin conversión
- **Cadencia:** 1 nuevo por semana (coordinado con contenido editorial)

---

## 6. GOOGLE ADS — ESTRATEGIA DETALLADA

### 6.1 Campañas de Search (Tipo 1 y 2)

**Estructura de campañas propuesta:**

```
Campaña 1 — Branded (siempre activa · bid máximo)
├── Ad Group: Visión Davivienda
│   Keywords: "visión davivienda", "vision davivienda analisis", "newsletter davivienda"
│   Match: Exact + Phrase
│   Budget: $500K COP/mes

Campaña 2 — Análisis Económico Colombia (Tipo 1 — alta intención)
├── Ad Group: Perspectiva macro
│   Keywords: "análisis económico colombia", "perspectiva económica colombia 2026", "investigaciones davivienda"
├── Ad Group: Indicadores macro
│   Keywords: "ISE colombia", "inflación colombia 2026", "tasa banrep hoy", "PIB colombia"
├── Ad Group: Inversión personal
│   Keywords: "donde invertir en colombia 2026", "cdts en colombia", "fondos de inversión colombia"
   Budget: $2,000K COP/mes

Campaña 3 — Coyuntura (Tipo 2 — artículos semanales)
├── Ad Group: Vivienda
│   Keywords: "sector vivienda colombia 2026", "caída vivienda nueva colombia"
├── Ad Group: Comercio/Retail
│   Keywords: "comercio minorista colombia", "ventas minoristas colombia"
├── Ad Group: Dólar/TRM
│   Keywords: "tasa cambio colombia hoy", "dólar peso colombiano"
├── Ad Group: BanRep
│   Keywords: "tasa interés colombia banrep", "JDBR colombia decisión"
   Budget: $2,500K COP/mes
```

### 6.2 Oportunidades identificadas en datos reales de mayo 2026

| Keyword | Clics mayo | CTR | Impresiones | Diagnóstico | Acción |
|---------|-----------|-----|-------------|-------------|--------|
| **cdt** | 656 | **12%** | 5,484 | CTR más alto del portfolio — altísima intención | **Ampliar budget — P0** |
| vision davivienda (branded) | 361 | 31% | 1,160 | Branded 31% — eficientísimo | Mantener y proteger |
| fondos indexados | 3,473 | 7% | 51,645 | Alto volumen + CTR bueno | Ampliar presupuesto |
| fondos de inversión | 1,981 | 4% | 44,360 | CTR aceptable · competitivo | Mantener · test copy |
| invertir en la bolsa | 340 | 4% | 8,985 | CTR OK · menor volumen | Mantener |
| noticias económicas | 3,429 | 2% | 197,733 | Altísimas impresiones · CTR bajo | Revisar match type o pausar |
| en qué puedo invertir dinero | 722 | 2% | 30,388 | Intención alta · CTR bajo | Mejorar anuncio o landing |
| noticias colombianas | 338 | 1% | 24,002 | CTR muy bajo | Revisar o pausar |

**CDT es la oportunidad más clara:** 12% CTR con 5,484 impresiones = 656 clics. Si se amplía a 20,000 impresiones con el mismo CTR → 2,400 clics/mes. Presupuesto adicional estimado para escalar: $800K COP/mes.

### 6.3 Red de Display y Remarketing Google (Tipo 3)

**Sites contextuales para placement targeting:**
- larepublica.co — audiencia ejecutiva y financiera
- portafolio.co — lectura económica
- bloomberg.com/latin-america — perfil premium
- eltiempo.com/economia — audiencia masiva economía
- dinero.com — audiencia empresa/inversión

**Formato de anuncios:**
- Banner responsivo horizontal (728×90) + cuadrado (300×250)
- Imagen: thumbnail del artículo pautado
- Título: `"[Dato del artículo] — Visión Davivienda"`
- Descripción: `"Análisis del equipo de investigaciones de Davivienda. Gratis →"`

---

## 7. PROYECCIÓN DE RESULTADOS

### Escenario conservador (primeros 60 días post-cambio)

| Métrica | Actual (mayo 2026) | Target conservador (60 días) | Target agresivo (90 días) |
|---------|-------------------|------------------------------|---------------------------|
| Sesiones desde pauta/mes | 12,778 | 18,000 | 22,000 |
| CPV promedio | ~$395 COP | <$350 COP | <$300 COP |
| Suscriptores nuevos/mes vía pauta | Sin medir | 3,000+ | 5,000+ |
| CPL suscriptor | Sin medir | <$700 COP | <$500 COP |
| CTR Meta | Sin medir | >1.5% | >2.5% |
| Alcance semanal | Sin medir | 200,000+ | 350,000+ |

**Lógica de la proyección:**
- Cambiar objetivo de Interacción → Sesiones en Meta: CPV cae ~15% de inmediato (sin nuevo presupuesto)
- Regenerar LAL con lista 135K: CPV adicional -10% (Meta encuentra mejor perfil)
- Activar remarketing CA-02 (42K visitantes/mes): +3,000–4,000 sesiones/mes sin incremento de presupuesto
- Subir CA-01 a Meta (135K): eliminar ~$800K/mes de presupuesto desperdiciado en suscriptores ya captados

### Modelo de ROI — Suscriptor nuevo

| Concepto | Valor |
|---------|-------|
| CPL target nuevo suscriptor vía pauta | $500 COP |
| Suscriptores nuevos/mes (target conservador) | 3,000 |
| Inversión mensual Tipo 1 | $8,000,000 COP |
| LTV estimado suscriptor (12 meses de email open rate) | $2,000–$5,000 COP en impacto de retención/upsell |
| Punto de equilibrio | CPL <$2,000 COP para que sea positivo (estamos 4x por debajo) |

---

## 8. GESTIÓN DE LA AGENCIA — PERFORMIX

### Contexto de la relación

- **Contacto:** Alejandro Bojacá (vía Starcom/WPP)
- **Situación actual:** Carolina no tiene acceso a Meta BM — toda la gestión pasa por Performix
- **Riesgo:** decisiones sin visibilidad directa de campañas → dependencia total de los reportes de la agencia
- **Solución:** acceso analista (solo lectura) para Carolina — no ejecutar, solo ver

### Protocolo de reporte semanal (a implementar desde 23 jun)

**Formato del reporte que debe entregar Performix cada lunes:**

```
REPORTE PAUTA VISIÓN — Semana [X]
Fecha: [DD/MM]

SESIONES TOTAL: [X] (vs target 4,500/semana)
├── Meta: [X] sesiones · CPV $[X] · Presupuesto ejecutado: $[X]
├── Google Search: [X] sesiones · CPC $[X] · Presupuesto ejecutado: $[X]
└── Google Display: [X] sesiones · CPV $[X] · Presupuesto ejecutado: $[X]

CPV META vs target <$350: [VERDE/ROJO]
CPL TIPO 1 vs target <$500: [VERDE/ROJO]

CREATIVOS:
├── Mejor rendimiento: [ID creativo] — CTR [X]% · CPV $[X]
├── Peor rendimiento: [ID creativo] — CTR [X]% · CPV $[X]
└── Frecuencia: [X] impresiones/usuario/semana — [OK/ROTAR]

AUDIENCIAS:
├── LAL-01 1%: CPV $[X] · Alcance [X]
├── LAL-02 2%: CPV $[X] · Alcance [X]
└── CA-02 remarketing: CPV $[X] · Alcance [X]

ALERTA / RECOMENDACIÓN:
[Máximo 2 líneas de la agencia]
```

### Reglas de escalación

| Condición | Acción |
|-----------|--------|
| CPV >$500 en semana 1 | Revisar objetivo de campaña — ¿está en "Sesiones" o volvió a "Interacción"? |
| CPV no baja en 2 semanas | Auditar audiencias — LAL probablemente vencido |
| CTR Meta <0.8% | Cambiar creativo — el hook no está funcionando |
| Frecuencia >4 | Rotar creativo inmediatamente |
| Sesiones <3,000/semana | Escalar a Carolina — posible problema de bid o presupuesto |

---

## 9. PLAN DE ACCIÓN — ANTES DEL 28 JUN

**Deadline duro:** Natalia Otálora sale el 28 jun. Todo lo que requiera aprobación presupuestal debe estar listo antes.

### P0 — Bloqueantes (sin esto, nada más avanza)

| Acción | Owner | Deadline | Bloqueo si no se hace |
|--------|-------|----------|----------------------|
| **Acceso analista Meta BM para Carolina** | Jeison → Alejandro Bojacá (Performix) | **20 jun** | Sin BM: decisiones ciegas, no se puede auditar, no se puede verificar nada |
| **Propuesta reasignación $9.9M a Natalia** | Carolina | **Antes 28 jun** | Si Natalia sale sin aprobar: el presupuesto sigue en objetivos vanidad hasta que vuelva |
| **Auditoría campañas activas** | Carolina + Performix | **23 jun** | Requiere acceso BM — ver qué LAL, qué objetivos, qué creativos están corriendo hoy |
| **Subir lista 135K a Meta (CA-01)** | Performix | **23 jun** | Export Braze segment `3189_IEC_NEW_BOLETÍN_QUINCENAL` → subir a Meta Custom Audiences |
| **Regenerar LAL-01 y LAL-02 con lista 135K** | Performix | **23 jun** | LAL vencidas = CPV inflado permanente |

### P1 — Producción y configuración (semanas del 23 jun – 30 jun)

| Acción | Owner | Deadline | Resultado esperado |
|--------|-------|----------|-------------------|
| Brief de creativos a Performix | Carolina | **23 jun** | Este documento ES el brief — compartir directamente |
| Implementar UTMs estandarizados | Performix | **23 jun** | Sin UTMs: no hay atribución en GA4 · tráfico aparece como "Unassigned" |
| Activar Pixel eventos personalizados Meta | Performix + Leo (dev) | **30 jun** | Eventos: SuscripciónConfirmada · Lectura>2min · NewsletterSignup |
| Producir C2-A — Reel tráfico artículo semana | Estefanía | **25 jun** | Primer reel del ciclo semanal listo para lanzar martes 30 jun |
| Producir C1-A — Reel adquisición "169K" | Estefanía + Ernesto | **25 jun** | Primer creativo Tipo 1 con prueba social |
| Activar remarketing CA-02 (42K visitantes) | Performix | **30 jun** | Recuperar visitantes mayo sin costo adicional |
| Ampliar keyword CDT en Google Search | Performix | **23 jun** | CDT tiene 12% CTR — es la oportunidad más rápida en Google |

### P2 — Optimización y escala (julio 2026)

| Acción | Owner | Timeline |
|--------|-------|----------|
| Primer análisis de resultados post-cambio | Carolina | 15 jul |
| Ajuste de LAL si CPL >$700 después de 2 semanas | Performix | 7 jul |
| Producir C1-B (carrusel adquisición) | Estefanía | 5 jul |
| Test TikTok Ads con $500K COP del ahorro | Performix | 15 jul |
| Implementar LinkedIn Ads para segmento profesional | Performix | Ago 2026 |

---

## 10. CICLO OPERATIVO SEMANAL

El ciclo que convierte la estrategia en ejecución repetible:

| Día | Qué pasa | Quién | Input | Output |
|-----|----------|-------|-------|--------|
| **Lunes AM** | Ernesto publica artículo ancla Pista A | Ernesto | Investigación + redacción | Artículo live en vision.davivienda.com |
| **Lunes PM** | Estefanía produce C2-A — Reel basado en el artículo | Estefanía | Dato principal del artículo | Reel 30s con hook del dato |
| **Martes** | Performix lanza C2-A como Tipo 2 (objetivo: Sessions) | Performix | Reel + URL artículo + UTMs | Campaña activa |
| **Miércoles** | Carolina revisa métricas C2-A: CPV, CTR, frecuencia | Carolina | Reporte Performix / BM | Decisión: escalar / ajustar / pausar |
| **Jueves** | Estefanía produce creativo del banco (C1-B o C3-C) | Estefanía | Brief semanal | Creativo listo para la semana siguiente |
| **Viernes** | Performix revisa frecuencia · rota si >3 | Performix | Datos BM | Creativos frescos el próximo lunes |

---

## 11. RECOMENDACIONES ESTRATÉGICAS

### 11.1 Corto plazo — lo que mueve la aguja esta semana

1. **Cambiar objetivo de "Interacción" a "Sesiones" en Meta** — es el cambio más alto ROI disponible. No requiere presupuesto nuevo, no requiere nuevos creativos. Solo requiere instrucción a Performix. El CPV caería ~15% en 7 días.

2. **Subir la lista de 135K a Meta esta semana** — Performix puede hacer el upload en 1 hora. Sin eso, se sigue pagando para adquirir a suscriptores actuales. Es dinero directo.

3. **Ampliar keyword CDT en Google** — tiene el CTR más alto del portfolio (12%). Duplicar el presupuesto de esa keyword específica genera el doble de clics de la audiencia más caliente (intención de inversión activa).

### 11.2 Mediano plazo — julio–agosto

4. **No pausar campañas** — el historial prueba el costo de las pausas: enero 14K sesiones → febrero 2.7K. El algoritmo de Meta tarda 3–4 semanas en recuperarse. Pausar para "revisar" es más caro que dejar correr y ajustar sobre la marcha.

5. **Priorizar contenido sobre producción perfecta** — un Reel grabado con iPhone con el dato real del artículo supera a una producción de estudio con un dato genérico. La relevancia del dato EN EL MOMENTO es el activo más valioso. C2-C (Story breaking) debe producirse en <30 minutos.

6. **Construir el banco de creativos** — el ciclo semanal necesita un banco de 3–4 creativos Tipo 3 que funcionen siempre como base. La energía creativa se concentra en los creativos Tipo 2 (1 nuevo/semana) que son los que más rotan.

### 11.3 Largo plazo — Q3 2026 y más allá

7. **TikTok como canal de adquisición** — el segmento "entusiasta financiero joven" (<35 años) está en TikTok, no en Meta. Con $500K COP/mes de prueba (del ahorro de la reasignación) se puede validar si funciona para Visión. Benchmark regional: CPL en TikTok puede ser 40% menor que Meta para audiencias financieras jóvenes.

8. **LinkedIn Ads para segmento B2B** — Visión tiene una audiencia natural de economistas, analistas, ejecutivos bancarios y asesores. LinkedIn permite segmentar por cargo exacto y empresa. El CPL es más alto ($2,000–$5,000 COP) pero la calidad del suscriptor es mayor. Recomendado para agosto 2026.

9. **Pixel de conversión completo** — hoy Meta no sabe qué sucede después del click. Con el evento `SuscripciónConfirmada` configurado, Meta puede optimizar automáticamente hacia las audiencias que convierten mejor (no solo que hacen click). Esto podría reducir el CPL a la mitad sin cambiar el presupuesto.

10. **Test de landing page dedicada** — el formulario de Lead Gen nativo de Meta funciona, pero una landing page en vision.davivienda.com con prueba social (169K suscriptores, testimonios, preview del newsletter) convierte mejor a largo plazo y los suscriptores tienen mejor retención (porque eligieron activamente ir al sitio). Recomendado: test A/B Lead Gen vs Landing Page en julio.

---

## 12. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Natalia no aprueba la reasignación antes del 28 jun | Media | Alto | Presentar en números: $9.9M = 0 sesiones medibles. La decisión se sostiene sola con los datos. |
| Performix resiste el cambio de objetivos | Baja | Medio | El brief es la instrucción formal. Si resisten: escalar a Jeison. El cliente manda la estrategia. |
| CPV no baja después del cambio de objetivo | Baja | Medio | Si en 7 días el CPV no baja: problema de LAL. Actualizar LAL con lista 135K como siguiente paso. |
| Algorithm reset por cambio de campaña | Media | Bajo | Meta tarda 7–14 días en re-optimizar después de cambio de objetivo. Es normal y transitorio. |
| Producción de creativos se atrasa | Media | Medio | El banco de creativos de Tipo 3 (C3-A, C3-B, C3-C) se produce una vez y rota. No depende de la semana editorial. |
| Pausas de pauta en Q3 | Alta | Alto | Documentar historial enero-febrero como caso de costo. El algoritmo cuesta más recuperarlo que mantenerlo. |

---

## NOTAS OPERATIVAS

- **Contacto agencia:** Alejandro Bojacá (Performix / Starcom) — todo brief va copiado a Jeison
- **Deadline hard Natalia:** 28 jun 2026 — ausente hasta fecha indefinida
- **Acceso BM pendiente:** Jeison → Alejandro Bojacá · deadline 20 jun
- **Export Braze para CA-01:** segmento `3189_IEC_NEW_BOLETÍN_QUINCENAL` — 135,500 suscriptores
- **Pixel Meta:** verificar instalación en vision.davivienda.com antes de lanzar cualquier remarketing nuevo
- **UTM estructura sugerida:** `utm_source=meta&utm_medium=paid&utm_campaign=tipo1-adquisicion&utm_content=c1a-reel-prueba-social`
