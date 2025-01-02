import { render, screen, waitFor } from '@testing-library/react'
import { invoke } from '@tauri-apps/api/tauri'
import { GpuInfo as GpuInfoComponent } from '../GpuInfo'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock tauri invoke
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}))

describe('GpuInfoComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Test Mode', () => {
    it('shows loading state initially', () => {
      render(<GpuInfoComponent testMode={true} />)
      expect(screen.getByText('Detecting GPU...')).toBeInTheDocument()
    })

    it('displays Apple GPU information when available', async () => {
      const mockGpuInfo = {
        gpu_type: 'Apple',
        memory_total_mb: 8192,
        memory_used_mb: 2048,
        memory_free_mb: 6144,
        cuda_version: null,
        driver_version: 'Test Driver',
        compute_capability: null,
        temperature_c: 45.0,
        power_usage_w: 15.0,
        utilization_percent: 30.0,
      }

      vi.mocked(invoke).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText('GPU Information')).toBeInTheDocument()
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('8192MB')).toBeInTheDocument()
      })
    })

    it('displays error message when GPU detection fails', async () => {
      const errorMessage = 'Failed to detect GPU'
      vi.mocked(invoke).mockRejectedValueOnce(new Error(errorMessage))

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText(content => content.includes(errorMessage))).toBeInTheDocument()
      })
    })

    it('displays GPU information when no GPU is detected', async () => {
      const mockGpuInfo = {
        gpu_type: 'None',
        memory_total_mb: 0,
        memory_used_mb: null,
        memory_free_mb: null,
        cuda_version: null,
        driver_version: null,
        compute_capability: null,
        temperature_c: null,
        power_usage_w: null,
        utilization_percent: null,
      }

      vi.mocked(invoke).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText('None')).toBeInTheDocument()
        expect(screen.getByText('0MB')).toBeInTheDocument()
      })
    })
  })

  describe('User Mode', () => {
    it('shows user-friendly message when GPU is available', async () => {
      const mockGpuInfo = {
        gpu_type: 'Apple',
        memory_total_mb: 8192,
        memory_used_mb: 2048,
        memory_free_mb: 6144,
        cuda_version: null,
        driver_version: 'Test Driver',
        compute_capability: null,
        temperature_c: 45.0,
        power_usage_w: 15.0,
        utilization_percent: 30.0,
      }

      vi.mocked(invoke).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={false} />)

      await waitFor(() => {
        expect(screen.getByText('Graphics Capability')).toBeInTheDocument()
      })
    })

    it('shows user-friendly error message when detection fails', async () => {
      const errorMessage = 'Failed to detect GPU'
      vi.mocked(invoke).mockRejectedValueOnce(new Error(errorMessage))

      render(<GpuInfoComponent testMode={false} />)

      await waitFor(() => {
        expect(
          screen.getByText('Unable to detect graphics capabilities. Please try again.')
        ).toBeInTheDocument()
        // Technical error should not be visible
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
      })
    })
  })
})
