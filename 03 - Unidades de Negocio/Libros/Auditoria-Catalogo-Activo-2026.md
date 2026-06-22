---
date: 2026-06-21
type: auditoria
tags: [libros, catalogo, auditoria, e-commerce, inventario, precios, 2026]
related-people: [Nicolas Serna, Carolina Ramirez]
related-projects: [Plan-Comercial-Libros]
sources: [https://edicionesgamma.com/tienda/ — scraping 2026-06-21]
ai-first: true
confidence: high
---

## For future Claude
Audit of Ediciones Gamma's active e-commerce catalog scraped from edicionesgamma.com/tienda on 2026-06-21. Shows 29 books currently for sale (not the full 590+ historical catalog). Key finding: 6 of those are subscription bundles, not standalone book sales. Arte has the highest average price ($252K COP). Crianza has the lowest ($34K COP). Anuarios exist for 2006, 2007, 2023–2026 — years 2008–2022 are missing from the store. Many books lack publication year on product pages. Owner: [[Nicolas Serna]].

---

# Auditoria Catalogo Activo — Tienda edicionesgamma.com

**Fecha de auditoria:** 2026-06-21
**Fuente:** https://edicionesgamma.com/tienda/
**Alcance:** Catalogo activo en venta (no es el catalogo historico completo de 590+ titulos)

---

## Resumen Ejecutivo

| Categoria | Titulos activos | Precio min | Precio max | Precio promedio |
|---|---|---|---|---|
| Arquitectura y Diseno | 7 | $135,000 | $191,000 | $161,000 |
| Arte | 7 | $190,000 | $323,000 | $252,000 |
| Turismo | 8 | $15,000 | $167,000 | $70,000 |
| Cocina | 2 | $119,000 | $160,000 | $140,000 |
| Crianza Infantil | 5 | $30,000 | $45,000 | $34,200 |
| **TOTAL libros** | **29** | **$15,000** | **$323,000** | **— ** |

Suscripciones con libro incluido: 6 bundles (listados aparte, no son ventas de libro puro).

---

## Catalogo por Categoria

### 1. Arquitectura y Diseno (7 titulos)

| Titulo | Ano | Precio COP |
|---|---|---|
| Anuario AXXIS de Arquitectura, Diseno & Decoracion 2026 | 2026 | $191,000 |
| Anuario de Arquitectura, Diseno y Decoracion AXXIS 2025 | 2025 | $184,000 |
| Anuario de Arquitectura, Diseno y Decoracion AXXIS 2024 | 2024 | $175,000 |
| Anuario de Arquitectura, Diseno y Decoracion AXXIS 2023 | 2023 | $170,000 |
| Mallol Arquitectos | Sin dato | $140,000 |
| Anuario de Arquitectura y Diseno AXXIS 2007 | 2007 | $135,000 |
| Anuario de Arquitectura y Diseno AXXIS 2006 | 2006 | $135,000 |

**Observaciones:**
- Los Anuarios son el producto de mayor rotacion de la BU — precio crece ~$5K por edicion.
- Hay un vacio de 15 anos en el e-commerce: ediciones 2008-2022 no estan listadas. Pueden estar en bodega o descatalogadas.
- Mallol Arquitectos no tiene ano visible en la ficha de producto — accion pendiente para Nicolas.

---

### 2. Arte (7 titulos)

| Titulo | Ano | Precio COP |
|---|---|---|
| Abel Rodriguez (Mogaje Guihu) El nombrador de plantas | Sin dato | $323,000 |
| Luciano Jaramillo | Sin dato | $305,000 |
| MOMO – Hernando Del Villar | Sin dato | $315,000 |
| Pedro Nel Gomez | Sin dato | $275,000 |
| Freda Sargent | Sin dato | $190,000 |
| Manolo Vellejin | Sin dato | $190,000 |
| Ethel Gilmour | Sin dato | $190,000 |

**Observaciones:**
- Arte es la categoria de mayor ticket promedio ($252K). Ideal para regalos corporativos y consignacion en hoteles boutique.
- Ningun titulo tiene ano de publicacion en su ficha de e-commerce. Es una brecha de contenido: los coleccionistas quieren saber la edicion.
- Abel Rodriguez es el libro mas caro del catalogo activo ($323K). Tiene alto potencial como ancla de propuesta de regalo corporativo premium.

---

### 3. Turismo (8 titulos)

| Titulo | Ano | Precio COP |
|---|---|---|
| Esta es Colombia – Edicion 6 | Sin dato | $167,000 |
| This is Colombia – Edicion 6 | Sin dato | $167,000 |
| Bogota la Ciudad | Sin dato | $85,000 |
| Asi es Barranquilla | Sin dato | $69,000 |
| Guia Elarqa de Arquitectura de Bogota (ES) | Sin dato | $15,000 |
| Guia Elarqa de Arquitectura de Bogota (EN) | Sin dato | $15,000 |
| Guia Elarqa de Arquitectura de Medellin (ES) | Sin dato | $15,000 |
| Guia Elarqa de Arquitectura de Medellin (EN) | Sin dato | $15,000 |

**Observaciones:**
- "Esta es Colombia" y "This is Colombia" son el mismo titulo en dos idiomas. Precio identico. Bien posicionados para el canal de hoteles y sector diplomatico.
- Las Guias Elarqa estan subvaloradas: $15,000 COP para un producto editorial de gran formato es precio de descarte. Revisar si este precio es intencional (liquidacion) o un error de configuracion en el e-commerce.
- Asi es Barranquilla a $69K es un precio muy bajo para un coffee table book. Posible titulo con inventario excedente que se esta liquidando.

---

### 4. Cocina (2 titulos)

| Titulo | Ano | Precio COP |
|---|---|---|
| Andres Carne de Res | Sin dato | $160,000 |
| Cocina para el Fin de Semana | Sin dato | $119,000 |

**Observaciones:**
- Categoria con solo 2 titulos pero ambos con alto reconocimiento de marca. Andres Carne de Res es un titulo con traccion cultural fuerte — candidato para activaciones estacionales y feria del libro.
- "Cocina para el Fin de Semana" aparece como incentivo en el bundle de suscripcion Diners ($284K). Esto indica que el titulo tiene valor percibido como regalo pero probablemente tiene stock excedente.

---

### 5. Crianza Infantil (5 titulos)

| Titulo | Ano | Precio COP |
|---|---|---|
| Coleccion de Nutricion Infantil | Sin dato | $45,000 |
| Manual de Estimulacion Temprana | Sin dato | $36,000 |
| Como aprender y crecer con su hijo – 4 a 12 anos | Sin dato | $30,000 |
| Estimule sus aptitudes, virtudes y fortalezas | Sin dato | $30,000 |
| Talleres de motivacion para ninos | Sin dato | $30,000 |

**Observaciones:**
- Categoria de menor ticket promedio ($34K). Los precios sugieren que estos titulos tienen inventario envejecido o fueron calculados para distribucion masiva.
- El Manual de Estimulacion Temprana (desarrollado con psicologas de la Javeriana) es el titulo de mayor credibilidad institucional de la categoria. El precio de $36K subestima su posicionamiento.
- Canal natural para crianza: pediatrias, jardines infantiles, tiendas universitarias de la Javeriana — estos canales aun no estan activados.

---

### 6. Suscripciones con Libro (6 bundles — no son ventas de libro puro)

| Bundle | Precio COP | Libro incluido |
|---|---|---|
| AXXIS anual + Anuario 2026 | $327,900 | Anuario AXXIS 2026 |
| AXXIS anual + Anuario 2025 | $322,000 | Anuario AXXIS 2025 |
| AXXIS anual (sin libro) | $208,000 | — |
| Diners anual + Abel Rodriguez | $376,500 | Arte – $323K de valor |
| Diners anual + Cocina para el Fin de Semana | $284,000 | Cocina – $119K de valor |
| Diners anual + Panama Country 3ed | $214,800 | Titulo de inventario legacy |

**Observaciones:**
- El bundle Diners + Abel Rodriguez ($376K) tiene la propuesta de valor mas solida: el libro vale $323K solo, el diferencial de la suscripcion es apenas $53K.
- "Panama Country 3ra edicion" sigue apareciendo como incentivo de suscripcion Diners. Este titulo fue identificado en la nota de Libros como un titulo "castigado" con inventario a $1 peso contable. Usarlo como gancho de suscripcion es la estrategia correcta.
- Los bundles no estan pensados como productos de regalo corporativo: tendrian que reempacarse para ese uso.

---

## Hallazgos Criticos

### 1. Brecha entre catalogo historico y catalogo activo
El vault registra **590+ titulos publicados desde 1979**. El e-commerce activo solo lista **29 titulos**. La gran mayoria del inventario no esta digitalizado, no tiene precio publico, o no esta disponible en el canal digital. Esto es una brecha de revenue.

**Accion:** Nicolas Serna debe hacer un inventario fisico de bodega y determinar cuantos titulos mas pueden activarse en el e-commerce con fichas completas.

### 2. Anuarios faltantes 2008-2022
Los Anuarios son el producto de mayor rotacion. Solo estan listados 2006, 2007, y 2023-2026. Hay **15 ediciones faltantes** en el e-commerce. Si existen en bodega, representan stock vendible con credibilidad de marca alta.

**Accion:** Verificar stock fisico de Anuarios 2008-2022. Si existe, activarlos en el e-commerce con precio de liquidacion ($80K-$100K).

### 3. Ausencia de anos de publicacion
De los 29 titulos activos, solo los Anuarios tienen ano visible. Los 22 titulos restantes no lo muestran. Esto afecta la decision de compra de coleccionistas y el SEO de los productos.

**Accion:** Ernesto Rodriguez actualiza las fichas de producto con ano de publicacion, ISBN, numero de paginas y descripcion editorial.

### 4. Precios Elarqa posiblemente desactualizados
Las 4 Guias Elarqa a $15,000 COP no guardan proporcion con ningun otro titulo del catalogo. Un coffee table book de arquitectura a ese precio parece un error de configuracion o un precio de hace 15+ anos que nunca se actualizo.

**Accion:** Revisar si el precio es intencional (liquidacion de inventario final) o si debe actualizarse.

### 5. Categoria Cocina subrepresentada
Solo 2 titulos de cocina en un catalogo de 590 publicaciones desde 1979. Colombia tiene un boom gastronomico activo. Si existen mas titulos de cocina en bodega, es la categoria con mayor potencial de venta cross con el canal Diners.

---

## Oportunidades Identificadas

| Oportunidad | Impacto potencial | Responsable |
|---|---|---|
| Activar Anuarios 2008-2022 en e-commerce | $800K–$2M COP adicional en ventas | Nicolas Serna |
| Completar fichas de producto con ano + ISBN + descripcion | +15-25% tasa de conversion organica estimada | Ernesto Rodriguez |
| Reposicionar Elarqa Guides como paquete bilateral (ES+EN) a $25K | Incrementar ticket promedio Turismo | Nicolas Serna |
| Bundle "Coleccion Arte" (3 libros) para regalo corporativo | Ticket $800K-$900K paquete vs $750K separados | Nicolas Serna |
| Activar titulos de crianza en canal Javeriana (ya en proceso de vinculacion) | Revenue incremental Crianza | Nicolas Serna |

---

## Relacionado

[[03 - Unidades de Negocio/Libros/Libros]] · [[Estrategia-Libros-Conmemorativos-2026]] · [[02 - Personas/Nicolas Serna]] · [[02 - Personas/Ernesto Rodriguez]]

#libros #catalogo #auditoria #e-commerce #inventario #precios
