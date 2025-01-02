import { useState, useEffect, useCallback } from 'react'
import { getHardwareInfo } from '@/services/hardwareService'
import { HardwareInfo } from '@/types/hardware'

const POLLING_INTERVAL = 5000 // 5 seconds

export function useHardwareInfo() {
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHardwareInfo = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const info = await getHardwareInfo()
      setHardwareInfo(info)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hardware info'
      setError(errorMessage)
      setHardwareInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHardwareInfo()
    const interval = setInterval(fetchHardwareInfo, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchHardwareInfo])

  return { hardwareInfo, error, isLoading, refresh: fetchHardwareInfo }
}
