import { useState } from 'react'
import { Button, Menu, MenuItem } from '../../../index'

export default function MenuControlledMenuDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Menu
      trigger={<Button text={open ? 'Close menu' : 'Open menu'} />}
      open={open}
      onOpenChange={setOpen}
      placement="bottom-right"
      overlapTrigger
      viewportPadding={16}
    >
      <MenuItem text="Rename" />
      <MenuItem text="Archive" />
    </Menu>
  )
}
