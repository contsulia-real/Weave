import { Card, Row, Text } from '../../../index'

export default function CardSelectableCardDemo() {
  return (
    <Row gap={1}>
      <Card selectable defaultSelected viewProps={{ width: 10, padding: 1.5 }}>
        <Text>Selected</Text>
      </Card>
      <Card selectable viewProps={{ width: 10, padding: 1.5 }}>
        <Text>Available</Text>
      </Card>
    </Row>
  )
}
