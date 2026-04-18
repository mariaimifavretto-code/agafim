import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.agafim.org.br',
  base: '/',
  output: 'static',
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
