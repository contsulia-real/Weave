import { useState } from 'react'
import { Button, Column, Menu, MenuItem, Text } from '../../../index'

export default function MenuSelectionDismissalDemo() {
  const [status, setStatus] = useState('No action selected')

  return (
    <Column gap={1} align="start">
      <Menu trigger={<Button text="Actions" />} defaultOpen closeOnSelect={false}>
        <MenuItem text="Keep open" onSelect={() => setStatus('Kept open')} />
        <MenuItem
          text="Select and close"
          closeOnSelect
          onSelect={() => setStatus('Selected and closed')}
        />
      </Menu>
      <Text typo="body-small">{status}</Text>
    </Column>
  )
}
