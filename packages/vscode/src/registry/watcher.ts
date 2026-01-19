import { workspace, Uri, Disposable } from 'vscode';
import { clearCache, setRegistry } from './cache';
import { loadRegistry, resolveRegistryPath } from './loader';

const watchers: Map<string, Disposable> = new Map();

export function setupRegistryWatcher(): void {
  const folders = workspace.workspaceFolders;
  if (!folders) {
    return;
  }
  
  for (const folder of folders) {
    const registryUri = resolveRegistryPath(folder.uri);
    const watcherKey = folder.uri.toString();
    
    if (watchers.has(watcherKey)) {
      continue;
    }
    
    const watcher = workspace.createFileSystemWatcher(
      registryUri.fsPath,
      false,
      false,
      false
    );
    
    watcher.onDidChange(async () => {
      const registry = await loadRegistry(folder.uri);
      setRegistry(folder.uri, registry);
    });
    
    watcher.onDidCreate(async () => {
      const registry = await loadRegistry(folder.uri);
      setRegistry(folder.uri, registry);
    });
    
    watcher.onDidDelete(() => {
      setRegistry(folder.uri, null);
    });
    
    watchers.set(watcherKey, watcher);
  }
}

export function disposeWatchers(): void {
  for (const disposable of watchers.values()) {
    disposable.dispose();
  }
  watchers.clear();
}

export function refreshAllRegistries(): Promise<void> {
  clearCache();
  
  const folders = workspace.workspaceFolders;
  if (!folders) {
    return Promise.resolve();
  }
  
  const promises = folders.map(async (folder) => {
    const registry = await loadRegistry(folder.uri);
    setRegistry(folder.uri, registry);
  });
  
  return Promise.all(promises).then(() => undefined);
}
