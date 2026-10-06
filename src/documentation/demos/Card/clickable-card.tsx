import { Card, Column, Text } from '../../../index'

export default function CardClickableCardDemo() {
  return (
    <Card clickable viewProps={{ width: 20, padding: 1.5, label: 'Open project Atlas' }}>
      <Column gap={0.5}>
        <Text typo="title-medium">Open project</Text>
        <Text color="secondary">The whole surface is clickable.</Text>
      </Column>
    </Card>
  )
}
