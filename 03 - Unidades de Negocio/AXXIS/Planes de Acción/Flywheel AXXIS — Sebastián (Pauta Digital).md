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

### Nota: campañas de clientes — fuera del scope de este documento

Este plan cubre exclusivamente la **pauta propia de la revista** (presupuesto de AXXIS/Gamma para conseguir suscriptores). Las campañas que los anunciantes contratan y AXXIS ejecuta con su propio presupuesto (ACESCO, CORONA, Amarilo, Pianeta Legno, Colchones Eldorado, etc.) son **ingresos comerciales** — se gestionan en un documento separado y sus métricas no deben mezclarse con las de la pauta de suscripción.

---

## Tus Acciones — Sprint 30 días (Jun 20 – Jul 20)

> **Actualización jun 21, 2026:** Auditoría visual de `revistaaxxis.com.co/suscribirse-2/` realizada. Los problemas de la landing están confirmados. Las acciones 1-2 se actualizaron con los hallazgos reales.

### REGLA ANTES DE EMPEZAR: no tocar presupuesto hasta que Juan David corrija la landing

La landing tiene 4 problemas estructurales confirmados visualmente (jun 21):
- URL `/suscribirse-2/` (WordPress duplicó la página — Juan David debe corregirlo antes del Jun 23)
- Sin H1 — Google y el Pixel no identifican de qué trata la página
- Sin propuesta de valor encima de los precios — usuario llega sin contexto
- Banner sticky muestra $181.100 — precio que no corresponde a ningún plan vigente

**No activar retargeting ni LAL hasta que Juan David confirme que la URL es `/suscribirse/` y el H1 está presente.**

---

### ACCIÓN 1 — Verificar Pixel + CAPI en la URL correcta
**Plazo:** Jun 25 | **Prioridad:** 🔴 Crítica (bloquea el retargeting)

> HubSpot muestra 10 suscripciones reales en mayo (vía Triario). El checkout funciona. El problema es que esas compras son invisibles para Meta — confirma que el Pixel no está disparando Purchase en el flujo de Triario.

Pasos en orden:

1. **Instalar Meta Pixel Helper** (extensión gratuita de Chrome) y navegar a la URL de suscripción (cuando Juan David confirme que es `/suscribirse/`)
2. **Verificar ViewContent:** ¿aparece en la landing? Si no → el retargeting de visitantes es imposible
3. **Verificar Purchase:** navegar hasta la confirmación de compra en Triario → ¿dispara el evento? Si no → Meta nunca supo de las 10 compras de mayo
4. **Si Triario no acepta Pixel en su dominio:** solicitar a Triario la activación de CAPI (Conversions API) server-side — sin esto se pierde 40% de conversiones por iOS 14.5+
5. **Verificar dominio en BM:** Business Manager → Brand Safety → Dominios → `revistaaxxis.com.co` debe aparecer como verificado (necesario para AEM en iOS)

**Entregable:** Screenshot de Meta Pixel Helper mostrando los eventos que disparan (o no). Compartir con Carolina el Jun 25.

---

### ACCIÓN 2 — Activar retargeting de visitantes web

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

## KPIs que reportas mensualmente
> Solo métricas de pauta propia de suscripción — las campañas de clientes van en reporte comercial separado.

| KPI | Baseline (mayo 2026) | Meta jul | Meta sep |
|-----|---------------------|---------|---------|
| CPC Meta Ads (pauta propia) | $108 COP | <$90 | <$75 |
| Conversiones suscripción/mes | 0 | ≥10 | ≥25 |
| CPL suscripción | ∞ | <$15.000 COP | <$10.000 COP |
| Frecuencia Meta prospecting | 2.2 | <2.0 | <1.8 |
| ROAS campaña suscripción | 0 | >1.0 | >3.0 |
| Pixel activo en landing | No | Sí | Sí |
| CAPI configurado (Triario) | No | Sí | Sí |

---

## Lo que desbloqueas para el resto del equipo

| Si tú haces esto | Juan David puede... | Paola Gordillo puede... |
|-----------------|---------------------|------------------------|
| Activas retargeting con evento ViewContent | Optimizar la landing para esa audiencia caliente | Crear contenido de IG específico para quienes visitaron la landing |
| Creas LAL de suscriptores | — | Usar el perfil del LAL para entender qué tipo de persona es suscriptor y hacer contenido dirigido a ellos |
| Logras datos de conversión atribuibles | — | Entender qué perfil de seguidor termina comprando |
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
