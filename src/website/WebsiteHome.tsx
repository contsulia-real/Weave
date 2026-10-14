import { Column, Link, Text } from '../index'

export function WebsiteHome() {
  return (
    <Column width="fill" height="100vh" overflow="auto" background="surface" color="tertiary">
      <Column width="fill" padding={32} gap={12}>
        <Text typo="display-small">Weave</Text>
        <Text typo="body-large">
          A browser-native React UI framework built on semantic components, DOM and CSS.
        </Text>
        <Link href="/docs" text="Documentation" />
      </Column>
    </Column>
  )
}
