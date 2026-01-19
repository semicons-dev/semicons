import type { AssetRef } from './types.js';
import { SemiconsError } from './errors.js';

export const TOKEN_NAME_PATTERN = /^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;

export function validateTokenName(
  name: string
): { ok: true } | { ok: false; reason: string } {
  if (!name) return { ok: false, reason: 'Token name cannot be empty' };
  if (!TOKEN_NAME_PATTERN.test(name)) {
    return {
      ok: false,
      reason: 'Must be category:name format (e.g., "navigation:menu")'
    };
  }
  return { ok: true };
}

export function parseTokenName(name: string): {
  category: string;
  parts: string[];
} {
  const validation = validateTokenName(name);
  if (!validation.ok) {
    throw new SemiconsError(
      'INVALID_TOKEN_NAME',
      validation.reason,
      { fieldPath: `token.${name}` }
    );
  }
  const [category, ...rest] = name.split(':');
  return {
    category,
    parts: rest.join(':').split('-')
  };
}

export function validateAssetRef(
  raw: string,
  allowedNamespaces: string[]
): { ok: true } | { ok: false; reason: string } {
  if (!raw) return { ok: false, reason: 'AssetRef cannot be empty' };

  const colonIndex = raw.indexOf(':');
  if (colonIndex === -1) {
    return { ok: false, reason: 'AssetRef must contain namespace:id' };
  }

  const namespace = raw.slice(0, colonIndex);
  const id = raw.slice(colonIndex + 1);

  if (!namespace) {
    return { ok: false, reason: 'Namespace cannot be empty' };
  }

  if (!id) {
    return { ok: false, reason: 'ID cannot be empty' };
  }

  if (!/^[a-z][a-z0-9-]*$/.test(namespace)) {
    return {
      ok: false,
      reason: 'Namespace must be lowercase alphanumeric with hyphens'
    };
  }

  if (allowedNamespaces.length > 0 && !allowedNamespaces.includes(namespace)) {
    return {
      ok: false,
      reason: `Unknown namespace "${namespace}". Allowed: ${allowedNamespaces.join(', ')}`
    };
  }

  return { ok: true };
}

export function parseAssetRef(raw: string): {
  raw: AssetRef;
  namespace: string;
  id: string;
} {
  const colonIndex = raw.indexOf(':');
  if (colonIndex === -1) {
    throw new SemiconsError(
      'INVALID_ASSET_REF',
      'AssetRef must contain namespace:id',
      { fieldPath: `assetRef.${raw}` }
    );
  }

  const namespace = raw.slice(0, colonIndex);
  const id = raw.slice(colonIndex + 1);

  if (!namespace || !id) {
    throw new SemiconsError(
      'INVALID_ASSET_REF',
      'Namespace and ID cannot be empty',
      { fieldPath: `assetRef.${raw}` }
    );
  }

  return { raw, namespace, id };
}
