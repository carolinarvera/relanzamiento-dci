---
date: 2026-06-20
type: plan-accion
tags: [axxis, pauta, meta-ads, digital, flywheel, sebastian, junio-2026]
related-people: [Sebastián Díaz, Carolina Ramirez]
related-projects: [Axxis-Dashboard-Growth, Revenue-Growth]
ai-first: true
confidence: high
---

# Plan de Acción — Pauta Digital
## Sebastián · Revista AXXIS · Junio–Septiembre 2026

---

## Tu rol en el flywheel de AXXIS

```
FLYWHEEL AXXIS
                    ┌─────────────────────────────┐
                    │   AUDIENCIA CUALIFICADA     │
                    │   (SEO + Web — Juan David)  │
                    └────────────┬────────────────┘
                                 │ Tráfico de calidad
                                 ▼
                    ┌─────────────────────────────┐
                    │   COMUNIDAD + LEADS         │
                    │   (Redes + Newsletter)       │
                    └────────────┬────────────────┘
                                 │ Audiencia comprometida
                                 ▼
         ┌──────────────────────────────────────────┐
         │   CONVERSIÓN + REVENUE (PAUTA DIGITAL)   │◀── TÚ ESTÁS AQUÍ
         │   Conviertes audiencia en suscriptores,  │
         │   mides resultados para anunciantes y    │
         │   generas el revenue que financia todo   │
         └──────────────────────────────────────────┘
                      │ Revenue financia SEO y contenido
                      └──────────────▶ vuelve al inicio
```

**Tu trabajo es el cierre del loop.** Tomas la audiencia que construyó Juan David con SEO y Paola con redes, y la conviertes en suscriptores pagos y en ingresos de pauta. Sin conversión, el flywheel no gira.

---

## Diagnóstico — Dónde estamos hoy (datos reales mayo 2026)

### El diagnóstico más crítico: el anuncio funciona, el funnel no

| Métrica | Valor mayo 2026 | Estado |
|---------|----------------|--------|
| Inversión Meta Ads | $122.381 COP | — |
| Clics a landing suscripción | 702 | — |
| CTR | 1.14% | 🟡 Dentro del benchmark (0.8–1.5%) |
| **Conversiones (compras)** | **0** | 🔴 **CRÍTICO** |
| CPL (costo por lead) | **∞** (no hay conversiones) | 🔴 CRÍTICO |
| ROAS | **0** | 🔴 CRÍTICO |

**El insight central:** Con 702 personas que llegaron a la landing y cero que compraron, el problema **no es el anuncio**. El CTR de 1.14% confirma que el creativo llama la atención y la gente hace clic. El problema ocurre en la landing o en el proceso de compra.

**Antes de tocar cualquier creativo o presupuesto, hay que saber dónde se rompe el funnel.**

### Tendencia CPC — señal de alerta

| Mes | CPC (COP) | ∆ |
|-----|-----------|---|
| Marzo 2026 | $76 | — |
| Abril 2026 | $92 | +21% |
| Mayo 2026 | **$108** | **+17% — 3° mes consecutivo** |

**El CPC subiendo 3 meses seguidos significa:** la audiencia actual se está saturando. Con frecuencia de 2.2 (límite recomendado: < 2.5), las mismas personas ven el anuncio repetido. Pronto llegaremos a punto de quiebre donde el costo por clic va a ser insostenible.

**Solución no es bajar el presupuesto — es abrir nuevas audiencias** (retargeting + lookalike).

### Estado de anunciantes activos (pauta de terceros — junio 2026)

| Anunciante | Formato | Revenue mensual | Renovación jul |
|-----------|---------|----------------|---------------|
| COLCHONES ELDORADO | Billboard Digital (800K impresiones) | $3.500.000 COP | Por confirmar |
| AMARILO | Video AXXIS Shorts | $3.200.000 COP | Por confirmar |
| PIANETA LEGNO | Video Tour AXXIS | $6.350.400 COP | Por confirmar |
| ACESCO | Patrocinio Evento Medellín | $12.000.000 COP | Por confirmar |
| CORONA | Contenido web + nota Habitart | $8.000.000 COP | Por confirmar |
| **TOTAL** | | **~$33.050.400 COP** | |

**Datos técnicos del formato más rentable:**
El billboard digital de Colchones Eldorado tiene un CTR de 0.15% con 800K impresiones contratadas. Ese número es el argumento de venta más poderoso que tienes: **0.15% de CTR en billboard es la mejor posición disponible en el sitio.** Úsalo en propuestas a nuevos anunciantes.

---

## Tus Acciones — Sprint 30 días (Jun 20 – Jul 20)

### ACCIÓN 1 — Diagnosticar por qué 702 clics no generaron ninguna compra
**Plazo:** Jun 25 | **Prioridad:** 🔴 Crítica (bloquea todo lo demás)

Esta acción no depende de pauta — depende de entender el flujo técnico. Necesitas responder:

1. **¿El evento Purchase está configurado en Meta Events Manager?**
   - Ir a Meta Business Manager → Events Manager → Pixel de AXXIS → Events
   - ¿Aparece el evento "Purchase" o "Subscribe"? ¿Ha disparado alguna vez?
   - Si no aparece: el Pixel no está midiendo conversiones → todas las compras que haya habido son invisibles para Meta

2. **¿El evento ViewContent dispara en la landing de suscripción?**
   - Instalar Meta Pixel Helper (extensión de Chrome) y visitar la URL de suscripción
   - ¿El evento ViewContent aparece? Si no → no se puede hacer retargeting de visitantes

3. **¿El dominio está verificado en Business Manager?**
   - BM → Brand Safety → Dominios → verificar si revistaaxxis.com.co aparece verificado
   - Sin verificación: Aggregated Event Measurement (AEM) no funciona → pérdida de datos en iOS

4. **¿Hay CAPI (Conversions API) activo?**
   - Sin CAPI se pierde hasta un 40% de conversiones por la privacidad de iOS 14.5+
   - Verificar en Events Manager si hay eventos server-side además de los de Pixel

**Entregable:** Respuesta a las 4 preguntas anteriores en un documento de 1 página. Compartir con Carolina el Jun 25.

---

### ACCIÓN 2 — Activar retargeting de visitantes web
**Plazo:** Jun 27 | **Prioridad:** 🔴 Crítica

**Prerequisito:** que el evento ViewContent esté disparando en la landing (Acción 1).

Una vez confirmado, crear en Meta Ads Manager:

**Campaña:** Retargeting AXXIS Suscripción
- **Tipo:** Conversiones (objetivo: Purchase / Subscribe)
- **Audiencia:** Visitantes de la landing de suscripción últimos 30 días que NO compraron (Custom Audience desde website → URL contiene "/suscripcion" → excluir quienes dispararon evento Purchase)
- **Presupuesto:** $36.000 COP/día (30% del presupuesto actual de suscripción)
- **Frecuencia objetivo:** 3-4 (esta audiencia es pequeña y ya nos conoce — puede ver el anuncio más veces)
- **Mensaje:** diferente al anuncio de prospecting. Ejemplo: "Ya viste la suscripción — esto es lo que incluye: [beneficio 1], [beneficio 2]. Accede hoy."

**Por qué funciona:** una persona que ya visitó la landing tiene 5-10x más probabilidad de comprar que alguien frío. El CPL del retargeting debe ser 60-70% más barato que el prospecting.

---

### ACCIÓN 3 — Crear LAL (Lookalike Audience) de suscriptores actuales
**Plazo:** Jun 30 | **Prioridad:** 🔴 Crítica

**Prerequisito:** tener lista de suscriptores actuales (coordinado con Paola Nossa / HubSpot).

1. Solicitar a Paola Nossa/Carolina la exportación de la lista de suscriptores activos (email + nombre)
2. En Meta Business Manager → Audiencias → Crear audiencia → Custom Audience → Lista de clientes
3. Subir la lista (mínimo 100 emails para que Meta cree la LAL)
4. Crear Lookalike Audience al 1%, 2% y 5% de Colombia
5. Lanzar campaña de prospecting hacia LAL 1% con el mismo creativo actual
6. Medir CPC de LAL vs audiencia de intereses actuales — debe ser menor

**Por qué importa:** hoy la audiencia de intereses (personas a quienes Meta decide mostrar el anuncio basado en comportamientos) no está bien calibrada — de ahí el CPC subiendo. Los LAL encuentran personas similares a quienes ya compraron → mejor calidad, menor costo.

---

### ACCIÓN 4 — Auditar y refrescar los creativos para bajar CPC
**Plazo:** Jul 7 | **Prioridad:** 🟠 Alta

CPC subiendo 3 meses = señal clásica de fatiga creativa. El mismo creativo se ha mostrado tanto a la misma audiencia que la gente ya lo ignora.

**Diagnóstico de creativos actuales:**
- Ir a Ads Manager → Creativos → Ver todos los activos en las últimas 8 semanas
- ¿Cuántos formatos distintos están corriendo? (imagen estática, video, carrusel)
- ¿El CTR de algún creativo bajó más del 20% en las últimas 2 semanas? (señal de fatiga)

**Nuevas variantes a crear (mínimo 3 conceptos distintos):**

| Concepto | Ángulo | Formato | CTA |
|---------|--------|---------|-----|
| Problema → solución | "¿Te quedas sin ver los mejores proyectos de arquitectura de Colombia?" | Video 15s | "Suscríbete" |
| Social proof | "160.000 arquitectos y diseñadores ya lo leen" | Estático | "Únete" |
| Beneficio directo | "Los proyectos del Anuario AXXIS, antes de que salgan en impreso" | Carrusel 3-5 fotos | "Accede aquí" |

**Regla de Andromeda 2026 (Meta AI):** creativos con similitud visual > 60% compiten entre sí y Meta reduce el alcance de todos. Los 3 conceptos anteriores deben verse VISUALMENTE distintos — diferente imagen anchor, diferente texto de apertura, diferente paleta.

---

### ACCIÓN 5 — Confirmar renovaciones de anunciantes para julio y crear reporte mensual
**Plazo:** Jun 27 | **Prioridad:** 🟠 Alta

Los 5 anunciantes activos tienen pauta que vence en junio 2026. La renovación no es automática.

**Para cada anunciante (Colchones Eldorado, Amarilo, Pianeta Legno, Acesco, Corona):**
1. Confirmar si la pauta continúa en julio o no
2. Preparar un reporte de resultados de junio — 1 página por anunciante con:
   - Impresiones entregadas vs contratadas
   - CTR logrado vs benchmark
   - Alcance de la campaña
   - Comparativo vs promedio del sector
3. En la conversación de renovación, mostrar el reporte como argumento — no pedir renovación "en base a la relación", sino en base a resultados medibles

**Template de reporte (1 página):**
```
COLCHONES ELDORADO — Resultados junio 2026
Billboard Digital revistaaxxis.com.co

Impresiones:     800.000 (100% del contrato)
CTR:             0.15% (benchmark sector: 0.10%)
Alcance:         [Dato de Analytics]
Audiencia:       Arquitectos y diseñadores, 25-54 años
                 74% mujeres · 83% mobile · Bogotá 27%

→ Resultado: 0.15% CTR = 50% por encima del benchmark
→ Recomendación: renovar con 1.000.000 impresiones en julio
```

---

## Tus Acciones — Sprint 60–90 días (Jul 20 – Sep 20)

| Acción | Plazo | Métrica |
|--------|-------|---------|
| Prospectar 5 anunciantes nuevos — categoría materiales/acabados | Ago 15 | 2 cierres nuevos |
| Activar Google Ads SEM para "suscripción revista arquitectura colombia" | Jul 31 | CPL SEM < $15.000 COP |
| Crear propuesta de bundles (impreso + digital + redes) | Jul 15 | 3 propuestas enviadas |
| Medir ROAS por canal (SEO vs Paid Social vs Email) con GA4 | Ago 1 | Dashboard de atribución |
| Evaluar LinkedIn Ads para pauta B2B (anunciantes del sector) | Ago 31 | Recomendación documentada |

---

### Propuesta de bundles — estructura (para preparar en las próximas 2 semanas)

| Bundle | Incluye | Precio referencia |
|--------|---------|-----------------|
| **Básico** | 1 página interior impresa + banner web 1 mes (200K impresiones) | Desde $8M COP |
| **Estándar** | Doble página impresa + billboard 1 mes (800K imp.) + 2 posts en IG Stories | Desde $18M COP |
| **Premium** | Contraportada + billboard 3 meses + tour en video AXXIS + nota editorial + 4 Reels en IG | Desde $40M COP |

Argumento de venta del bundle: el anunciante compra una audiencia, no un formato. Arquitectos, diseñadores y constructores con poder de decisión de compra en materiales, acabados, muebles, equipos. Mostrar el perfil demográfico (74% mujeres, 35-44 años mayoritarios, Bogotá) como el segmento exacto que necesitan impactar.

---

## KPIs que reportas mensualmente

| KPI | Baseline (mayo 2026) | Meta jul | Meta sep |
|-----|---------------------|---------|---------|
| CPC Meta Ads | $108 COP | <$90 | <$75 |
| Conversiones suscripción/mes | 0 | ≥10 | ≥25 |
| CPL suscripción | ∞ | <$15.000 COP | <$10.000 COP |
| Frecuencia Meta | 2.2 | <2.0 | <1.8 |
| Anunciantes activos | 5 | 6 | 8 |
| Revenue digital pauta/mes | ~$33M COP | Confirmar renovaciones | +2 cuentas nuevas |
| ROAS campaña suscripción | 0 | >1.0 | >3.0 |

---

## Lo que desbloqueas para el resto del equipo

| Si tú haces esto | Juan David puede... | Paola Gordillo puede... |
|-----------------|---------------------|------------------------|
| Activas retargeting con evento ViewContent | Optimizar la landing para esa audiencia caliente | Crear contenido de IG específico para quienes visitaron la landing |
| Creas LAL de suscriptores | — | Usar el perfil del LAL para entender qué tipo de persona es suscriptor y hacer contenido dirigido a ellos |
| Produces reportes de anunciantes con métricas | — | Usar el perfil de audiencia del reporte en propuestas a nuevos anunciantes |
| Logras primeras conversiones | Juan David tiene datos de qué artículos SEO convierten mejor | Paola sabe qué contenido de IG lleva a gente que compra |

---

## Acceso que necesitas

| Herramienta | Para qué | Estado |
|-------------|---------|--------|
| Meta Business Manager | Gestión de campañas + audiencias + Pixel | Confirmar acceso admin |
| Meta Events Manager | Verificar Pixel + CAPI + eventos | Incluido en BM |
| Meta Pixel Helper (extensión Chrome) | Verificar eventos en el sitio | Descargar gratis en Chrome Store |
| Google Analytics 4 (viewer) | Medir tráfico y conversiones por canal | Solicitar a Juan David |
| Base de suscriptores (CSV) | Crear Custom Audience + LAL | Solicitar a Paola Nossa vía HubSpot |

---

*Documento generado por Growth Team AXXIS — Junio 2026*
*Fuentes: Tab 05 Pauta Digital, SEO Analysis (GA4 ene–jun 2026), Informe Pauta Mayo 2026 — Sebastián Díaz, Tab 04 Redes Sociales*
