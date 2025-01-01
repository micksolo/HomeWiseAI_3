import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Tauri's invoke function globally
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}))

// Add any other global test setup here
