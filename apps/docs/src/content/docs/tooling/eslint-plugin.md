---
title: ESLint Plugin
description: Lint icon usage in your codebase
---

The `@semicons/eslint-plugin` provides ESLint rules to validate icon usage and catch errors early.

## Overview

This page covers:
- Installation and configuration
- Available rules
- Auto-fix capabilities
- Recommended configuration

## Installation

```bash
pnpm add -D @semicons/eslint-plugin
# or
npm install -D @semicons/eslint-plugin
```

## Configuration

### Basic Configuration

```javascript
// eslint.config.mjs
import semicons from '@semicons/eslint-plugin'

export default [
  {
    plugins: {
      semicons,
    },
    rules: {
      'semicons/valid-icon-token': 'error',
    },
  },
]
```

### Recommended Configuration

```javascript
// eslint.config.mjs
import semicons from '@semicons/eslint-plugin'

export default [
  {
    plugins: {
      semicons,
    },
    rules: {
      'semicons/valid-icon-token': 'error',
    },
    settings: {
      semicons: {
        registryPath: 'src/icons.generated/registry.json',
      },
    },
  },
]
```

## Rules

### valid-icon-token

Validates icon token names against the registry.

**Error Cases:**

1. **Invalid token format**

```javascript
// ESLint: 'navigation:menu' format required
<Icon name="Menu" />           // ✗ Must be lowercase
<Icon name="NAV:menu" />       // ✗ Category lowercase
```

2. **Token not in registry**

```javascript
<Icon name="navigation:menu" />  // If not defined in registry
```

3. **Deprecated token**

```javascript
<Icon name="old:delete" />  // If deprecated: '2.0.0'
```

**Fixable Issues:**

- Typos suggest similar tokens (edit distance ≤ 2)
- Deprecated tokens can be auto-removed

### Auto-fix

```bash
# Auto-fix all fixable issues
eslint . --fix
```

**Example Fix:**

```javascript
// Input
<Icon name="navgation:menu" />

// Auto-fix suggestion
<Icon name="navigation:menu" />  // Closest match
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `registryPath` | `string` | Path to registry.json |
| `allowedNamespaces` | `string[]` | Allowed namespaces |
| `strict` | `boolean` | Strict validation |

### Registry Auto-discovery

The plugin automatically searches for `icons.generated/registry.json` in parent directories (up to 10 levels).

### Explicit Registry Path

```javascript
settings: {
  semicons: {
    registryPath: './path/to/registry.json',
  },
}
```

## Recommended Config

```javascript
// eslint.config.mjs
import js from '@eslint/js'
import semicons from '@semicons/eslint-plugin'

export default [
  js.configs.recommended,
  {
    plugins: {
      semicons,
    },
    rules: {
      'semicons/valid-icon-token': 'error',
    },
    settings: {
      semicons: {
        registryPath: 'src/icons.generated/registry.json',
      },
    },
  },
]
```

## Common Issues

### Registry not found

```
Error: Cannot find registry at 'src/icons.generated/registry.json'
```

**Solution**: Run `generate` first, or set `registryPath`.

### False positives

**Problem**: Plugin reports valid tokens as invalid.

**Solution**: Ensure registry is up to date.

## Next Steps

- [CLI Scan](/cli/scan) - CLI-based scanning
- [VS Code Extension](/tooling/vscode-extension) - IDE support
- [Registry Reference](/reference/registry-json) - Registry structure
