import { useState } from 'react'
import { Column, MarkSlider, Text } from '../../../index'

const marks = [
  { flag: 0, label: 'Minimum' },
  { flag: 20, label: 'Low' },
  { flag: 55, label: 'Medium' },
  { flag: 100, label: 'Maximum' },
] as const

export default function MarkSliderControlledRestrictedInverseDemo() {
  const [value, setValue] = useState(55)

  return (
    <Column gap={12} align="start">
      <MarkSlider
        marks={marks}
        value={value}
        onChange={setValue}
        restricted
        inverse
        label="Priority"
        name="priority"
      />
      <Text typo="body-small" color="secondary">
        Value: {value}
      </Text>
    </Column>
  )
}
