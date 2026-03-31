import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  /** GitHub Pages (projeto): `VITE_BASE_PATH=/nome-do-repo/` no CI. Local: `/`. */
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
