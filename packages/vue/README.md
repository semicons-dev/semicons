# @semicons/vue

Vue 3 component library for Semicons - semantic icon tokens with dual sprite/inline modes.

## Features

- **Dual Mode Rendering**: Sprite (default) or inline SVG rendering
- **Vue 3 Composition API**: Uses provide/inject and Composition API
- **Tree-shakeable**: Only bundle what you use
- **A11y by default**: Proper ARIA attributes for screen readers

## Installation

```bash
pnpm add @semicons/vue
```

## Quick Start

```vue
<script setup lang="ts">
import { Icon, SemiconsProvider } from '@semicons/vue'
</script>

<template>
  <SemiconsProvider spriteUrl="/semicons.svg">
    <button aria-label="Open menu">
      <Icon name="navigation:menu" />
    </button>
  </SemiconsProvider>
</template>
```

## Modes

### Sprite Mode (Default)

Uses `<use href="#icon-name" />` to reference symbols from an external SVG sprite file.

```vue
<Icon name="navigation:menu" mode="sprite" />
```

**Requirements:**
- Deploy `semicons.svg` to your public folder
- Default sprite URL: `/semicons.svg`
- Configure via `SemiconsProvider` or `spriteUrl` prop

### Inline Mode

Renders SVG directly inline. Useful for SSR, offline apps, or when sprite isn't available.

```vue
<Icon name="navigation:menu" mode="inline" />
```

**Requirements:**
- CLI generates `src/icons.generated/inline.ts`
- Configure your bundler to alias the import:

**Vite:**
```ts
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@semicons/generated': './src/icons.generated/inline.ts',
    },
  },
});
```

**Webpack:**
```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@semicons/generated': path.resolve(__dirname, 'src/icons.generated/inline.ts'),
    },
  },
};
```

Then import in your app entry:

```ts
// main.ts
import '@semicons/generated'
```

### Auto Mode (Recommended)

Automatically chooses sprite if available, falls back to inline.

```vue
<Icon name="navigation:menu" mode="auto" /> <!-- Default -->
```

## API

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Icon token name (e.g., `navigation:menu`) |
| `mode` | `'auto' \| 'sprite' \| 'inline'` | `'auto'` | Render mode |
| `spriteUrl` | `string` | `/semicons.svg` | Sprite file URL |
| `size` | `number \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Icon size (12/16/20/24/32px) |
| `decorative` | `boolean` | `true` | If true, icon is decorative |
| `ariaLabel` | `string` | - | Accessible label (required if decorative=false) |
| `title` | `string` | - | `<title>` element content |

### SemiconsProvider

Provides default values for all Icon components.

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

### Composables

```ts
import { useSemicons } from '@semicons/vue'

const ctx = useSemicons()
console.log(ctx.spriteUrl) // '/semicons.svg'
```

## Accessibility Best Practices

### Decorative Icons

Icons that add visual context (not conveying information) should be decorative:

```vue
<button aria-label="Open menu">
  <Icon name="navigation:menu" decorative />
</button>
```

- Renders `aria-hidden="true"`
- No screen reader announcement

### Informative Icons

Icons that convey meaning must have an accessible label:

```vue
<Icon
  name="status:error"
  :decorative="false"
  aria-label="Error: Form validation failed"
/>
```

- Renders `role="img"` with `aria-label`
- Screen reader announces the label

## Setup with Generated Icons

### 1. Configure CLI

Add to your `semicons.config.ts`:

```ts
export default defineConfig({
  generate: {
    inline: true,
    output: './src/icons.generated',
  },
});
```

### 2. Configure Bundler Alias

**Vite:**
```ts
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@semicons/generated': './src/icons.generated/inline.ts',
    },
  },
});
```

**Webpack:**
```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@semicons/generated': path.resolve(__dirname, 'src/icons.generated/inline.ts'),
    },
  },
};
```

### 3. Import in App Entry

```ts
// main.ts
import '@semicons/generated'

createApp(App).mount('#app')
```

## Tree Shaking

The runtime package doesn't include any icon data. Generated files should be:

- Split by category (optional, configured in CLI)
- Imported via the alias configured above

This ensures only used icons are bundled.

## License

MIT
