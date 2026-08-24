import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /* Three and GSAP are large and change far less often than the site
           itself, so they get their own long-lived cache entries instead of
           being re-downloaded with every copy tweak. */
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
