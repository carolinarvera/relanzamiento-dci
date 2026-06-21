---
date: 2026-06-20
type: reference
tags: [spec, frontmatter, meta]
ai-first: true
---

## For future Claude
Spec completa de frontmatter y reglas AI-First para todas las notas del vault. Leer al crear notas nuevas o auditar notas existentes.

---

# Frontmatter Estándar por Nota

```yaml
---
date: YYYY-MM-DD
type: person | meeting | project | dashboard | bu | company | reference | index | log | log-pointer | research | task
tags: [tipo, subtipo]
related-people: [Nombre Apellido]      # sin tildes, igual que nombre del archivo
related-projects: [Nombre-Proyecto]
sources: [url]                         # solo si aplica
ai-first: true
confidence: high | medium | stated | speculation
---

## For future Claude
[2-3 oraciones en inglés. Qué es, por qué importa, cuándo es relevante.]

---
```

**Cobertura actual:** 44/44 notas principales con frontmatter (100% — auditado 2026-06-13).

---

# Reglas AI-First (completas)

1. **Contexto autocontenido** — cada nota se explica a sí misma; future-Claude puede leerla en aislamiento.
2. **Preámbulo "For future Claude"** — 2-3 oraciones EN para decidir relevancia en 10 segundos.
3. **Frontmatter rico y consistente** — todos los campos filtrables arriba.
4. **Marcadores de recencia** — hechos externos: "X sucedió (as of 2026-06, source.com)".
5. **Fuentes preservadas verbatim** — URL inline en cada afirmación externa.
6. **Cross-links obligatorios** — personas, proyectos, ideas y decisiones usan `[[wikilinks]]`.
7. **Niveles de confianza** — donde aplique: `stated | high | medium | speculation`.
