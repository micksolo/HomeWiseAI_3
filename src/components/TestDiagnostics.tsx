import { invoke } from '@tauri-apps/api/tauri'
import { useState } from 'react'

interface GpuInfo {
  gpu_type: 'Apple' | 'None'
  memory_total_mb: number
  memory_used_mb: number | null
  memory_free_mb: number | null
  cuda_version: string | null
  driver_version: string | null
  compute_capability: string | null
  temperature_c: number | null
  power_usage_w: number | null
  utilization_percent: number | null
}

interface TestResult {
  name: string
  status: 'passed' | 'failed' | 'running'
  error?: string
  details?: string
}

export function TestDiagnostics() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    try {
      // Test 1: Basic GPU Detection
      setTestResults(prev => [
        ...prev,
        {
          name: 'Basic GPU Detection',
          status: 'running',
        },
      ])

      const result = await invoke<GpuInfo>('detect_gpu')
      const hasGpu = result.gpu_type !== 'None' && result.memory_total_mb > 0

      setTestResults(prev => [
        ...prev.slice(0, -1),
        {
          name: 'Basic GPU Detection',
          status: hasGpu ? 'passed' : 'failed',
          details: `Detected: ${result.gpu_type} with ${result.memory_total_mb}MB VRAM${
            result.cuda_version ? `, CUDA ${result.cuda_version}` : ''
          }${result.driver_version ? `, Driver ${result.driver_version}` : ''}`,
        },
      ])

      // Test 2: Test Mode
      setTestResults(prev => [
        ...prev,
        {
          name: 'Test Mode',
          status: 'running',
        },
      ])

      await invoke('set_gpu_test_mode', { enabled: true })
      const isTestMode = await invoke<boolean>('is_gpu_test_mode')

      setTestResults(prev => [
        ...prev.slice(0, -1),
        {
          name: 'Test Mode',
          status: isTestMode ? 'passed' : 'failed',
          details: `Test mode is ${isTestMode ? 'enabled' : 'disabled'}`,
        },
      ])

      // Test 3: Error Simulation
      setTestResults(prev => [
        ...prev,
        {
          name: 'Error Simulation',
          status: 'running',
        },
      ])

      await invoke('simulate_error', { enabled: true })
      try {
        await invoke('detect_gpu')
        setTestResults(prev => [
          ...prev.slice(0, -1),
          {
            name: 'Error Simulation',
            status: 'failed',
            details: 'Error simulation failed - no error was thrown',
          },
        ])
      } catch (error) {
        setTestResults(prev => [
          ...prev.slice(0, -1),
          {
            name: 'Error Simulation',
            status: 'passed',
            details: 'Error simulation succeeded',
          },
        ])
      }

      // Clean up
      await invoke('simulate_error', { enabled: false })
      await invoke('set_gpu_test_mode', { enabled: false })
    } catch (error) {
      console.error('Test failed:', error)
      setTestResults(prev => [
        ...prev.slice(0, -1),
        {
          name: prev[prev.length - 1].name,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        },
      ])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className='test-diagnostics'>
      <h2>GPU Test Diagnostics</h2>
      <button onClick={runTests} disabled={isRunning} className='run-tests-button'>
        {isRunning ? 'Running Tests...' : 'Run All Tests'}
      </button>

      <div className='test-results'>
        {testResults.map((result, index) => (
          <div key={index} className={`test-result ${result.status}`}>
            <h3>{result.name}</h3>
            <p>Status: {result.status}</p>
            {result.details && <p>Details: {result.details}</p>}
            {result.error && <p>Error: {result.error}</p>}
          </div>
        ))}
      </div>

      <style>{`
        .test-diagnostics {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .test-results {
          margin-top: 20px;
        }

        .test-result {
          margin: 10px 0;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        .test-result.passed {
          background-color: #e6ffe6;
          border-color: #99ff99;
        }

        .test-result.failed {
          background-color: #ffe6e6;
          border-color: #ff9999;
        }

        .test-result.running {
          background-color: #e6f3ff;
          border-color: #99ccff;
        }

        .run-tests-button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
        }

        .run-tests-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        h3 {
          margin: 0 0 10px 0;
        }

        p {
          margin: 5px 0;
        }
      `}</style>
    </div>
  )
}
