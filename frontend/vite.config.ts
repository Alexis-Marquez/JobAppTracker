import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config';
// @ts-ignore
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '/src/tests/setup.tsx',
  },
})
