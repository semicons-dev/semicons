# Semicons VS Code Extension

Semantic icon token system for VS Code - provides completion, hover, diagnostics, and preview for icon tokens.

## Features

- **Completion**: Auto-complete icon tokens in `<Icon name="...">` attributes
- **Hover**: Show token details on hover with preview command
- **Diagnostics**: Real-time validation of icon tokens
- **Preview**: Webview panel preview of icon tokens
- **Search**: QuickPick search for icon tokens

## Requirements

- VS Code 1.90.0+
- Node.js 20+

## Installation

### Development

```bash
cd packages/vscode
pnpm install
pnpm build
```

### Running in Extension Development Host

1. Press `F5` to launch Extension Development Host
2. Open a test workspace with a `semicons.config.ts` or run `pnpm semicons generate`
3. Test completion, hover, and diagnostics in `.tsx`, `.vue`, or `.astro` files

## Setup

### 1. Generate Icons

```bash
pnpm semicons generate
```

This creates `src/icons.generated/registry.json` in your workspace.

### 2. Configure VS Code Settings

The extension uses these settings (configurable in VS Code settings):

| Setting | Default | Description |
|---------|---------|-------------|
| `semicons.registryPath` | `src/icons.generated/registry.json` | Path to registry.json |
| `semicons.localIconDir` | `icons/local` | Directory for local icons |
| `semicons.iconComponentName` | `Icon` | Icon component name |

### 3. Icon File Structure

Local icons should be placed in `icons/local/` directory:

```
icons/
└── local/
    ├── menu.svg
    ├── menu-dark.svg
    └── close.svg
```

Reference them in your registry as `local:menu`, `local:menu-dark`, `local:close`.

## Usage

### Completion

In `.tsx`, `.vue`, or `.astro` files:

```tsx
<Icon name="nav|igation:menu" />
```

Type `navigation:` and select from completion list.

### Hover

Hover over a token to see:
- Token name
- Asset reference
- A11y label
- Preview command link

### Diagnostics

Invalid or deprecated tokens are highlighted:
- **Error**: Token not found or invalid format
- **Warning**: Deprecated token

### Preview

Run `Semicons: Preview Icon` command or click preview link in hover to open webview panel with icon preview.

### Search

Run `Semicons: Search Token` command to search and insert tokens via QuickPick.

## Commands

| Command | Description |
|---------|-------------|
| `semicons.refreshRegistry` | Refresh registry from disk |
| `semicons.searchToken` | Search and insert token |
| `semicons.previewIcon` | Preview token in webview |

## Supported File Types

- TypeScript React (`.tsx`)
- JavaScript React (`.jsx`)
- Vue (`.vue`)
- Astro (`.astro`)

## Development

### Build

```bash
pnpm build        # Production build
pnpm watch        # Development watch mode
```

### Debug

1. Press `F5` to start Extension Development Host
2. Open test workspace
3. Test features in real-time

### Project Structure

```
packages/vscode/
├── package.json          # Extension manifest
├── tsconfig.json
├── esbuild.js           # Bundler script
├── src/
│   ├── extension.ts     # Entry point
│   ├── registry/
│   │   ├── types.ts     # Type definitions
│   │   ├── loader.ts    # Load registry.json
│   │   ├── cache.ts     # Multi-folder cache
│   │   └── watcher.ts   # FileSystemWatcher
│   ├── features/
│   │   ├── completion.ts
│   │   ├── hover.ts
│   │   ├── diagnostics.ts
│   │   └── commands.ts
│   ├── views/
│   │   └── previewWebview.ts
│   └── utils/
│       ├── config.ts
│       ├── path.ts
│       └── tokenParse.ts
└── README.md
```

## Publishing

```bash
# Install vsce
npm install -g @vscode/vsce

# Package
vsce package

# Publish
vsce publish
```

## License

MIT
