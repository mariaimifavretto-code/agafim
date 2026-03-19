import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: node({
    mode: 'standalone',
    entrypointResolution: 'auto',
  }),
  integrations: [],
  vite: {
    ssr: {
      noExternal: ['@astrojs/internal-helpers']
    },
    resolve: {
      alias: {
        '@lib': '/src/lib',
        '../../lib/api': '/src/lib/api'
      }
    }
  }
});
