export interface GpuInfo {
  gpu_type: string
  cuda_version?: string
  driver_version?: string
  compute_capability?: string
  temperature_c?: number
  power_usage_w?: number
  utilization_percent?: number
  memory_total_mb: number
  memory_used_mb: number
  memory_free_mb: number
}
