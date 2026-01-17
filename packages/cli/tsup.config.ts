import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ['@semicons/core', 'commander', 'cosmiconfig', 'glob', 'svgo'],
  esbuildOptions(options) {
    options.outExtension = { '.js': '.mjs' };
  }
});
