import { Avatar, Row, Text } from '../../../index'

export default function AvatarFallbackBehaviorDemo() {
  return (
    <Row gap={24} align="center">
      <Avatar
        name="Custom fallback"
        fallback={<Text typo="label-small">?</Text>}
        viewProps={{ width: 64, height: 64 }}
      />
      <Avatar
        src="data:image/png;base64,not-valid-image-data"
        name="Broken image"
        fallback="BI"
        viewProps={{ width: 64, height: 64 }}
      />
    </Row>
  )
}
