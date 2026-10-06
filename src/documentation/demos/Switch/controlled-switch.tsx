import { useState } from 'react'
import { Column, Switch, Text } from '../../../index'

export default function SwitchControlledSwitchDemo() {
  const [checked, setChecked] = useState(true)

  return (
    <Column gap={0.75} align="start">
      <Switch
        checked={checked}
        onChange={setChecked}
        name="updates"
        value="enabled"
        label="Product updates"
        size="large"
      />
      <Text typo="body-small" color="secondary">
        Checked: {checked ? 'true' : 'false'}
      </Text>
    </Column>
  )
}
