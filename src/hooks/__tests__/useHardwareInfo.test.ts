import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useHardwareInfo } from '../useHardwareInfo'
import { getHardwareInfo } from '../../services/hardwareService'
import { StrictMode } from 'react'
import { act } from '@testing-library/react'

// Mock the hardware service
vi.mock('../../services/hardwareService', () => ({
  getHardwareInfo: vi.fn(),
  calculateSystemResources: vi.fn().mockReturnValue({
    memoryUsagePercentage: 50,
    totalMemoryGB: 16,
    usedMemoryGB: 8,
  }),
}))

const renderHookInStrictMode = <T>(callback: () => T) => {
  return renderHook(callback, {
    wrapper: StrictMode,
  })
}

describe('useHardwareInfo', () => {
  const mockHardwareInfo = {
    cpuCount: 8,
    cpuBrand: 'Intel Core i7',
    memoryTotal: 16 * 1024 * 1024,
    memoryUsed: 8 * 1024 * 1024,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.mocked(getHardwareInfo).mockResolvedValue(mockHardwareInfo)
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('should fetch hardware info on mount', async () => {
    const { result } = renderHookInStrictMode(() => useHardwareInfo())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.hardwareInfo).toBeNull()

    // Wait for the initial fetch
    await act(async () => {
      await Promise.resolve() // Flush microtasks
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.hardwareInfo).toEqual(mockHardwareInfo)
    expect(result.current.error).toBeNull()
  }, 10000)

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch')
    vi.mocked(getHardwareInfo).mockRejectedValue(error)

    const { result } = renderHookInStrictMode(() => useHardwareInfo())

    // Wait for the error to be handled
    await act(async () => {
      await Promise.resolve() // Flush microtasks
      vi.advanceTimersByTime(0)
      await Promise.resolve() // Flush microtasks again to ensure state updates are processed
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(error)
    expect(result.current.hardwareInfo).toBeNull()
  }, 10000)

  it('should not poll during tests', async () => {
    const { result } = renderHookInStrictMode(() => useHardwareInfo())

    // Wait for initial fetch
    await act(async () => {
      await Promise.resolve() // Flush microtasks
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isLoading).toBe(false)

    // Clear the initial call
    vi.mocked(getHardwareInfo).mockClear()

    // Advance time - should not trigger polling in test environment
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(getHardwareInfo).not.toHaveBeenCalled()
  }, 10000)

  it('should allow manual refresh', async () => {
    const { result } = renderHookInStrictMode(() => useHardwareInfo())

    // Wait for initial fetch
    await act(async () => {
      await Promise.resolve() // Flush microtasks
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isLoading).toBe(false)

    // Clear the initial call
    vi.mocked(getHardwareInfo).mockClear()

    // Trigger manual refresh
    await act(async () => {
      await result.current.refresh()
    })

    expect(getHardwareInfo).toHaveBeenCalledTimes(1)
  }, 10000)
})