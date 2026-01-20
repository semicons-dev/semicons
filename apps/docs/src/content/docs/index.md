---
title: Semicons
description: A semantic icon registry and toolchain for design systems
template: splash
hero:
  tagline: Type-safe icons with semantic tokens. One source of truth for your design system.
  actions:
    - text: Get Started
      link: /getting-started/quickstart/
      icon: right-arrow
      variant: primary
    - text: View on GitHub
      link: https://github.com/semicons/semicons
      icon: external
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## What is Semicons?

Semicons is a **semantic icon registry** that maps human-readable tokens to icon assets. Instead of hardcoding icon names throughout your codebase, you use semantic tokens like `navigation:menu` or `status:error`.

<CardGrid>
  <Card title="Type-Safe" icon="pencil">
    Full TypeScript support with generated types for all your icons.
  </Card>
  <Card title="Framework Agnostic" icon="puzzle">
    Use with React, Vue, or any framework that supports SVG.
  </Card>
  <Card title="Themeable" icon="palette">
    Define light/dark variants or custom themes per token.
  </Card>
  <Card title="Tooling" icon="tool">
    CLI, ESLint rules, and VS Code extension included.
  </Card>
</CardGrid>

## Quick Start

```bash
# 1. Install CLI
pnpm add -D @semicons/cli

# 2. Initialize
npx @semicons/cli init

# 3. Generate icons
npx @semicons/cli generate

# 4. Use in your app
import { Icon } from '@semicons/react'
<Icon name="navigation:menu" />
```

## When to Use Semicons

- **Design systems** that need consistent icon naming across teams
- **Multi-theme applications** requiring light/dark icon variants
- **TypeScript projects** wanting compile-time icon validation
- **Large codebases** where icon refactoring is frequent

## When NOT to Use Semicons

- Simple projects with 1-5 icons (overhead not justified)
- Projects already using a complete icon library (Lucide, FontAwesome)
- Static sites with no build step requirement

## Next Steps

- [Quickstart Guide](/getting-started/quickstart) - Get up and running
- [CLI Reference](/cli/overview) - Explore CLI commands
- [Framework Guides](/frameworks/react) - Integrate with React or Vue
