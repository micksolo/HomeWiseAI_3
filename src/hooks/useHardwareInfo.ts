import { useState, useEffect, useCallback } from 'react'
import { invokeWithErrorHandling } from '../services/tauriApi'

export interface HardwareInfo {
  cpuCount: number
  cpuBrand: string
  memoryTotal: number
  memoryUsed: number
  platform: string
}

function validateHardwareInfo(info: unknown): info is HardwareInfo {
  console.log('Validating hardware info:', JSON.stringify(info, null, 2))

  if (!info || typeof info !== 'object') {
    console.error('Hardware info is not an object:', info)
    throw new Error('Hardware info must be an object')
  }

  const typedInfo = info as Record<string, unknown>
  console.log('Checking fields:', Object.keys(typedInfo))

  // Check all required fields are present
  const requiredFields = ['cpuCount', 'cpuBrand', 'memoryTotal', 'memoryUsed', 'platform']
  const missingFields = requiredFields.filter(field => !(field in typedInfo))
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields)
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }

  // Check CPU count
  if (typeof typedInfo.cpuCount !== 'number') {
    console.error('Invalid CPU count type:', typeof typedInfo.cpuCount)
    throw new Error(`CPU count must be a number, got ${typeof typedInfo.cpuCount}`)
  }
  if (typedInfo.cpuCount < 0) {
    console.error('Negative CPU count:', typedInfo.cpuCount)
    throw new Error('CPU count cannot be negative')
  }

  // Check CPU brand
  if (typeof typedInfo.cpuBrand !== 'string') {
    console.error('Invalid CPU brand type:', typeof typedInfo.cpuBrand)
    throw new Error(`CPU brand must be a string, got ${typeof typedInfo.cpuBrand}`)
  }
  if (typedInfo.cpuBrand.trim().length === 0) {
    console.error('Empty CPU brand')
    throw new Error('CPU brand cannot be empty')
  }

  // Check memory total
  if (typeof typedInfo.memoryTotal !== 'number') {
    console.error('Invalid memory total type:', typeof typedInfo.memoryTotal)
    throw new Error(`Memory total must be a number, got ${typeof typedInfo.memoryTotal}`)
  }
  if (typedInfo.memoryTotal < 0) {
    console.error('Negative memory total:', typedInfo.memoryTotal)
    throw new Error('Memory total cannot be negative')
  }

  // Check memory used
  if (typeof typedInfo.memoryUsed !== 'number') {
    console.error('Invalid memory used type:', typeof typedInfo.memoryUsed)
    throw new Error(`Memory used must be a number, got ${typeof typedInfo.memoryUsed}`)
  }
  if (typedInfo.memoryUsed < 0) {
    console.error('Negative memory used:', typedInfo.memoryUsed)
    throw new Error('Memory used cannot be negative')
  }
  if (typedInfo.memoryUsed > typedInfo.memoryTotal) {
    console.error('Memory used exceeds total:', {
      used: typedInfo.memoryUsed,
      total: typedInfo.memoryTotal,
    })
    throw new Error('Memory used cannot exceed total memory')
  }

  // Check platform
  if (typeof typedInfo.platform !== 'string') {
    console.error('Invalid platform type:', typeof typedInfo.platform)
    throw new Error(`Platform must be a string, got ${typeof typedInfo.platform}`)
  }
  if (typedInfo.platform.trim().length === 0) {
    console.error('Empty platform')
    throw new Error('Platform cannot be empty')
  }

  console.log('Hardware info validation successful')
  return true
}

export function useHardwareInfo(pollingInterval = 5000) {
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchHardwareInfo = useCallback(async () => {
    if (!isInitialized) {
      return
    }

    try {
      setIsLoading(true)
      console.log('Fetching hardware info...')
      const info = await invokeWithErrorHandling<unknown>('get_hardware_info')
      console.log('Received hardware info:', JSON.stringify(info, null, 2))

      // Validate and type check the response
      if (validateHardwareInfo(info)) {
        setHardwareInfo(info)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching hardware info:', err)
      setError(err instanceof Error ? err.message : String(err))
      setHardwareInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized])

  const refresh = useCallback(() => {
    console.log('Manual refresh triggered')
    fetchHardwareInfo()
  }, [fetchHardwareInfo])

  // Initialize Tauri API
  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        // Wait a bit to ensure Tauri is ready
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (mounted) {
          setIsInitialized(true)
        }
      } catch (err) {
        console.error('Error initializing:', err)
        if (mounted) {
          setError('Failed to initialize hardware monitoring')
        }
      }
    }

    initialize()
    return () => {
      mounted = false
    }
  }, [])

  // Set up polling after initialization
  useEffect(() => {
    if (!isInitialized) {
      return
    }

    console.log('Initial hardware info fetch')
    fetchHardwareInfo()

    if (pollingInterval > 0) {
      console.log(`Setting up polling interval: ${pollingInterval}ms`)
      const interval = setInterval(fetchHardwareInfo, pollingInterval)
      return () => {
        console.log('Cleaning up polling interval')
        clearInterval(interval)
      }
    }
  }, [fetchHardwareInfo, pollingInterval, isInitialized])

  return {
    hardwareInfo,
    error,
    isLoading,
    refresh,
  }
}
