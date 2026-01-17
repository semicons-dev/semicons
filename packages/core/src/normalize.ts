import type {
  RegistryConfigInput,
  NormalizedRegistry,
  NormalizedToken,
  NormalizeWarning,
  NormalizeOptions,
  TokenDefInput
} from './types.js';
import { SemiconsError } from './errors.js';
import { validateAssetRef } from './token.js';

const DEFAULT_THEMES = ['light', 'dark'] as const;
const DEFAULT_RULES = {
  enforceThemeCompleteness: false,
  allowUnknownTokens: false,
  validateAssetRef: true,
  allowedNamespaces: ['local', 'lucide'] as string[]
};

function resolveThemesAndDefaultTheme(
  input: RegistryConfigInput,
  warnings: NormalizeWarning[]
): { themes: string[]; defaultTheme: string } {
  let themes = input.themes;
  let defaultTheme = input.defaultTheme;

  if (!themes || themes.length === 0) {
    themes = [...DEFAULT_THEMES];
    warnings.push({
      code: 'MISSING_THEMES_CONFIG',
      message: 'No themes provided, defaulting to ["light", "dark"]',
      fieldPath: 'themes'
    });
  }

  if (!defaultTheme) {
    if (themes.includes('light')) {
      defaultTheme = 'light';
    } else {
      defaultTheme = themes[0];
    }
    warnings.push({
      code: 'MISSING_DEFAULT_THEME',
      message: `No defaultTheme provided, inferred as "${defaultTheme}"`,
      fieldPath: 'defaultTheme'
    });
  }

  return { themes, defaultTheme };
}

function isPartialThemeMap(
  def: TokenDefInput
): def is Partial<Record<string, string>> {
  return (
    typeof def === 'object' &&
    def !== null &&
    !('themes' in def)
  );
}

function expandTokenDef(
  tokenName: string,
  def: RegistryConfigInput['tokens'][string],
  themes: string[],
  defaultTheme: string,
  rules: typeof DEFAULT_RULES,
  warnings: NormalizeWarning[]
): NormalizedToken {
  let themesMap: Record<string, string> = {};
  let a11y = {};
  let meta = {};

  if (typeof def === 'string') {
    for (const theme of themes) {
      themesMap[theme] = def;
    }
  } else if (isPartialThemeMap(def)) {
    themesMap = Object.fromEntries(
      Object.entries(def).filter(([, v]) => v !== undefined)
    ) as Record<string, string>;
  } else {
    themesMap = { ...def.themes };
    if (def.a11y) a11y = def.a11y;
    if (def.meta) meta = def.meta;
  }

  const missingThemes = themes.filter(t => !(t in themesMap));
  if (missingThemes.length > 0) {
    if (rules.enforceThemeCompleteness) {
      throw new SemiconsError(
        'MISSING_THEME',
        `Missing themes: ${missingThemes.join(', ')}`,
        { tokenName, fieldPath: `tokens.${tokenName}.themes` }
      );
    }
    const fallbackAsset = themesMap[defaultTheme];
    if (fallbackAsset) {
      for (const theme of missingThemes) {
        themesMap[theme] = fallbackAsset;
        warnings.push({
          code: 'THEME_FALLBACK',
          message: `Theme "${theme}" not defined, falling back to "${defaultTheme}"`,
          fieldPath: `tokens.${tokenName}.themes.${theme}`
        });
      }
    }
  }

  if (rules.validateAssetRef) {
    for (const [theme, assetRef] of Object.entries(themesMap)) {
      const validation = validateAssetRef(assetRef, rules.allowedNamespaces);
      if (!validation.ok) {
        warnings.push({
          code: 'INVALID_ASSET_REF',
          message: `Invalid AssetRef for theme "${theme}": ${validation.reason}`,
          fieldPath: `tokens.${tokenName}.themes.${theme}`
        });
      }
    }
  }

  const tokenMeta = meta as { deprecated?: boolean | string };
  const deprecated = tokenMeta.deprecated;

  return {
    name: tokenName,
    themes: themesMap,
    a11y: a11y as NonNullable<NormalizedToken['a11y']>,
    meta: meta as NonNullable<NormalizedToken['meta']>,
    ...(typeof deprecated === 'string' && { deprecated })
  };
}

export function normalizeConfig(
  input: RegistryConfigInput,
  options: NormalizeOptions = {}
): { registry: NormalizedRegistry; warnings: NormalizeWarning[] } {
  const warnings: NormalizeWarning[] = [];
  const rules = { ...DEFAULT_RULES, ...input.rules } as typeof DEFAULT_RULES;

  const { themes, defaultTheme } = resolveThemesAndDefaultTheme(input, warnings);

  const normalizedTokens = Object.entries(input.tokens)
    .map(([name, def]) =>
      expandTokenDef(name, def, themes, defaultTheme, rules, warnings)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const token of normalizedTokens) {
    if (token.deprecated) {
      const version = typeof token.deprecated === 'string'
        ? ` (removed in ${token.deprecated})`
        : '';
      warnings.push({
        code: 'TOKEN_DEPRECATED',
        message: `Token "${token.name}" is deprecated${version}`,
        fieldPath: `tokens.${token.name}.meta.deprecated`
      });
    }
  }

  const registry: NormalizedRegistry = {
    version: input.version ?? '1.0.0',
    themes,
    defaultTheme,
    tokens: normalizedTokens,
    rules
  };

  for (const warning of warnings) {
    options.onWarning?.(warning);
  }

  return { registry, warnings };
}
