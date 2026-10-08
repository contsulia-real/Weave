import { useRef } from 'react'
import { Button, Column, Row, SnackProvider, Text, useSnack } from '../../../index'

function QueueControls() {
  const snack = useSnack()

  return (
    <Column gap={16} align="start">
      <Text typo="body-small">Each click creates a new queued Snack instance.</Text>
      <Row gap={16}>
        <Button
          text="Show notification"
          viewProps={{
            onClick: () => {
              snack.show({
                text: 'Saved from the queue',
                variant: 'success',
                persistent: true,
                placement: 'bottom-right',
              })
            },
          }}
        />
        <Button text="Dismiss all" variant="secondary" viewProps={{ onClick: snack.dismissAll }} />
      </Row>
    </Column>
  )
}

export default function SnackProviderQueueDemo() {
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <Column ref={hostRef} width="fill" minHeight={160}>
      <SnackProvider container={hostRef}>
        <QueueControls />
      </SnackProvider>
    </Column>
  )
}
