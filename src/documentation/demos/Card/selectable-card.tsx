import { Card, Row, Text } from '../../../index'

export default function CardSelectableCardDemo() {
  return (
    <Row gap={16}>
      <Card selectable defaultSelected viewProps={{ width: 160, padding: 24 }}>
        <Text>Selected</Text>
      </Card>
      <Card selectable viewProps={{ width: 160, padding: 24 }}>
        <Text>Available</Text>
      </Card>
    </Row>
  )
}
