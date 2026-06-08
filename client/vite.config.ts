import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({ eslint: { lintCommand: 'eslint "src/**/*.{ts,tsx}"' } }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
