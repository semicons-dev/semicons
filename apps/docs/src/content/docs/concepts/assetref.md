---
title: AssetRef
description: Understanding asset references and namespaces
---

AssetRefs connect semantic tokens to actual icon assets. This page covers the namespace system, local assets, and validation rules.

## Overview

This page covers:
- The `namespace:id` AssetRef format
- Built-in namespaces (`local`, `lucide`)
- Local directory conventions
- Namespace validation and restrictions

## AssetRef Format

AssetRefs follow the `namespace:id` pattern:

```
namespace:id
```

Components:
- **namespace**: The source of the icon
- **id**: The identifier within that namespace

```javascript
// AssetRef examples
'local:menu'              // Local icon, id="menu"
'lucide:home'             // Lucide preset, id="home"
'custom:company-logo'     // Custom namespace, id="company-logo"
```

## Built-in Namespaces

### local Namespace

The `local` namespace is for your custom SVG icons:

```javascript
tokens: {
  'navigation:menu': 'local:menu',
  'status:error': 'local:error',
}
```

Expected file location:
```
icons/local/menu.svg
icons/local/error.svg
```

### lucide Namespace

The `lucide` namespace provides built-in icons from the Lucide library:

```javascript
tokens: {
  'navigation:home': 'lucide:home',
  'action:edit': 'lucide:pencil',
  'status:info': 'lucide:info',
}
```

**Note**: Lucide icons require no additional files - they're bundled in the CLI.

## Directory Structure

### Recommended Structure

```
project/
├── icons/
│   ├── local/
│   │   ├── menu.svg
│   │   ├── error.svg
│   │   └── success.svg
│   └── lucide/              // Optional: override Lucide icons
│       └── home.svg         // Overrides lucide:home
├── src/
│   └── icons.generated/
├── semicons.config.mjs
└── package.json
```

### Custom Namespaces

Add custom namespaces in your config:

```javascript
export default {
  namespaces: {
    brand: {
      source: './icons/brand/*.svg',
      transform: (svg) => svg, // Optional transformation
    },
  },
  tokens: {
    'branding:logo': 'brand:logo',
  },
}
```

## Namespace Validation

By default, only `local` and `lucide` namespaces are allowed:

```javascript
// Allowed by default
'local:menu'     // ✓
'lucide:home'    // ✓
'custom:icon'    // ✗ Not allowed by default
```

### Strict Namespace Validation

Enable strict validation in CLI:

```bash
npx @semicons/cli generate --strict
```

### Custom Allowed Namespaces

```javascript
export default {
  allowedNamespaces: ['local', 'lucide', 'brand'],
  namespaces: {
    brand: { source: './icons/brand/*.svg' },
  },
  tokens: {
    'branding:logo': 'brand:logo',
  },
}
```

## When to Use

- **local**: Your custom icons
- **lucide**: Common icons from Lucide library
- **custom**: Third-party icon sets or shared assets

## When Not to Use

- Creating unnecessary namespaces (overhead)
- Using namespaces without proper source configuration

## Common Issues

### Namespace not found

```bash
Error: Namespace "custom" not configured
```

**Solution**: Add `custom` to `namespaces` config.

### Asset not found

```bash
Error: Cannot find asset "local:menu"
```

**Solution**: Verify `icons/local/menu.svg` exists.

### Invalid namespace

```bash
Error: Namespace "FOO" not in allowedNamespaces
```

**Solution**: Add to `allowedNamespaces` or use lowercase.

## Next Steps

- [Token Naming](/concepts/token-naming) - Token conventions
- [CLI Generate](/cli/generate) - Asset generation
- [Registry Reference](/reference/registry-json) - Registry structure
