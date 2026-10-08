import { useRef } from 'react'
import { Column, Snack, SnackProvider } from '../../../index'

export default function SnackSnackActionDemo() {
  const hostRef = useRef(null)

  return (
    <Column ref={hostRef} width="fill" minHeight={128}>
      <SnackProvider container={hostRef}>
        <Snack
          text="Item archived"
          action="Undo"
          onAction={() => {}}
          persistent
          placement="bottom-center"
          defaultOpen
        />
      </SnackProvider>
    </Column>
  )
}
