import { JSX } from 'react'
import { HardwareMonitor } from './components/hardware/HardwareMonitor'
import { Box, Container, Typography, ThemeProvider, CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { GpuInfo } from './components/GpuInfo'
import { TestDiagnostics } from './components/TestDiagnostics'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
})

export function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth='md'>
        <Box sx={{ my: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            HomeWise AI - System Monitor
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            Your privacy is important to us. All system information is processed locally and never
            leaves your device.
          </Typography>
          <HardwareMonitor />
          <GpuInfo />
          <TestDiagnostics />
        </Box>
      </Container>
    </ThemeProvider>
  )
}
