import { useState } from 'react'
import './App.css'
import WordInfo from './wi/wordinfo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <WordInfo/>
  )
}

export default App
