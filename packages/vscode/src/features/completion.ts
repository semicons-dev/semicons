import {
  languages,
  CompletionItem,
  CompletionItemKind,
  MarkdownString,
  Disposable,
  type TextDocument,
  type Position,
  type CancellationToken,
  type ProviderResult,
} from 'vscode';
import { getRegistryForFile } from '../registry/cache';
import { getSemiconsConfig } from '../utils/config';

export function registerCompletionProvider(): Disposable {
  const provider = languages.registerCompletionItemProvider(
    [
      { language: 'typescriptreact' },
      { language: 'javascriptreact' },
      { language: 'vue' },
      { language: 'astro' },
    ],
    {
      async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken
      ): Promise<CompletionItem[]> {
        const registry = await getRegistryForFile(document.uri);

        if (!registry || !registry.tokens) {
          return [];
        }

        const config = getSemiconsConfig();
        const iconName = config.iconComponentName;

        // Check if we're inside an Icon component
        const line = document.lineAt(position.line).text;
        const linePrefix = line.substring(0, position.character);

        // Match patterns like:
        // - <Icon name="
        // - <Icon name={" or <Icon name={
        // - :name=" (Vue)
        const iconPattern = new RegExp(`<${iconName}\\s+[^>]*name\\s*=\\s*["']`, 'g');
        const vuePattern = new RegExp(`:${iconName}\\s*:\\s*name\\s*=\\s*["']`, 'g');

        const isInIconName = iconPattern.test(linePrefix) || vuePattern.test(linePrefix);

        if (!isInIconName) {
          return [];
        }

        const items: CompletionItem[] = [];

        for (const token of registry.tokens) {
          const deprecated = token.meta.deprecated;
          const category = token.name.split(':')[0];

          const item = new CompletionItem(
            token.name,
            CompletionItemKind.EnumMember
          );

          // Detail shows category and deprecated status
          let detail = category;
          if (deprecated) {
            detail += ' (deprecated)';
          }
          item.detail = detail;

          // Documentation
          const docLines: string[] = [];

          if (token.a11y?.label) {
            docLines.push(`a11y: "${token.a11y.label}"`);
          }
          if (token.meta.description) {
            docLines.push(token.meta.description);
          }
          if (deprecated) {
            docLines.push(`⚠️ Deprecated: ${typeof deprecated === 'string' ? deprecated : 'This icon is deprecated'}`);
          }

          const doc = new MarkdownString();
          doc.value = docLines.join('\n\n');
          item.documentation = doc;

          // Insert text
          item.insertText = token.name;
          item.range = undefined; // Let VS Code auto-detect range

          items.push(item);
        }

        return items;
      },
    },
    '"', // Trigger on quote
    "'"  // Trigger on single quote
  );

  return provider;
}
