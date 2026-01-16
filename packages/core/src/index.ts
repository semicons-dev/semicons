export interface IconToken {
  name: string;
  svg: string;
  viewBox: string;
  width: number;
  height: number;
}

export interface IconCollection {
  name: string;
  tokens: IconToken[];
}

export interface IconRegistry {
  version: string;
  collections: IconCollection[];
}

export interface SchemaOutput {
  tokens: IconToken[];
  collections: string[];
  version: string;
}

export function generateSchema(tokens: IconToken[]): SchemaOutput {
  return {
    tokens,
    collections: [...new Set(tokens.map((t) => t.name.split('/')[0]))],
    version: '1.0.0',
  };
}

export function outputJSON(data: SchemaOutput): string {
  return JSON.stringify(data, null, 2);
}
