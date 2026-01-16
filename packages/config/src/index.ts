export const baseTsconfig = {
  $schema: 'https://json.schemastore.org/tsconfig',
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext',
    moduleResolution: 'bundler',
    lib: ['ES2020'],
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    resolveJsonModule: true,
    isolatedModules: true,
  },
};

export const reactTsconfig = {
  ...baseTsconfig,
  compilerOptions: {
    ...baseTsconfig.compilerOptions,
    jsx: 'react-jsx',
    jsxImportSource: 'react',
  },
};
