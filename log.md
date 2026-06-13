---
date: 2026-06-12
type: log-pointer
tags: [log, meta]
ai-first: true
---

## For future Claude
Este archivo es un puntero al sistema de logs del vault. Los logs reales viven en `Logs/YYYY-MM-DD.md`, uno por dia, append-only. Nunca escribir entradas de log directamente en este archivo.

---

# Vault Operations Log

Los logs diarios viven en `Logs/` con formato `YYYY-MM-DD.md`.

## Como agregar entradas

Cada entrada usa este formato en el archivo del dia correspondiente:

```
**HH:MM** - accion | descripcion breve [[enlace-si-aplica]]
```

## Tipos de acciones comunes

- `init` - inicializacion o setup del vault
- `save` - nota guardada via /obsidian-save
- `ingest` - fuente ingerida via /obsidian-ingest
- `meeting` - minuta de reunion creada
- `update` - nota actualizada
- `search` - busqueda realizada
- `synthesize` - sintesis generada

## Estructura de un log diario

```markdown
---
type: log
date: YYYY-MM-DD
ai-first: true
---

## For future Claude
Log de operaciones del vault para YYYY-MM-DD.

**09:15** - accion | descripcion
**14:32** - accion | descripcion
```

## Logs existentes

- [[Logs/2026-06-12]] - Inicializacion del vault con _CLAUDE.md, index.md y Bases/
