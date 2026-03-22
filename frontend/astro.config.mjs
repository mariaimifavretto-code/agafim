import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mariaimifavretto-code.github.io/agafim/',
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
