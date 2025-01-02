import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

console.log('Starting app initialization...')

try {
  const rootElement = document.getElementById('root')
  console.log('Root element:', rootElement)

  if (!rootElement) {
    throw new Error('Root element not found')
  }

  console.log('Creating React root...')
  const root = ReactDOM.createRoot(rootElement)
  console.log('React root created successfully')

  console.log('Attempting to render app...')
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
  console.log('App render call completed.')
} catch (error) {
  console.error('Fatal error during app initialization:', error)
}
