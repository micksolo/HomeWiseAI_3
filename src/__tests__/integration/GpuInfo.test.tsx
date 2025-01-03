import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GpuInfo } from '../../components/GpuInfo'
import * as tauriApi from '@tauri-apps/api/tauri'
import { GpuInfo as GpuInfoType } from '../../types/gpu'

// Mock tauri invoke
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}))

describe('GpuInfo Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading state initially', () => {
    render(<GpuInfo />)
    expect(screen.getByText(/Detecting GPU/i)).toBeInTheDocument()
  })

  it('displays GPU information when detection succeeds', async () => {
    const mockGpuInfo = {
      gpu_type: 'Apple',
      memory_total_mb: 8192,
      memory_used_mb: 2048,
      memory_free_mb: 6144,
      temperature_c: 45.5,
      power_usage_w: 15.0,
      utilization_percent: 30.0,
      cuda_version: null,
      driver_version: null,
      compute_capability: null,
    }

    vi.mocked(tauriApi.invoke).mockResolvedValue(mockGpuInfo)

    render(<GpuInfo />)

    await waitFor(() => {
      expect(screen.getByText(/Apple Silicon/i)).toBeInTheDocument()
      expect(screen.getByText(/8192/)).toBeInTheDocument()
      expect(screen.getByText(/45.5°C/)).toBeInTheDocument()
    })

    expect(tauriApi.invoke).toHaveBeenCalledWith('detect_gpu')
  })

  it('displays error message when detection fails', async () => {
    vi.mocked(tauriApi.invoke).mockRejectedValue(new Error('GPU detection failed'))

    render(<GpuInfo testMode={true} />)

    await waitFor(() => {
      expect(screen.getByText(/Error detecting GPU/i)).toBeInTheDocument()
    })
  })

  test('updates GPU metrics periodically', async () => {
    const mockGpuInfo: GpuInfoType = {
      gpu_type: 'nvidia',
      cuda_version: '11.7',
      driver_version: '515.65.01',
      compute_capability: '8.6',
      temperature_c: 65.0,
      power_usage_w: 150.0,
      utilization_percent: 80.0,
      memory_total_mb: 8192,
      memory_used_mb: 4096,
      memory_free_mb: 4096,
    }

    vi.spyOn(tauriApi, 'invoke').mockResolvedValue(mockGpuInfo)

    render(<GpuInfo testMode={true} />)

    // Wait for initial render
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument()
    })

    // Verify initial values
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument()
    expect(screen.getByText(/65.0°C/i)).toBeInTheDocument()

    // Update mock values
    const updatedGpuInfo: GpuInfoType = {
      ...mockGpuInfo,
      temperature_c: 70.0,
      power_usage_w: 160.0,
      utilization_percent: 85.0,
    }

    vi.spyOn(tauriApi, 'invoke').mockResolvedValue(updatedGpuInfo)

    // Wait for update interval
    await new Promise(resolve => setTimeout(resolve, 1100))

    // Verify updated values
    await waitFor(
      () => {
        expect(screen.getByText(/70.0°C/i)).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  }, 10000) // Increase timeout to 10 seconds
})
