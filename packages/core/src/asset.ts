import type { NormalizedToken } from './types.js';

export { parseAssetRef } from './token.js';

export function getAssetRefNamespace(assetRef: string): string | null {
  const colonIndex = assetRef.indexOf(':');
  if (colonIndex === -1) return null;
  return assetRef.slice(0, colonIndex);
}

export function isLocalAssetRef(assetRef: string): boolean {
  return assetRef.startsWith('local:');
}

export function extractLocalId(assetRef: string): string | null {
  if (!isLocalAssetRef(assetRef)) return null;
  const colonIndex = assetRef.indexOf(':');
  return colonIndex >= 0 ? assetRef.slice(colonIndex + 1) : assetRef;
}

export function extractAssetRefId(assetRef: string): string | null {
  const colonIndex = assetRef.indexOf(':');
  if (colonIndex === -1) return null;
  return assetRef.slice(colonIndex + 1);
}

export function filterLocalTokens(tokens: NormalizedToken[]): NormalizedToken[] {
  return tokens.filter(t =>
    Object.values(t.themes).some(a => isLocalAssetRef(a))
  );
}

export function getTokenAssetRefs(token: NormalizedToken): Array<{ theme: string; assetRef: string }> {
  return Object.entries(token.themes).map(([theme, assetRef]) => ({ theme, assetRef }));
}

export function getLocalAssetRefs(token: NormalizedToken): Array<{ theme: string; id: string }> {
  return Object.entries(token.themes)
    .filter(([, assetRef]) => isLocalAssetRef(assetRef))
    .map(([theme, assetRef]) => ({ theme, id: extractLocalId(assetRef)! }));
}
