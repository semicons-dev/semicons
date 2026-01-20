---
title: Quickstart
description: Get started with Semicons in 5 minutes
---

Semicons provides a fast way to set up type-safe icons in your project. This guide walks through installation, configuration, and basic usage.

## Overview

This page covers:
- Installing Semicons CLI and runtime packages
- Initializing your icon registry
- Generating icon assets
- Using icons in React/Vue applications

## Installation

Install the CLI and your desired runtime package:

```bash
# Core CLI
pnpm add -D @semicons/cli

# React runtime
pnpm add @semicons/react

# Vue runtime
pnpm add @semicons/vue
```

## Initialize

Run the init command to create the default configuration:

```bash
npx @semicons/cli init
```

This creates:
- `semicons.config.mjs` - Configuration file
- `icons/local/` - Directory for your SVG icons
- `src/icons.generated/` - Output directory for generated files

## Add Icons

Place SVG files in `icons/local/`:

```bash
icons/local/
├── menu.svg
├── close.svg
├── error.svg
└── success.svg
```

Update `semicons.config.mjs`:

```javascript
export default {
  version: '1.0.0',
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  tokens: {
    'navigation:menu': 'local:menu',
    'navigation:close': 'local:close',
    'status:error': 'local:error',
    'status:success': 'local:success',
  },
}
```

## Generate Assets

Run generate to create all required files:

```bash
npx @semicons/cli generate
```

Output:
```
src/icons.generated/
├── registry.json    # Icon registry (SSOT)
├── types.ts         # TypeScript types
├── inline.ts        # Inline SVG data
└── local/           # Optimized SVGs

public/
└── semicons.svg     # Sprite sheet
```

## Use in React

```tsx
import { Icon, SemiconsProvider } from '@semicons/react'

export function App() {
  return (
    <SemiconsProvider spriteUrl="/semicons.svg">
      <Icon name="navigation:menu" />
      <Icon name="status:error" />
    </SemiconsProvider>
  )
}
```

## Use in Vue

```vue
<script setup lang="ts">
import { Icon, SemiconsProvider } from '@semicons/vue'
</script>

<template>
  <SemiconsProvider sprite-url="/semicons.svg">
    <Icon name="navigation:menu" />
    <Icon name="status:error" />
  </SemiconsProvider>
</template>
```

## When to Use

- New projects starting an icon system
- Projects migrating from hardcoded icons
- Design systems establishing icon standards

## When Not to Use

- Existing projects with established icon workflows (may need migration)
- Projects using icon fonts (different architecture)

## Common Issues

### Token not found

```
Error: Token "navigation:menu" not found in registry
```

**Solution**: Ensure the token is defined in `semicons.config.mjs` and matches the pattern `category:name`.

### SVG file not found

```
Error: Cannot find icon "local:menu"
```

**Solution**: Verify the SVG file exists at `icons/local/menu.svg`.

### Theme not defined

```
Error: Theme "dark" not defined for token
```

**Solution**: Add the theme to your config or set `defaultTheme`.

## Next Steps

- [Project Setup](/getting-started/project-setup) - Advanced configuration
- [Token Naming](/concepts/token-naming) - Best practices for token names
- [CLI Reference](/cli/overview) - Full CLI documentation
