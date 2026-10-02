import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
  define: { "import.meta.env.VITE_APP_ENV": JSON.stringify((mode === "production" ? "production" : mode === "staging" ? "staging" : env.VITE_APP_ENV || "development")) },
  plugins: [react()],
  server: { port: 4173, proxy: { '/api': 'http://127.0.0.1:3001' } },
  preview: { port: 4173 },
}; });
