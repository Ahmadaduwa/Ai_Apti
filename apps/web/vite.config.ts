import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  // Add resolver for path aliases
  resolve: {
    alias: {
      // Use fileURLToPath so aliases work in ESM + container environments
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
})
