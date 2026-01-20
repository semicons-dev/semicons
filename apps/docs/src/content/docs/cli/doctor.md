---
title: doctor Command
description: Run diagnostics on your Semicons configuration
---

The `doctor` command performs health checks on your icon configuration, identifying issues and suggesting fixes.

## Overview

This page covers:
- What doctor checks for
- Auto-fix capabilities
- Output interpretation
- Strict mode

## Usage

```bash
# Basic diagnostics
npx @semicons/cli doctor

# With auto-fix
npx @semicons/cli doctor --fix

# Strict mode
npx @semicons/cli doctor --strict
```

## What It Checks

### Configuration Checks

- Config file exists and is valid JSON/JS
- Required fields present (version, themes, tokens)
- Theme names are consistent

### Asset Checks

- SVG files exist for local icons
- No orphaned SVG files (not referenced in tokens)
- Icon files are valid SVG

### Registry Checks

- All tokens have theme definitions
- No duplicate token names
- Asset references are valid

### Project Checks

- `.gitignore` includes generated files
- Package.json has required scripts
- Output directory exists

## Output Example

```
$ npx @semicons/cli doctor

[doctor] Running diagnostics...

✓ Config file valid
✓ Version defined
✓ Themes configured
✓ Tokens defined
✗ Missing theme variants
  └─ status:success missing "dark" theme
✗ Orphaned SVG file
  └─ icons/local/unused.svg not referenced in any token
✓ Git ignore configured
✓ Output directory exists

Found 2 issues (1 warning, 1 error)

Fix with: npx @semicons/cli doctor --fix
```

## Options

| Option | Description |
|--------|-------------|
| `--fix` | Attempt automatic fixes |
| `--strict` | Treat warnings as errors |
| `--json` | JSON output |
| `--verbose` | Detailed output |

### Auto-fix

```bash
npx @semicons/cli doctor --fix
```

Fixes automatically:
- `.gitignore` entries
- Directory creation
- Orphaned file detection (warnings only)

### Strict Mode

```bash
npx @semicons/cli doctor --strict
```

Treats warnings as errors, fails on:
- Missing theme variants
- Orphaned files
- Incomplete configuration

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `1` | Issues found |

## When to Use

- Before releases
- After adding new icons
- CI/CD health checks
- Troubleshooting configuration issues

## When Not to Use

- During active development
- On fresh projects (run init first)

## Common Issues

### Git ignore missing

```
✗ icons.generated/ not in .gitignore
```

**Fix**: Run `doctor --fix` or manually add.

### Theme incomplete

```
✗ Token "status:success" missing "dark" theme
```

**Fix**: Add missing theme to config or use `--strict loose`.

## Next Steps

- [CLI Scan](/cli/scan) - Code scanning
- [CLI Generate](/cli/generate) - Generate after fixes
- [Project Setup](/getting-started/project-setup) - CI/CD integration
