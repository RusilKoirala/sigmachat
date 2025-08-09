import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.argv': '[]',
    'process.platform': '"browser"',
    'process.version': '"v16.0.0"'
  },
  resolve: {
    alias: {
      process: 'process/browser',
      buffer: 'buffer',
      util: 'util'
    }
  },
  optimizeDeps: {
    include: ['bhailang', 'process', 'buffer', 'util'],
    exclude: []
  },
  build: {
    commonjsOptions: {
      include: [/bhailang/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          process: 'process'
        }
      }
    }
  }
});