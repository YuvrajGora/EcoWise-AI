import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

interface VitestConfigExport {
  test: {
    globals: boolean;
    environment: string;
    setupFiles: string;
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
} as import('vite').UserConfig & VitestConfigExport)
