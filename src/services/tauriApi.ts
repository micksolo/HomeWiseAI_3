import { invoke } from '@tauri-apps/api'
import { getVersion } from '@tauri-apps/api/app'
import type { InvokeArgs } from '@tauri-apps/api/tauri'

export async function invokeWithErrorHandling<T>(command: string, args?: InvokeArgs): Promise<T> {
  try {
    // Check if Tauri is available first
    await getVersion()

    const result = await invoke<T>(command, args)
    if (result === null || result === undefined) {
      throw new Error(`Command ${command} returned no data`)
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Tauri not available')) {
        throw new Error('Tauri API not available')
      }
      if (error.message.includes('returned no data')) {
        throw error
      }
    }
    throw new Error(`Command failed (Command: ${command})`)
  }
}
