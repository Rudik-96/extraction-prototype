import { defineConfig } from 'vite';

export default defineConfig({
  // Относительные пути нужны, чтобы сборка открывалась внутри Capacitor.
  base: './',
  server: { port: 5173 },
  preview: { port: 4173 },
});
