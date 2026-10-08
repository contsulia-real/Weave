import { Column, Divider, Text } from '../../../index'

export default function DividerZeroGapBoundaryDemo() {
  return (
    <Column width={320}>
      <Text>First row</Text>
      <Divider gap={0} />
      <Text>Second row</Text>
      <Divider gap={0} size={2} />
      <Text>Third row</Text>
    </Column>
  )
}
