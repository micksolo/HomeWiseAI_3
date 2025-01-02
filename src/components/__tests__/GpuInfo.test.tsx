import { render, screen, waitFor } from '@testing-library/react'
import { invoke } from '@tauri-apps/api/tauri'
import { GpuInfo as GpuInfoComponent } from '../GpuInfo'

// Mock tauri invoke
jest.mock('@tauri-apps/api/tauri', () => ({
  invoke: jest.fn(),
}))

describe('GpuInfoComponent', () => {
  beforeEach(() => {
    ;(invoke as jest.Mock).mockClear()
  })

  describe('Test Mode', () => {
    it('shows loading state initially', () => {
      render(<GpuInfoComponent testMode={true} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('displays NVIDIA GPU information when available', async () => {
      const mockGpuInfo = {
        info: {
          gpuType: 'Nvidia' as const,
          name: 'NVIDIA RTX 3080',
          vramMb: 10240,
          isAvailable: true,
        },
        detection_time_ms: 15.5,
      }

      ;(invoke as jest.Mock).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText('GPU Information')).toBeInTheDocument()
        expect(screen.getByText(/NVIDIA RTX 3080/)).toBeInTheDocument()
        expect(screen.getByText(/10240 MB/)).toBeInTheDocument()
        expect(screen.getByText(/Available/)).toBeInTheDocument()
        expect(screen.getByText(/15.50 ms/)).toBeInTheDocument()
        expect(screen.getByText('Test Mode')).toBeInTheDocument()
      })
    })

    it('displays Apple Silicon GPU information when available', async () => {
      const mockGpuInfo = {
        info: {
          gpuType: 'Apple' as const,
          name: 'Apple M1 Pro',
          vramMb: 8192,
          isAvailable: true,
        },
        detection_time_ms: 12.3,
      }

      ;(invoke as jest.Mock).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText('GPU Information')).toBeInTheDocument()
        expect(screen.getByText(/Apple M1 Pro/)).toBeInTheDocument()
        expect(screen.getByText(/8192 MB/)).toBeInTheDocument()
        expect(screen.getByText(/Available/)).toBeInTheDocument()
        expect(screen.getByText(/12.30 ms/)).toBeInTheDocument()
      })
    })

    it('displays error message when GPU detection fails', async () => {
      const errorMessage = 'Failed to detect GPU'
      ;(invoke as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('displays not available message when no GPU is detected', async () => {
      const mockGpuInfo = {
        info: {
          gpuType: 'None' as const,
          name: 'No GPU Available',
          vramMb: 0,
          isAvailable: false,
        },
        detection_time_ms: 5.2,
      }

      ;(invoke as jest.Mock).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={true} />)

      await waitFor(() => {
        expect(screen.getByText(/Not Available/)).toBeInTheDocument()
      })
    })
  })

  describe('User Mode', () => {
    it('shows user-friendly message when GPU is available', async () => {
      const mockGpuInfo = {
        info: {
          gpuType: 'Apple' as const,
          name: 'Apple M1 Pro',
          vramMb: 8192,
          isAvailable: true,
        },
        detection_time_ms: 12.3,
      }

      ;(invoke as jest.Mock).mockResolvedValueOnce(mockGpuInfo)

      render(<GpuInfoComponent testMode={false} />)

      await waitFor(() => {
        expect(screen.getByText('Graphics Capability')).toBeInTheDocument()
        expect(screen.getByText(/Your system is using Apple M1 Pro/)).toBeInTheDocument()
        expect(screen.getByText('Available')).toBeInTheDocument()
        // Performance metrics should not be visible
        expect(screen.queryByText(/Detection Time/)).not.toBeInTheDocument()
      })
    })

    it('shows user-friendly error message when detection fails', async () => {
      const errorMessage = 'Failed to detect GPU'
      ;(invoke as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

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
