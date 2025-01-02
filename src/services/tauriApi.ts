import { invoke } from '@tauri-apps/api'
import { getVersion } from '@tauri-apps/api/app'

let isTauriAvailable: boolean | null = null

async function checkTauriAvailability(): Promise<boolean> {
  if (isTauriAvailable !== null) {
    return isTauriAvailable
  }

  try {
    await getVersion()
    isTauriAvailable = true
    console.log('Tauri is available')
    return true
  } catch (error) {
    isTauriAvailable = false
    console.error('Tauri is not available:', error)
    return false
  }
}

export const invokeWithErrorHandling = async <T>(cmd: string, ...args: any[]): Promise<T> => {
  console.log(`Attempting to invoke Tauri command: ${cmd}`, args)

  const isAvailable = await checkTauriAvailability()
  if (!isAvailable) {
    throw new Error('Tauri API not available - make sure you are running in Tauri context')
  }

  try {
    const startTime = performance.now()
    const result = await invoke<T>(cmd, args.length === 1 ? args[0] : args)
    const endTime = performance.now()

    console.log(`Tauri command ${cmd} completed in ${Math.round(endTime - startTime)}ms:`, result)

    if (result === undefined || result === null) {
      throw new Error(`Command ${cmd} returned no data`)
    }

    return result
  } catch (error) {
    console.error(`Error invoking Tauri command ${cmd}:`, {
      error,
      args,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Enhance error message with command context
    const errorMessage =
      error instanceof Error
        ? `${error.message} (Command: ${cmd})`
        : `Failed to invoke Tauri command ${cmd}: ${String(error)}`

    throw new Error(errorMessage)
  }
}
