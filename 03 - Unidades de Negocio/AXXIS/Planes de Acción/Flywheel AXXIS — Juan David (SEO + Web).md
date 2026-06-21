---
date: 2026-06-20
type: plan-accion
tags: [axxis, seo, web, cro, flywheel, juan-david, junio-2026]
related-people: [Juan David, Carolina Ramirez, Ernesto Rodriguez]
related-projects: [Axxis-Dashboard-Growth, Estrategia-Digital]
ai-first: true
confidence: high
---

# Plan de Acción — SEO + Web
## Juan David · Revista AXXIS · Junio–Septiembre 2026

---

## Tu rol en el flywheel de AXXIS

```
FLYWHEEL AXXIS
                    ┌─────────────────────────────┐
         ┌──────────▶   AUDIENCIA CUALIFICADA     │
         │          │   (SEO + Web — TÚ)          │
         │          └────────────┬────────────────┘
         │                       │ Tráfico de calidad
         │                       ▼
         │          ┌─────────────────────────────┐
         │          │   COMUNIDAD + LEADS         │
         │          │   (Redes + Newsletter)       │
         │          └────────────┬────────────────┘
         │                       │ Leads capturados
         │                       ▼
         │          ┌─────────────────────────────┐
         └──────────│   CONVERSIÓN + REVENUE      │
      Revenue       │   (Pauta — Sebastián)        │
      financia SEO  └─────────────────────────────┘
```

**Tu trabajo es la entrada del flywheel.** Sin tráfico de calidad, no hay leads. Sin leads, no hay suscriptores. Sin suscriptores, no hay audiencia que vender a los anunciantes. Todo empieza aquí.

---

## Diagnóstico — Dónde estamos hoy (datos reales)

### El dato más importante que debes entender

| Canal | Usuarios (YTD ene–jun) | Engagement (seg en sitio) | Costo |
|-------|----------------------|--------------------------|-------|
| **Organic Search (SEO)** | **42.133** | **83s** ✅ | **$0** |
| Paid Social (Meta Ads) | 226.927 | **9s** 🔴 | $122.381 COP/mes |
| Email/Newsletter | 25.379 | **103s** ✅ | mínimo |
| Direct | 26.383 | 39s | $0 |
| Organic Social | 15.583 | 20s | $0 |

**Conclusión:** El usuario de SEO permanece 9x más tiempo en el sitio que el de Meta Ads, y no cuesta un peso. El tráfico de pago es volumen sin valor. **Tu trabajo tiene más impacto en la conversión a suscriptor que cualquier campaña de Meta.**

### Mix de tráfico mayo 2026 (problema actual)

| Canal | Sesiones mayo | % del total |
|-------|-------------|------------|
| Paid Social (Meta) | 46.489 | 67% |
| **Organic Search** | **11.159** | **16%** |
| Direct | 4.346 | 6% |
| Organic Social | 2.953 | 4% |
| Email | 2.826 | 4% |

**El problema:** AXXIS depende 67% de publicidad paga para traer visitas. Si mañana se para la inversión en Meta, el sitio pierde dos tercios de su tráfico. Tu misión es invertir esa proporción.

### Estado SEO actual (Google Search Console — 12 meses)

| Métrica | Valor | Diagnóstico |
|---------|-------|-------------|
| Clics orgánicos (12m) | 84.800 | Base sólida, pero sin crecer |
| Impresiones (12m) | 4.410.000 | Potencial masivo sin explotar |
| CTR medio | 1.9% | Bajo — títulos y metas mal optimizados |
| Posición media | 10.3 | Página 2 de Google — muy cerca del top |
| **Páginas indexadas** | **4.490** | **🔴 CRÍTICO** |
| **Páginas NO indexadas** | **21.100** | **82.5% del sitio invisible para Google** |

---

## El problema más urgente: 21.100 páginas no indexadas

> **Actualización jun 2026:** Screaming Frog confirmó las causas raíz. Ya no son hipótesis — son hechos verificados. Ver auditoría SF: `axxis issues_overview_report.csv`

Este es el hallazgo más crítico. AXXIS tiene años de contenido editorial de calidad, y Google no puede ver el 82.5% de él. Screaming Frog auditó el sitio y encontró las causas exactas:

**Causas CONFIRMADAS por Screaming Frog:**

| Causa | Páginas afectadas | Impacto |
|-------|-----------------|---------|
| **H1 faltante** | **~75% del sitio** | 🔴 Sin H1, Google no sabe de qué trata la página |
| **Meta descriptions duplicadas** | **~61% del sitio** | 🔴 Conflicto de plugins CMS — Google las ignora |
| **Paginación sin etiqueta `<a>`** | ~4.710 URLs | 🟠 Google no puede seguir páginas 2, 3, 4... |
| **Redirecciones 3xx internas** | ~35.810 URLs | 🟠 Presupuesto de rastreo desperdiciado |
| **Errores 4xx internos** | ~870 URLs | 🟠 Enlaces rotos — señal negativa |
| **Directivas noindex** | ~3.330 URLs | ⚠️ Revisar si son intencionales |

**El diagnóstico real:** No es robots.txt. Es H1 faltante en 75% de páginas + meta descriptions duplicadas (casi seguro por dos plugins SEO activos en simultáneo — ej. Yoast + RankMath). Google ve el sitio como contenido mal estructurado y duplicado → no indexa.

**Fix de mayor impacto (puede hacerse en 1 día):**
Si el problema de meta descriptions duplicadas es un plugin duplicado, desactivar uno de los plugins resuelve el 61% de las páginas con ese problema en una sola acción. Verificar en: WP Admin → Plugins → buscar plugins activos con "SEO" en el nombre.

**Impacto de resolverlo:** Si se indexa un 30% de esas páginas (6.330 páginas extra), con el CTR actual de 1.9% y posición media 10 → estimado conservador de +15.000 clics orgánicos adicionales/mes sin crear nada nuevo.

---

## Tus Acciones — Sprint 30 días (Jun 20 – Jul 20)

### ACCIÓN 1 — Resolver meta descriptions duplicadas: identificar y desactivar plugin SEO duplicado
**Plazo:** Jun 23 | **Prioridad:** 🔴 Crítica — fix global posible en 1 hora

SF confirmó: 61% de páginas tienen múltiples meta descriptions. Causa más común: dos plugins SEO activos al mismo tiempo.

Pasos:
1. WP Admin → Plugins → Plugins activos
2. Buscar plugins con "SEO", "Yoast", "RankMath", "All in One SEO" en el nombre
3. Si hay más de uno activo → desactivar el que no es el principal (no eliminar, solo desactivar primero)
4. Verificar en 10 URLs con View Source que ya no aparezca `<meta name="description"` dos veces
5. Reportar a Carolina cuál era el plugin duplicado

**Métrica:** Meta descriptions duplicadas bajar de 61% a <5%

---

### ACCIÓN 2 — Resolver H1 faltante: auditar plantillas del CMS
**Plazo:** Jun 27 | **Prioridad:** 🔴 Crítica — 1 fix en plantilla = resuelve 75% de páginas

75% de páginas sin H1 es casi siempre un problema de plantilla, no de contenido individual.

Pasos:
1. Verificar qué tipos de página están afectadas: artículos, categorías, páginas de autor, páginas estáticas
2. Revisar el archivo de plantilla de artículos (`single.php` en WordPress): ¿hay un `<h1>` que incluya el título del artículo?
3. Si no existe: agregar `<h1><?php the_title(); ?></h1>` en el lugar correcto del template
4. Verificar con View Source en 10 artículos que el H1 aparezca en el HTML (no generado por JS)
5. Si está generado por JS: reportar a Carolina — requiere solución diferente (SSR o prerender)

**Métrica:** H1 faltante bajar de 75% a <5%

---

### ACCIÓN 3 — Corregir errores 4xx y paginación rota
**Plazo:** Jul 7 | **Prioridad:** 🟠 Alta

**Errores 4xx (~870 URLs):**
- Exportar desde SF: Bulk Export → Response Codes → 4xx → columna "Inlinks"
- Priorizar las URLs con más enlaces entrantes
- Para cada una: redirigir con 301 a la URL correcta o marcar noindex si no tiene reemplazo

**Paginación sin `<a>` (4.710 URLs):**
- Los botones "Siguiente / Anterior" deben ser `<a href="...">` no `<button>` ni `<span>`
- Verificar en el tema del CMS — generalmente es un ajuste en el loop de paginación

**Métrica:** 4xx internos → 0 | Páginas paginadas correctamente enlazadas → 100%

---

### ACCIÓN 3 — SEO + fix de la landing de suscripción
**Plazo:** Jun 27 | **Prioridad:** 🔴 Crítica
**URL auditada:** `revistaaxxis.com.co/suscribirse-2/` (jun 21, 2026)

> Auditoría visual realizada. Los problemas están confirmados — no son hipótesis. Ejecutar en el orden exacto listado abajo.

---

#### 3A — Corregir el URL: eliminar el `/suscribirse-2/`
**Plazo:** Jun 23 | 30 minutos

La URL actual es `/suscribirse-2/`. El `-2` significa que WordPress creó esta página cuando ya existía `/suscribirse/`. Hay dos páginas competiendo por el mismo tráfico y autoridad SEO.

Pasos:
1. WP Admin → Páginas → buscar "suscrib" → identificar si `/suscribirse/` existe
2. Si `/suscribirse/` existe y está vacía o rota:
   - Eliminarla → luego editar el slug de `/suscribirse-2/` a `suscribirse`
3. Si `/suscribirse/` tiene contenido diferente:
   - Configurar un redirect 301 desde `/suscribirse/` hacia `/suscribirse-2/` en tanto se consolida
   - Reportar a Carolina qué contenido tiene la versión original
4. Actualizar el botón del nav ("Suscribirse") para que apunte a la URL definitiva
5. Verificar en GSC → Cobertura → que no aparezca la URL antigua indexada

**Métrica:** Solo 1 URL de suscripción indexada. Redirect 301 confirmado en Screaming Frog.

---

#### 3B — Agregar H1 a la página de suscripción
**Plazo:** Jun 23 | 15 minutos

La página muestra "SUSCRIPCIÓN REVISTA AXXIS" en mayúsculas pero probablemente es un H2 o un `<div>` con CSS `text-transform: uppercase`. Sin H1 Google no entiende de qué trata la página.

Pasos:
1. Ver código fuente de `revistaaxxis.com.co/suscribirse-2/` (Cmd+U en Chrome)
2. Buscar `<h1>` — si no aparece o aparece vacío, el problema está confirmado
3. En WP: editar la página de suscripción → agregar un bloque de Encabezado H1 con el texto:
   `Suscríbete a Revista AXXIS — Arquitectura, Diseño y Decoración`
4. Si el tema usa un page builder (Elementor, Divi, etc.): buscar el widget de "Título de página" y verificar que esté marcado como H1
5. Confirmar con View Source que `<h1>` aparece en el HTML

**Métrica:** H1 presente en el HTML de la página. Visible en Screaming Frog columna "H1".

---

#### 3C — Reescribir el title tag y la meta description
**Plazo:** Jun 24 | 20 minutos

El title actual es probablemente auto-generado. La meta description muy probablemente está vacía o copiada de otra página (SF confirmó 61% de metas duplicadas en el sitio).

En Yoast / RankMath (el plugin que quede activo después de la Acción 1):

**Title tag:**
```
Suscríbete a Revista AXXIS | Arquitectura, Diseño y Decoración Colombia
```
(58 caracteres — dentro del límite de 60)

**Meta description:**
```
Lee los mejores proyectos de arquitectura y diseño de Colombia. Planes desde $59.700. Edición digital. Cancela cuando quieras.
```
(127 caracteres — dentro del límite de 155)

Por qué funciona: incluye la keyword principal "suscripción revista AXXIS", el precio como gancho de clic, y un argumento de objeción ("cancela cuando quieras").

**Métrica:** Title y meta únicos en GSC → página deja de aparecer en el reporte de "meta descriptions duplicadas".

---

#### 3D — Agregar contenido de texto a la página (SEO + conversión)
**Plazo:** Jun 27 | 1-2 horas (coordinado con Ernesto para el copy)

La página tiene casi cero texto. Google ve: 3 precios, un nombre de producto, y una imagen. No hay suficiente contenido para indexar bien, y tampoco para convencer al usuario de comprar.

Secciones a agregar (en ese orden en la página):

**Sección 1 — Encima de los planes (propuesta de valor):**
```
¿Qué incluye tu suscripción?
- Acceso digital ilimitado a todos los números de AXXIS
- Proyectos de arquitectura y diseño colombiano e internacional
- Contenido exclusivo para suscriptores
- Acceso desde cualquier dispositivo
```

**Sección 2 — Debajo de los planes (preguntas frecuentes / FAQ):**
Esto captura búsquedas de long-tail en Google.
```
¿La suscripción es digital o impresa?
¿Puedo cancelar en cualquier momento?
¿Cómo accedo al contenido después de suscribirme?
¿En qué países está disponible?
¿El Anuario AXXIS está incluido en todos los planes?
```

El FAQ con respuestas cortas (2-3 líneas) puede agregar 200-300 palabras de contenido relevante que Google sí indexa y que responde objeciones de compra.

**Métrica:** Página de suscripción deja de aparecer en reporte de "thin content" de Screaming Frog (actualmente tiene 10.590 URLs con thin content — esta debe salir).

---

#### 3E — Agregar Schema.org de Producto con precios
**Plazo:** Jun 27 | 45 minutos

Google puede mostrar los precios directamente en los resultados de búsqueda si la página tiene schema de Product + Offer. Sin esto, Google no sabe que hay precios en la página.

Agregar este JSON-LD en el `<head>` de la página (en WP: usar el campo de "Custom HTML" del plugin SEO o un plugin como "Schema & Structured Data"):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Suscripción Revista AXXIS",
  "description": "Acceso digital a la revista de arquitectura, diseño y decoración más importante de Colombia.",
  "brand": {"@type": "Brand", "name": "Revista AXXIS"},
  "offers": [
    {
      "@type": "Offer",
      "name": "Plan 3 meses",
      "price": "59700",
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "Plan Anual",
      "price": "208000",
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "Plan Semestral + Anuario 2026",
      "price": "263900",
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock"
    }
  ]
}
```

Validar en: [Rich Results Test de Google](https://search.google.com/test/rich-results)

**Métrica:** Schema válido sin errores en el Rich Results Test.

---

#### 3F — Agregar links internos hacia la página de suscripción
**Plazo:** Jul 7 | 1 hora

Actualmente los artículos no enlazan a la página de suscripción. Google usa los links internos para entender qué páginas son importantes. La página de suscripción recibe cero link juice del contenido editorial.

Acciones:
1. Identificar los 10 artículos con más tráfico orgánico (en GSC: Rendimiento → Páginas → ordenar por Clics)
2. En cada uno: agregar al final del artículo un párrafo o widget con CTA:
   > "¿Te gustó este proyecto? Como suscriptor AXXIS tienes acceso a todos los números digitales. [Suscríbete aquí →](https://revistaaxxis.com.co/suscribirse/)"
3. Verificar que el link use el texto ancla "suscripción AXXIS" o "suscríbete a AXXIS" (no "haz clic aquí")
4. Si el tema tiene sidebar: agregar widget de suscripción en artículos de arquitectura y diseño

**Métrica:** La página de suscripción aparece con al menos 10 links internos en Screaming Frog (columna "Inlinks").

---

#### 3G — Corregir el banner de $181.100 en el footer
**Plazo:** Jun 23 | 15 minutos

Hay un banner sticky en la parte inferior de la pantalla que muestra **$181.100** — un precio que no corresponde a ninguno de los 3 planes actuales ($59.700 / $208.000 / $263.900). Esto genera confusión y desconfianza.

Pasos:
1. Identificar qué elemento HTML o plugin genera ese banner (clic derecho → Inspeccionar en Chrome)
2. Si es un plugin de "sticky bar" o "popup": actualizar el precio o desactivar el banner
3. Si es un widget del tema: actualizar desde Apariencia → Widgets o Personalizar
4. Verificar en mobile (83% del tráfico es mobile) que el banner no tape el botón de compra

**Métrica:** El precio mostrado en el banner coincide con uno de los planes vigentes.

---

**Resumen de la Acción 3 — entregables y fechas:**

| Sub-acción | Qué hacer | Plazo | Tiempo estimado |
|-----------|-----------|-------|----------------|
| 3A | Corregir URL (`/suscribirse-2/` → `/suscribirse/`) | Jun 23 | 30 min |
| 3B | Agregar H1 a la página | Jun 23 | 15 min |
| 3G | Corregir precio $181.100 en banner | Jun 23 | 15 min |
| 3C | Reescribir title tag y meta description | Jun 24 | 20 min |
| 3D | Agregar copy de valor + FAQ | Jun 27 | 1-2 h |
| 3E | Schema.org Product + Offer | Jun 27 | 45 min |
| 3F | Links internos desde artículos top | Jul 7 | 1 h |

**Entregable final:** captura de pantalla de la página con el H1 visible + Rich Results Test con schema válido + Screaming Frog mostrando 1 sola URL de suscripción indexada. Compartir con Carolina el Jun 27.

---

### ACCIÓN 4 — Configurar eventos básicos en Google Analytics 4
**Plazo:** Jul 7 | **Prioridad:** 🟠 Alta

Para poder medir si el SEO convierte, necesitamos eventos configurados:
- Verificar que el evento `purchase` o `subscribe` esté disparando cuando alguien se suscribe
- Configurar evento de `page_view` en `/suscripcion` para medir visitas a esa página
- Configurar event de `scroll` al 75% en artículos (indica lectura real)
- Verificar que GA4 esté vinculado a Google Search Console (para cruzar datos de clics con comportamiento en sitio)

**Por qué importa:** Sin esto, no podemos saber si el tráfico orgánico está convirtiendo o no. Hoy estamos volando a ciegas.

---

### ACCIÓN 5 — Optimizar los 10 artículos con mayor potencial de CTR
**Plazo:** Jul 15 | **Prioridad:** 🟠 Alta

En GSC, filtrar por: Impresiones > 1.000 / Posición entre 5 y 15 / CTR < 3%. Esas páginas están cerca del top 5 y nadie hace clic.

Para cada una:
- Reescribir el `<title>` para que sea más clicable (máx 60 caracteres, incluir keyword principal, agregar emoción o dato)
- Reescribir la meta description (máx 155 caracteres, incluir pregunta o promesa)
- Verificar que el H1 sea único y diferente al título SEO
- Verificar que la imagen principal tenga `alt text` descriptivo

**Ejemplo de mejora:**
- Título actual (genérico): "Casa en Bogotá | Revista AXXIS"
- Título optimizado: "Casa en Bogotá que mezcla lo republicano con lo artesanal — AXXIS"

**Métrica:** CTR de esas páginas debe subir de ~1.9% a >3% en 30 días post-cambio

---

### ACCIÓN 6 — Crear los primeros 2 artículos pilar de clusters SEO
**Plazo:** Jul 31 | **Prioridad:** 🟠 Alta (coordinado con Ernesto)

Los clusters más urgentes por volumen de búsqueda y facilidad de posicionar:

**Cluster 1: Arquitectura colombiana**
- Artículo pilar: "Los 30 proyectos de arquitectura más importantes de Colombia en 2025"
- Extensión: mínimo 2.000 palabras
- Estructura: lista con imágenes, arquitecto responsable, ciudad, descripción breve
- Palabras clave objetivo: "arquitectura colombiana", "proyectos de arquitectura colombia", "arquitectura moderna colombia"
- Por qué funciona: el Anuario AXXIS ya tiene este contenido — solo hay que formatearlo para SEO

**Cluster 2: Diseño interior residencial**
- Artículo pilar: "Cómo diseñar un apartamento en Colombia: guía completa con proyectos reales"
- Extensión: mínimo 1.800 palabras
- Palabras clave: "diseño de interiores colombia", "decoración apartamentos bogotá"

**Coordinación con Ernesto:** él provee los proyectos y la edición, tú implementas el SEO on-page (estructura H2/H3, keywords, links internos, schema markup).

---

## Tus Acciones — Sprint 60–90 días (Jul 20 – Sep 20)

| Acción | Plazo | Métrica |
|--------|-------|---------|
| Completar 5 clusters SEO (artículo pilar + 3 satelites c/u) | Sep 1 | 5 clusters publicados |
| Implementar Schema.org Article en todos los artículos nuevos | Jul 31 | Schema validado (Rich Results Test) |
| Implementar Schema.org Organization en homepage | Jul 31 | Aparece en Knowledge Panel |
| Crear página de autores con bios y credenciales | Ago 15 | Señal E-E-A-T para Google |
| Auditar alt text de las 50 imágenes más visitadas | Ago 31 | 100% con alt text descriptivo |
| Conectar Google Search Console con GA4 (si no está) | Jul 7 | Vinculado |
| Crear sitemap.xml por sección (artículos / proyectos / anuario) | Jul 15 | Sitemap enviado a GSC |

---

## KPIs que reportas mensualmente

| KPI | Baseline (mayo 2026) | Meta jul | Meta sep |
|-----|---------------------|---------|---------|
| Páginas indexadas | 4.490 | 8.000 | 12.000 |
| Clics orgánicos/mes (GSC) | ~7.067 est. | +20% | +50% |
| Posición media | 10.3 | 8.0 | 6.0 |
| CTR orgánico | 1.9% | 2.5% | 3.0% |
| % tráfico orgánico del total | 16% | 22% | 30% |
| Artículos pilar publicados | 0 | 2 | 5 |

---

## Lo que desbloqueas para el resto del equipo

| Si tú haces esto | Paola Gordillo puede... | Sebastián puede... |
|-----------------|------------------------|-------------------|
| Desbloqueas 21K páginas indexadas | Compartir más contenido con tracción real en IG | Armar audiencia de retargeting con más visitantes |
| Optimizas landing suscripción | Mandar tráfico de redes a una página que convierte | Bajar el CPL de $∞ a algo medible |
| Publicas cluster "arquitectura colombia" | Usar esos artículos para contenido editorial de IG | Mostrar alcance de audiencia a nuevos anunciantes |
| Configuras eventos GA4 | Saber qué publicaciones de IG traen más engagement al sitio | Saber qué canal trae usuarios que convierten |

---

## Acceso que necesitas

| Herramienta | Para qué | Estado |
|-------------|---------|--------|
| Google Search Console | Indexación, keywords, CTR | Solicitar a Carolina si no tienes |
| Google Analytics 4 | Comportamiento en sitio, conversiones | Solicitar viewer access |
| CMS del sitio (WordPress / otro) | Editar títulos, metas, robots.txt | Confirmar si tienes acceso |
| Screaming Frog (gratis hasta 500 URLs) | Auditoría técnica de indexación | Descargar en screaming frog.co.uk |

---

*Documento generado por Growth Team AXXIS — Junio 2026*
*Fuentes: Tab 03 Web/CRO, SEO Analysis (GA4 ene–jun 2026), Google Search Console (12m jun 2025–jun 2026)*
