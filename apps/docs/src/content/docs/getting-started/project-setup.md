---
title: Project Setup
description: Configure Semicons for monorepos, CI/CD, and team workflows
---

This page covers advanced setup scenarios including monorepo support, recommended scripts, Git ignore patterns, and CI/CD integration.

## Overview

This page covers:
- Monorepo and single-repo configurations
- Recommended npm scripts
- Git ignore best practices
- CI/CD pipeline setup

## Monorepo Setup

For monorepos, you can have a shared icon registry consumed by multiple packages.

### Option 1: Centralized Registry

```
my-monorepo/
├── packages/
│   ├── app/
│   │   └── src/
│   └── web/
│       └── src/
├── icons/                    # Shared icons
│   └── local/
│       └── menu.svg
├── semicons.config.mjs       # Shared config
└── package.json
```

Configure in `semicons.config.mjs`:

```javascript
export default {
  version: '1.0.0',
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  outputDir: './packages/app/src/icons.generated',
  tokens: {
    'navigation:menu': 'local:menu',
    'action:edit': 'local:edit',
    'status:error': 'local:error',
  },
}
```

Generate for each app:

```bash
# App 1
npx @semicons/cli generate --config semicons.config.mjs --out packages/app/src/icons.generated

# App 2
npx @semicons/cli generate --config semicons.config.mjs --out packages/web/src/icons.generated
```

### Option 2: Package-Based Registry

Each package can have its own `semicons.config.mjs`:

```
packages/design-system/
├── icons/
│   └── local/
│       └── menu.svg
├── semicons.config.mjs
└── src/
    └── icons.generated/
```

## Recommended Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "icons:generate": "npx @semicons/cli generate",
    "icons:scan": "npx @semicons/cli scan ./src",
    "icons:doctor": "npx @semicons/cli doctor",
    "icons:watch": "npx @semicons/cli generate --watch",
    "predev": "pnpm icons:generate",
    "prebuild": "pnpm icons:generate"
  }
}
```

Usage:

```bash
# Generate on every dev server start
pnpm dev

# Watch mode during development
pnpm icons:watch

# Scan for issues
pnpm icons:scan

# Health check
pnpm icons:doctor
```

## Git Ignore

Generated files should be committed to ensure reproducible builds:

```gitignore
# Generated files - COMMIT these
src/icons.generated/
public/semicons.svg

# Local icons - COMMIT these
icons/local/

# Config - COMMIT this
semicons.config.mjs

# Node modules - DON'T commit
node_modules/

# Build outputs
dist/
build/
```

**Rationale**: Committing generated files ensures:
- Consistent builds across environments
- No runtime dependency on CLI
- Faster CI/CD (no regeneration needed)

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/icons.yml
name: Icons

on:
  push:
    paths:
      - 'icons/**'
      - 'semicons.config.mjs'
  pull_request:
    paths:
      - 'icons/**'
      - 'semicons.config.mjs'

jobs:
  icons:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: '8'
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm icons:generate
      - run: pnpm icons:scan --fail-on error
      - run: pnpm icons:doctor --strict
```

### Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: semicons-generate
        name: Generate icons
        entry: pnpm icons:generate
        language: system
        pass_filenames: false
        stages: [pre-commit]
```

## When to Use

- Team projects needing consistent icon workflows
- CI/CD pipelines requiring validation
- Monorepos sharing icon assets

## When Not to Use

- Personal projects (overhead not justified)
- Projects with no build step

## Common Issues

### Monorepo: Token collisions

**Problem**: Two packages define the same token name.

**Solution**: Use a naming prefix per package:
```javascript
tokens: {
  'ds-navigation:menu': 'local:menu',  // Design System
  'app-navigation:menu': 'local:menu', // App
}
```

### CI: Build fails on main but passes locally

**Problem**: Git ignore includes generated files.

**Solution**: Commit generated files (see above).

## Next Steps

- [CLI Overview](/cli/overview) - Full CLI reference
- [Concepts Overview](/concepts/overview) - Core concepts
