import { describe, it, expect } from 'vitest';
import {
  getAssetRefNamespace,
  isLocalAssetRef,
  extractLocalId,
  extractAssetRefId,
  filterLocalTokens,
  getTokenAssetRefs,
  getLocalAssetRefs,
  parseAssetRef
} from '../src/asset.js';

describe('getAssetRefNamespace', () => {
  it('should return namespace from valid asset ref', () => {
    expect(getAssetRefNamespace('local:menu')).toBe('local');
    expect(getAssetRefNamespace('lucide:trash-2')).toBe('lucide');
    expect(getAssetRefNamespace('custom:foo-bar')).toBe('custom');
  });

  it('should return null for invalid asset ref', () => {
    expect(getAssetRefNamespace('local')).toBe(null);
    expect(getAssetRefNamespace(':')).toBe('');
    expect(getAssetRefNamespace('')).toBe(null);
  });
});

describe('isLocalAssetRef', () => {
  it('should return true for local: refs', () => {
    expect(isLocalAssetRef('local:menu')).toBe(true);
    expect(isLocalAssetRef('local:alert-circle')).toBe(true);
  });

  it('should return false for non-local refs', () => {
    expect(isLocalAssetRef('lucide:trash')).toBe(false);
    expect(isLocalAssetRef('custom:foo')).toBe(false);
    expect(isLocalAssetRef('local')).toBe(false);
  });
});

describe('extractLocalId', () => {
  it('should extract id from local: ref', () => {
    expect(extractLocalId('local:menu')).toBe('menu');
    expect(extractLocalId('local:alert-circle')).toBe('alert-circle');
    expect(extractLocalId('local:trash-2')).toBe('trash-2');
  });

  it('should return null for non-local refs', () => {
    expect(extractLocalId('lucide:trash')).toBe(null);
    expect(extractLocalId('custom:foo')).toBe(null);
  });

  it('should return null for invalid refs', () => {
    expect(extractLocalId('local')).toBe(null);
    expect(extractLocalId('')).toBe(null);
  });
});

describe('extractAssetRefId', () => {
  it('should extract id from any asset ref', () => {
    expect(extractAssetRefId('local:menu')).toBe('menu');
    expect(extractAssetRefId('lucide:trash-2')).toBe('trash-2');
    expect(extractAssetRefId('figma:node-123')).toBe('node-123');
  });

  it('should return null for invalid refs', () => {
    expect(extractAssetRefId('local')).toBe(null);
    expect(extractAssetRefId('')).toBe(null);
  });
});

describe('filterLocalTokens', () => {
  const tokens = [
    { name: 'a:local-only', themes: { light: 'local:menu' } },
    { name: 'b:mixed', themes: { light: 'local:foo', dark: 'lucide:bar' } },
    { name: 'c:external-only', themes: { light: 'lucide:baz' } }
  ] as any[];

  it('should filter tokens with local: refs', () => {
    const result = filterLocalTokens(tokens);
    expect(result).toHaveLength(2);
    expect(result.map(t => t.name)).toEqual(['a:local-only', 'b:mixed']);
  });

  it('should return empty array when no local tokens', () => {
    const result = filterLocalTokens([tokens[2]]);
    expect(result).toHaveLength(0);
  });
});

describe('getTokenAssetRefs', () => {
  it('should return all theme-assetRef pairs', () => {
    const token = {
      name: 'test:icon',
      themes: { light: 'local:foo', dark: 'lucide:bar' }
    } as any;

    const result = getTokenAssetRefs(token);
    expect(result).toEqual([
      { theme: 'light', assetRef: 'local:foo' },
      { theme: 'dark', assetRef: 'lucide:bar' }
    ]);
  });
});

describe('getLocalAssetRefs', () => {
  it('should return only local: refs with extracted ids', () => {
    const token = {
      name: 'test:icon',
      themes: { light: 'local:foo', dark: 'lucide:bar', dim: 'local:baz' }
    } as any;

    const result = getLocalAssetRefs(token);
    expect(result).toEqual([
      { theme: 'light', id: 'foo' },
      { theme: 'dim', id: 'baz' }
    ]);
  });

  it('should return empty array when no local refs', () => {
    const token = {
      name: 'test:icon',
      themes: { light: 'lucide:bar' }
    } as any;

    const result = getLocalAssetRefs(token);
    expect(result).toEqual([]);
  });
});

describe('parseAssetRef', () => {
  it('should parse valid asset ref', () => {
    const result = parseAssetRef('local:menu');
    expect(result).toEqual({ raw: 'local:menu', namespace: 'local', id: 'menu' });
  });

  it('should throw for missing colon', () => {
    expect(() => parseAssetRef('local')).toThrow();
  });

  it('should throw for empty namespace or id', () => {
    expect(() => parseAssetRef(':menu')).toThrow();
    expect(() => parseAssetRef('local:')).toThrow();
  });
});
