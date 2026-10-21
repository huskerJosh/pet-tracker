/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, proxy: { '/api': 'http://localhost:4000' } },
  test: { environment: 'jsdom', globals: true, include: ['__tests__/**/*.test.{ts,tsx}'], setupFiles: ['./__tests__/setupTests.ts'] },
});
