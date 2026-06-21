---
date: 2026-06-20
type: strategy
tags: [seo, diners, estrategia, 90-dias, trafico-organico]
related-people: [Ernesto Rodriguez, Carolina Ramirez]
related-projects: [Revenue-Growth, Diners-Digital]
ai-first: true
confidence: high
sources:
  - GSC Performance export jun 2026 (84,942 clics, 5.15M impresiones)
  - GSC Coverage export jun 2026 (787K URLs, 10,724 indexadas)
  - GSC Core Web Vitals export jun 2026 (desktop)
  - Google Ads audit jun 2026 (14 CSVs)
---

## For future Claude
Estrategia SEO de 90 días (jun–sep 2026) para revistadiners.com.co. Construida sobre auditoría completa de GSC (Performance + Coverage + CWV). El diagnóstico central: el sitio tiene una crisis estructural de calidad (1.4% indexación, 383K páginas rechazadas por Google, 49K 404s) que precede y causa el CTR bajo (1.65%). La secuencia correcta es reparar la señal técnica antes de optimizar CTR o publicar contenido nuevo. Hay 3 quick wins editoriales (meta rewrites de canciones indirectas, santorini colombiano, y homepage) que pueden ejecutarse esta semana en paralelo con los fixes técnicos.

---

# Estrategia SEO 90 días — Revista Diners · Jun–Sep 2026

## Diagnóstico Ejecutivo

El sitio tiene tres capas de problemas que se refuerzan entre sí:

1. **Crawl budget en crisis**: 48,959 errores 404 + URLs paramétricas de JetBlog + paginación profunda = Google desperdicia su presupuesto de rastreo en páginas que no existen o no aportan valor
2. **Señal de calidad dañada**: 383,067 páginas rastreadas por Google y elegidas activamente para NO indexar = thin content masivo. El Core Update de abril 2026 lo confirmó: se deindexaron 4,379 páginas en 2 semanas. Actualmente el sitio tiene 1.4% de tasa de indexación sobre 787K URLs conocidas — críticamente bajo
3. **Performance penalizada**: 0 páginas con LCP "Bueno" en desktop. El 99%+ de páginas compite con penalización de velocidad activa (LCP >2.5s)

**Secuencia correcta:** limpiar señal técnica → consolidar calidad → optimizar CTR → escalar contenido.
Optimizar meta tags sin resolver la señal de calidad produce rendimientos marginales.

## Estado de Base (Jun 2026)

| Métrica | Valor | Semáforo |
|---------|-------|---------|
| Clics orgánicos/mes | ~28,000 | 🟠 |
| Impresiones/mes | ~1,716,516 | 🟢 (alto potencial) |
| CTR global | 1.65% | 🔴 (benchmark: 3-5%) |
| Posición promedio | 7.7 | 🟠 |
| Páginas indexadas | 10,724 / 787,000 | 🔴 (1.4%) |
| Páginas "rastreadas sin indexar" | 383,067 | 🔴 CRÍTICO |
| Errores 404 | 48,959 | 🔴 CRÍTICO |
| Páginas con LCP "Bueno" (desktop) | 7 | 🔴 (0.1%) |
| Tráfico desde España | ~1,130/mes · pos 14.71 | 🟡 Oportunidad |

## Fase 1 — Dejar de Sangrar (Jun 20 – Jul 4)

### Tech

#### T1 — Redirecciones 301 masivas | Plazo: Jun 28 | Owner: Tech

Pasos:
1. En GSC → Cobertura → "No se ha encontrado (404)" → exportar tabla completa (48,959 URLs)
2. Agrupar por patrón: artículos eliminados, categorías renombradas, taxonomías cambiadas
3. Para cada grupo, mapear a URL destino:
   - Artículo equivalente existe → redirect a ese artículo
   - No hay equivalente → redirect a categoría padre
   - Categoría padre también eliminada → redirect a homepage
4. Implementar vía plugin de redirects (Redirection, Yoast Premium) o en .htaccess
5. Verificar en GSC en 4 semanas que 404s empiezan a desaparecer

Impacto esperado: recuperar crawl budget para páginas válidas. Los ~49K tokens de rastreo desperdiciados se redistribuyen a contenido real.

#### T2 — Bloquear URLs paramétricas | Plazo: Jun 21 | Owner: Tech

```
# robots.txt — añadir estas líneas:
Disallow: /*?jet_blog_ajax=
Disallow: /*?nocache=
Disallow: /*?nonamp=
```

Adicionalmente: configurar en JetBlog que las URLs de carga AJAX tengan canonical apuntando a la URL limpia del artículo.

Verificar en GSC en 2 semanas que estas URLs desaparecen del informe de cobertura.

#### T3 — Noindex /uncategorized/ y paginación | Plazo: Jun 22-23 | Owner: Tech

**Para /uncategorized/:**
- Yoast SEO → Search Appearance → Taxonomías → Category "Uncategorized" → No indexar
- O reclasificar todos los posts en /uncategorized/ en la categoría editorial correcta

**Para paginación:**
- Verificar que Yoast/RankMath tenga noindex para page/2 en adelante
- Si no: en functions.php:
```php
add_action( 'wp_head', function() {
    if ( is_paged() ) {
        echo '<meta name="robots" content="noindex, follow">' . "\n";
    }
} );
```

### Editorial (paralelo, esta semana)

#### E1 — Meta "Canciones indirectas" | Plazo: Jun 21 | Owner: Ernesto

- URL: revistadiners.com.co/cultura/canciones-indirectas/
- Situación: 95,161 impresiones · pos 4.4 · CTR 0.7% — el artículo aparece pero nadie entra
- Title propuesto: `Las canciones indirectas más poderosas para dedicar (2026)`
- Meta description propuesta: `¿Buscas la canción indirecta perfecta? Las más profundas y emotivas para cuando las palabras no alcanzan. Lista actualizada 2026.` (155 chars)
- Impacto estimado: de 0.7% a 3-4% CTR = +2,800-3,100 clics/trimestre

#### E2 — Meta "Santorini colombiano" | Plazo: Jun 22 | Owner: Ernesto

- URL: revistadiners.com.co/estilo-de-vida/santorini-colombiano-antioquia/
- Situación: 28,953 imp · pos 4.3 · CTR 0.17% — anomalía de intent mismatch
- Revisar el artículo: ¿da información concreta de dónde queda, cómo llegar, qué ver?
- Si el artículo es específico de destino → title: `Santorini colombiano: dónde queda, cómo llegar y qué ver en Antioquia`
- Si el artículo es conceptual/general → reescribir con información práctica de destino
- Impacto estimado: de 0.17% a 1.5-2% = +390-550 clics/trimestre

#### E3 — Fix meta homepage | Plazo: Jun 21 | Owner: Tech + Editorial

- Situación: "diners" en pos 4.7 — Google confunde la marca con Diners Club (tarjeta)
- H1 de homepage debe decir: "Revista Diners" (no solo "Diners")
- Title: `Revista Diners Colombia | Cultura, Gastronomía y Estilo de Vida`
- Meta description: `Revista Diners, la publicación de cultura, gastronomía y lifestyle en Colombia desde 1969. Descubrí las mejores experiencias, restaurantes y destinos.`
- Schema Organization en homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Revista Diners",
  "url": "https://revistadiners.com.co",
  "logo": "https://revistadiners.com.co/[ruta-logo].png",
  "foundingDate": "1969",
  "sameAs": [
    "https://www.instagram.com/revistadiners",
    "https://www.facebook.com/revistadinerscolombia"
  ]
}
```

## Fase 2 — Consolidar Calidad (Jul 5–25)

### Tech

#### T4 — LCP optimization top 20 páginas | Plazo: Jul 15 | Owner: Tech

Las 20 páginas con más tráfico orgánico (exportar de GSC → Performance → Páginas → ordenar por clics). Para cada una:

1. Identificar el elemento LCP (normalmente imagen hero) con Chrome DevTools o PageSpeed Insights
2. Convertir imagen a WebP: `cwebp -q 80 original.jpg -o optimized.webp`
3. En el HTML: añadir `width` y `height` explícitos para evitar layout shift
4. Añadir preload en `<head>`: `<link rel="preload" as="image" href="hero.webp">`
5. Diferir JavaScript no crítico con `defer` o `async`
6. Target: LCP < 2.5s en esas 20 páginas

Métrica de éxito: en 4-6 semanas, esas páginas aparecen en GSC → Experiencia → CWV como "Buenas".

### Editorial

#### E4 — Auditoría de thin content | Plazo: Jul 15 | Owner: Editorial + Carolina

Exportar todas las páginas indexadas (GSC → Performance → Páginas → exportar todo). Segmentar:

| Grupo | Criterio | Acción |
|-------|----------|--------|
| Conservar y mejorar | >50 clics/3m o >1,000 impresiones | Actualizar, mejorar, optimizar meta |
| Fusionar | Artículos similares con <10 clics/3m | Consolidar en 1 artículo + redirect 301 |
| Eliminar | <10 clics, <500 palabras, desactualizado, no valor de marca | Redirigir a categoría o eliminar |

Regla: el objetivo no es borrar contenido valioso, es limpiar el inventario que le dice a Google que el sitio tiene baja calidad editorial a escala.

#### E5 — Hub page "Planes de fin de semana Bogotá" | Plazo: Jul 20 | Owner: Ernesto

- Crear página pilar: `revistadiners.com.co/estilo-de-vida/planes-fin-de-semana-bogota/`
- Estructura: intro editorial (300 palabras) + secciones por tipo de plan con link a cada satélite
- Satélites a linkear: aguas termales · karts · restaurantes afueras · mini golf · cerámica · restaurantes temáticos
- Desde cada satélite, añadir internal link de vuelta a la hub page
- Query objetivo: "planes de fin de semana bogota", "que hacer en bogota", "planes bogota"

#### E6 — Actualizar "10 series colombianas" | Plazo: Jul 10 | Owner: Ernesto

- URL: revistadiners.com.co/cultura/cine-y-tv/10-series-colombianas/
- Situación: 78,875 imp · 1.26% CTR · pos 6.85 — artículo probablemente desactualizado
- Añadir series 2025-2026: La Huésped, Estado de Fuga 1986, etc.
- Nuevo title: `Las mejores series colombianas en Netflix 2026: la lista definitiva`
- Desde "Series más largas del mundo" (pos 3.78 — el artículo estrella del cluster) → añadir 1 internal link a este artículo

## Fase 3 — Escalar (Jul 26 – Sep 30)

#### T5 — Hreflang España | Plazo: Jul 28 | Owner: Tech

España es el 3er país por clics (1,130/mes) pero está en pos 14.71. El TLD .co se interpreta como Colombia-only.

Artículos candidatos para hreflang `es-ES` (cultura universal, no geografía colombiana específica):
- Poemas de Gabriel García Márquez
- Canciones indirectas
- Las mejores series latinoamericanas
- Literatura colombiana (GGM, etc.)
- Artículos de cine y TV sin referencia geográfica específica

Implementación en Yoast: SEO → Search Appearance → Hreflang → o mediante plugin WPML/Polylang.

Si no hay CMS de multilenguaje: añadir manualmente en `<head>`:
```html
<link rel="alternate" hreflang="es-CO" href="https://revistadiners.com.co/[url]/" />
<link rel="alternate" hreflang="es-ES" href="https://revistadiners.com.co/[url]/" />
<link rel="alternate" hreflang="es" href="https://revistadiners.com.co/[url]/" />
```

Potencial: triplicar tráfico desde España (de ~1,130/mes a ~3,400/mes en 6 meses).

#### T6 — Schema Article + BreadcrumbList | Plazo: Ago 1 | Owner: Tech

- `Article` schema en todos los artículos: author, datePublished, dateModified, image, headline
- `Person` schema para autores con byline (Ernesto Rodríguez et al.) — señal E-E-A-T directa
- `BreadcrumbList` en toda la jerarquía del sitio (Yoast lo genera automáticamente si está bien configurado)
- Verificar implementación con Google Rich Results Test

#### E7 — Contenido nuevo Q3 | Plazo: Ago-Sep | Owner: Ernesto

Prioridad por potencial de impresiones ya identificado en GSC:

| Artículo nuevo | Query objetivo | Base de datos GSC |
|----------------|---------------|-------------------|
| Guía Pereira restaurantes 2026 (definitiva) | "restaurantes pereira" | 6,618 imp/3m ya rasteadas en pos 6.87 |
| Qué hacer en Bogotá este fin de semana — hub | "planes bogota", "que hacer bogota" | Hub del Cluster 1 |
| Hub literatura colombiana siglo XX | "escritores colombianos", "poetas colombianos" | Extensión cluster GGM |
| Aguas termales cerca de Bogotá 2026 (refresh) | "termales cerca de bogota" | 73,328 imp/3m · ya #1 — mantener liderazgo |

## KPIs y Seguimiento

Revisión mensual los primeros viernes del mes. Fuente: GSC Performance (últimos 3 meses) + GSC Coverage.

| Métrica | Jun 2026 (base) | Meta Jul | Meta Sep | Meta Dic |
|---------|-----------------|----------|----------|---------|
| Páginas indexadas | 10,724 | 11,500 | 12,000 | 13,000+ |
| CTR global | 1.65% | 2.0% | 2.5% | 3.5% |
| Clics orgánicos/mes | ~28,000 | 35,000 | 45,000 | 65,000 |
| Errores 404 en GSC | 48,959 | <10,000 | <5,000 | <1,000 |
| Páginas con LCP "Bueno" (desktop) | 7 | 100 | 500 | 2,000+ |
| Posición brand "diners" | 4.7 | 2.5 | 1.5 | 1.0 |
| Clics desde España | ~1,130/mes | 1,500 | 2,500 | 4,000 |

## Dependencias Críticas

```
1. Resolver 404s → libera crawl budget → Google re-evalúa páginas válidas
2. Bloquear params → elimina contenido duplicado → señal de calidad sube
3. Noindex paginación + uncategorized → dominio pierde señal de thin content
4. LCP fix en top 20 → ranking mejora en queries de mayor tráfico
5. Homepage meta fix → brand "diners" sube de pos 4.7 a top 2
6. Todo lo anterior → base para que contenido nuevo funcione
```

Sin Fase 1, publicar contenido nuevo en Fase 3 produce las mismas 383K páginas rastreadas y no indexadas.

## Matriz de Responsabilidades

| Acción | Owner | Semana |
|--------|-------|--------|
| Exportar 404s + plan redirecciones | Tech | 1 |
| Bloquear params en robots.txt | Tech | 1 |
| Meta rewrite "canciones indirectas" | Ernesto | 1 |
| Fix meta homepage + Schema Org | Tech + Editorial | 1 |
| Noindex /uncategorized/ y paginación | Tech | 1-2 |
| Meta rewrite "santorini colombiano" | Ernesto | 2 |
| Implementar 301s masivos (49K URLs) | Tech | 2-3 |
| LCP optimization top 20 páginas | Tech | 3-6 |
| Auditoría thin content + decisión | Editorial + Carolina | 3-5 |
| Actualizar "10 series colombianas" | Ernesto | 3-4 |
| Hub page planes fin de semana Bogotá | Ernesto | 4-6 |
| Hreflang España (artículos cultura) | Tech | 7-8 |
| Schema Article + BreadcrumbList | Tech | 7-8 |
| Contenido nuevo Q3 | Ernesto | 8-14 |

---

[[Diners]] · [[Ernesto Rodriguez]] · [[Carolina Ramirez]]
