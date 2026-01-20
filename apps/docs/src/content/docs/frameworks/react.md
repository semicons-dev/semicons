---
title: React
description: Use Semicons in React applications
---

The `@semicons/react` package provides type-safe React components for using Semicons icons in your application.

## Overview

This page covers:
- Installation and setup
- Render modes (sprite, inline, auto)
- Provider configuration
- Accessibility patterns
- TypeScript support

## Installation

```bash
pnpm add @semicons/react
# or
npm install @semicons/react
```

## Basic Usage

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

## Render Modes

### Auto Mode (Default)

Automatically chooses sprite if available, falls back to inline:

```tsx
<Icon name="navigation:menu" mode="auto" />
```

### Sprite Mode

Uses `<use href="#token">` from sprite sheet:

```tsx
<Icon name="navigation:menu" mode="sprite" />
```

**Requirements**: `semicons.svg` in public directory.

### Inline Mode

Renders SVG directly inline:

```tsx
<Icon name="navigation:menu" mode="inline" />
```

**Requirements**: Generated `inline.ts` with icon data.

## Provider Configuration

### SemiconsProvider

Sets defaults for all Icon components:

```tsx
<SemiconsProvider
  spriteUrl="/semicons.svg"
  defaultMode="auto"
  defaultSize="md"
  defaultDecorative={true}
>
  <Icon name="navigation:menu" />
</SemiconsProvider>
```

### Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spriteUrl` | `string` | `'/semicons.svg'` | Sprite file URL |
| `defaultMode` | `'auto' \| 'sprite' \| 'inline'` | `'auto'` | Default render mode |
| `defaultSize` | `IconSize` | `'md'` | Default icon size |
| `defaultDecorative` | `boolean` | `true'` | Default decorative state |

### Size Values

| Size | Pixel |
|------|-------|
| `xs` | 12px |
| `sm` | 16px |
| `md` | 20px |
| `lg` | 24px |
| `xl` | 32px |

## Inline Mode Setup

### 1. Generate with CLI

```bash
npx @semicons/cli generate
```

### 2. Initialize Icons

**Option A: Direct import**

```tsx
// main.tsx
import { initFromGenerated } from '@semicons/react'
import { INLINE_ICONS, ICON_META } from './icons.generated/inline'

initFromGenerated({ INLINE_ICONS, ICON_META })
```

**Option B: icons.generated entry**

```tsx
// main.tsx
import { initFromGenerated } from '@semicons/react/icons.generated'
import * as generated from './icons.generated'

initFromGenerated(generated)
```

### 3. Use Without Provider

```tsx
// Icons work without provider in inline mode
<Icon name="navigation:menu" mode="inline" />
```

## Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IconName` | Required | Icon token name |
| `mode` | `'auto' \| 'sprite' \| 'inline'` | Provider default | Render mode |
| `size` | `IconSize \| number` | Provider default | Icon size |
| `decorative` | `boolean` | `true` | Decorative icon |
| `ariaLabel` | `string` | - | Accessible label |
| `title` | `string` | - | Title tooltip |

## Accessibility

### Decorative Icons (Default)

```tsx
<button aria-label="Open menu">
  <Icon name="navigation:menu" />
</button>
```

Renders: `aria-hidden="true"` (hidden from screen readers)

### Meaningful Icons

```tsx
<Icon
  name="status:error"
  decorative={false}
  ariaLabel="Form validation failed"
/>
```

Renders: `role="img"` with `aria-label`

## TypeScript Support

### IconName Type

```tsx
import { Icon, type IconName } from '@semicons/react'

const iconName: IconName = 'navigation:menu'

function Toolbar({ icon }: { icon: IconName }) {
  return <Icon name={icon} />
}
```

### Generated Types

```tsx
import { ICON_META } from './icons.generated/types'

type AvailableIcon = keyof typeof ICON_META
```

## Next.js Notes

### Public Directory

Place sprite in `public/`:

```
next-app/
├── public/
│   └── semicons.svg
└── src/
    └── app/
```

### SSR Consideration

Inline mode works better with SSR. For sprite mode, ensure sprite is available:

```tsx
// Use dynamic import for sprite-only components
'use client'
import dynamic from 'next/dynamic'
const Icon = dynamic(() => import('@semicons/react').then(m => m.Icon))
```

## Vite Notes

### Sprite in Public

Vite serves `public/` at root:

```
vite-app/
├── public/
│   └── semicons.svg
└── src/
```

### Inline Mode

Set up path alias in `vite.config.ts`:

```ts
export default defineConfig({
  resolve: {
    alias: {
      '@semicons/generated': path.resolve(__dirname, './src/icons.generated/inline.ts'),
    },
  },
})
```

## When to Use

- New React projects
- React-based design systems
- TypeScript React projects

## When Not to Use

- Non-React projects (use Vue or vanilla)
- Static sites without build step

## Common Issues

### Sprite not loading

```bash
Icon not rendered - sprite not available
```

**Solution**: Verify `public/semicons.svg` exists.

### Type errors

```tsx
Type '"navigation:menu"' is not assignable to type 'IconName'
```

**Solution**: Run `generate` to update types.

### ariaLabel missing

```bash
Warning: Icon with decorative={false} requires ariaLabel
```

**Solution**: Add `ariaLabel` prop.

## Next Steps

- [Vue Guide](/frameworks/vue) - Vue integration
- [Accessibility](/concepts/a11y) - Accessibility patterns
- [CLI Generate](/cli/generate) - Generate assets
