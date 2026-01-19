import {
  languages,
  MarkdownString,
  window,
  Hover,
  Disposable,
  type TextDocument,
  type Position,
  type CancellationToken,
  type ProviderResult,
} from 'vscode';
import { getRegistryForFile } from '../registry/cache';
import { getSemiconsConfig } from '../utils/config';
import { extractTokenNameAtPosition } from '../utils/tokenParse';

export function registerHoverProvider(): Disposable {
  const provider = languages.registerHoverProvider(
    [
      { language: 'typescriptreact' },
      { language: 'javascriptreact' },
      { language: 'vue' },
      { language: 'astro' },
    ],
    {
      async provideHover(
        document: TextDocument,
        position: Position,
        cancellationToken: CancellationToken
      ): Promise<Hover | null | undefined> {
        const registry = await getRegistryForFile(document.uri);

        if (!registry || !registry.tokens) {
          return null;
        }

        const tokenName = extractTokenNameAtPosition(document, position);

        if (!tokenName) {
          return null;
        }

        const foundToken = registry.tokens.find((t: { name: string }) => t.name === tokenName);

        if (!foundToken) {
          return null;
        }

        const markdown = new MarkdownString();
        markdown.isTrusted = true;

        const deprecated = foundToken.meta.deprecated;
        const theme = registry.defaultTheme;
        const assetRef = foundToken.themes[theme] || Object.values(foundToken.themes)[0];

        // Build hover content
        const lines: string[] = [];

        // Token name with deprecated marker
        if (deprecated) {
          lines.push(`~~${foundToken.name}~~ ⚠️`);
        } else {
          lines.push(`**${foundToken.name}**`);
        }

        // Asset ref
        lines.push(`\`${assetRef}\``);

        // A11y label
        if (foundToken.a11y?.label) {
          lines.push(`a11y: "${foundToken.a11y.label}"`);
        }

        // Tags
        if (foundToken.meta.tags && foundToken.meta.tags.length > 0) {
          lines.push(`tags: ${foundToken.meta.tags.join(', ')}`);
        }

        // Preview command
        const previewCommand = `[Preview icon](command:semicons.previewIcon?${encodeURIComponent(JSON.stringify([foundToken.name]))})`;
        lines.push('', previewCommand);

        markdown.value = lines.join('\n\n');

        return new Hover(markdown);
      },
    }
  );

  return provider;
}
