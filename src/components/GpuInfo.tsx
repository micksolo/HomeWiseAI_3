import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { Box, LinearProgress, Typography } from '@mui/material'
import styles from './GpuInfo.module.css'

interface GpuInfo {
  gpu_type: 'Apple' | 'Nvidia' | 'None'
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

interface MetricProgressProps {
  label: string
  value: number
  max: number
  unit: string
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

function MetricProgress({ label, value, max, unit, color = 'primary' }: MetricProgressProps) {
  const percentage = (value / max) * 100

  return (
    <Box className={styles.metricProgress}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
        <Typography variant='body2'>{label}</Typography>
        <Typography variant='body2'>
          {value.toFixed(1)}
          {unit} / {max}
          {unit}
        </Typography>
      </Box>
      <LinearProgress
        variant='determinate'
        value={percentage}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  )
}

export function GpuInfo({ testMode = false }: GpuInfoProps) {
  const [info, setInfo] = useState<GpuInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    detectGpu()
    // Set up polling for real-time updates
    const interval = setInterval(detectGpu, 2000) // Update every 2 seconds
    return () => clearInterval(interval)
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

  const getUtilizationColor = (percent: number): 'success' | 'warning' | 'error' => {
    if (percent < 60) return 'success'
    if (percent < 85) return 'warning'
    return 'error'
  }

  const getTemperatureColor = (temp: number): 'success' | 'warning' | 'error' => {
    if (temp < 70) return 'success'
    if (temp < 85) return 'warning'
    return 'error'
  }

  const getGpuName = () => {
    switch (info.gpu_type) {
      case 'Apple':
        return 'Apple Silicon'
      case 'Nvidia':
        return 'NVIDIA' + (info.cuda_version ? ` (CUDA ${info.cuda_version})` : '')
      default:
        return 'Unknown'
    }
  }

  return (
    <div className={styles.container}>
      <h3>{testMode ? 'GPU Information' : 'Graphics Capability'}</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Type:</span>
          <span className={styles.value}>{getGpuName()}</span>
        </div>

        {/* Memory Usage */}
        {info.memory_total_mb > 0 && (
          <Box className={styles.metricsSection}>
            <MetricProgress
              label={info.gpu_type === 'Nvidia' ? 'VRAM Usage' : 'Unified Memory Usage'}
              value={info.memory_used_mb ?? 0}
              max={info.memory_total_mb}
              unit='MB'
              color={getUtilizationColor(((info.memory_used_mb ?? 0) / info.memory_total_mb) * 100)}
            />
          </Box>
        )}

        {/* GPU Utilization */}
        {info.utilization_percent !== null && (
          <Box className={styles.metricsSection}>
            <MetricProgress
              label='GPU Utilization'
              value={info.utilization_percent}
              max={100}
              unit='%'
              color={getUtilizationColor(info.utilization_percent)}
            />
          </Box>
        )}

        {/* Temperature */}
        {info.temperature_c !== null && (
          <Box className={styles.metricsSection}>
            <MetricProgress
              label='Temperature'
              value={info.temperature_c}
              max={100}
              unit='°C'
              color={getTemperatureColor(info.temperature_c)}
            />
          </Box>
        )}

        {/* Power Usage */}
        {info.power_usage_w !== undefined && info.power_usage_w !== null && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Power Usage:</span>
            <span className={styles.value}>{info.power_usage_w.toFixed(1)}W</span>
          </div>
        )}

        {/* NVIDIA-specific information */}
        {info.gpu_type === 'Nvidia' && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
