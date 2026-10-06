import { useState } from 'react'
import { Column, Slider, Text } from '../../../index'

export default function SliderControlledContinuousDemo() {
  const [value, setValue] = useState(42)

  return (
    <Column gap={0.75} align="start">
      <Slider
        value={value}
        onChange={setValue}
        name="volume"
        label="Volume"
        size="large"
        min={0}
        max={100}
      />
      <Text typo="body-small" color="secondary">
        Value: {value}
      </Text>
    </Column>
  )
}
