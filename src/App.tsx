import { useMemo, useState } from 'react'
import { DocumentationPage } from './documentation/DocumentationPage'
import {
  type DocumentationThemeColorId,
  defaultDocumentationThemeColor,
  documentationThemeColors,
} from './documentation/documentation-theme'
import { createThemeFromColorSeed, type ThemeMode, ThemeProvider } from './index'

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const [themeColorId, setThemeColorId] = useState<DocumentationThemeColorId>(
    defaultDocumentationThemeColor.id,
  )
  const themeColor =
    documentationThemeColors.find(({ id }) => id === themeColorId) ?? defaultDocumentationThemeColor
  const theme = useMemo(() => createThemeFromColorSeed(themeColor.seed), [themeColor.seed])

  return (
    <ThemeProvider theme={theme} mode={themeMode}>
      <DocumentationPage
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
        themeColorId={themeColor.id}
        onThemeColorChange={setThemeColorId}
      />
    </ThemeProvider>
  )
}

export default App
