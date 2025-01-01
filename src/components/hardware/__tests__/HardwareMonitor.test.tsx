import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HardwareMonitor } from '../HardwareMonitor'
import { useHardwareInfo } from '../../../hooks/useHardwareInfo'

// Mock the useHardwareInfo hook
vi.mock('../../../hooks/useHardwareInfo')

describe('HardwareMonitor', () => {
  const mockHardwareInfo = {
    cpuCount: 8,
    cpuBrand: 'Intel Core i7',
    memoryTotal: 16 * 1024 * 1024,
    memoryUsed: 8 * 1024 * 1024,
  }

  const mockSystemResources = {
    memoryUsagePercentage: 50,
    totalMemoryGB: 16,
    usedMemoryGB: 8,
  }

  beforeEach(() => {
    vi.mocked(useHardwareInfo).mockReturnValue({
      hardwareInfo: mockHardwareInfo,
      systemResources: mockSystemResources,
      error: null,
      isLoading: false,
      refresh: vi.fn(),
    })
  })

  it('should display hardware information', () => {
    render(<HardwareMonitor />)

    expect(screen.getByText('System Resources')).toBeInTheDocument()
    expect(screen.getByText(mockHardwareInfo.cpuBrand)).toBeInTheDocument()
    expect(screen.getByText(`Cores/Threads: ${mockHardwareInfo.cpuCount}`)).toBeInTheDocument()
    expect(screen.getByText(/8.0 GB \/ 16.0 GB/)).toBeInTheDocument()
  })

  it('should show loading state', () => {
    vi.mocked(useHardwareInfo).mockReturnValue({
      hardwareInfo: null,
      systemResources: null,
      error: null,
      isLoading: true,
      refresh: vi.fn(),
    })

    render(<HardwareMonitor />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should show error state', () => {
    const error = new Error('Failed to fetch hardware info')
    vi.mocked(useHardwareInfo).mockReturnValue({
      hardwareInfo: null,
      systemResources: null,
      error,
      isLoading: false,
      refresh: vi.fn(),
    })

    render(<HardwareMonitor />)

    expect(screen.getByText(error.message)).toBeInTheDocument()
  })

  it('should call refresh when button is clicked', () => {
    const refresh = vi.fn()
    vi.mocked(useHardwareInfo).mockReturnValue({
      hardwareInfo: mockHardwareInfo,
      systemResources: mockSystemResources,
      error: null,
      isLoading: false,
      refresh,
    })

    render(<HardwareMonitor />)

    const refreshButton = screen.getByRole('button')
    fireEvent.click(refreshButton)

    expect(refresh).toHaveBeenCalled()
  })

  it('should disable refresh button while loading', () => {
    vi.mocked(useHardwareInfo).mockReturnValue({
      hardwareInfo: mockHardwareInfo,
      systemResources: mockSystemResources,
      error: null,
      isLoading: true,
      refresh: vi.fn(),
    })

    render(<HardwareMonitor />)

    const refreshButton = screen.getByRole('button')
    expect(refreshButton).toBeDisabled()
  })
})
