import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@fortawesome/free-solid-svg-icons'],
  },
  server: {
    proxy: {
      '/api': 'https://tala-web-kohl.vercel.app/'
    },
  }
});
