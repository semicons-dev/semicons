import { describe, it, expect } from 'vitest';
import {
  listTokenNames,
  getToken,
  createExampleRegistry,
  normalizeConfig
} from '../src/index.js';
import { SemiconsError } from '../src/errors.js';

describe('listTokenNames', () => {
  it('should return array of token names', () => {
    const registry = createExampleRegistry();
    const names = listTokenNames(registry);
    expect(names).toEqual(['alert:error', 'editor:bold', 'navigation:menu']);
  });

  it('should return empty array for empty registry', () => {
    const { registry } = normalizeConfig({ tokens: {} });
    const names = listTokenNames(registry);
    expect(names).toEqual([]);
  });

  it('should return names in sorted order', () => {
    const { registry } = normalizeConfig({
      tokens: {
        'z:third': 'local:z',
        'a:first': 'local:a',
        'm:second': 'local:m'
      }
    });
    const names = listTokenNames(registry);
    expect(names).toEqual(['a:first', 'm:second', 'z:third']);
  });
});

describe('getToken', () => {
  it('should return token when exists', () => {
    const registry = createExampleRegistry();
    const token = getToken(registry, 'navigation:menu');
    expect(token).toBeDefined();
    expect(token?.name).toBe('navigation:menu');
    expect(token?.a11y.label).toBe('Menu');
  });

  it('should return undefined when token not found', () => {
    const registry = createExampleRegistry();
    const token = getToken(registry, 'nonexistent:icon');
    expect(token).toBeUndefined();
  });

  it('should return token with all properties', () => {
    const registry = createExampleRegistry();
    const token = getToken(registry, 'alert:error');
    expect(token).toBeDefined();
    expect(token?.themes.light).toBe('local:error-light');
    expect(token?.meta.tags).toEqual(['danger', 'status']);
    expect(token?.meta.deprecated).toBe('2.0.0');
  });
});

describe('createExampleRegistry', () => {
  it('should create a valid registry', () => {
    const registry = createExampleRegistry();
    expect(registry.version).toBe('0.0.0');
    expect(registry.themes).toContain('light');
    expect(registry.themes).toContain('dark');
    expect(registry.defaultTheme).toBe('light');
  });

  it('should contain expected tokens', () => {
    const registry = createExampleRegistry();
    expect(registry.tokens).toHaveLength(3);

    const names = listTokenNames(registry);
    expect(names).toContain('navigation:menu');
    expect(names).toContain('alert:error');
    expect(names).toContain('editor:bold');
  });

  it('should have correct metadata for each token', () => {
    const registry = createExampleRegistry();

    const menuToken = getToken(registry, 'navigation:menu');
    expect(menuToken?.a11y.label).toBe('Menu');
    expect(menuToken?.meta.category).toBe('navigation');

    const errorToken = getToken(registry, 'alert:error');
    expect(errorToken?.a11y.role).toBe('img');
    expect(errorToken?.a11y.label).toBe('Error');
    expect(errorToken?.meta.deprecated).toBe('2.0.0');

    const boldToken = getToken(registry, 'editor:bold');
    expect(boldToken?.meta.category).toBe('editor');
  });
});

describe('SemiconsError', () => {
  it('should create error with code, message, and details', () => {
    const error = new SemiconsError(
      'INVALID_TOKEN_NAME',
      'Token name is invalid',
      { fieldPath: 'tokens.test.name' }
    );

    expect(error.name).toBe('SemiconsError');
    expect(error.code).toBe('INVALID_TOKEN_NAME');
    expect(error.message).toBe('Token name is invalid');
    expect(error.details.fieldPath).toBe('tokens.test.name');
  });

  it('should be instanceof Error', () => {
    const error = new SemiconsError(
      'TEST',
      'Test message',
      { fieldPath: 'test' }
    );
    expect(error instanceof Error).toBe(true);
  });

  it('should support optional tokenName in details', () => {
    const error = new SemiconsError(
      'MISSING_THEME',
      'Theme missing',
      { tokenName: 'test:icon', fieldPath: 'tokens.test:icon.themes' }
    );
    expect(error.details.tokenName).toBe('test:icon');
  });
});

describe('normalizeConfig edge cases', () => {
  it('should handle partial theme maps', () => {
    const result = normalizeConfig({
      themes: ['light', 'dark', 'dim'],
      tokens: {
        'test:icon': {
          themes: { light: 'local:light-only' }
        }
      }
    });

    expect(result.registry.tokens[0].themes.light).toBe('local:light-only');
    expect(result.registry.tokens[0].themes.dark).toBe('local:light-only');
    expect(result.registry.tokens[0].themes.dim).toBe('local:light-only');
  });

  it('should handle empty themes array', () => {
    const result = normalizeConfig({
      themes: [],
      tokens: { 'test:icon': 'local:test' }
    });

    expect(result.registry.themes).toContain('light');
    expect(result.registry.themes).toContain('dark');
  });

  it('should include warning for missing themes config', () => {
    const result = normalizeConfig({
      tokens: { 'test:icon': 'local:test' }
    });

    expect(result.warnings.some(w => w.code === 'MISSING_THEMES_CONFIG')).toBe(true);
  });

  it('should include warning for inferred defaultTheme', () => {
    const result = normalizeConfig({
      themes: ['dark'],
      tokens: { 'test:icon': 'local:test' }
    });

    expect(result.warnings.some(w => w.code === 'MISSING_DEFAULT_THEME')).toBe(true);
    expect(result.registry.defaultTheme).toBe('dark');
  });

  it('should validate asset refs and warn on invalid', () => {
    const result = normalizeConfig({
      tokens: {
        'test:icon': {
          themes: { light: 'invalid-no-namespace' }
        }
      }
    });

    expect(result.warnings.some(w => w.code === 'INVALID_ASSET_REF')).toBe(true);
  });

  it('should include theme fallback warning when strict mode is off', () => {
    const result = normalizeConfig({
      rules: { enforceThemeCompleteness: false },
      tokens: {
        'test:icon': {
          themes: { light: 'local:test' }
        }
      }
    });

    expect(result.warnings.some(w => w.code === 'THEME_FALLBACK')).toBe(true);
  });
});

describe('Schema validation edge cases', () => {
  it('should handle empty tokens array', () => {
    const result = normalizeConfig({ tokens: {} });
    const json = result.registry;

    expect(json.tokens).toHaveLength(0);
    expect(json.version).toBeDefined();
  });

  it('should preserve custom version string', () => {
    const { registry } = normalizeConfig({
      version: '2.5.1',
      tokens: { 'test:icon': 'local:test' }
    });

    expect(registry.version).toBe('2.5.1');
  });

  it('should include all default rules', () => {
    const { registry } = normalizeConfig({ tokens: {} });

    expect(registry.rules.enforceThemeCompleteness).toBe(false);
    expect(registry.rules.allowUnknownTokens).toBe(false);
    expect(registry.rules.validateAssetRef).toBe(true);
    expect(registry.rules.allowedNamespaces).toContain('local');
    expect(registry.rules.allowedNamespaces).toContain('lucide');
  });
});
