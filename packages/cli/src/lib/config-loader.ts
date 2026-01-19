import { cosmiconfig } from 'cosmiconfig';
import { normalizeConfig, type NormalizedRegistry, type RegistryConfigInput, type NormalizeWarning, type NormalizeOptions } from '@semicons/core';

export interface LoadConfigResult {
  config: RegistryConfigInput;
  registry: NormalizedRegistry;
  warnings: NormalizeWarning[];
  filepath: string;
}

export async function loadConfig(configPath?: string, options?: NormalizeOptions): Promise<LoadConfigResult> {
  const explorer = cosmiconfig('semicons', {
    searchPlaces: [
      'semicons.config.mjs',
      'semicons.config.js',
      'semicons.config.json'
    ],
    loaders: {
      '.mjs': async (filepath: string, content: string) => {
        const module = await import(filepath);
        return module.default || module;
      },
      '.js': async (filepath: string, content: string) => {
        const module = await import(filepath);
        return module.default || module;
      },
      '.json': (filepath: string, content: string) => JSON.parse(content)
    }
  });

  const result = configPath
    ? await explorer.load(configPath)
    : await explorer.search();

  if (!result) {
    throw new Error('No semicons config found. Create semicons.config.mjs/js/json');
  }

  const { registry, warnings } = normalizeConfig(result.config as RegistryConfigInput, options);

  return {
    config: result.config as RegistryConfigInput,
    registry,
    warnings,
    filepath: result.filepath
  };
}
