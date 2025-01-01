export interface HardwareInfo {
  cpuCount: number
  cpuBrand: string
  memoryTotal: number
  memoryUsed: number
}

export interface SystemResources {
  memoryUsagePercentage: number
  totalMemoryGB: number
  usedMemoryGB: number
}
