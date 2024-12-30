import { useState } from 'react'
import '@styles/App.css'

// Test comment to verify git hooks - this should be auto-formatted
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>HomeWise AI</h1>
      <div className='card'>
        <button onClick={() => setCount(count => count + 1)}>Count is {count}</button>
        <p>Your local AI assistant that respects your privacy</p>
      </div>
      <p className='read-the-docs'>Running on Tauri + React + TypeScript</p>
    </>
  )
}

export default App
