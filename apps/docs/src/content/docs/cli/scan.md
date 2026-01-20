---
title: scan Command
description: Scan codebase for icon usage issues
---

The `scan` command analyzes your codebase for icon-related issues including invalid tokens, deprecated icons, and direct SVG imports.

## Overview

This page covers:
- What scan checks for
- Output formats
- Exit codes and fail conditions
- Integration with CI/CD

## Usage

```bash
# Scan entire src
npx @semicons/cli scan ./src

# Scan specific directory
npx @semicons/cli scan ./src/components

# JSON output
npx @semicons/cli scan ./src --format json
```

## What It Checks

### Invalid Tokens

```javascript
// Bad - token not in registry
<Icon name="navigation:menu" />  // If "navigation:menu" not defined
```

### Deprecated Tokens

```javascript
// Bad - using deprecated token
<Icon name="old:delete" />  // If deprecated: '2.0.0'
```

### Direct SVG Imports

```javascript
// Bad - direct .svg import
import MenuIcon from './menu.svg'
```

### Hardcoded Icon Names

```javascript
// Bad - hardcoded string
const icon = 'menu'
```

## Options

| Option | Description |
|--------|-------------|
| `--format <text\|json\|html>` | Output format |
| `--fail-on <error\|warn\|never>` | Exit condition |
| `--registry <path>` | Registry path |
| `--no-color` | Disable colored output |

### Output Formats

**Text (default):**
```
$ npx @semicons/cli scan ./src

src/components/Menu.tsx:15  Invalid token "navgation:menu"  error
src/components/Button.tsx:8  Deprecated token "old:delete"  warn
src/utils/icons.ts:3       Direct .svg import             error

Found 2 errors, 1 warning
```

**JSON:**
```json
{
  "errors": 2,
  "warnings": 1,
  "issues": [
    {
      "file": "src/components/Menu.tsx",
      "line": 15,
      "message": "Invalid token \"navgation:menu\"",
      "level": "error"
    }
  ]
}
```

**HTML:**
Generates an HTML report suitable for CI artifacts.

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No violations (or only warnings with `--fail-on warn`) |
| `1` | Errors found (or warnings with `--fail-on warn`) |

### Fail Conditions

```bash
# Fail on errors only (default)
npx @semicons/cli scan ./src --fail-on error

# Fail on warnings too
npx @semicons/cli scan ./src --fail-on warn

# Never fail (report only)
npx @semicons/cli scan ./src --fail-on never
```

## CI/CD Integration

```yaml
# .github/workflows/scan.yml
- name: Scan icons
  run: pnpm semicons scan ./src --fail-on error
```

## When to Use

- Pre-commit hooks
- CI/CD pipelines
- Before releases
- Regular code health checks

## When Not to Use

- During active development (too noisy)
- On files without icon usage

## Common Issues

### False positives

**Problem**: Scan reports valid tokens as invalid.

**Solution**: Ensure registry is generated first.

### Too many warnings

**Problem**: Legacy code has many issues.

**Solution**: Use `--fail-on error` initially, fix gradually.

## Next Steps

- [CLI Generate](/cli/generate) - Generate registry first
- [CLI Doctor](/cli/doctor) - Configuration diagnostics
- [ESLint Plugin](/tooling/eslint-plugin) - Real-time linting
