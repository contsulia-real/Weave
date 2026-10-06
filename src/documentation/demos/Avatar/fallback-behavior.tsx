import { Avatar, Row, Text } from '../../../index'

export default function AvatarFallbackBehaviorDemo() {
  return (
    <Row gap={1.5} align="center">
      <Avatar
        name="Custom fallback"
        fallback={<Text typo="label-small">?</Text>}
        viewProps={{ width: 4, height: 4 }}
      />
      <Avatar
        src="data:image/png;base64,not-valid-image-data"
        name="Broken image"
        fallback="BI"
        viewProps={{ width: 4, height: 4 }}
      />
    </Row>
  )
}
