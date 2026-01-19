import { Uri } from 'vscode';

export interface Registry {
  version: string;
  defaultTheme: string;
  themes: string[];
  tokens: Token[];
}

export interface Token {
  name: string;
  themes: Record<string, AssetRef>;
  meta: {
    deprecated?: boolean | string;
    description?: string;
    tags?: string[];
  };
  a11y?: {
    label?: string;
    description?: string;
  };
}

export type AssetRef = string; // e.g., "local:menu", "lucide:github"

export interface TokenCompletionItem {
  label: string;
  detail: string;
  documentation: string;
  deprecated: boolean | string;
  category?: string;
}

export interface IconComponentInfo {
  name: string;
  nameProp: string;
  uri: Uri;
}
