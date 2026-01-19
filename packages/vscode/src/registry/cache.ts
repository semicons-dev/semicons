import { Uri, workspace, type Uri as VSCodeUri } from 'vscode';
import type { Registry } from './types';
import { loadRegistry } from './loader';

interface RegistryCache {
  [folderUri: string]: Registry | null | Promise<Registry | null>;
}

const cache: RegistryCache = {};

export async function getRegistryForFile(fileUri: VSCodeUri): Promise<Registry | null> {
  const folder = workspace.getWorkspaceFolder(fileUri);
  
  if (folder) {
    const folderKey = folder.uri.toString();
    
    if (!cache[folderKey]) {
      cache[folderKey] = await loadRegistry(folder.uri);
    }
    
    return cache[folderKey];
  }
  
  // Fallback: use first available registry
  const folders = workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    const firstFolder = folders[0];
    const firstKey = firstFolder.uri.toString();
    
    if (!cache[firstKey]) {
      cache[firstKey] = await loadRegistry(firstFolder.uri);
    }
    
    return cache[firstKey];
  }
  
  return null;
}

export async function getRegistryForFolder(folderUri: VSCodeUri): Promise<Registry | null> {
  const folderKey = folderUri.toString();

  if (!cache[folderKey]) {
    cache[folderKey] = await loadRegistry(folderUri);
  }

  return cache[folderKey] as Promise<Registry | null> | Registry | null;
}

export function setRegistry(folderUri: VSCodeUri, registry: Registry | null): void {
  const folderKey = folderUri.toString();
  cache[folderKey] = registry;
}

export function clearCache(): void {
  for (const key of Object.keys(cache)) {
    delete cache[key];
  }
}

export async function getAllRegistries(): Promise<Registry[]> {
  const registries: Registry[] = [];

  for (const value of Object.values(cache)) {
    if (value && !(value instanceof Promise)) {
      registries.push(value);
    }
  }

  return registries;
}
