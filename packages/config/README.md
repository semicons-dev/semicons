# @semicons/config

Shared configuration for Semicons monorepo and external projects.

## For External Projects

```bash
npm i -D @semicons/config typescript eslint prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react eslint-plugin-react-hooks
```

Then use as shown below.

## For Monorepo Development

The Semicons monorepo uses its own `tsconfig.base.json` for local development. External projects should use `@semicons/config` as shown above.

## Usage

### TypeScript

**packages/core/tsconfig.json** (Library):
```json
{
  "extends": "@semicons/config/tsconfig/lib.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**packages/react/tsconfig.json** (React App/Library):
```json
{
  "extends": "@semicons/config/tsconfig/app.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### ESLint (Flat Config)

**eslint.config.mjs**:
```javascript
import base from '@semicons/config/eslint/base.cjs';
import react from '@semicons/config/eslint/react.cjs';

export default [
  base,
  react
];
```

**For Astro projects**:
```javascript
import base from '@semicons/config/eslint/base.cjs';
import astro from '@semicons/config/eslint/astro.cjs';

export default [
  base,
  astro
];
```

### Prettier

**prettier.config.cjs**:
```javascript
module.exports = require('@semicons/config/prettier');
```

**prettier.config.mjs**:
```javascript
import prettierConfig from '@semicons/config/prettier';
export default prettierConfig;
```

## For External Projects

When publishing this config separately:

```bash
npm i -D @semicons/config typescript eslint prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react eslint-plugin-react-hooks
```

Then use as shown above.

## Extending Configs

Override rules in your project:

```javascript
// eslint.config.mjs
import base from '@semicons/config/eslint/base.cjs';

export default [{
  ...base,
  rules: {
    ...base.rules,
    '@typescript-eslint/no-explicit-any': 'off'
  }
}];
```

```json
// tsconfig.json
{
  "extends": "@semicons/config/tsconfig/app.json",
  "compilerOptions": {
    "strict": false
  }
}
```

## Available Exports

### TypeScript
- `@semicons/config/tsconfig/base.json` - Base strict config
- `@semicons/config/tsconfig/lib.json` - Library config (with declarations)
- `@semicons/config/tsconfig/app.json` - App config (with React JSX)

### ESLint
- `@semicons/config/eslint/base` - Base TypeScript rules
- `@semicons/config/eslint/react` - React specific rules
- `@semicons/config/eslint/astro` - Astro rules (TODO)

### Prettier
- `@semicons/config/prettier` - Prettier config object
