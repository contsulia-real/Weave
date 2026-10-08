import { useState } from 'react'
import { Column, SegmentedButton, Text } from '../../../index'

export default function SegmentedButtonControlledSelectionDemo() {
  const [selected, setSelected] = useState<string | null>('day')

  return (
    <Column gap={16} align="start">
      <SegmentedButton
        variant="secondary"
        selection="single"
        selected={selected}
        onSelect={setSelected}
        items={[
          { id: 'day', children: 'Day' },
          { id: 'week', children: 'Week' },
          { id: 'month', children: 'Month', disabled: true },
        ]}
      />
      <Text typo="body-small" color="secondary">
        Selected: {selected ?? 'none'}
      </Text>
    </Column>
  )
}
