# @semicons/eslint-plugin

ESLint plugin for Semicons icon governance - enforce semantic token usage and prevent hardcoded SVGs.

## Installation

```bash
pnpm add -D @semicons/eslint-plugin eslint @typescript-eslint/parser
```

## Usage

### Flat Config (ESLint 9+)

```javascript
// eslint.config.mjs
import semicons from '@semicons/eslint-plugin';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@semicons': semicons,
    },
    extends: ['plugin:@semicons/recommended'],
    rules: {
      // Override default rules if needed
      '@semicons/valid-icon-token': [
        'error',
        {
          iconComponentName: 'Icon',
          iconNameProp: 'name',
          registryPath: './src/icons.generated/registry.json',
        },
      ],
    },
  },
];
```

## Rules

| Rule | Description | Default Level |
|------|-------------|---------------|
| `no-hardcoded-svg-import` | Disallow importing raw SVG files | error |
| `no-img-raw-svg` | Discourage using `<img>` with SVG sources | warn |
| `valid-icon-token` | Validate Icon token names against pattern and registry | error |

## Options

### valid-icon-token

```typescript
interface SemiconsEslintOptions {
  iconComponentName?: string;  // default: "Icon"
  iconNameProp?: string;       // default: "name"
  registryPath?: string;       // e.g., "./src/icons.generated/registry.json"
}
```

### Token Name Pattern

Icon tokens must match: `^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$`

Example: `navigation:menu`, `action:edit`, `category:icon-name`

## License

MIT
