import { vi } from 'vitest'

// Mock Tauri invoke function for testing
export const invoke = vi.fn()

// Mock initialization function
export const initializeTauriApi = vi.fn().mockResolvedValue(undefined)
