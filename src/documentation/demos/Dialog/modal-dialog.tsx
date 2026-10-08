import { useRef, useState } from 'react'
import { Button, Column, Dialog, Row, Text } from '../../../index'

export default function DialogModalDialogDemo() {
  const [open, setOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <Column gap={16} align="start">
      <Button text="Open dialog" viewProps={{ onClick: () => setOpen(true) }} />
      <Dialog
        modal
        open={open}
        onOpenChange={setOpen}
        closeOnEscape={false}
        closeOnBackdrop
        initialFocus={cancelRef}
      >
        <Column gap={16}>
          <Text typo="title-medium">Delete project?</Text>
          <Text typo="body-medium">This action cannot be undone.</Text>
          <Row gap={16}>
            <Button
              text="Cancel"
              variant="secondary"
              viewProps={{ ref: cancelRef, onClick: () => setOpen(false) }}
            />
            <Button text="Delete" variant="danger" />
          </Row>
        </Column>
      </Dialog>
    </Column>
  )
}
