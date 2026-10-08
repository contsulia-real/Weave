import { useState } from 'react'
import { Button, Column, Drawer, Row, Text } from '../../../index'

export default function DrawerControlledDrawerDemo() {
  const [open, setOpen] = useState(true)
  const [size, setSize] = useState('256px')

  return (
    <Drawer
      side="left"
      mode="non-modal"
      open={open}
      onOpenChange={setOpen}
      size={size}
      onSizeChange={setSize}
      minSize={160}
      drawer={
        <Column gap={8}>
          <Text typo="label-medium">Controlled drawer</Text>
          <Text typo="body-small">Current size: {size}</Text>
        </Column>
      }
      viewProps={{ width: 'fill', height: 192 }}
    >
      <Column padding={16} gap={16}>
        <Text>Main content remains mounted.</Text>
        <Row>
          <Button
            text={open ? 'Close drawer' : 'Open drawer'}
            viewProps={{ onClick: () => setOpen(!open) }}
          />
        </Row>
      </Column>
    </Drawer>
  )
}
