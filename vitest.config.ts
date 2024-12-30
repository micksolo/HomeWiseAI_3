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
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src-tauri/',
        'src/test/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/*',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@components', replacement: resolve(__dirname, 'src/components') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
      { find: '@services', replacement: resolve(__dirname, 'src/services') },
      { find: '@styles', replacement: resolve(__dirname, 'src/styles') },
      { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '@types', replacement: resolve(__dirname, 'src/types') },
      { find: '@constants', replacement: resolve(__dirname, 'src/constants') },
      { find: '@layouts', replacement: resolve(__dirname, 'src/layouts') },
    ],
  },
})
