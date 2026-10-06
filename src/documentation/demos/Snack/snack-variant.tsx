import { useRef } from 'react'
import { Column, Snack, SnackProvider } from '../../../index'

export default function SnackSnackVariantDemo() {
  const hostRef = useRef(null)

  return (
    <Column ref={hostRef} width="fill" minHeight={8}>
      <SnackProvider container={hostRef}>
        <Snack
          text="Could not save changes"
          variant="danger"
          persistent
          placement="bottom-center"
          defaultOpen
        />
      </SnackProvider>
    </Column>
  )
}
