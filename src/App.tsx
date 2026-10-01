import { DocumentationPage } from './documentation/DocumentationPage'
import { ThemeProvider } from './index'

function App() {
  return (
    <ThemeProvider mode="system">
      <DocumentationPage />
    </ThemeProvider>
  )
}

export default App
