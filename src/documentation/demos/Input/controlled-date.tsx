import { useState } from 'react'
import { Column, Input, Text } from '../../../index'

export default function DateControlledDateDemo() {
  const [value, setValue] = useState('2026-10-09')

  return (
    <Column gap={0.75} width={22}>
      <Input type="date" value={value} onChange={setValue} viewProps={{ label: 'Selected date' }} />
      <Text typo="body-small" color="secondary">
        Value: {value || 'empty'}
      </Text>
    </Column>
  )
}
