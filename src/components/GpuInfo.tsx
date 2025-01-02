import React, { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'

interface GpuInfo {
  gpuType: 'Nvidia' | 'Apple' | 'Amd' | 'None'
  name: string
  vramMb: number
  isAvailable: boolean
}

export const GpuInfoComponent: React.FC = () => {
  const [gpuInfo, setGpuInfo] = useState<GpuInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const detectGpu = async () => {
      try {
        const info = await invoke<GpuInfo>('detect_gpu')
        setGpuInfo(info)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to detect GPU')
      } finally {
        setLoading(false)
      }
    }

    detectGpu()
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' p={2}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    )
  }

  if (!gpuInfo) {
    return (
      <Box p={2}>
        <Alert severity='info'>No GPU information available</Alert>
      </Box>
    )
  }

  return (
    <Box p={2}>
      <Typography variant='h6' gutterBottom>
        GPU Information
      </Typography>
      <Typography>
        <strong>Type:</strong> {gpuInfo.gpuType}
      </Typography>
      <Typography>
        <strong>Name:</strong> {gpuInfo.name}
      </Typography>
      {gpuInfo.isAvailable && (
        <Typography>
          <strong>VRAM:</strong> {gpuInfo.vramMb} MB
        </Typography>
      )}
      <Typography>
        <strong>Status:</strong> {gpuInfo.isAvailable ? 'Available' : 'Not Available'}
      </Typography>
    </Box>
  )
}

export default GpuInfoComponent
