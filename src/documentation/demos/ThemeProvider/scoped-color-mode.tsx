import { Button, Row, ThemeProvider } from '../../../index'

export default function ThemeProviderScopedColorModeDemo() {
  return (
    <Row gap={1}>
      <ThemeProvider mode="light">
        <Button text="Light scope" />
      </ThemeProvider>
      <ThemeProvider mode="dark">
        <Button text="Dark scope" />
      </ThemeProvider>
    </Row>
  )
}
