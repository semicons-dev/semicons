import { Uri, workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import type { Registry } from './types';

export async function loadRegistry(folderUri: Uri): Promise<Registry | null> {
  const config = workspace.getConfiguration('semicons', folderUri);
  const registryPath = config.get<string>('registryPath', 'src/icons.generated/registry.json');
  
  const registryUri = Uri.joinPath(folderUri, registryPath);
  
  try {
    const document = await workspace.openTextDocument(registryUri);
    const content = document.getText();
    const registry = JSON.parse(content) as Registry;
    return registry;
  } catch (error) {
    return null;
  }
}

export function resolveRegistryPath(folderUri: Uri): Uri {
  const config = workspace.getConfiguration('semicons', folderUri);
  const registryPath = config.get<string>('registryPath', 'src/icons.generated/registry.json');
  return Uri.joinPath(folderUri, registryPath);
}
