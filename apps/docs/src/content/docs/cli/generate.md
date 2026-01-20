---
title: generate Command
description: Generate all icon assets from configuration
---

The `generate` command creates all icon assets including the registry, types, inline data, and sprite sheet.

## Overview

This page covers:
- Generated output files
- Mode options (sprite/inline)
- Watch mode for development
- Remote registry support

## Usage

```bash
# Basic generation
npx @semicons/cli generate

# Watch mode
npx @semicons/cli generate --watch

# Remote registry
npx @semicons/cli generate --remote https://example.com/semicons.json
```

## Output Files

### registry.json

The single source of truth for icon metadata:

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
        "label": "Menu"
      }
    }
  ]
}
```

### types.ts / types.d.ts

TypeScript types for type-safe icon usage:

```typescript
export type IconName = 'navigation:menu' | 'status:error' | 'action:edit';

export interface IconMeta {
  name: string;
  category?: string;
  deprecated?: boolean | string;
  description?: string;
}

export const ICON_META: Record<IconName, IconMeta> = {
  'navigation:menu': { name: 'navigation:menu', category: 'navigation' },
};
```

### inline.ts / inline.d.ts

Inline SVG data for direct rendering:

```typescript
export const INLINE_ICONS: Record<string, string> = {
  'navigation:menu': '<svg viewBox="0 0 24 24">...</svg>',
  'status:error': '<svg viewBox="0 0 24 24">...</svg>',
};

export const ICON_META = { /* ... */ };
```

### semicons.svg

SVG sprite sheet for sprite mode:

```svg
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="navigation:menu" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
  <symbol id="status:error" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
</svg>
```

### schema.json

JSON Schema for validation:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "tokens": { "type": "array" }
  }
}
```

## Options

| Option | Description |
|--------|-------------|
| `--config <path>` | Config file path |
| `--out <dir>` | Output directory |
| `--watch, -w` | Watch for changes |
| `--remote <url>` | Remote config URL |
| `--strict <mode>` | Strictness: loose/warn/strict |
| `--no-optimize` | Skip SVG optimization |
| `--format <format>` | Output format: json/ts |

### Watch Mode

```bash
npx @semicons/cli generate --watch
```

Watches for changes to:
- Configuration file
- SVG files in icons directory

### Remote Registry

```bash
# JSON
npx @semicons/cli generate --remote https://example.com/semicons.json

# JavaScript module
npx @semicons/cli generate --remote https://example.com/semicons.mjs
```

## Output Directory

Default: `./src/icons.generated/`

```bash
# Custom output
npx @semicons/cli generate --out ./app/src/generated
```

Structure:
```
src/icons.generated/
├── registry.json
├── schema.json
├── types.ts
├── types.d.ts
├── inline.ts
├── inline.d.ts
├── report.json
└── local/
    ├── navigation-menu.light.svg
    └── navigation-menu.dark.svg
```

## When to Use

- After adding new icons
- After changing configuration
- In CI/CD before builds
- In watch mode during development

## When Not to Use

- Runtime (already generated)
- After every code change (only when icons change)

## Common Issues

### Duplicate token names

```bash
Error: Duplicate token "navigation:menu"
```

**Solution**: Remove duplicate from config.

### SVG optimization fails

```bash
Error: SVGO optimization failed for "menu.svg"
```

**Solution**: Check SVG validity, use `--no-optimize`.

### Theme not defined

```bash
Error: Theme "dark" not defined for "navigation:menu"
```

**Solution**: Add theme to config or use `--strict loose`.

## Next Steps

- [CLI Overview](/cli/overview) - All commands
- [CLI Scan](/cli/scan) - Validate generation
- [CLI Doctor](/cli/doctor) - Diagnostics
