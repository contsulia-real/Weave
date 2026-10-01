import { useState } from 'react'
import { DocumentationPage } from './documentation/DocumentationPage'
import { type ThemeMode, ThemeProvider } from './index'

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')

  return (
    <ThemeProvider mode={themeMode}>
      <DocumentationPage themeMode={themeMode} onThemeModeChange={setThemeMode} />
    </ThemeProvider>
  )
}

export default App
