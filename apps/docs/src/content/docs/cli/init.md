---
title: init Command
description: Initialize a new Semicons configuration
---

The `init` command creates a starter configuration and directory structure for your icon system.

## Overview

This page covers:
- What the init command creates
- Configuration options
- Directory structure

## Usage

```bash
npx @semicons/cli init
```

## What Gets Created

```
project/
├── semicons.config.mjs    # Configuration file
├── icons/
│   └── local/
│       └── .gitkeep       # Placeholder for icons
└── src/
    └── icons.generated/   # Created on first generate
```

## Configuration File

The generated `semicons.config.mjs`:

```javascript
// semicons.config.mjs
export default {
  version: '1.0.0',
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  tokens: {
    'navigation:menu': 'local:menu',
  },
}
```

## Options

| Option | Description |
|--------|-------------|
| `--force` | Overwrite existing config |
| `--template <name>` | Template: `minimal`, `full` |

### Templates

```bash
# Minimal template (default)
npx @semicons/cli init --template minimal

# Full template with examples
npx @semicons/cli init --template full
```

### Full Template Contents

```javascript
export default {
  version: '1.0.0',
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  tokens: {
    // Navigation
    'navigation:menu': 'local:menu',
    'navigation:home': 'lucide:home',
    'navigation:chevron-right': 'lucide:chevron-right',
    
    // Status
    'status:error': 'local:error',
    'status:success': 'local:success',
    'status:warning': 'lucide:alert-triangle',
    'status:info': 'lucide:info',
    
    // Actions
    'action:edit': 'lucide:pencil',
    'action:delete': 'lucide:trash-2',
    'action:search': 'lucide:search',
  },
}
```

## After Init

1. Add your SVG icons to `icons/local/`
2. Update `semicons.config.mjs` with your tokens
3. Run `npx @semicons/cli generate`

## When to Use

- Starting a new project with Semicons
- Resetting configuration to defaults
- Creating a template for team standardization

## When Not to Use

- Existing configuration (use `generate` to update)
- One-off changes (edit config directly)

## Common Issues

### Config already exists

```bash
Error: Config already exists
```

**Solution**: Use `--force` to overwrite.

### Invalid template

```bash
Error: Unknown template "custom"
```

**Solution**: Use `minimal` or `full`.

## Next Steps

- [CLI Generate](/cli/generate) - Generate after init
- [Token Naming](/concepts/token-naming) - Configure tokens
- [AssetRef](/concepts/assetref) - Configure assets
