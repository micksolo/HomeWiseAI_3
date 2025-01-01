import { invoke } from './tauriApi'
import { HardwareInfo, SystemResources } from '../types/hardware'

/**
 * Validates hardware information
 * @param info Hardware information to validate
 * @throws {Error} If the hardware information is invalid
 */
const validateHardwareInfo = (info: HardwareInfo): void => {
  if (!info || typeof info !== 'object') {
    throw new Error('Invalid hardware information format')
  }

  if (!Number.isInteger(info.cpuCount) || info.cpuCount <= 0) {
    throw new Error('Invalid CPU count')
  }

  if (typeof info.cpuBrand !== 'string' || info.cpuBrand.trim().length === 0) {
    throw new Error('Invalid CPU brand information')
  }

  if (!Number.isInteger(info.memoryTotal) || info.memoryTotal <= 0) {
    throw new Error('Invalid total memory value')
  }

  if (!Number.isInteger(info.memoryUsed) || info.memoryUsed < 0) {
    throw new Error('Invalid used memory value')
  }

  if (info.memoryUsed > info.memoryTotal) {
    throw new Error('Used memory exceeds total memory')
  }
}

/**
 * Fetches hardware information from the system using Tauri's backend.
 * @throws {Error} If the hardware information cannot be retrieved or is invalid
 * @returns {Promise<HardwareInfo>} Hardware information including CPU and memory details
 */
export const getHardwareInfo = async (): Promise<HardwareInfo> => {
  try {
    const info = await invoke<HardwareInfo>('get_hardware_info')
    if (!info) {
      throw new Error('Failed to retrieve hardware information')
    }

    validateHardwareInfo(info)
    return info
  } catch (error) {
    console.error('Error fetching hardware info:', error)
    throw error instanceof Error ? error : new Error('Failed to retrieve hardware information')
  }
}

/**
 * Calculates system resource usage from hardware information.
 * @param {HardwareInfo} info - The hardware information to calculate resources from
 * @returns {SystemResources} Calculated system resource usage
 * @throws {Error} If the input information is invalid
 */
export const calculateSystemResources = (info: HardwareInfo): SystemResources => {
  validateHardwareInfo(info)

  const totalMemoryGB = Math.round((info.memoryTotal / (1024 * 1024)) * 100) / 100
  const usedMemoryGB = Math.round((info.memoryUsed / (1024 * 1024)) * 100) / 100
  const memoryUsagePercentage = Math.round((info.memoryUsed / info.memoryTotal) * 100 * 10) / 10

  // Validate calculated values
  if (
    !Number.isFinite(totalMemoryGB) ||
    !Number.isFinite(usedMemoryGB) ||
    !Number.isFinite(memoryUsagePercentage)
  ) {
    throw new Error('Invalid memory calculations')
  }

  return {
    memoryUsagePercentage,
    totalMemoryGB,
    usedMemoryGB,
  }
}
