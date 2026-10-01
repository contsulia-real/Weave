import { useMemo, useState } from 'react'
import { DocumentationPage } from './documentation/DocumentationPage'
import { createThemeFromColorSeed, type ThemeMode, ThemeProvider } from './index'

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const documentationTheme = useMemo(() => createThemeFromColorSeed('#6d5dfc'), [])

  return (
    <ThemeProvider theme={documentationTheme} mode={themeMode}>
      <DocumentationPage themeMode={themeMode} onThemeModeChange={setThemeMode} />
    </ThemeProvider>
  )
}

export default App
