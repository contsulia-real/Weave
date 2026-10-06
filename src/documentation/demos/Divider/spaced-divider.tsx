import { Column, Divider, Text } from '../../../index'

export default function DividerSpacedDividerDemo() {
  return (
    <Column width={20}>
      <Text>First section</Text>
      <Divider gap={1} size={2} />
      <Text>Second section</Text>
    </Column>
  )
}
