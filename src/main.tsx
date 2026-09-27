import {
  StrictMode,
  useState,
} from 'react'
import {
  SnackProvider,
  ThemeProvider,
  createRoot,
  type ThemeMode,
} from './index'
import './index.css'
import App from './App.tsx'

export function PlaygroundRoot() {
  const [
    themeMode,
    setThemeMode,
  ] = useState<ThemeMode>('system')

  return (
    <ThemeProvider mode={themeMode}>
      <SnackProvider>
        <App
          themeMode={themeMode}
          onThemeModeChange={
            setThemeMode
          }
        />
      </SnackProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlaygroundRoot />
  </StrictMode>,
)
