import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Automatically cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Tauri API calls
vi.mock('@tauri-apps/api', () => ({
  invoke: vi.fn(),
  event: {
    listen: vi.fn(),
    emit: vi.fn(),
  },
}))

// Mock environment variables
vi.stubGlobal('VITE_APP_NAME', 'HomeWise AI (Test)')
vi.stubGlobal('VITE_APP_ENV', 'test')
