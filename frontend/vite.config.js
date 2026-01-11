import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://127.0.0.1:8000',
      '/register': 'http://127.0.0.1:8000',
      '/upload': 'http://127.0.0.1:8000',
      '/files': 'http://127.0.0.1:8000',
      '/share': 'http://127.0.0.1:8000',
      '/folders': 'http://127.0.0.1:8000', 
    }
  }
})