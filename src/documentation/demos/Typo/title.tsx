import { Column, Text } from '../../../index'

export default function TypoTitleDemo() {
  return (
    <Column gap={1}>
      <Text typo="title-large">Title large</Text>
      <Text typo="title-medium">Title medium</Text>
      <Text typo="title-small">Title small</Text>
    </Column>
  )
}
