import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getHardwareInfo, calculateSystemResources } from '../hardwareService'
import { invoke } from '../tauriApi'

// Mock the Tauri invoke function
vi.mock('../tauriApi', () => ({
  invoke: vi.fn(),
}))

describe('Hardware Service', () => {
  const mockHardwareInfo = {
    cpuCount: 8,
    cpuBrand: 'Intel Core i7',
    memoryTotal: 16 * 1024 * 1024,
    memoryUsed: 8 * 1024 * 1024,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(invoke).mockResolvedValue(mockHardwareInfo)
  })

  describe('Data Validation', () => {
    it('should reject invalid CPU count with validation error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({ ...mockHardwareInfo, cpuCount: 0 })
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU count')
    })

    it('should reject empty CPU brand with validation error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({ ...mockHardwareInfo, cpuBrand: '' })
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU brand')
    })

    it('should reject zero memory values with validation error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({ ...mockHardwareInfo, memoryTotal: 0 })
      await expect(getHardwareInfo()).rejects.toThrow('Invalid total memory')
    })

    it('should reject when used memory exceeds total memory', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({
        ...mockHardwareInfo,
        memoryTotal: 1024,
        memoryUsed: 2048,
      })
      await expect(getHardwareInfo()).rejects.toThrow('Used memory exceeds total memory')
    })
  })

  describe('Type Safety', () => {
    it('should reject non-integer CPU count with validation error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({ ...mockHardwareInfo, cpuCount: 3.14 })
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU count')
    })

    it('should reject non-numeric memory values with validation error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({ ...mockHardwareInfo, memoryTotal: '1024' })
      await expect(getHardwareInfo()).rejects.toThrow('Invalid total memory')
    })

    it('should reject missing required properties with validation error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce({ cpuCount: 8 })
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU brand')
    })
  })

  describe('getHardwareInfo', () => {
    it('should fetch hardware info successfully', async () => {
      const result = await getHardwareInfo()
      expect(result).toEqual(mockHardwareInfo)
      expect(invoke).toHaveBeenCalledWith('get_hardware_info')
    })

    it('should reject null response with error', async () => {
      vi.mocked(invoke).mockResolvedValueOnce(null)
      await expect(getHardwareInfo()).rejects.toThrow('Failed to retrieve hardware information')
    })

    it('should propagate invoke errors', async () => {
      const error = new Error('Invoke failed')
      vi.mocked(invoke).mockRejectedValueOnce(error)
      await expect(getHardwareInfo()).rejects.toThrow(error.message)
    })
  })

  describe('calculateSystemResources', () => {
    it('should calculate system resources correctly', () => {
      const result = calculateSystemResources(mockHardwareInfo)
      expect(result.totalMemoryGB).toBe(16)
      expect(result.usedMemoryGB).toBe(8)
      expect(result.memoryUsagePercentage).toBe(50)
    })

    it('should reject invalid memory information', () => {
      const invalidInfo = { ...mockHardwareInfo, memoryTotal: 0 }
      expect(() => calculateSystemResources(invalidInfo)).toThrow()
    })

    it('should round values to 2 decimal places', () => {
      const unevenInfo = {
        ...mockHardwareInfo,
        memoryTotal: Math.round(15.7777 * 1024 * 1024),
        memoryUsed: Math.round(7.8888 * 1024 * 1024),
      }
      const result = calculateSystemResources(unevenInfo)
      expect(result.totalMemoryGB.toString()).toMatch(/^\d+(\.\d{1,2})?$/)
      expect(result.usedMemoryGB.toString()).toMatch(/^\d+(\.\d{1,2})?$/)
      expect(result.memoryUsagePercentage.toString()).toMatch(/^\d+(\.\d{1})?$/)
    })
  })
})
