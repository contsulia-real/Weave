import { StrictMode } from 'react'
import App from './App.tsx'
import './documentation/i18n'
import { createRoot } from './index'
import './index.css'

if (!window.location.pathname.startsWith('/docs')) {
  window.history.replaceState(null, '', '/docs')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
