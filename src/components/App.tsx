import { Container } from '@mui/material'
import { HardwareMonitor } from './hardware/HardwareMonitor'
import '../styles/App.css'

function App() {
  return (
    <Container maxWidth='sm'>
      <h1>HomeWise AI</h1>
      <p>Your local AI assistant that respects your privacy</p>
      <HardwareMonitor />
    </Container>
  )
}

export default App
