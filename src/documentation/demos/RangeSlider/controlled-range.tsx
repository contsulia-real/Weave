import { useState } from 'react'
import { Column, RangeSlider, Text } from '../../../index'

export default function RangeSliderControlledRangeDemo() {
  const [value, setValue] = useState<[number, number]>([25, 75])

  return (
    <Column gap={0.75} align="start">
      <RangeSlider
        value={value}
        onChange={setValue}
        startName="minimum"
        endName="maximum"
        startLabel="Minimum"
        endLabel="Maximum"
        label="Allowed range"
        min={0}
        max={100}
        step={5}
      />
      <Text typo="body-small" color="secondary">
        Range: {value[0]}–{value[1]}
      </Text>
    </Column>
  )
}
