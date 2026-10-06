import { useState } from 'react'
import { List, ListItem, Text } from '../../../index'

export default function ListControlledMultipleSelectionDemo() {
  const [selected, setSelected] = useState<readonly string[]>(['alpha'])

  return (
    <>
      <List selection="multiple" selected={selected} onSelect={setSelected}>
        <ListItem id="alpha">Alpha</ListItem>
        <ListItem id="beta">Beta</ListItem>
        <ListItem id="gamma" disabled>
          Gamma
        </ListItem>
      </List>
      <Text typo="body-small">Selected: {selected.join(', ') || 'None'}</Text>
    </>
  )
}
