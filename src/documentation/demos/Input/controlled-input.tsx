import { useState } from 'react'
import { Column, Input, Text } from '../../../index'

export default function InputControlledInputDemo() {
  const [value, setValue] = useState('Weave')

  return (
    <Column gap={12} width={320}>
      <Input
        value={value}
        onChange={setValue}
        name="project"
        autoComplete="off"
        maxLength={24}
        placeholder="Project name"
      />
      <Text typo="body-small" color="secondary">
        Value: {value || 'empty'}
      </Text>
    </Column>
  )
}
