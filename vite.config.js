import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        prototype2: resolve(__dirname, '02.html'),
        prototype3: resolve(__dirname, '03.html'),
      },
    },
  },
})
