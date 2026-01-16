# Semicons

A modern, type-safe icon system for your applications.

## Quick Start

```bash
# Install dependencies
pnpm install

# Install semicons CLI
pnpm add @semicons/cli

# Initialize configuration
npx @semicons/cli init

# Generate icons
npx @semicons/cli generate
```

## Workspace Structure

```
semicons/
├── apps/
│   └── docs/          # Astro documentation site
└── packages/
    ├── cli/           # @semicons/cli - Command line interface
    ├── core/          # @semicons/core - Core types and utilities
    ├── react/         # @semicons/react - React components
    ├── eslint-plugin/ # @semicons/eslint-plugin - ESLint rules
    └── config/        # @semicons/config - Shared configurations
```

## Development

```bash
# Run all dev tasks
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Run tests
pnpm test
```

## Publishing

```bash
# Create a changeset
pnpm changeset

# Publish packages
pnpm release
```

## Documentation

Visit [http://localhost:3000](http://localhost:3000) to view the documentation site during development.

```bash
pnpm -C apps/docs dev
```
