import { Uri, workspace } from 'vscode';
import type { AssetRef } from '../registry/types';
import { getSemiconsConfig } from './config';

export function parseAssetRef(assetRef: AssetRef): { namespace: string; id: string } | null {
  const match = assetRef.match(/^([^:]+):(.+)$/);
  if (!match) {
    return null;
  }
  return { namespace: match[1], id: match[2] };
}

export async function resolveAssetToFileUri(
  assetRef: AssetRef,
  folder: Uri
): Promise<Uri | null> {
  const parsed = parseAssetRef(assetRef);
  if (!parsed) {
    return null;
  }
  
  const { namespace, id } = parsed;
  
  if (namespace === 'local') {
    const config = getSemiconsConfig(folder);
    const filePath = `${config.localIconDir}/${id}.svg`;
    const fileUri = Uri.joinPath(folder, filePath);
    
    try {
      // Check if file exists
      await workspace.fs.stat(fileUri);
      return fileUri;
    } catch {
      return null;
    }
  }
  
  // For other namespaces (lucide, etc.), we can't resolve to local file
  return null;
}

export async function readSvgContent(fileUri: Uri): Promise<string | null> {
  try {
    const bytes = await workspace.fs.readFile(fileUri);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}
