import { render, screen, waitFor } from '@testing-library/react'
import { invoke } from '@tauri-apps/api/tauri'
import GpuInfoComponent from '../GpuInfo'

// Mock tauri invoke
jest.mock('@tauri-apps/api/tauri', () => ({
  invoke: jest.fn(),
}))

describe('GpuInfoComponent', () => {
  beforeEach(() => {
    ;(invoke as jest.Mock).mockClear()
  })

  it('shows loading state initially', () => {
    render(<GpuInfoComponent />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays GPU information when available', async () => {
    const mockGpuInfo = {
      gpuType: 'Nvidia' as const,
      name: 'NVIDIA RTX 3080',
      vramMb: 10240,
      isAvailable: true,
    }

    ;(invoke as jest.Mock).mockResolvedValueOnce(mockGpuInfo)

    render(<GpuInfoComponent />)

    await waitFor(() => {
      expect(screen.getByText('GPU Information')).toBeInTheDocument()
      expect(screen.getByText(/NVIDIA RTX 3080/)).toBeInTheDocument()
      expect(screen.getByText(/10240 MB/)).toBeInTheDocument()
      expect(screen.getByText(/Available/)).toBeInTheDocument()
    })
  })

  it('displays error message when GPU detection fails', async () => {
    const errorMessage = 'Failed to detect GPU'
    ;(invoke as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<GpuInfoComponent />)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays not available message when no GPU is detected', async () => {
    const mockGpuInfo = {
      gpuType: 'None' as const,
      name: 'No GPU Available',
      vramMb: 0,
      isAvailable: false,
    }

    ;(invoke as jest.Mock).mockResolvedValueOnce(mockGpuInfo)

    render(<GpuInfoComponent />)

    await waitFor(() => {
      expect(screen.getByText(/Not Available/)).toBeInTheDocument()
    })
  })
})
