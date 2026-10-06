import { Button, ThemeProvider } from '../../../index'

export default function ThemeProviderReducedMotionScopeDemo() {
  return (
    <ThemeProvider reducedMotion="reduce">
      <Button text="Reduced-motion subtree" viewProps={{ enter: { animation: 'fade-in' } }} />
    </ThemeProvider>
  )
}
