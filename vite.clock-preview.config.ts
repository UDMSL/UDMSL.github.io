import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Isolated preview build; the homepage menu and production entry stay unchanged.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-clock-preview',
    rollupOptions: { input: 'exam-clock-preview.html' },
  },
})
