export type ThemeName = string;
export type TokenName = string;
export type AssetRef = string;
export type SemVer = string;

export interface ParsedAssetRef {
  raw: AssetRef;
  namespace: string;
  id: string;
}

export interface A11yMeta {
  label?: string;
  role?: 'img' | 'presentation';
  ariaHidden?: boolean;
}

export interface TokenMeta {
  category?: string;
  tags?: string[];
  deprecated?: boolean | SemVer;
  description?: string;
}

export interface TokenDefFull {
  themes: Record<ThemeName, AssetRef>;
  a11y?: A11yMeta;
  meta?: TokenMeta;
}

export type TokenDefInput =
  | AssetRef
  | Partial<Record<ThemeName, AssetRef>>
  | TokenDefFull;

export interface NormalizedToken {
  name: TokenName;
  themes: Record<ThemeName, AssetRef>;
  a11y: A11yMeta;
  meta: TokenMeta;
  deprecated?: SemVer;
}

export interface RegistryRules {
  enforceThemeCompleteness: boolean;
  allowUnknownTokens: boolean;
  validateAssetRef: boolean;
  allowedNamespaces: string[];
}

export interface RegistryConfigInput {
  version?: string;
  themes?: ThemeName[];
  defaultTheme?: ThemeName;
  tokens: Record<TokenName, TokenDefInput>;
  rules?: Partial<RegistryRules>;
}

export interface NormalizedRegistry {
  version: string;
  themes: ThemeName[];
  defaultTheme: ThemeName;
  tokens: NormalizedToken[];
  rules: RegistryRules;
}

export interface NormalizeWarning {
  code: string;
  message: string;
  fieldPath: string;
}

export interface NormalizeResult {
  registry: NormalizedRegistry;
  warnings: NormalizeWarning[];
}

export interface NormalizeOptions {
  onWarning?: (warning: NormalizeWarning) => void;
}
