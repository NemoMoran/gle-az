import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Statische Website: `vite build` erzeugt die App, scripts/prerender.mjs schreibt danach
// jede Route als eigene HTML-Datei nach dist/ (siehe README.md, Routing und Hosting).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: false },
  build: { target: 'es2022', sourcemap: false },
})
