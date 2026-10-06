import { Button, ThemeProvider } from '../../../index'

export default function ThemeProviderBasicUsageDemo() {
  return (
    <ThemeProvider mode="system" reducedMotion="system">
      <Button text="ThemeProvider content" />
    </ThemeProvider>
  )
}
