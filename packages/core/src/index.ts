export * from './types.js';
export * from './errors.js';
export {
  validateTokenName,
  parseTokenName,
  validateAssetRef,
  parseAssetRef
} from './token.js';
export {
  getAssetRefNamespace,
  isLocalAssetRef,
  extractLocalId,
  extractAssetRefId,
  filterLocalTokens,
  getTokenAssetRefs,
  getLocalAssetRefs
} from './asset.js';
export { toRegistrySchema, toRegistryJSON } from './schema.js';

import type { NormalizedRegistry, NormalizedToken } from './types.js';

export type { NormalizedRegistry, NormalizedToken };

export function listTokenNames(registry: NormalizedRegistry): string[] {
  return registry.tokens.map((t) => t.name);
}

export function getToken(
  registry: NormalizedRegistry,
  name: string
): NormalizedToken | undefined {
  return registry.tokens.find((t) => t.name === name);
}

export function createExampleRegistry(): NormalizedRegistry {
  const { registry } = normalizeConfig({
    version: '0.0.0',
    tokens: {
      'navigation:menu': {
        themes: { light: 'local:menu-light', dark: 'local:menu-dark' },
        a11y: { label: 'Menu' },
        meta: { category: 'navigation', description: 'Open menu' }
      },
      'alert:error': {
        themes: { light: 'local:error-light', dark: 'local:error-dark' },
        a11y: { role: 'img', label: 'Error' },
        meta: { tags: ['danger', 'status'], deprecated: '2.0.0' }
      },
      'editor:bold': {
        themes: { light: 'lucide:bold', dark: 'lucide:bold' },
        a11y: { label: 'Bold' },
        meta: { category: 'editor' }
      }
    }
  });
  return registry;
}

import { normalizeConfig } from './normalize.js';
export { normalizeConfig };
