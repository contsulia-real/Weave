import { Column, Text } from '../../../index'

export default function TypoBodyDemo() {
  return (
    <Column gap={16}>
      <Text typo="body-large">Body large</Text>
      <Text typo="body-medium">Body medium</Text>
      <Text typo="body-small">Body small</Text>
      <Text typo="body-xsmall">Body xsmall</Text>
    </Column>
  )
}
