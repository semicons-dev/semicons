---
title: CLI Overview
description: Introduction to the Semicons CLI and its responsibilities
---

The Semicons CLI is the only producer of generated icon assets. This page covers CLI responsibilities, global options, and command structure.

## Overview

This page covers:
- CLI responsibilities and architecture
- Global options available for all commands
- Command structure and help

## CLI Responsibilities

The Semicons CLI is the **single source of truth** for generating:

| Output File | Purpose |
|-------------|---------|
| `registry.json` | Icon registry (SSOT) |
| `schema.json` | JSON Schema for validation |
| `types.ts` | TypeScript type definitions |
| `types.d.ts` | TypeScript declarations |
| `inline.ts` | Inline SVG data |
| `inline.d.ts` | Inline SVG declarations |
| `semicons.svg` | SVG sprite sheet |

## Installation

```bash
# Install globally
npm install -g @semicons/cli

# Or use via npx
npx @semicons/cli <command>

# Or add to package.json
pnpm add -D @semicons/cli
```

## Global Options

These options are available for all commands:

| Option | Description |
|--------|-------------|
| `--config <path>` | Path to configuration file |
| `--out <dir>` | Output directory for generated files |
| `--strict <mode>` | Strictness mode: `loose`, `warn`, `strict` |
| `--json` | JSON output format |
| `--help` | Show help for command |
| `--version` | Show CLI version |

### Examples

```bash
# Custom config
npx @semicons/cli generate --config icons.config.mjs

# Custom output
npx @semicons/cli generate --out ./src/generated

# Strict mode
npx @semicons/cli generate --strict strict

# JSON output
npx @semicons/cli doctor --json
```

## Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize a new Semicons configuration |
| `generate` | Generate all icon assets |
| `scan` | Scan codebase for icon usage issues |
| `doctor` | Run diagnostics on configuration |
| `--watch, -w` | Watch mode (with generate) |
| `--remote <url>` | Load config from remote URL |

### Quick Reference

```bash
# Initialize new project
npx @semicons/cli init

# Generate all assets
npx @semicons/cli generate

# Watch and regenerate
npx @semicons/cli generate --watch

# Scan for issues
npx @semicons/cli scan ./src

# Health check
npx @semicons/cli doctor

# Remote config
npx @semicons/cli generate --remote https://example.com/semicons.json
```

## Help

Get help for any command:

```bash
# General help
npx @semicons/cli --help

# Specific command help
npx @semicons/cli generate --help

# All commands
npx @semicons/cli --help
```

## When to Use

- Setting up new icon configuration
- Generating icon assets after config changes
- Scanning for icon-related issues
- Validating icon setup

## When Not to Use

- Runtime icon rendering (use runtime packages)
- IDE features (use VS Code extension)

## Common Issues

### Config not found

```bash
Error: Cannot find config file
```

**Solution**: Run `init` first or specify with `--config`.

### Output directory not writable

```bash
Error: EACCES: permission denied
```

**Solution**: Check directory permissions or use `--out`.

## Next Steps

- [CLI Init](/cli/init) - Initialize configuration
- [CLI Generate](/cli/generate) - Generate assets
- [CLI Scan](/cli/scan) - Scan for issues
- [CLI Doctor](/cli/doctor) - Diagnostics
