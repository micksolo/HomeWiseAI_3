import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Tauri API', () => {
  const originalWindow = { ...window }
  const mockInvoke = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    window = { ...originalWindow }
  })

  afterEach(() => {
    window = { ...originalWindow }
    vi.clearAllMocks()
  })

  it('should throw error when Tauri API is not available', async () => {
    // Remove __TAURI__ from window
    window.__TAURI__ = undefined

    // Re-import the module to get fresh instance
    const { invoke } = await import('../tauriApi')

    await expect(invoke('test')).rejects.toThrow('Tauri API not available')
  })

  it('should use window.__TAURI__.invoke when available', async () => {
    // Mock successful response
    const mockResponse = { success: true }
    mockInvoke.mockResolvedValue(mockResponse)

    // Set up window.__TAURI__
    window.__TAURI__ = {
      invoke: mockInvoke,
    }

    // Re-import the module to get fresh instance
    const { invoke } = await import('../tauriApi')

    const result = await invoke('test', { param: 'value' })

    expect(mockInvoke).toHaveBeenCalledWith('test', { param: 'value' })
    expect(result).toEqual(mockResponse)
  })

  it('should handle invoke errors', async () => {
    // Mock error response
    const mockError = new Error('Invoke failed')
    mockInvoke.mockRejectedValue(mockError)

    // Set up window.__TAURI__
    window.__TAURI__ = {
      invoke: mockInvoke,
    }

    // Re-import the module to get fresh instance
    const { invoke } = await import('../tauriApi')

    await expect(invoke('test')).rejects.toThrow('Invoke failed')
  })
})
