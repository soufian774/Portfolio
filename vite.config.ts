import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ottimizzazioni per SEO e performance
    rollupOptions: {
      output: {
        // Chunk splitting per better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-slot', '@radix-ui/react-separator'],
          icons: ['lucide-react'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    // Minificazione avanzata
    minify: 'terser',
    // Ottimizzazione assets
    assetsInlineLimit: 4096, // Inline assets < 4KB
    cssCodeSplit: true, // CSS code splitting
    sourcemap: false // Disabilita sourcemap in produzione
  },
  // Ottimizzazioni di development
  server: {
    open: true
  },
  // Preload ottimizzato
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})