import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { App } from '../../App'
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
        memoryTotal: 16777216,
        memoryUsed: 8388608,
        platform: 'darwin',
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
    const message = screen.getByText(/your privacy is important to us/i)
    expect(message).toBeDefined()
  })

  it('renders the HardwareMonitor component', () => {
    render(<App />)
    expect(screen.getByText(/system resources/i)).toBeDefined()
  })
})
