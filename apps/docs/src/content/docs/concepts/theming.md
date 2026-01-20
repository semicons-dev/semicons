---
title: Theming
description: Configure light/dark themes and theme enforcement
---

Theming allows you to define different icon variants for different visual contexts. This page covers theme configuration and enforcement strategies.

## Overview

This page covers:
- Theme configuration (light/dark/custom)
- The `enforceThemeCompleteness` setting
- Strict vs Warn vs Loose strategies
- Fallback behavior

## Theme Configuration

Themes are defined in your configuration file:

```javascript
export default {
  version: '1.0.0',
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  tokens: {
    'navigation:menu': {
      themes: {
        light: 'local:menu-light',
        dark: 'local:menu-dark',
      },
    },
  },
}
```

### Theme Properties

| Property | Type | Description |
|----------|------|-------------|
| `themes` | `string[]` | List of available themes |
| `defaultTheme` | `string` | Fallback theme when none specified |

### Common Themes

```javascript
// Light/Dark
themes: ['light', 'dark']
defaultTheme: 'light'

// With high contrast
themes: ['light', 'dark', 'high-contrast']
defaultTheme: 'light'

// Custom brand themes
themes: ['light', 'dark', 'blue-theme', 'green-theme']
defaultTheme: 'light'
```

## Token Theme Variants

### Simple Format (single AssetRef)

```javascript
tokens: {
  'navigation:menu': 'local:menu',  // Same for all themes
}
```

### Theme Map Format

```javascript
tokens: {
  'navigation:menu': {
    themes: {
      light: 'local:menu-light',
      dark: 'local:menu-dark',
    },
  },
}
```

### With Fallback

```javascript
tokens: {
  'status:success': {
    themes: {
      light: 'local:success-green',
      // dark: defaults to light
    },
  },
}
```

## Theme Enforcement

The `enforceThemeCompleteness` setting controls strictness:

### Loose (Default)

```javascript
export default {
  enforceThemeCompleteness: 'loose',
}
```

- Missing themes fall back to `defaultTheme`
- No warnings during generation

### Warn

```javascript
export default {
  enforceThemeCompleteness: 'warn',
}
```

- Missing themes fall back to `defaultTheme`
- Warnings logged for incomplete tokens

### Strict

```javascript
export default {
  enforceThemeCompleteness: 'strict',
}
```

- All tokens must define all themes
- Generation fails if any token is incomplete

## CLI Strict Mode

Override enforcement via CLI flag:

```bash
# Warn mode
npx @semicons/cli generate --strict warn

# Strict mode
npx @semicons/cli generate --strict strict
```

## When to Use Each Strategy

### Loose

- Early-stage projects
- Personal projects
- Icons with no theme differences

### Warn

- Growing teams adopting theming
- Gradual migration to complete themes

### Strict

- CI/CD pipelines
- Design systems with defined themes
- Before releases

## Fallback Behavior

When a token doesn't define a theme:

```
Token: 'navigation:menu'
Defined: { light: 'local:menu-light' }
Missing: dark

Result:
{
  light: 'local:menu-light',
  dark: 'local:menu-light'  // Falls back to light
}
```

## When to Use

- Light/dark mode support
- Brand theme variants
- Accessibility high-contrast modes

## When Not to Use

- Single-theme projects
- Static branding (no theme switching)

## Common Issues

### Theme mismatch

```bash
Warning: Token "status:error" missing theme "dark"
```

**Solution**: Add the missing theme or use `--strict loose`.

### Generation fails in strict mode

```bash
Error: Token "status:error" missing themes: dark
```

**Solution**: Add missing themes or use `--strict warn`.

## Next Steps

- [AssetRef](/concepts/assetref) - Asset references
- [CLI Generate](/cli/generate) - Generation options
- [React Theming](/frameworks/react#theming) - Runtime theming
