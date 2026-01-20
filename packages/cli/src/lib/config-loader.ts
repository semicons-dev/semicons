import { cosmiconfig } from 'cosmiconfig';
import { normalizeConfig, type NormalizedRegistry, type RegistryConfigInput, type NormalizeWarning, type NormalizeOptions } from '@semicons/core';

export interface LoadConfigResult {
  config: RegistryConfigInput;
  registry: NormalizedRegistry;
  warnings: NormalizeWarning[];
  filepath: string;
  isRemote: boolean;
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
    filepath: result.filepath,
    isRemote: false
  };
}

export async function loadRemoteConfig(url: string, options?: NormalizeOptions): Promise<LoadConfigResult> {
  console.log(`[config] Loading remote config from ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch remote config: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  let config: RegistryConfigInput;

  if (contentType.includes('application/json') || url.endsWith('.json')) {
    config = await response.json() as RegistryConfigInput;
  } else if (contentType.includes('application/javascript') || url.endsWith('.js') || url.endsWith('.mjs')) {
    const text = await response.text();
    const blob = new Blob([text], { type: 'application/javascript' });
    const moduleUrl = URL.createObjectURL(blob);
    const module = await import(moduleUrl);
    URL.revokeObjectURL(moduleUrl);
    config = (module as any).default || module;
  } else {
    throw new Error('Unsupported remote config format. Use JSON or JavaScript module.');
  }

  const { registry, warnings } = normalizeConfig(config, options);

  return {
    config,
    registry,
    warnings,
    filepath: url,
    isRemote: true
  };
}
