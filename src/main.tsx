import { StrictMode } from 'react'
import {
  SnackProvider,
  ThemeProvider,
  createRoot,
} from './index'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SnackProvider>
        <App />
      </SnackProvider>
    </ThemeProvider>
  </StrictMode>,
)
