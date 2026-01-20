---
title: Token Naming
description: Conventions and best practices for semantic token names
---

Consistent token naming makes your icon system discoverable and maintainable. This page covers the naming convention, examples, and migration strategies.

## Overview

This page covers:
- The `category:name` naming format
- Validation regex and examples
- Category design recommendations
- Deprecation and migration strategies

## Naming Format

Tokens follow the `category:name` pattern:

```
category:name
```

Where:
- **category**: A group of related icons (navigation, status, action)
- **name**: A descriptive identifier for the specific icon

### Validation Regex

```regex
^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$
```

### Valid Examples

```javascript
'navigation:menu'        // ✓ Valid
'status:error'           // ✓ Valid
'action:edit'            // ✓ Valid
'editor:bold'            // ✓ Valid
'navigation:chevron-up'  // ✓ Valid
'status:warning.circle'  // ✓ Valid with dot
'editor/code-block'      // ✓ Valid with slash
```

### Invalid Examples

```javascript
'Menu'                   // ✗ Must be lowercase
'NAVIGATION:menu'        // ✗ Category must be lowercase
'navigation:Menu'        // ✗ Name must be lowercase
'navigation:menu-icon'   // ✗ Underscore not allowed
'nav:menu'               // ✗ Category too short (recommend 3+ chars)
':menu'                  // ✗ Missing category
'navigation:'            // ✗ Missing name
```

## Category Design

Categories group related icons. Choose categories that reflect UI patterns:

### Recommended Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| `navigation` | Navigation icons | `menu`, `home`, `chevron-right`, `search` |
| `status` | Status indicators | `error`, `success`, `warning`, `info` |
| `action` | User actions | `edit`, `delete`, `copy`, `share` |
| `editor` | Text editing | `bold`, `italic`, `link`, `code-block` |
| `media` | Media controls | `play`, `pause`, `volume`, `fullscreen` |
| `communication` | Communication | `chat`, `mail`, `phone`, `notification` |

### Category Naming Rules

- Use **kebab-case** (lowercase, hyphens)
- Be **descriptive** - `navigation` not `nav`
- Avoid **overlap** - don't have both `edit` and `editing`
- Keep to **3-5 categories** for most projects

## Migration Strategy

When renaming tokens, use the deprecation field:

```javascript
// Before: 'edit' → After: 'action:edit'
tokens: {
  'action:edit': 'local:edit',
  'edit': {
    deprecated: '2.0.0',
    replacement: 'action:edit',
  },
}
```

### Migration Steps

1. Add the new token with proper naming
2. Mark the old token as deprecated with a version
3. Run `generate` to update types
4. Update code to use new token name
5. Remove old token in next major version

### ESLint Auto-fix

The ESLint plugin suggests corrections for misspelled tokens:

```javascript
// If you type 'navgation:menu', it suggests:
// - navigation:menu
```

## When to Use

- New icon systems (start with correct naming)
- Refactoring existing icons
- Onboarding new team members

## When Not to Use

- Ad-hoc icon usage (not using Semicons)
- Legacy systems (gradual migration ok)

## Common Issues

### Token format violations

```bash
Error: Token "Edit" does not match pattern
```

**Solution**: Use lowercase `action:edit`, not `Edit`.

### Category too generic

**Problem**: `ui:menu` - what does "ui" mean?

**Solution**: Be specific - `navigation:menu`.

### Inconsistent naming

**Problem**: `navigation:menu` and `status:delete` - no pattern.

**Solution**: Choose categories that reflect the icon's purpose, not appearance.

## Next Steps

- [AssetRef](/concepts/assetref) - Asset reference details
- [ESLint Plugin](/tooling/eslint-plugin) - Linting rules
- [CLI Scan](/cli/scan) - Find invalid tokens
