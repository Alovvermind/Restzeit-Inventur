import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './'  // relativ, damit Ressourcen auch bei Subpfaden geladen werden
})
