import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: node({
    mode: 'standalone',
    host: true,
    port: 4321
  }),
  integrations: [tailwind()],
  // ADICIONE ISSO AQUI:
  vite: {
    ssr: {
      noExternal: ['@astrojs/internal-helpers']
    }
  }
});
