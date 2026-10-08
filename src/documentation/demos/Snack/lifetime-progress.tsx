import { useRef, useState } from 'react'
import { Button, Column, Snack, SnackProvider, Text } from '../../../index'

export default function SnackLifetimeProgressDemo() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(true)
  const [dismissed, setDismissed] = useState(0)

  return (
    <Column ref={hostRef} width="fill" minHeight={160} gap={16} align="start">
      <SnackProvider container={hostRef}>
        <Button text="Restart timed Snack" viewProps={{ onClick: () => setOpen(true) }} />
        <Text typo="body-small">Completed dismissals: {dismissed}</Text>
        <Snack
          text="Uploading changes"
          variant="info"
          duration={5000}
          progress
          placement="top-right"
          open={open}
          onOpenChange={setOpen}
          onDismissed={() => setDismissed((count) => count + 1)}
        />
      </SnackProvider>
    </Column>
  )
}
