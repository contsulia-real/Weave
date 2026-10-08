import { Column, Text } from '../../../index'

export default function TypoDisplayDemo() {
  return (
    <Column gap={16}>
      <Text typo="display-large">Display large</Text>
      <Text typo="display-medium">Display medium</Text>
      <Text typo="display-small">Display small</Text>
    </Column>
  )
}
