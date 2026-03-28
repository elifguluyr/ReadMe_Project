import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://readme-api-m7pb.onrender.com',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})