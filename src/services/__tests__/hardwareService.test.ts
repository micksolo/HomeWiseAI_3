import { describe, it, expect, vi } from 'vitest'
import { getHardwareInfo, calculateSystemResources } from '../hardwareService'
import { invokeWithErrorHandling } from '../tauriApi'

vi.mock('../tauriApi', () => ({
  invokeWithErrorHandling: vi.fn(),
}))

describe('Hardware Service', () => {
  describe('Data Validation', () => {
    it('should reject invalid CPU count with validation error', async () => {
      const mockInfo = {
        cpuCount: 0,
        cpuBrand: 'Test CPU',
        memoryTotal: 8388608, // 8GB in KB
        memoryUsed: 4194304, // 4GB in KB
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU count')
    })

    it('should reject empty CPU brand with validation error', async () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: '',
        memoryTotal: 8388608,
        memoryUsed: 4194304,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU brand')
    })

    it('should reject zero memory values with validation error', async () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: 0,
        memoryUsed: 0,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Invalid total memory')
    })

    it('should reject when used memory exceeds total memory', async () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: 8388608,
        memoryUsed: 16777216,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Used memory exceeds total')
    })
  })

  describe('Type Safety', () => {
    it('should reject non-integer CPU count with validation error', async () => {
      const mockInfo = {
        cpuCount: 2.5,
        cpuBrand: 'Test CPU',
        memoryTotal: 8388608,
        memoryUsed: 4194304,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU count')
    })

    it('should reject non-numeric memory values with validation error', async () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: '8GB',
        memoryUsed: 4194304,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Invalid total memory')
    })

    it('should reject missing required properties with validation error', async () => {
      const mockInfo = {
        cpuCount: 4,
        memoryTotal: 8388608,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      await expect(getHardwareInfo()).rejects.toThrow('Invalid CPU brand')
    })
  })

  describe('getHardwareInfo', () => {
    it('should fetch hardware info successfully', async () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: 8388608,
        memoryUsed: 4194304,
        platform: 'darwin',
      }

      vi.mocked(invokeWithErrorHandling).mockResolvedValue(mockInfo)
      const result = await getHardwareInfo()
      expect(result).toEqual(mockInfo)
    })

    it('should reject null response with error', async () => {
      vi.mocked(invokeWithErrorHandling).mockResolvedValue(null)
      await expect(getHardwareInfo()).rejects.toThrow('Failed to retrieve hardware')
    })

    it('should propagate invoke errors', async () => {
      vi.mocked(invokeWithErrorHandling).mockRejectedValue(new Error('Invoke failed'))
      await expect(getHardwareInfo()).rejects.toThrow('Invoke failed')
    })
  })

  describe('calculateSystemResources', () => {
    it('should calculate system resources correctly', () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: 8388608, // 8GB in KB
        memoryUsed: 4194304, // 4GB in KB
        platform: 'darwin',
      }

      const resources = calculateSystemResources(mockInfo)
      expect(resources.totalMemoryGB).toBe(8)
      expect(resources.usedMemoryGB).toBe(4)
      expect(resources.memoryUsagePercentage).toBe(50)
    })

    it('should reject invalid memory information', () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: -1,
        memoryUsed: 0,
        platform: 'darwin',
      }

      expect(() => calculateSystemResources(mockInfo)).toThrow('Invalid total memory')
    })

    it('should round values to 2 decimal places', () => {
      const mockInfo = {
        cpuCount: 4,
        cpuBrand: 'Test CPU',
        memoryTotal: 8388608,
        memoryUsed: 2796203, // ~33.33% usage
        platform: 'darwin',
      }

      const resources = calculateSystemResources(mockInfo)
      expect(resources.memoryUsagePercentage).toBe(33.3)
      expect(resources.totalMemoryGB).toBe(8)
      expect(resources.usedMemoryGB).toBe(2.67)
    })
  })
})
