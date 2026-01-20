---
title: registry.json
description: The registry.json format and reference
---

The `registry.json` is the single source of truth for all icon metadata. This page documents its structure.

## Overview

This page covers:
- Registry structure and fields
- Version compatibility
- Full example
- Migration guide

## Structure

```json
{
  "version": "1.0.0",
  "themes": ["light", "dark"],
  "defaultTheme": "light",
  "tokens": [
    {
      "name": "navigation:menu",
      "themes": {
        "light": "local:menu-light",
        "dark": "local:menu-dark"
      },
      "a11y": {
        "label": "Menu",
        "description": "Open navigation menu"
      },
      "meta": {
        "category": "navigation",
        "description": "Open menu",
        "tags": ["hamburger", "nav"]
      },
      "deprecated": false
    }
  ]
}
```

## Fields

### version

```json
"version": "1.0.0"
```

The registry format version. Used for backward compatibility.

### themes

```json
"themes": ["light", "dark"]
```

Array of theme names. All tokens must define these themes.

### defaultTheme

```json
"defaultTheme": "light"
```

Fallback theme when no specific theme is requested.

### tokens

Array of token objects. Each token has:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Token name (category:name) |
| `themes` | `object` | Theme → AssetRef mapping |
| `a11y` | `object` | Accessibility metadata |
| `meta` | `object` | Additional metadata |
| `deprecated` | `boolean \| string` | Deprecation status |

### Token: themes

```json
"themes": {
  "light": "local:menu-light",
  "dark": "local:menu-dark"
}
```

### Token: a11y

```json
"a11y": {
  "label": "Menu",
  "description": "Open the navigation menu"
}
```

### Token: meta

```json
"meta": {
  "category": "navigation",
  "description": "Open menu",
  "tags": ["hamburger", "nav"]
}
```

### Token: deprecated

```json
// Not deprecated
"deprecated": false

// Deprecated
"deprecated": "2.0.0"  // Version when deprecated
```

## Full Example

```json
{
  "version": "1.0.0",
  "themes": ["light", "dark"],
  "defaultTheme": "light",
  "tokens": [
    {
      "name": "navigation:menu",
      "themes": {
        "light": "local:menu-light",
        "dark": "local:menu-dark"
      },
      "a11y": {
        "label": "Menu",
        "description": "Open navigation menu"
      },
      "meta": {
        "category": "navigation",
        "description": "Open menu"
      },
      "deprecated": false
    },
    {
      "name": "status:error",
      "themes": {
        "light": "local:error",
        "dark": "local:error"
      },
      "a11y": {
        "label": "Error",
        "description": "Error indicator"
      },
      "meta": {
        "category": "status"
      },
      "deprecated": "2.0.0"
    }
  ]
}
```

## Version Compatibility

| Registry Version | CLI Version | Status |
|-----------------|-------------|--------|
| 1.0.0 | 1.0.0+ | Current |
| 0.9.0 | 0.9.0 | Legacy |

## When to Use

- Reading icon metadata programmatically
- Validating icon configuration
- Building custom tools

## When Not to Use

- Direct editing (edit `semicons.config.mjs` instead)
- Runtime rendering (use runtime packages)

## Common Issues

### Invalid JSON

```bash
Error: Invalid JSON in registry.json
```

**Solution**: Run `generate` to regenerate.

### Version mismatch

```bash
Error: Registry version 0.9.0 not compatible with CLI 1.0.0
```

**Solution**: Migrate registry or use compatible CLI version.

## Next Steps

- [JSON Schema](/reference/json-schema) - Schema validation
- [CLI Generate](/cli/generate) - Generate registry
- [Concepts Overview](/concepts/overview) - Core concepts
