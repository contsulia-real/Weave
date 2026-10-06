import { useState } from 'react'
import { Button, Row, Text } from '../../../index'

export default function ButtonHandlingClicksDemo() {
  const [clicks, setClicks] = useState(0)

  return (
    <Row gap={1} align="center">
      <Button text="Click me" viewProps={{ onClick: () => setClicks((current) => current + 1) }} />
      <Text>{clicks === 1 ? '1 click' : clicks + ' clicks'}</Text>
    </Row>
  )
}
