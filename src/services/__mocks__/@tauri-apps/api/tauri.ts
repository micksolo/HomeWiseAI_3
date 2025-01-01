import { vi } from 'vitest'

export const invoke = vi.fn().mockImplementation(async (command: string) => {
  if (command === 'get_hardware_info') {
    return {
      cpuCount: 8,
      cpuBrand: 'Intel Core i7',
      memoryTotal: 16 * 1024 * 1024,
      memoryUsed: 8 * 1024 * 1024,
    }
  }
  throw new Error(`Unknown command: ${command}`)
})
