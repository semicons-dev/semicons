export interface SemiconsEslintOptions {
  iconComponentName?: string;
  iconNameProp?: string;
  registryPath?: string;
}

export interface IconRegistry {
  tokens: Array<{
    name: string;
    category: string;
    path: string;
    deprecated?: boolean;
    replacement?: string;
    description?: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export const TOKEN_NAME_PATTERN = /^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;
