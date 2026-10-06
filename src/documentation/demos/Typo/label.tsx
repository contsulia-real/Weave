import { Column, Text } from '../../../index'

export default function TypoLabelDemo() {
  return (
    <Column gap={1}>
      <Text typo="label-large">Label large</Text>
      <Text typo="label-medium">Label medium</Text>
      <Text typo="label-small">Label small</Text>
    </Column>
  )
}
