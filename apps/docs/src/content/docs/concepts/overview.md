---
title: Overview
description: Core concepts and terminology in Semicons
---

Understanding the core concepts helps you make the most of Semicons. This page defines key terms and explains the architecture.

## Overview

This page covers:
- Core terminology (Token, AssetRef, Theme, Registry)
- The semantic token vs icon name distinction
- Semicons v1 design boundaries

## Terminology

### Token

A **token** is a semantic identifier for an icon. Tokens follow the `category:name` pattern and are the primary way developers reference icons.

```javascript
// Tokens in configuration
tokens: {
  'navigation:menu': 'local:menu',      // Token: navigation:menu
  'status:error': 'local:error',        // Token: status:error
  'action:edit': 'lucide:pencil',       // Token: action:edit
}
```

### AssetRef

An **AssetRef** (`namespace:id`) references the actual icon asset. It consists of:
- **namespace**: The source of the icon (`local`, `lucide`)
- **id**: The identifier within that namespace

```javascript
// AssetRef examples
'local:menu'      // Local icon with id "menu"
'lucide:home'     // Lucide icon with id "home"
'custom:alert'    // Custom namespace with id "alert"
```

### Theme

A **theme** defines a variant of an icon, typically for different visual contexts. Common themes:
- `light` - Icons for light backgrounds
- `dark` - Icons for dark backgrounds
- Custom themes like `high-contrast`, `brand-blue`

### Registry

The **registry** is the central JSON file (`registry.json`) that maps tokens to themed AssetRefs. It's the single source of truth for icon metadata.

### Preset

A **preset** is a predefined set of icons (like Lucide) that can be imported into your registry.

## Semantic Tokens vs Icon Names

| Aspect | Semantic Token | Icon Name |
|--------|----------------|-----------|
| Format | `category:name` | `kebab-case` |
| Purpose | Describes meaning/context | Describes appearance |
| Example | `navigation:menu` | `hamburger` or `menu-hamburger` |
| Refactoring | Rarely changes | Changes with design system |
| Localization | Not needed | Not needed |

**Why semantic tokens?**
- `navigation:menu` clearly indicates it's for navigation UI
- `status:error` indicates an error state indicator
- Tokens document themselves - no need for comments

## Design Boundaries

Semicons v1 has clear boundaries:

### What Semicons Does

- Token-to-asset mapping
- Theme variant management
- Type generation
- Sprite sheet generation
- CLI for asset pipeline
- Framework runtime components
- Linting rules and IDE support

### What Semicons Does NOT Do

- SVG optimization (delegated to SVGO)
- Icon design (you provide SVGs)
- Runtime icon customization (color/size at runtime)
- CDN/hosting (you deploy sprites)
- Authentication/authorization (for remote registries)

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   semicons      │     │      CLI        │     │   Runtime       │
│   config.mjs    │────▶│   generate      │────▶│   components    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                   ┌─────────────────┐
                   │   registry.json │ (SSOT)
                   └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │  types.ts   │ │  inline.ts  │ │semicons.svg │
      └─────────────┘ └─────────────┘ └─────────────┘
```

## When to Use

- Building or maintaining a design system
- Needing consistent icon naming across teams
- Supporting multiple themes (light/dark)
- Wanting type safety for icons

## When Not to Use

- One-off icon usage (no overhead needed)
- Projects with established icon conventions

## Common Issues

### Confusion between token and asset

**Problem**: Treating `navigation:menu` and `local:menu` as the same thing.

**Solution**: Remember - tokens are for code (`<Icon name="navigation:menu" />`), asset refs are for configuration.

### Forgetting the category

**Problem**: Using just `menu` instead of `navigation:menu`.

**Solution**: Tokens must follow `category:name` pattern. Configure ESLint to catch this.

## Next Steps

- [Token Naming](/concepts/token-naming) - Token naming conventions
- [AssetRef](/concepts/assetref) - Asset reference details
- [Theming](/concepts/theming) - Theme configuration
