import { useState } from 'react'
import { Column, Input, Text } from '../../../index'

export default function ControlledTimeDemo() {
  const [value, setValue] = useState('14:30')

  return (
    <Column width={352} gap={12}>
      <Input
        type="time"
        value={value}
        onChange={setValue}
        min="09:00"
        max="18:00"
        step={60}
        viewProps={{ label: 'Selected time' }}
      />
      <Text typo="body-small" color="secondary">
        Value: {value || 'empty'}
      </Text>
    </Column>
  )
}
