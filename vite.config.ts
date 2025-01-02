/**
 * Vite Build Configuration
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@services': resolve(__dirname, './src/services'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@types': resolve(__dirname, './src/types'),
      '@constants': resolve(__dirname, './src/constants'),
      '@layouts': resolve(__dirname, './src/layouts'),
    },
  },
  // Vite options tailored for Tauri development
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: ['es2021', 'chrome100', 'safari13'],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
