import { describe, it, expect } from 'vitest';
import { normalizeConfig } from '../src/normalize.js';

describe('normalizeConfig', () => {
  it('should expand string shorthand to all themes', () => {
    const result = normalizeConfig({
      tokens: { 'test:icon': 'local:test' }
    });
    expect(result.registry.tokens[0].themes).toEqual({
      light: 'local:test',
      dark: 'local:test'
    });
  });

  it('should sort tokens by name', () => {
    const result = normalizeConfig({
      tokens: {
        'z:third': 'local:z',
        'a:first': 'local:a',
        'm:second': 'local:m'
      }
    });
    const names = result.registry.tokens.map((t) => t.name);
    expect(names).toEqual(['a:first', 'm:second', 'z:third']);
  });

  it('should throw when enforceThemeCompleteness=true and theme missing', () => {
    expect(() =>
      normalizeConfig({
        rules: { enforceThemeCompleteness: true },
        tokens: { 'test:icon': { themes: { light: 'local:test' } } }
      })
    ).toThrow();
  });

  it('should fallback to defaultTheme when enforceThemeCompleteness=false', () => {
    const result = normalizeConfig({
      rules: { enforceThemeCompleteness: false },
      tokens: { 'test:icon': { themes: { light: 'local:test' } } }
    });
    expect(result.registry.tokens[0].themes.dark).toBe('local:test');
  });

  it('should infer defaultTheme as light when available', () => {
    const result = normalizeConfig({
      tokens: { 'test:icon': 'local:test' }
    });
    expect(result.registry.defaultTheme).toBe('light');
  });

  it('should infer defaultTheme as first theme when light not available', () => {
    const result = normalizeConfig({
      themes: ['dark', 'dim'],
      tokens: { 'test:icon': 'local:test' }
    });
    expect(result.registry.defaultTheme).toBe('dark');
  });

  it('should warn about deprecated tokens', () => {
    const result = normalizeConfig({
      tokens: {
        'test:icon': {
          themes: {},
          meta: { deprecated: '2.0.0' }
        }
      }
    });
    expect(result.warnings.some((w) => w.code === 'TOKEN_DEPRECATED')).toBe(true);
  });

  it('should include onWarning callback invocations', () => {
    const warnings: any[] = [];
    normalizeConfig(
      { tokens: {} },
      { onWarning: (w) => warnings.push(w) }
    );
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('should provide default themes when not specified', () => {
    const result = normalizeConfig({
      tokens: { 'test:icon': 'local:test' }
    });
    expect(result.registry.themes).toEqual(['light', 'dark']);
  });

  it('should allow custom allowedNamespaces', () => {
    const result = normalizeConfig({
      rules: { allowedNamespaces: ['custom', 'local'] },
      tokens: { 'test:icon': { themes: { light: 'custom:test' } } }
    });
    expect(result.registry.rules.allowedNamespaces).toEqual(['custom', 'local']);
  });

  it('should preserve a11y and meta from full form', () => {
    const result = normalizeConfig({
      tokens: {
        'test:icon': {
          themes: { light: 'local:test', dark: 'local:test-dark' },
          a11y: { label: 'Test Icon', role: 'img' },
          meta: { category: 'test', description: 'A test icon' }
        }
      }
    });
    const token = result.registry.tokens[0];
    expect(token.a11y.label).toBe('Test Icon');
    expect(token.meta.category).toBe('test');
  });
});
