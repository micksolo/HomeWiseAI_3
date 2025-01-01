import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'
import { useHardwareInfo } from '../../hooks/useHardwareInfo'

// Mock the useHardwareInfo hook
vi.mock('../../hooks/useHardwareInfo')

describe('App Component', () => {
  beforeEach(() => {
    // Setup default mock for useHardwareInfo
    vi.mocked(useHardwareInfo).mockReturnValue({
      hardwareInfo: {
        cpuCount: 8,
        cpuBrand: 'Intel Core i7',
        memoryTotal: 16 * 1024 * 1024,
        memoryUsed: 8 * 1024 * 1024,
      },
      systemResources: {
        memoryUsagePercentage: 50,
        totalMemoryGB: 16,
        usedMemoryGB: 8,
      },
      error: null,
      isLoading: false,
      refresh: vi.fn(),
    })
  })

  it('renders the main heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /homewise ai/i })
    expect(heading).toBeDefined()
    expect(heading.textContent?.toLowerCase()).toContain('homewise ai')
  })

  it('renders the privacy message', () => {
    render(<App />)
    const message = screen.getByText(/your local ai assistant that respects your privacy/i)
    expect(message).toBeDefined()
  })

  it('renders the HardwareMonitor component', () => {
    render(<App />)
    expect(screen.getByText('System Resources')).toBeInTheDocument()
  })
})
