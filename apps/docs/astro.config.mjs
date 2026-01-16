import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://semicons-dev.github.io',
  output: 'static',
  server: {
    port: 3000,
    host: true
  }
});
