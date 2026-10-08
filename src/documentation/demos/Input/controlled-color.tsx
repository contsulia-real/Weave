import { useState } from 'react'
import { Column, Input, Text } from '../../../index'

export default function ControlledColorDemo() {
  const [value, setValue] = useState('#3b82f6')

  return (
    <Column width={352} gap={12}>
      <Input
        type="color"
        value={value}
        onChange={setValue}
        viewProps={{ label: 'Selected color' }}
      />
      <Text typo="body-small" color="secondary">
        Value: {value}
      </Text>
    </Column>
  )
}
