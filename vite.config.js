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
        'attendance-module': 'http://192.168.0.7:4003/assets/remoteEntry.js',
        'finance-module': 'http://192.168.0.7:4004/assets/remoteEntry.js',
        'ai-module': 'http://192.168.0.7:4005/assets/remoteEntry.js',
        'admin-module': 'http://192.168.0.7:4006/assets/remoteEntry.js'
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
