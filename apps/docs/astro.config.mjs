import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://semicons.example.com',
  server: {
    port: 3000,
    host: true
  }
});
