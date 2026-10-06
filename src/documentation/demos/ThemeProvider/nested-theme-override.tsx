import { Button, ThemeProvider } from '../../../index'

export default function ThemeProviderNestedThemeOverrideDemo() {
  return (
    <ThemeProvider
      theme={{
        tokens: {
          color: {
            primary: '#ff4f87',
          },
        },
      }}
    >
      <Button text="Inherited theme with local primary" />
    </ThemeProvider>
  )
}
