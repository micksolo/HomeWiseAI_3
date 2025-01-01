// Define the invoke function type
type InvokeFunction = <T>(cmd: string, ...args: any[]) => Promise<T>

// Extend Window interface to include __TAURI__ property
declare global {
  interface Window {
    __TAURI__?: {
      invoke: InvokeFunction
    }
  }
}

// Default invoke function
let invoke: InvokeFunction

// Initialize invoke based on environment
if (process.env.NODE_ENV === 'test' && window.__TAURI__) {
  invoke = window.__TAURI__.invoke
} else if (window.__TAURI__) {
  invoke = window.__TAURI__.invoke
} else {
  invoke = async () => {
    throw new Error('Tauri API not available')
  }
}

export { invoke }
