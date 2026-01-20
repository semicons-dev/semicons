import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://semicons.dev',
  integrations: [
    starlight({
      title: 'Semicons',
      social: [
        {
          label: 'GitHub',
          href: 'https://github.com/semicons/semicons',
          icon: 'github',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: 'Concepts',
          autogenerate: { directory: 'concepts' },
        },
        {
          label: 'CLI',
          autogenerate: { directory: 'cli' },
        },
        {
          label: 'Frameworks',
          autogenerate: { directory: 'frameworks' },
        },
        {
          label: 'Tooling',
          autogenerate: { directory: 'tooling' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        {
          label: 'Contributing',
          autogenerate: { directory: 'contributing' },
        },
      ],
    }),
  ],
});
