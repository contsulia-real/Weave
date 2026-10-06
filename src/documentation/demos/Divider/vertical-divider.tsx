import { Divider, Row, Text } from '../../../index'

export default function DividerVerticalDividerDemo() {
  return (
    <Row height={3} gap={1} align="center">
      <Text>Preview</Text>
      <Divider direction="vertical" />
      <Text>Publish</Text>
    </Row>
  )
}
