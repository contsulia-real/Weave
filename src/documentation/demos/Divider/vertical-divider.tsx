import { Divider, Row, Text } from '../../../index'

export default function DividerVerticalDividerDemo() {
  return (
    <Row height={48} gap={16} align="center">
      <Text>Preview</Text>
      <Divider direction="vertical" />
      <Text>Publish</Text>
    </Row>
  )
}
