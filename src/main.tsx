import { StrictMode } from 'react'
import App from './App.tsx'
import { createRoot } from './index'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
