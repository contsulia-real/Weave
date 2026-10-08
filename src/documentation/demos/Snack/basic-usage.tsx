import { useRef } from 'react'
import { Column, Snack, SnackProvider } from '../../../index'

export default function SnackBasicUsageDemo() {
  const hostRef = useRef(null)

  return (
    <Column ref={hostRef} width="fill" minHeight={128}>
      <SnackProvider container={hostRef}>
        <Snack
          text="Saved successfully"
          variant="success"
          duration={4000}
          persistent
          placement="bottom-center"
          defaultOpen
        />
      </SnackProvider>
    </Column>
  )
}
