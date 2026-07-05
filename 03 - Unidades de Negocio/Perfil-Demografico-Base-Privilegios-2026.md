---
date: 2026-07-03
type: data
tags: [suscriptores, privilegios, beneficios-suscriptores, demografia, segmentacion, zona-premium]
related-people: [Carolina Ramirez]
related-projects: [Beneficios-Suscriptores, Zona-Premium-Suscriptores]
ai-first: true
confidence: high
---

## For future Claude
Análisis demográfico agregado de la base de miembros de Privilegios Davivienda (5,853 registros, exportado 2026-07-03 desde `Envío de comunicaciones BBDD - Envio.xlsx`, archivo protegido con contraseña). Se procesó con pandas directamente sobre el Excel para evitar errores de parsing manual. **No contiene nombres ni emails** — solo cifras agregadas por ciudad, edad y segmento. Este perfil corrige una asunción errónea que se había usado en una sesión previa con Gemini para diseñar la estrategia de aliados de Beneficios Suscriptores (asumía 39 años promedio; el dato real es 45.3 años, con el bloque más grande en 51+ años). Usar este perfil como base demográfica real antes de definir criterios de prospección de aliados o mensajes de campaña.

---

# Perfil Demográfico — Base Privilegios Davivienda (2026-07-03)

> **Fuente:** Export BBDD Privilegios, 5,853 registros · Procesado con pandas (Python) sobre el archivo Excel original
> **Propósito:** Insumo demográfico real para la estrategia de aliados de [[Zona-Premium-Suscriptores-AXXIS-Diners|Zona Premium de Suscriptores]] y [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios|Beneficios Suscriptores]]

---

## 1. Segmento

| Segmento | Registros | % |
|---|---|---|
| Premium | 3,200 | 54.7% |
| Clásico Portafolio | 1,580 | 27.0% |
| Premium Plus | 1,065 | 18.2% |
| Banca Privada | 8 | 0.1% |

---

## 2. Edad — corrige asunción previa incorrecta

**Dato erróneo usado antes (sesión Gemini, descartar):** "39 años promedio", base joven-millennial.

**Dato real:**
- **Promedio: 45.3 años · Mediana: 44 años** (rango 22–91)
- El rango más grande no es "30s" sino **51+ años (19.1%)**

| Rango de edad | Registros | % |
|---|---|---|
| 22-25 | 97 | 1.7% |
| 26-30 | 468 | 8.0% |
| 31-35 | 855 | 14.6% |
| 36-40 | 939 | 16.0% |
| 41-45 | 881 | 15.1% |
| 46-50 | 744 | 12.7% |
| 51+ | 1,118 | 19.1% |

**Implicación:** es una audiencia madura, con más peso en 40s-50s+ que en 30s. Los criterios de aliados y el tono de comunicación deben calibrarse a esto — no asumir perfil "millennial trendy".

---

## 3. Ciudades (top 20)

| Ciudad | Registros | % |
|---|---|---|
| Bogotá | 2,476 | 42.3% |
| Cali | 321 | 5.5% |
| Barranquilla | 265 | 4.5% |
| Medellín | 256 | 4.4% |
| Cartagena | 152 | 2.6% |
| Ibagué | 124 | 2.1% |
| Villavicencio | 107 | 1.8% |
| Pereira | 100 | 1.7% |
| Bucaramanga | 97 | 1.7% |
| Chía | 73 | 1.3% |
| Santa Marta | 71 | 1.2% |
| Cúcuta | 71 | 1.2% |
| Armenia | 59 | 1.0% |
| Cajicá | 59 | 1.0% |
| Envigado | 56 | 1.0% |
| Neiva | 56 | 1.0% |
| Manizales | 53 | 0.9% |
| Valledupar | 46 | 0.8% |
| Floridablanca | 46 | 0.8% |
| Montería | 43 | 0.7% |

Hay 275 ciudades/municipios distintos en total — cola larga real, no artefacto de parsing.

---

## 4. Cruce Edad × Segmento (% dentro de cada rango de edad)

| Rango de edad | Clásico Portafolio | Premium | Premium Plus |
|---|---|---|---|
| 22-25 | 7.2% | 73.2% | 19.6% |
| 26-30 | 13.5% | 61.3% | 25.2% |
| 31-35 | 29.6% | 54.0% | 16.4% |
| 36-40 | 32.8% | 51.8% | 15.3% |
| 41-45 | 30.0% | 55.6% | 14.4% |
| 46-50 | 26.3% | 54.2% | 19.4% |
| 51+ | 28.0% | 53.7% | 17.8% |

**Patrón:** Premium Plus tiene su mayor peso relativo en 26-30 años (25.2%), no en los mayores. Clásico Portafolio crece con la edad (7% en 22-25 → ~30% en 36-45+). Los suscriptores más jóvenes tienden a estar en tiers más altos; los de mayor edad/tenure se concentran más en Clásico — señal para pensar en estrategias de upgrade dirigidas a segmentos maduros.

---

## 5. Top 10 ciudades × Segmento (conteo absoluto)

| Ciudad | Clásico Portafolio | Premium | Premium Plus |
|---|---|---|---|
| Bogotá | 727 | 1,347 | 398 |
| Cali | 98 | 182 | 41 |
| Barranquilla | 72 | 147 | 46 |
| Medellín | 72 | 126 | 58 |
| Cartagena | 29 | 95 | 28 |
| Ibagué | 29 | 76 | 19 |
| Villavicencio | 30 | 55 | 22 |
| Pereira | 20 | 57 | 23 |
| Bucaramanga | 26 | 53 | 18 |
| Chía | 20 | 44 | 9 |

---

## 6. Nota sobre el directorio de aliados generado por Gemini

Una sesión previa con Gemini generó un "directorio de 500 aliados" (nombres de marcas, Instagram, sitios web, direcciones) para prospección. **Ese directorio no se debe usar tal cual** — los datos de contacto específicos no están verificados y varios muestran señales de estar mal cruzados o inventados. Sirve como inspiración de categorías (fine dining, wellness, diseño, escapes boutique), pero cualquier aliado concreto a contactar debe salir de investigación real o del conocimiento de campo de [[Nicolas Serna]].

---

## Relacionado

[[Zona-Premium-Suscriptores-AXXIS-Diners]] · [[03 - Unidades de Negocio/Experiencias/Arquitectura-Plataforma-Beneficios]] · [[Suscripciones-Revistas-2024-2026]] · [[Carolina Ramirez]] · [[Nicolas Serna]]

---

## Tags
#suscriptores #privilegios #beneficios-suscriptores #demografia #segmentacion #zona-premium
