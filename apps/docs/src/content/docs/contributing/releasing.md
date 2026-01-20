---
title: Releasing
description: Semicons release process and versioning
---

This page documents the Semicons release process, versioning strategy, and publishing workflow.

## Overview

This page covers:
- Versioning strategy
- Changesets workflow
- GitHub Actions release pipeline
- Publishing to npm

## Versioning Strategy

Semicons follows [Semantic Versioning](https://semver.org/):

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **patch**: Bug fixes (backward compatible)

## Changesets Workflow

### 1. Add Changeset

Before merging to main, add a changeset:

```bash
pnpm changeset
```

Select packages and version bump type:

```
? Which packages have changed? @semicons/cli
? What kind of change is it for @semicons/cli? patch
? Summary of changes? Fix SVG optimization edge case
```

This creates `.changeset/<name>.md`:

```markdown
---
'@semicons/cli': patch
---

Fix SVG optimization edge case
```

### 2. Commit and Push

```bash
git add .
git commit -m "feat(cli): add SVG optimization fix"
git push
```

### 3. Create PR

Open a PR with the changeset. The Changeset bot will comment on the PR.

### 4. Merge to Main

When merged, the Changeset bot creates a Version PR:

```
Version Packages (main)
├── @semicons/cli@1.2.3
├── @semicons/react@1.2.3
└── @semicons/vue@1.2.3
```

### 5. Merge Version PR

Merge the Version PR to trigger release.

## GitHub Actions Workflow

### CI Pipeline

`.github/workflows/ci.yml` runs on every PR:

```yaml
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
```

### Release Pipeline

`.github/workflows/release.yml`:

```yaml
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: pnpm install
      - run: pnpm build
      - run: pnpm npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Manual Release

```bash
# Bump version
pnpm changeset version

# Build all packages
pnpm build

# Publish to npm
pnpm npm publish --access public
```

## Release Checklist

- [ ] All tests pass
- [ ] No lint errors
- [ ] Type check passes
- [ ] Changelog updated
- [ ] Version PR reviewed
- [ ] Release notes drafted

## When to Release

- **patch**: Bug fixes, security patches
- **Minor**: New features, improvements
- **Major**: Breaking changes

## Common Issues

### Changeset not detected

**Solution**: Ensure changeset file is in `.changeset/` and committed.

### npm publish fails

**Solution**: Verify NPM_TOKEN is set in GitHub secrets.

### Version conflicts

**Solution**: Ensure all PRs have unique changesets.

## Next Steps

- [Contributing Overview](/contributing/overview) - Contribution guide
- [Repository Structure](/contributing/overview#repository-structure) - Package details
