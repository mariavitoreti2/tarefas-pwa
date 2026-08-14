import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/tarefas-pwa/',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  plugins: [
    vue(),

    VitePWA({
      registerType: 'autoUpdate',

      // IMPORTANTE:
      // manda o VitePWA usar o nosso sw.js
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',

      injectManifest: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2}',
        ],
      },

      manifest: {
        name: 'Gerenciador de Tarefas',
        short_name: 'Tarefas',

        description:
          'Aplicativo PWA para gerenciar tarefas diárias',

        theme_color: '#4a90d9',

        background_color: '#ffffff',

        display: 'standalone',

        scope: '/tarefas-pwa/',

        start_url: '/tarefas-pwa/',

        icons: [
          {
            src: '/tarefas-pwa/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/tarefas-pwa/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/tarefas-pwa/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});