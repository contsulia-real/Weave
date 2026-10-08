import { useState } from 'react'
import { Button, Column, Presence, Text } from '../../../index'

export default function PresenceTogglePresenceDemo() {
  const [visible, setVisible] = useState(true)
  const [status, setStatus] = useState('Mounted')

  const toggle = () => {
    if (!visible) setStatus('Mounted')
    setVisible((current) => !current)
  }

  return (
    <Column gap={16} align="start">
      <Button text={visible ? 'Hide' : 'Show'} viewProps={{ onClick: toggle }} />
      <Text typo="body-small" color="secondary">
        Status: {status}
      </Text>
      <Presence present={visible} onExitComplete={() => setStatus('Exit complete')}>
        <Column
          background="surfaceHover"
          padding={24}
          radius="medium"
          enter={{ animation: 'fade-down' }}
          exit={{ animation: 'fade-up' }}
        >
          <Text>Animated content</Text>
        </Column>
      </Presence>
    </Column>
  )
}
