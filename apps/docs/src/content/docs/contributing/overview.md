---
title: Contributing
description: Contribute to Semicons development
---

Contributions are welcome! This page covers how to set up your development environment and submit changes.

## Overview

This page covers:
- Development environment setup
- Repository structure
- Submitting issues and PRs
- Commit message conventions

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+

### Clone and Install

```bash
git clone https://github.com/semicons/semicons.git
cd semicons
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Type Check

```bash
pnpm typecheck
```

### Lint

```bash
pnpm lint
```

## Repository Structure

```
semicons/
├── apps/
│   ├── docs/          # Documentation site
│   └── vscode/        # VS Code extension
├── packages/
│   ├── core/          # Core library
│   ├── cli/           # CLI tool
│   ├── react/         # React runtime
│   ├── vue/           # Vue runtime
│   ├── eslint-plugin/ # ESLint rules
│   └── ...
├── docs/todos/        # TODO tracking
├── turbo.json         # Turborepo config
└── package.json
```

## Submitting Changes

### Issues

Before submitting a PR, open an issue to discuss:

- Bug reports with reproduction steps
- Feature requests with use cases
- Questions about usage

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and add tests
4. Run `pnpm build && pnpm test`
5. Submit PR with description

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): add new token validation
fix(cli): handle missing SVG files
docs(readme): update installation instructions
refactor(react): simplify Icon component
test(core): add tests for token parsing
```

## Changesets

Semicons uses [Changesets](https://github.com/changesets/changesets) for versioning.

### Adding a Changeset

```bash
pnpm changeset
```

This creates a markdown file in `.changeset/` describing the change.

### Publishing

1. PR with changeset → Merge to main
2. Changeset bot creates version PR
3. Merge version PR →自动发布到 npm

## Code Style

- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting (included in ESLint)

## When to Contribute

- Bug fixes
- New features
- Documentation improvements
- Test coverage

## Getting Help

- [GitHub Issues](https://github.com/semicons/semicons/issues)
- [GitHub Discussions](https://github.com/semicons/semicons/discussions)

## Next Steps

- [Releasing](/contributing/releasing) - Release process
- [Repository Structure](#repository-structure) - Explore packages
