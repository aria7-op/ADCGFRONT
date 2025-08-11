import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/postcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'adcgmis-host',
      remotes: {
        'attendance-module': 'http://localhost:3003/assets/remoteEntry.js',
        'finance-module': 'http://localhost:3004/assets/remoteEntry.js',
        'ai-module': 'http://localhost:3005/assets/remoteEntry.js',
        'admin-module': 'http://localhost:3006/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        minifyInternalExports: false
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
