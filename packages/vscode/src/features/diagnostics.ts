import {
  languages,
  Diagnostic,
  DiagnosticSeverity,
  Disposable,
  TextDocument,
  workspace,
} from 'vscode';
import { getRegistryForFile } from '../registry/cache';
import { findIconTokens, type TokenMatch } from '../utils/tokenParse';

const TOKEN_PATTERN = /^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;

export class DiagnosticsManager {
  private collection: ReturnType<typeof languages.createDiagnosticCollection>;
  private disposables: Disposable[] = [];

  constructor() {
    this.collection = languages.createDiagnosticCollection('semicons');
  }

  async updateDocument(document: TextDocument): Promise<void> {
    const registry = await getRegistryForFile(document.uri);

    const diagnostics: Diagnostic[] = [];
    const matches = findIconTokens(document);

    for (const match of matches) {
      const { name, range } = match;

      // Check if matches token pattern
      if (!TOKEN_PATTERN.test(name)) {
        diagnostics.push(new Diagnostic(
          range,
          `Invalid token format. Expected "category:name" (e.g., "navigation:menu")`,
          DiagnosticSeverity.Error
        ));
        continue;
      }

      // Check if token exists in registry
      if (!registry || !registry.tokens) {
        continue;
      }

      const token = registry.tokens.find((t: { name: string }) => t.name === name);

      if (!token) {
        diagnostics.push(new Diagnostic(
          range,
          `Icon token "${name}" not found in registry`,
          DiagnosticSeverity.Error
        ));
      } else if (token.meta.deprecated) {
        const deprecationMessage = typeof token.meta.deprecated === 'string'
          ? `Deprecated: ${token.meta.deprecated}`
          : 'This icon is deprecated';

        diagnostics.push(new Diagnostic(
          range,
          `⚠️ ${deprecationMessage}`,
          DiagnosticSeverity.Warning
        ));
      }
    }

    this.collection.set(document.uri, diagnostics);
  }

  clear(): void {
    this.collection.clear();
  }

  dispose(): void {
    this.collection.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}

export function registerDiagnosticsProvider(
  manager: DiagnosticsManager
): Disposable {
  const disposables: Disposable[] = [];

  const languagesToRegister = [
    'typescriptreact',
    'javascriptreact',
    'vue',
    'astro',
  ];

  for (const language of languagesToRegister) {
    const pattern = `**/*.${language === 'typescriptreact' || language === 'javascriptreact' ? 'tsx' : language === 'vue' ? 'vue' : 'astro'}`;
    const watcher = workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(async (uri) => {
      const document = await workspace.openTextDocument(uri);
      await manager.updateDocument(document);
    });
    disposables.push(watcher);
  }

  return Disposable.from(...disposables);
}
