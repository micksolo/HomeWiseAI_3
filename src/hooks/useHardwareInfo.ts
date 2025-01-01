import { useState, useEffect, useCallback } from 'react'
import { getHardwareInfo, calculateSystemResources } from '../services/hardwareService'
import type { HardwareInfo, SystemResources } from '../types/hardware'

interface UseHardwareInfoReturn {
  hardwareInfo: HardwareInfo | null
  systemResources: SystemResources | null
  error: Error | null
  isLoading: boolean
  refresh: () => Promise<void>
}

const POLLING_INTERVAL = 5000 // 5 seconds

export const useHardwareInfo = (): UseHardwareInfoReturn => {
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null)
  const [systemResources, setSystemResources] = useState<SystemResources | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHardwareInfo = useCallback(async () => {
    try {
      setError(null)
      const info = await getHardwareInfo()
      setHardwareInfo(info)
      setSystemResources(calculateSystemResources(info))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hardware info'))
      setHardwareInfo(null)
      setSystemResources(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchHardwareInfo()
  }, [fetchHardwareInfo])

  useEffect(() => {
    fetchHardwareInfo()

    // Only set up polling if we're not in a test environment
    if (process.env.NODE_ENV !== 'test') {
      const intervalId = setInterval(fetchHardwareInfo, POLLING_INTERVAL)
      return () => clearInterval(intervalId)
    }
  }, [fetchHardwareInfo])

  return {
    hardwareInfo,
    systemResources,
    error,
    isLoading,
    refresh,
  }
}
