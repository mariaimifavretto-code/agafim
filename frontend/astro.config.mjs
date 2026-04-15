import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://www.agafim.org.br',
  base: '/',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [],
  vite: {
    resolve: {
      alias: {
        '@lib': '/src/lib',
        '../../lib/api': '/src/lib/api'
      }
    }
  }
});
