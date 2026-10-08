import { Card, Column, Text } from '../../../index'

export default function CardClickableCardDemo() {
  return (
    <Card clickable viewProps={{ width: 320, padding: 24, label: 'Open project Atlas' }}>
      <Column gap={8}>
        <Text typo="title-medium">Open project</Text>
        <Text color="secondary">The whole surface is clickable.</Text>
      </Column>
    </Card>
  )
}
