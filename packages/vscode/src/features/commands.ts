import {
  commands,
  window,
  workspace,
  Uri,
  QuickPickItem,
  Disposable,
} from 'vscode';
import { getRegistryForFile, getAllRegistries } from '../registry/cache';
import { refreshAllRegistries } from '../registry/watcher';
import { PreviewWebview } from '../views/previewWebview';

const previewWebview = new PreviewWebview();

export function registerCommands(): Disposable {
  const disposables: Disposable[] = [];
  
  // Refresh Registry
  disposables.push(commands.registerCommand('semicons.refreshRegistry', async () => {
    await refreshAllRegistries();
    window.showInformationMessage('Semicons registry refreshed');
  }));
  
  // Search Token (QuickPick)
  disposables.push(commands.registerCommand('semicons.searchToken', async () => {
    const registries = await getAllRegistries();
    if (registries.length === 0) {
      window.showWarningMessage('No registry found. Run pnpm semicons generate first.');
      return;
    }
    
    // Collect all tokens from all registries
    const tokens: Array<{ name: string; registry: typeof registries[0]; folder?: Uri }> = [];
    
    for (const registry of registries) {
      if (registry && registry.tokens) {
        for (const token of registry.tokens) {
          tokens.push({ name: token.name, registry });
        }
      }
    }
    
    // Create QuickPick items
    const items: QuickPickItem[] = tokens.map((t) => ({
      label: t.name,
      detail: t.name.split(':')[0],
      description: t.registry.tokens.find((tok: { name: string }) => tok.name === t.name)?.meta.deprecated ? '(deprecated)' : undefined,
    }));
    
    // Show QuickPick
    const selected = await window.showQuickPick(items, {
      placeHolder: 'Search for an icon token...',
      matchOnDescription: true,
      matchOnDetail: true,
    });
    
    if (!selected) {
      return;
    }
    
    const tokenName = selected.label;
    
    // Find the registry and folder for this token
    let foundRegistry = null;
    let foundFolder: Uri | undefined;
    
    for (const folder of workspace.workspaceFolders || []) {
      const registry = await getRegistryForFile(folder.uri);
      if (registry?.tokens.some((t: { name: string }) => t.name === tokenName)) {
        foundRegistry = registry;
        foundFolder = folder.uri;
        break;
      }
    }
    
    if (!foundRegistry || !foundFolder) {
      window.showErrorMessage('Token registry not found');
      return;
    }
    
    const token = foundRegistry.tokens.find((t: { name: string }) => t.name === tokenName);
    if (!token) {
      return;
    }
    
    // Insert into active editor
    const editor = window.activeTextEditor;
    if (editor) {
      const insertText = `name="${tokenName}"`;
      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, insertText);
      });
    } else {
      // Copy to clipboard as fallback
      await commands.executeCommand('editor.action.clipboardCopyAction');
      window.showInformationMessage(`Token "${tokenName}" copied to clipboard`);
    }
  }));
  
  // Preview Icon
  disposables.push(commands.registerCommand('semicons.previewIcon', async (tokenName: string) => {
    if (!tokenName) {
      const editor = window.activeTextEditor;
      if (editor) {
        const token = await getTokenAtCursor(editor.document, editor.selection.active);
        if (token) {
          tokenName = token;
        }
      }
    }
    
    if (!tokenName) {
      window.showWarningMessage('No token found at cursor');
      return;
    }
    
    // Find the token in registries
    const registries = await getAllRegistries();

    for (const registry of registries) {
      if (registry?.tokens) {
        const token = registry.tokens.find((t: { name: string }) => t.name === tokenName);
        if (token) {
          // Find the folder
          const folder = workspace.workspaceFolders?.find(async (f) => {
            const allRegs = await getAllRegistries();
            const reg = allRegs.find((r: any) => r === registry);
            return reg !== undefined;
          });
          
          if (folder) {
            await previewWebview.show(token, registry, folder.uri);
            return;
          }
        }
      }
    }
    
    window.showErrorMessage(`Token "${tokenName}" not found in registry`);
  }));
  
  return Disposable.from(...disposables);
}

async function getTokenAtCursor(document: { getText: (range?: any) => string }, position: any): Promise<string | null> {
  const line = document.getText().split('\n')[position.line];
  const match = line.match(/name\s*=\s*["']([^"']+)["']/);
  return match ? match[1] : null;
}
