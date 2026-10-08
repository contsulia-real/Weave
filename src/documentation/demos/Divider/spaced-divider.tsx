import { Column, Divider, Text } from '../../../index'

export default function DividerSpacedDividerDemo() {
  return (
    <Column width={320}>
      <Text>First section</Text>
      <Divider gap={16} size={2} />
      <Text>Second section</Text>
    </Column>
  )
}
