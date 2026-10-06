import { Badge, Button, Row } from '../../../index'

export default function BadgeBadgePlacementDemo() {
  return (
    <Row gap={2}>
      <Badge text="1" placement="top-left" visible>
        <Button text="Top left" variant="secondary" />
      </Badge>
      <Badge text="8" placement="bottom-right" visible>
        <Button text="Bottom right" variant="secondary" />
      </Badge>
    </Row>
  )
}
