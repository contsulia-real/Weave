import { useState } from 'react'
import { Badge, Button, Column } from '../../../index'

export default function BadgeVisibilityDemo() {
  const [visible, setVisible] = useState(true)

  return (
    <Column gap={1} align="start">
      <Button
        text={visible ? 'Hide badge' : 'Show badge'}
        variant="secondary"
        viewProps={{ onClick: () => setVisible((current) => !current) }}
      />
      <Badge text="3" visible={visible}>
        <Button text="Inbox remains mounted" />
      </Badge>
    </Column>
  )
}
