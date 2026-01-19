import {
  window,
  workspace,
  commands,
  type ExtensionContext,
  type Disposable,
} from 'vscode';
import { setupRegistryWatcher, refreshAllRegistries } from './registry/watcher';
import { getAllRegistries } from './registry/cache';
import { registerCompletionProvider } from './features/completion';
import { registerHoverProvider } from './features/hover';
import { registerDiagnosticsProvider, DiagnosticsManager } from './features/diagnostics';
import { registerCommands } from './features/commands';

let diagnosticsManager: DiagnosticsManager | null = null;
const disposables: Disposable[] = [];

export async function activate(context: ExtensionContext): Promise<void> {
  // Initial registry load
  await refreshAllRegistries();
  
  // Setup file watcher
  setupRegistryWatcher();
  
  // Register features
  disposables.push(registerCompletionProvider());
  disposables.push(registerHoverProvider());
  
  diagnosticsManager = new DiagnosticsManager();
  disposables.push(registerDiagnosticsProvider(diagnosticsManager));
  disposables.push(registerCommands());
  
  // Show welcome message
  const registries = await getAllRegistries();
  if (registries.length > 0) {
    window.setStatusBarMessage('Semicons loaded', 3000);
  } else {
    window.showWarningMessage(
      'Semicons: No registry found. Run "pnpm semicons generate" to create registry.json',
      'Generate Now'
    ).then((action) => {
      if (action === 'Generate Now') {
        commands.executeCommand('workbench.action.terminal.runSelectedText');
      }
    });
  }
  
  // Subscribe to document changes for diagnostics
  workspace.onDidChangeTextDocument((event) => {
    if (diagnosticsManager) {
      diagnosticsManager.updateDocument(event.document);
    }
  });
  
  // Subscribe to active editor changes
  window.onDidChangeActiveTextEditor((editor) => {
    if (editor && diagnosticsManager) {
      diagnosticsManager.updateDocument(editor.document);
    }
  });
  
  context.subscriptions.push({
    dispose: () => {
      for (const d of disposables) {
        d.dispose();
      }
      disposables.length = 0;
      if (diagnosticsManager) {
        diagnosticsManager.dispose();
        diagnosticsManager = null;
      }
    },
  });
}

export function deactivate(): void {
  // Cleanup handled by subscriptions
}
