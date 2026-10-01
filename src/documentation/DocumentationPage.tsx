import { Code, Column, Divider, Text } from '../index'

const basicUsage = `import {
  Button,
  Column,
  Text,
  ThemeProvider,
  createRoot,
} from 'weave'

const root = createRoot(
  document.getElementById('app')!,
)

root.render(
  <ThemeProvider mode="system">
    <Column gap={1} padding={2}>
      <Text typo="title-large">
        Hello from Weave
      </Text>

      <Button
        text="Continue"
        variant="primary"
      />
    </Column>
  </ThemeProvider>,
)`

export function DocumentationPage() {
  return (
    <Column width="fill" height="100vh" overflow="auto" background="surface" color="tertiary">
      <Column width="fill" maxWidth={64} padding={2} gap={2} alignSelf="center">
        <Column gap={0.75}>
          <Text typo="display-large">Weave Documentation</Text>
          <Text typo="body-large" color="secondary">
            Weave is a browser-native React UI framework for the Web. It provides semantic React
            components, theme tokens, responsive props and motion orchestration while keeping DOM
            and CSS as the single rendering path.
          </Text>
        </Column>

        <Divider />

        <Column gap={0.75}>
          <Text typo="headline-medium">Status</Text>
          <Text typo="body-medium">
            Weave is currently an alpha, private development package. The current development
            version is 0.1.0-alpha.0.
          </Text>
        </Column>

        <Column gap={0.75}>
          <Text typo="headline-medium">Architecture</Text>
          <Text typo="body-medium">
            Weave does not implement a custom React renderer. Components ultimately render ordinary
            semantic DOM and CSS, so browser layout, text rendering, forms, focus, scrolling,
            accessibility and compositing remain browser-native.
          </Text>
          <Text typo="body-medium">
            View is the public general-purpose primitive. Framework components reuse the same host,
            responsive, motion and theme infrastructure without introducing an alternate rendering
            path.
          </Text>
        </Column>

        <Column gap={0.75}>
          <Text typo="headline-medium">Basic usage</Text>
          <Code language="tsx">{basicUsage}</Code>
        </Column>
      </Column>
    </Column>
  )
}
