import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Alert,
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { useHardwareInfo } from '../../hooks/useHardwareInfo'

export const HardwareMonitor = () => {
  const { hardwareInfo, systemResources, error, isLoading, refresh } = useHardwareInfo()

  if (error) {
    return (
      <Alert
        severity='error'
        action={
          <IconButton color='inherit' size='small' onClick={() => refresh()}>
            <RefreshIcon />
          </IconButton>
        }
      >
        {error.message}
      </Alert>
    )
  }

  if (!hardwareInfo || !systemResources) {
    return <LinearProgress />
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6'>System Resources</Typography>
          <IconButton onClick={() => refresh()} disabled={isLoading} size='small'>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box mb={2}>
          <Typography variant='subtitle2' gutterBottom>
            CPU Information
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {hardwareInfo.cpuBrand}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Cores/Threads: {hardwareInfo.cpuCount}
          </Typography>
        </Box>

        <Box>
          <Typography variant='subtitle2' gutterBottom>
            Memory Usage
          </Typography>
          <LinearProgress
            variant='determinate'
            value={systemResources.memoryUsagePercentage}
            sx={{ mb: 1, height: 8, borderRadius: 1 }}
          />
          <Typography variant='body2' color='text.secondary'>
            {systemResources.usedMemoryGB.toFixed(1)} GB /{' '}
            {systemResources.totalMemoryGB.toFixed(1)} GB (
            {systemResources.memoryUsagePercentage.toFixed(1)}%)
          </Typography>
        </Box>

        {isLoading && (
          <Box mt={2}>
            <LinearProgress />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
