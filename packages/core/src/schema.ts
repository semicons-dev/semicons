import type { NormalizedRegistry, AssetRef } from './types.js';

const ASSET_REF_PATTERN = '^[a-z][a-z0-9-]*:.+$';

export function toRegistrySchema(): object {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://semicons.dev/schema/registry.json',
    title: 'Semicons Registry',
    type: 'object',
    required: ['version', 'themes', 'defaultTheme', 'tokens'],
    properties: {
      version: { type: 'string' },
      themes: {
        type: 'array',
        items: { type: 'string' },
        uniqueItems: true
      },
      defaultTheme: { type: 'string' },
      tokens: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'themes'],
          properties: {
            name: {
              type: 'string',
              pattern: '^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$'
            },
            themes: {
              type: 'object',
              additionalProperties: {
                type: 'string',
                pattern: ASSET_REF_PATTERN
              }
            },
            a11y: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                role: { type: 'string', enum: ['img', 'presentation'] },
                ariaHidden: { type: 'boolean' }
              }
            },
            meta: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                deprecated: { type: ['boolean', 'string'] },
                description: { type: 'string' }
              }
            }
          }
        }
      }
    }
  };
}

export function toRegistryJSON(registry: NormalizedRegistry): object {
  return {
    version: registry.version,
    themes: registry.themes,
    defaultTheme: registry.defaultTheme,
    tokens: registry.tokens.map(token => ({
      name: token.name,
      themes: token.themes,
      ...(Object.keys(token.a11y).length > 0 && { a11y: token.a11y }),
      ...(Object.keys(token.meta).length > 0 && { meta: token.meta })
    }))
  };
}

export type { AssetRef };
