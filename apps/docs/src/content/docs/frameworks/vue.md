---
title: Vue
description: Use Semicons in Vue 3 applications
---

The `@semicons/vue` package provides type-safe Vue 3 components for using Semicons icons.

## Overview

This page covers:
- Installation and setup
- Render modes (sprite, inline, auto)
- Provider (provide/inject) configuration
- Accessibility patterns
- TypeScript support

## Installation

```bash
pnpm add @semicons/vue
# or
npm install @semicons/vue
```

## Basic Usage

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

## Render Modes

### Auto Mode (Default)

```vue
<Icon name="navigation:menu" mode="auto" />
```

### Sprite Mode

```vue
<Icon name="navigation:menu" mode="sprite" />
```

**Requirements**: `semicons.svg` in public directory.

### Inline Mode

```vue
<Icon name="navigation:menu" mode="inline" />
```

**Requirements**: Generated `inline.ts` with icon data.

## Provider Configuration

### SemiconsProvider

Sets defaults using Vue's provide/inject:

```vue
<SemiconsProvider
  sprite-url="/semicons.svg"
  default-mode="auto"
  default-size="md"
  :default-decorative="true"
>
  <Icon name="navigation:menu" />
</SemiconsProvider>
```

### Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sprite-url` | `String` | `'/semicons.svg'` | Sprite file URL |
| `default-mode` | `'auto' \| 'sprite' \| 'inline'` | `'auto'` | Default mode |
| `default-size` | `String` | `'md'` | Default size |
| `default-decorative` | `Boolean` | `true` | Default decorative |

### Size Values

| Size | Pixel |
|------|-------|
| `xs` | 12px |
| `sm` | 16px |
| `md` | 20px |
| `lg` | 24px |
| `xl` | 32px |

## useSemicons Composable

Access current context values:

```vue
<script setup lang="ts">
import { useSemicons } from '@semicons/vue'

const ctx = useSemicons()
console.log(ctx.spriteUrl)     // '/semicons.svg'
console.log(ctx.defaultMode)   // 'auto'
console.log(ctx.defaultSize)   // 'md'
</script>
```

## Inline Mode Setup

### 1. Generate with CLI

```bash
npx @semicons/cli generate
```

### 2. Initialize Icons

```ts
// main.ts
import { setInlineIcons, setIconMeta } from '@semicons/vue'
import { INLINE_ICONS, ICON_META } from './icons.generated/inline'

setInlineIcons(INLINE_ICONS)
setIconMeta(ICON_META)

import App from './App.vue'
createApp(App).mount('#app')
```

### 3. Use Without Provider

```vue
<Icon name="navigation:menu" mode="inline" />
```

## Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `String` | Required | Icon token name |
| `mode` | `'auto' \| 'sprite' \| 'inline'` | Provider default | Render mode |
| `size` | `Number \| String` | Provider default | Icon size |
| `decorative` | `Boolean` | `true` | Decorative icon |
| `aria-label` | `String` | - | Accessible label |
| `title` | `String` | - | Title tooltip |

## Accessibility

### Decorative Icons (Default)

```vue
<button aria-label="Open menu">
  <Icon name="navigation:menu" />
</button>
```

### Meaningful Icons

```vue
<Icon
  name="status:error"
  :decorative="false"
  aria-label="Form validation failed"
/>
```

## TypeScript Support

### IconName Type

```vue
<script setup lang="ts">
import { Icon, type IconName } from '@semicons/vue'

const iconName: IconName = 'navigation:menu'
</script>
```

### Generated Types

```ts
import { ICON_META } from './icons.generated/types'

type AvailableIcon = keyof typeof ICON_META
```

## Nuxt 3 Notes

### Plugin

Create `plugins/semicons.ts`:

```ts
import { setInlineIcons, setIconMeta } from '@semicons/vue'
import { INLINE_ICONS, ICON_META } from '~/icons.generated/inline'

export default defineNuxtPlugin(() => {
  setInlineIcons(INLINE_ICONS)
  setIconMeta(ICON_META)
})
```

### Sprite in Public

Place in `public/semicons.svg`.

## Vite Notes

### Path Alias

```ts
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@semicons/generated': path.resolve(__dirname, './src/icons.generated/inline.ts'),
    },
  },
})
```

## When to Use

- Vue 3 projects
- Vue-based design systems
- TypeScript Vue projects

## When Not to Use

- Non-Vue projects (use React or vanilla)
- Vue 2 projects (not supported)

## Common Issues

### Icon not rendered

**Solution**: Verify sprite URL and file existence.

### Props not reactive

**Solution**: Use kebab-case in template: `sprite-url`, `aria-label`.

### Type errors

**Solution**: Run `generate` to update types.

## Next Steps

- [React Guide](/frameworks/react) - React integration
- [Accessibility](/concepts/a11y) - Accessibility patterns
- [CLI Generate](/cli/generate) - Generate assets
