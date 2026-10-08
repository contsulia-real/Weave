import { useState } from 'react'
import { Button, Card, Column, Text } from '../../../index'

export default function CardCombinedInteractionDemo() {
  const [selected, setSelected] = useState(false)
  const [activations, setActivations] = useState(0)
  const [innerClicks, setInnerClicks] = useState(0)

  return (
    <Column gap={16}>
      <Card
        clickable
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        viewProps={{
          width: 352,
          padding: 24,
          onClick: () => setActivations((count) => count + 1),
        }}
      >
        <Column gap={16}>
          <Text>{selected ? 'Selected card' : 'Available card'}</Text>
          <Button
            text="Inner action"
            variant="secondary"
            viewProps={{ onClick: () => setInnerClicks((count) => count + 1) }}
          />
        </Column>
      </Card>

      <Text typo="body-small" color="secondary">
        Card activations: {activations} · inner clicks: {innerClicks}
      </Text>
    </Column>
  )
}
