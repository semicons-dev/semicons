---
title: VS Code Extension
description: IntelliSense and preview for Semicons in VS Code
---

The Semicons VS Code extension provides icon autocompletion, hover documentation, and live preview.

## Overview

This page covers:
- Installation and features
- Configuration options
- Supported file types
- Keyboard shortcuts

## Installation

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X`)
3. Search "Semicons"
4. Click Install

Or via command line:

```bash
code --install-extension semicons.semicons-vscode
```

## Features

### Autocompletion

Get icon token suggestions as you type:

```jsx
<Icon name="nav|"/>  // Suggests: navigation:menu, navigation:next
```

### Hover Documentation

Hover over an icon to see:

- Icon preview
- Token name
- Category
- Description
- Deprecation status

### Quick Fix

- Click the lightbulb to fix invalid tokens
- Shows similar tokens for typos

### Icon Preview

Click the preview button or use command palette:

- `Semicons: Preview Icon` - Preview selected icon
- Shows SVG at different sizes

## Commands

| Command | Description | Keyboard |
|---------|-------------|----------|
| `Semicons: Preview Icon` | Preview current icon | `Cmd+Shift+P` |
| `Semicons: Insert Icon` | Open icon picker | `Cmd+Shift+I` |
| `Semicons: Refresh` | Refresh from registry | - |

## Configuration

### Settings

```json
{
  "semicons.registryPath": "src/icons.generated/registry.json",
  "semicons.localIconDir": "icons/local",
  "semicons.iconComponentName": "Icon",
  "semicons.autoRefresh": true
}
```

### Settings Reference

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `registryPath` | `string` | Auto-discovered | Path to registry.json |
| `localIconDir` | `string` | `icons/local` | Local icons directory |
| `iconComponentName` | `string` | `Icon` | Component name to target |
| `autoRefresh` | `boolean` | `true` | Auto-refresh on registry change |
| `showPreviewOnHover` | `boolean` | `true` | Show preview on hover |

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "semicons.registryPath": "src/icons.generated/registry.json",
  "semicons.autoRefresh": true
}
```

## Supported Files

- `.tsx`, `.ts`, `.jsx`, `.js`
- `.vue` files
- Any file with JSX/TSX syntax

## When to Use

- Development with icon tokens
- Browsing available icons
- Validating icon usage

## When Not to Use

- Non-VS Code editors (use CLI/ESLint)
- CI/CD environments

## Common Issues

### No autocomplete

**Solution**: 
- Ensure registry is generated
- Check `registryPath` setting
- Run `Semicons: Refresh`

### Registry not found

```
Semicons: Registry not found
```

**Solution**: Run `npx @semicons/cli generate`.

### Icons not showing in preview

**Solution**: Check SVG files exist in `icons/local/`.

## Next Steps

- [ESLint Plugin](/tooling/eslint-plugin) - Linting
- [CLI Generate](/cli/generate) - Generate registry
- [Registry Reference](/reference/registry-json) - Registry structure
