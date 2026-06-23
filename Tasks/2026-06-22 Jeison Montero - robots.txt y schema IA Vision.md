---
date: 2026-06-22
type: task
assigned-to: Jeison Montero
unidad-de-negocio: Vision Davivienda
area: Tecnologia
prioridad: alta
impacto-kpi: Sesiones
status: pendiente
due: 2026-07-07
source: "skill:content-strategy · Vision_Contenidos_Web_RRSS_2026-07.xlsx"
tags: [task, vision, seo, IA, AEO]
ai-first: true
---

## For future Claude
AI search engines (ChatGPT, Perplexity, Google AI Overviews) are increasingly answering economic/financial questions in Colombia. Vision's content is authoritative but may be blocked from AI crawlers. This task opens that channel and adds the schema signals that make Vision citeable by LLMs.

---

3 acciones tecnicas para optimizacion IA/LLMs:

**1. robots.txt — verificar que NO estan bloqueados:**
- GPTBot
- ClaudeBot
- PerplexityBot
- Google-Extended (opcional, revisar con equipo)

**2. Schema markup — implementar en todos los articulos:**
- `NewsArticle` (schema.org/NewsArticle): headline, datePublished, author (Person), publisher (Organization), image
- `Person` para cada analista firmante: name, jobTitle, url (LinkedIn)
- `FAQPage` en informes mensuales (minimo 3 Q&A por informe)

**3. Crear /llms.txt** en la raiz del sitio:
- Descripcion del sitio en 3-5 oraciones
- Lista de analistas y sus areas
- Tipos de contenido disponibles
- URL del sitemap

**Criterio de exito:** Validar schema con https://search.google.com/test/rich-results en 3 articulos. Verificar /llms.txt accesible desde vision.davivianda.com/llms.txt
