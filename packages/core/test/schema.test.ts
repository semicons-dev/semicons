import { describe, it, expect } from 'vitest';
import { toRegistrySchema, toRegistryJSON } from '../src/schema.js';
import { normalizeConfig } from '../src/normalize.js';

describe('toRegistrySchema', () => {
  it('should include $schema pointing to 2020-12', () => {
    const schema = toRegistrySchema();
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
  });

  it('should have correct structure', () => {
    const schema = toRegistrySchema();
    expect(schema.$id).toBe('https://semicons.dev/schema/registry.json');
    expect(schema.title).toBe('Semicons Registry');
    expect(schema.type).toBe('object');
    expect(schema.required).toContain('tokens');
  });

  it('should define token name pattern', () => {
    const schema = toRegistrySchema();
    const tokenSchema = (schema.properties?.tokens as any)?.items;
    expect(tokenSchema.properties?.name?.pattern).toBeDefined();
  });

  it('should define assetRef pattern in themes', () => {
    const schema = toRegistrySchema();
    const themeSchema = (schema.properties?.tokens as any)?.items?.properties?.themes;
    expect(themeSchema.additionalProperties?.pattern).toBeDefined();
    expect(themeSchema.additionalProperties?.pattern).toBe('^[a-z][a-z0-9-]*:.+$');
  });
});

describe('toRegistryJSON', () => {
  it('should produce serializable output', () => {
    const { registry } = normalizeConfig({
      version: '1.0.0',
      tokens: { 'test:icon': 'local:test' }
    });
    const json = toRegistryJSON(registry);
    expect(() => JSON.stringify(json)).not.toThrow();
  });

  it('should include all required fields', () => {
    const { registry } = normalizeConfig({
      version: '1.0.0',
      tokens: { 'test:icon': 'local:test' }
    });
    const json = toRegistryJSON(registry);
    expect(json.version).toBe('1.0.0');
    expect(json.themes).toEqual(['light', 'dark']);
    expect(json.defaultTheme).toBe('light');
    expect(json.tokens).toHaveLength(1);
    expect(json.tokens[0].name).toBe('test:icon');
    expect(json.tokens[0].themes.light).toBe('local:test');
    expect(json.tokens[0].themes.dark).toBe('local:test');
  });

  it('should handle full token definitions', () => {
    const { registry } = normalizeConfig({
      version: '1.0.0',
      themes: ['light', 'dark'],
      defaultTheme: 'light',
      tokens: {
        'navigation:menu': {
          themes: { light: 'local:menu', dark: 'local:menu-dark' },
          a11y: { label: 'Menu' },
          meta: { category: 'navigation' }
        }
      }
    });
    const json = toRegistryJSON(registry);
    expect(json.tokens[0].a11y).toEqual({ label: 'Menu' });
    expect(json.tokens[0].meta).toEqual({ category: 'navigation' });
  });
});
