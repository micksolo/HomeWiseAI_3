import React, { useEffect } from 'react'
import { useHardwareInfo } from '../../hooks/useHardwareInfo'
import { formatBytes } from '../../utils/formatters'
import { Alert, CircularProgress, Box, Typography, Button, Paper } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

export const HardwareMonitor: React.FC = () => {
  const { hardwareInfo, error, isLoading, refresh } = useHardwareInfo()

  useEffect(() => {
    console.log('HardwareMonitor rendered with:', {
      hardwareInfo: hardwareInfo
        ? {
            ...hardwareInfo,
            memoryTotal: formatBytes(hardwareInfo.memoryTotal * 1024),
            memoryUsed: formatBytes(hardwareInfo.memoryUsed * 1024),
          }
        : null,
      error,
      isLoading,
    })
  }, [hardwareInfo, error, isLoading])

  const getErrorMessage = (error: Error | string): string => {
    console.error('Hardware Monitor Error:', error)
    const message = error instanceof Error ? error.message : error
    return message.includes('Unsupported platform')
      ? 'This feature is currently only supported on Windows, macOS, and Linux.'
      : message
  }

  const handleRefresh = () => {
    console.log('Manually refreshing hardware info...')
    refresh()
  }

  const renderContent = () => {
    try {
      if (isLoading && !hardwareInfo) {
        console.log('Rendering loading state...')
        return (
          <Box display='flex' justifyContent='center' alignItems='center' p={2}>
            <CircularProgress />
          </Box>
        )
      }

      if (error) {
        console.log('Rendering error state:', error)
        return (
          <Alert
            severity='error'
            action={
              <Button color='inherit' size='small' onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {getErrorMessage(error)}
          </Alert>
        )
      }

      if (!hardwareInfo) {
        console.log('No hardware info available')
        return (
          <Alert severity='warning'>
            Hardware information is not available. Please try refreshing.
          </Alert>
        )
      }

      console.log('Rendering hardware info:', hardwareInfo)
      const cpuInfo =
        hardwareInfo.cpuBrand && hardwareInfo.cpuCount
          ? `${hardwareInfo.cpuBrand} (${hardwareInfo.cpuCount} cores)`
          : 'CPU information unavailable'

      const memoryInfo =
        hardwareInfo.memoryTotal && hardwareInfo.memoryUsed
          ? `${formatBytes(hardwareInfo.memoryUsed * 1024)} / ${formatBytes(hardwareInfo.memoryTotal * 1024)}`
          : 'Memory information unavailable'

      return (
        <>
          <Typography variant='h6' gutterBottom>
            System Resources
          </Typography>
          <Box mb={2}>
            <Typography variant='body1'>CPU: {cpuInfo}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant='body1'>Memory Usage: {memoryInfo}</Typography>
          </Box>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              variant='outlined'
              size='small'
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>
        </>
      )
    } catch (err) {
      console.error('Error in renderContent:', err)
      return (
        <Alert severity='error'>
          An unexpected error occurred while rendering hardware information.
          <pre>{err instanceof Error ? err.message : String(err)}</pre>
        </Alert>
      )
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      {renderContent()}
    </Paper>
  )
}
