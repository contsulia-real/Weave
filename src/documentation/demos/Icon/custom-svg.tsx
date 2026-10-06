import { Icon, Row, Text } from '../../../index'

const customMark = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="8" />
    <path d="M8 12h8M12 8v8" />
  </svg>
)

export default function IconCustomSvgDemo() {
  return (
    <Row gap={1} align="center">
      <Icon svg={customMark} size="large" stroke="bold" viewProps={{ label: 'Add item' }} />
      <Text>Custom SVG with an accessible name</Text>
    </Row>
  )
}
