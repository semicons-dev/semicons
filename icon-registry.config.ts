import { defineConfig } from '@semicons/cli';

export default defineConfig({
  outputDir: './src/icons.generated',
  collections: [
    {
      name: 'core',
      source: './icons/*.svg',
    },
  ],
});
