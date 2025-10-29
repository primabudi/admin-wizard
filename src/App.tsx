import { useState } from 'react'
import { Button } from '@chakra-ui/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Admin Wizard</h1>
      <h2>Count: {count}</h2>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
    </div>
  )
}

export default App
