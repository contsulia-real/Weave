import { useRef, useState } from 'react'
import { Button, Column, Drawer, Text } from '../../../index'

export default function DrawerModalDrawerDemo() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  return (
    <Drawer
      side="bottom"
      mode="modal"
      open={open}
      onOpenChange={setOpen}
      size={14}
      closeThreshold={3}
      closeOnEscape
      closeOnBackdrop
      initialFocus={closeRef}
      restoreFocus
      drawer={
        <Column gap={1}>
          <Text typo="title-medium">Modal drawer</Text>
          <Text typo="body-small">The native Dialog branch owns modal behavior.</Text>
          <Button
            text="Close drawer"
            viewProps={{ ref: closeRef, onClick: () => setOpen(false) }}
          />
        </Column>
      }
      viewProps={{ width: 'fill', height: 14 }}
    >
      <Column padding={1} gap={1}>
        <Text>Main content</Text>
        <Button text="Open drawer" viewProps={{ onClick: () => setOpen(true) }} />
      </Column>
    </Drawer>
  )
}
