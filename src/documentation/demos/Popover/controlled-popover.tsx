import { useState } from 'react'
import { Button, Column, Popover, Text } from '../../../index'

export default function PopoverControlledPopoverDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      content={
        <Column gap={0.5}>
          <Text typo="label-medium">Project details</Text>
          <Text typo="body-small">Visibility is owned by the parent.</Text>
        </Column>
      }
    >
      <Button text={open ? 'Close details' : 'Open details'} />
    </Popover>
  )
}
