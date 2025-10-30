import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'

const system = createSystem(defaultConfig, {
  globalCss: {
    'html': {
      colorScheme: 'light',
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
        <App />
    </ChakraProvider>
  </StrictMode>,
)
