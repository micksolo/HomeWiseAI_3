export interface HardwareInfo {
  cpuCount: number
  cpuBrand: string
  memoryTotal: number // in kilobytes
  memoryUsed: number // in kilobytes
  platform: string
}

export interface SystemResources {
  memoryUsagePercentage: number
  totalMemoryGB: number
  usedMemoryGB: number
}
