import { useState } from 'react'
import { Button, Column, Presence, Row, Text } from '../../../index'

export default function PresencePresenceLayoutDemo() {
  const [visible, setVisible] = useState(true)

  return (
    <Column gap={16} align="start">
      <Button
        text={visible ? 'Remove both' : 'Restore both'}
        viewProps={{ onClick: () => setVisible((current) => !current) }}
      />

      <Presence present={visible}>
        <Row gap={16} align="center">
          <Column
            background="surfaceHover"
            padding={24}
            radius="medium"
            enter={{ animation: 'fade-down', spring: 'gentle' }}
            exit={{ animation: 'fade-up', spring: 'gentle' }}
          >
            <Text>First exiting host</Text>
          </Column>
          <Column
            background="surfaceHover"
            padding={24}
            radius="medium"
            enter={{ animation: 'fade-up', spring: 'gentle' }}
            exit={{ animation: 'fade-down', spring: 'gentle' }}
          >
            <Text>Second exiting host</Text>
          </Column>
        </Row>
      </Presence>
    </Column>
  )
}
