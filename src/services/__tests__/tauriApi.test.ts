import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { invokeWithErrorHandling } from '../tauriApi'
import { invoke } from '@tauri-apps/api'
import { getVersion } from '@tauri-apps/api/app'

// Mock the Tauri API modules
vi.mock('@tauri-apps/api', () => ({
  invoke: vi.fn(),
}))

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn(),
}))

describe('tauriApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully invoke a command', async () => {
    const mockResponse = { success: true }
    vi.mocked(invoke).mockResolvedValue(mockResponse)
    vi.mocked(getVersion).mockResolvedValue('1.0.0')

    const result = await invokeWithErrorHandling('test_command')
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error when command returns no data', async () => {
    vi.mocked(invoke).mockResolvedValue(null)
    vi.mocked(getVersion).mockResolvedValue('1.0.0')

    await expect(invokeWithErrorHandling('test_command')).rejects.toThrow(
      'Command test_command returned no data'
    )
  })

  it('should throw an error when command fails', async () => {
    const mockError = new Error('Command failed')
    vi.mocked(invoke).mockRejectedValue(mockError)
    vi.mocked(getVersion).mockResolvedValue('1.0.0')

    await expect(invokeWithErrorHandling('test_command')).rejects.toThrow('Command failed')
  })

  it('should throw an error when Tauri is not available', async () => {
    vi.mocked(getVersion).mockRejectedValue(new Error('Tauri not available'))

    await expect(invokeWithErrorHandling('test_command')).rejects.toThrow('Tauri API not available')
  })
})
