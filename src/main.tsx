import { StrictMode } from 'react'
import App from './App.tsx'
import './documentation/i18n'
import { createRoot } from './index'
import './index.css'

if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/docs')) {
  window.history.replaceState(null, '', '/docs')
}

document.title = window.location.pathname === '/' ? 'Weave' : 'Weave Documentation'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
