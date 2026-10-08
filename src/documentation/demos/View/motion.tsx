import { useState } from 'react'
import { Button, Column, Presence, Row, View } from '../../../index'

export default function ViewMotionDemo() {
  const [visible, setVisible] = useState(true)

  return (
    <Column gap={16} align="start">
      <Button
        text={visible ? 'Hide' : 'Show'}
        viewProps={{ onClick: () => setVisible((current) => !current) }}
      />

      <Row gap={16} align="center">
        <Presence present={visible}>
          <View
            background="surfaceHover"
            padding={24}
            radius="medium"
            enter={{ animation: 'fade-up', spring: 'gentle' }}
            exit={{ animation: 'fade-down', spring: 'gentle' }}
          >
            Enter and exit
          </View>
        </Presence>

        <View
          background="surfaceHover"
          padding={24}
          radius="medium"
          animation={{
            keyframes: [{ opacity: 0.55 }, { opacity: 1 }],
            duration: 'slow',
            repeat: 'infinite',
            direction: 'alternate',
          }}
        >
          Keyframes
        </View>
      </Row>
    </Column>
  )
}
