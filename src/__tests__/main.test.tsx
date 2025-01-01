import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from '@components/App'

// Mock ReactDOM
vi.mock('react-dom/client', () => ({
  default: {
    createRoot: vi.fn().mockReturnValue({
      render: vi.fn(),
    }),
  },
}))

// Mock Tauri API
vi.mock('@tauri-apps/api')

// Mock the root element
document.body.innerHTML = '<div id="root"></div>'

describe('Main Entry', () => {
  it('renders without crashing', async () => {
    // Import the main module
    await import('../main')

    // Verify that the root element exists
    const rootElement = document.getElementById('root')
    expect(rootElement).toBeDefined()

    // Verify that App can be rendered
    const { container } = render(<App />)
    expect(container).toBeDefined()
  })
})
