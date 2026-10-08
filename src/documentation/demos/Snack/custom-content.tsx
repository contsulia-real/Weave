import { useRef } from 'react'
import { Column, Snack, SnackProvider, Text } from '../../../index'

export default function SnackCustomContentDemo() {
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <Column ref={hostRef} width="fill" minHeight={128}>
      <SnackProvider container={hostRef}>
        <Snack persistent placement="bottom-center">
          <Column gap={4}>
            <Text typo="label-medium">Background sync paused</Text>
            <Text typo="body-small">Custom children can compose the entire Snack body.</Text>
          </Column>
        </Snack>
      </SnackProvider>
    </Column>
  )
}
