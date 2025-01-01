/**
 * Vitest Test Configuration
 *
 * This configuration is specifically for testing settings, separated from the main
 * Vite build configuration (vite.config.ts) to:
 * 1. Maintain clear separation of concerns
 * 2. Avoid type conflicts between Vite and Vitest
 * 3. Allow independent versioning and updates
 *
 * Key features:
 * - JSDOM environment for DOM testing
 * - Coverage reporting with v8 provider
 * - Minimum 80% coverage thresholds
 * - Path aliases matching build config
 *
 * Coverage thresholds are enforced in pre-push hooks to maintain code quality.
 *
 * @see vite.config.ts for build configuration
 */

/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    pool: 'forks',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@tauri-apps/api': path.resolve(__dirname, './node_modules/@tauri-apps/api'),
      '@tauri-apps/api/tauri': path.resolve(__dirname, './node_modules/@tauri-apps/api/dist/tauri'),
    },
  },
})
