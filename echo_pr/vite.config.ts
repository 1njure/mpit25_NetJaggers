import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './src/shared/lib/router/routeTree.gen.ts',
      routesDirectory: './src/app/routes'
    }),
    react(),
    tsconfigPaths(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@assets': path.resolve(__dirname, './src/app/assets'),
      '@shared/dashboardItem': path.resolve(__dirname, './src/shared/ui/dashboardItem'),
    }
  },
  server: {
    port: 3000, 
    host: true, 
    open: true, 
    
    proxy: {
      '/api': {
        target: 'http://api:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true, 
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  },
  
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8000'),
      VITE_APP_NAME: JSON.stringify(process.env.VITE_APP_NAME || 'Auth App')
    }
  }
})