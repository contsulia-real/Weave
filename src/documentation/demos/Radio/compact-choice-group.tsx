import { useState } from 'react'
import { Column, Radio, Text } from '../../../index'

export default function RadioCompactChoiceGroupDemo() {
  const [choice, setChoice] = useState('medium')

  return (
    <Column gap={0.75} align="start">
      <Radio
        label="Small"
        group="size"
        value="small"
        size="small"
        checked={choice === 'small'}
        onChange={(checked) => {
          if (checked) setChoice('small')
        }}
      />
      <Radio
        label="Medium"
        group="size"
        value="medium"
        size="medium"
        checked={choice === 'medium'}
        onChange={(checked) => {
          if (checked) setChoice('medium')
        }}
      />
      <Radio
        label="Large"
        group="size"
        value="large"
        size="large"
        checked={choice === 'large'}
        onChange={(checked) => {
          if (checked) setChoice('large')
        }}
      />
      <Text typo="body-small" color="secondary">
        Selected: {choice}
      </Text>
    </Column>
  )
}
