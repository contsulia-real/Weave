import { useState } from 'react'
import { Button, Column, Drawer, Row, Text } from '../../../index'

export default function DrawerControlledDrawerDemo() {
  const [open, setOpen] = useState(true)
  const [size, setSize] = useState('16rem')

  return (
    <Drawer
      side="left"
      mode="non-modal"
      open={open}
      onOpenChange={setOpen}
      size={size}
      onSizeChange={setSize}
      minSize={10}
      drawer={
        <Column gap={0.5}>
          <Text typo="label-medium">Controlled drawer</Text>
          <Text typo="body-small">Current size: {size}</Text>
        </Column>
      }
      viewProps={{ width: 'fill', height: 12 }}
    >
      <Column padding={1} gap={1}>
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
