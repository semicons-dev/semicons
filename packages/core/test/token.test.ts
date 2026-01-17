import { describe, it, expect } from 'vitest';
import {
  validateTokenName,
  parseTokenName,
  validateAssetRef
} from '../src/token.js';

describe('validateTokenName', () => {
  it('should accept valid names', () => {
    expect(validateTokenName('navigation:menu').ok).toBe(true);
    expect(validateTokenName('alert:error').ok).toBe(true);
    expect(validateTokenName('a:b').ok).toBe(true);
    expect(validateTokenName('editor:bold-text').ok).toBe(true);
  });

  it('should reject empty', () => {
    expect(validateTokenName('').ok).toBe(false);
  });

  it('should reject invalid format', () => {
    expect(validateTokenName('invalid').ok).toBe(false);
    expect(validateTokenName('NoColon').ok).toBe(false);
    expect(validateTokenName('123:abc').ok).toBe(false);
    expect(validateTokenName('a:b:c').ok).toBe(false);
  });
});

describe('parseTokenName', () => {
  it('should parse category and parts', () => {
    expect(parseTokenName('navigation:menu')).toEqual({
      category: 'navigation',
      parts: ['menu']
    });
    expect(parseTokenName('editor:bold-text')).toEqual({
      category: 'editor',
      parts: ['bold', 'text']
    });
  });

  it('should throw on invalid', () => {
    expect(() => parseTokenName('invalid')).toThrow();
  });
});

describe('validateAssetRef', () => {
  it('should accept valid asset refs', () => {
    expect(validateAssetRef('local:menu', ['local', 'lucide']).ok).toBe(true);
    expect(validateAssetRef('lucide:trash-2', ['local', 'lucide']).ok).toBe(true);
    expect(validateAssetRef('custom:foo-bar', ['custom']).ok).toBe(true);
  });

  it('should reject empty', () => {
    expect(validateAssetRef('', ['local']).ok).toBe(false);
  });

  it('should reject missing colon', () => {
    expect(validateAssetRef('local', ['local']).ok).toBe(false);
  });

  it('should reject unknown namespace', () => {
    const result = validateAssetRef('unknown:foo', ['local', 'lucide']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('Unknown namespace');
    }
  });

  it('should allow all namespaces when allowedNamespaces is empty', () => {
    expect(validateAssetRef('any:thing', []).ok).toBe(true);
  });
});
