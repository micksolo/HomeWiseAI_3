import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import styles from './GpuInfo.module.css'

interface GpuInfo {
  gpu_type: 'Apple' | 'None'
  memory_total_mb: number
  memory_used_mb: number | null
  memory_free_mb: number | null
  cuda_version: string | null
  driver_version: string | null
  compute_capability: string | null
  temperature_c: number | null
  power_usage_w: number | null
  utilization_percent: number | null
}

interface GpuInfoProps {
  testMode?: boolean
}

export function GpuInfo({ testMode = false }: GpuInfoProps) {
  const [info, setInfo] = useState<GpuInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    detectGpu()
  }, [])

  const detectGpu = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await invoke<GpuInfo>('detect_gpu')
      setInfo(result)
    } catch (e) {
      setError(e as string)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Detecting GPU...</div>
  }

  if (error) {
    return (
      <div className={styles.error}>
        {testMode
          ? `Error detecting GPU: ${error}`
          : 'Unable to detect graphics capabilities. Please try again.'}
      </div>
    )
  }

  if (!info) {
    return <div className={styles.noGpu}>No GPU information available</div>
  }

  return (
    <div className={styles.gpuInfo}>
      <h3>{testMode ? 'GPU Information' : 'Graphics Capability'}</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Type:</span>
          <span className={styles.value}>{info.gpu_type}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>VRAM:</span>
          <span className={styles.value}>{info.memory_total_mb}MB</span>
        </div>
        {info.memory_used_mb !== null && (
          <div className={styles.infoRow}>
            <span className={styles.label}>VRAM Used:</span>
            <span className={styles.value}>{info.memory_used_mb}MB</span>
          </div>
        )}
        {info.memory_free_mb !== null && (
          <div className={styles.infoRow}>
            <span className={styles.label}>VRAM Free:</span>
            <span className={styles.value}>{info.memory_free_mb}MB</span>
          </div>
        )}
        {info.cuda_version && (
          <div className={styles.infoRow}>
            <span className={styles.label}>CUDA Version:</span>
            <span className={styles.value}>{info.cuda_version}</span>
          </div>
        )}
        {info.driver_version && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Driver Version:</span>
            <span className={styles.value}>{info.driver_version}</span>
          </div>
        )}
        {info.compute_capability && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Compute Capability:</span>
            <span className={styles.value}>{info.compute_capability}</span>
          </div>
        )}
        {info.temperature_c !== null && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Temperature:</span>
            <span className={styles.value}>{info.temperature_c}°C</span>
          </div>
        )}
        {info.power_usage_w !== null && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Power Usage:</span>
            <span className={styles.value}>{info.power_usage_w}W</span>
          </div>
        )}
        {info.utilization_percent !== null && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Utilization:</span>
            <span className={styles.value}>{info.utilization_percent}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
