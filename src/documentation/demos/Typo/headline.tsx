import { Column, Text } from '../../../index'

export default function TypoHeadlineDemo() {
  return (
    <Column gap={1}>
      <Text typo="headline-large">Headline large</Text>
      <Text typo="headline-medium">Headline medium</Text>
      <Text typo="headline-small">Headline small</Text>
    </Column>
  )
}
