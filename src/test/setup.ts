import '@testing-library/jest-dom'
import { afterEach, beforeEach, vi } from 'vitest'
import { invoke } from './mocks/tauriModule'
import { cleanup } from '@testing-library/react'

// Mock CSS imports
vi.mock('*.css', () => ({}))

// Mock Tauri API
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke,
  default: { invoke },
}))

// Set up test environment
process.env.NODE_ENV = 'test'

// Mock window.__TAURI__ for testing
Object.defineProperty(window, '__TAURI__', {
  value: {
    invoke,
  },
  writable: true,
})

// Cleanup after each test
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
