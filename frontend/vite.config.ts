import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: false, // Разрешить использовать другой порт, если 5173 занят
    host: '0.0.0.0', // Разрешить доступ по сети (localhost и IP адрес)
    cors: true, // Разрешить CORS для всех источников в dev режиме
  },
});


