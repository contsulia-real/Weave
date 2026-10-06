import { useState } from 'react'
import { Button, Column, View } from '../../../index'

export default function ViewLayoutAnimationDemo() {
  const [expanded, setExpanded] = useState(false)

  return (
    <Column gap={1} align="start">
      <Button
        text={expanded ? 'Shrink' : 'Expand'}
        viewProps={{ onClick: () => setExpanded((current) => !current) }}
      />

      <View
        width={expanded ? 20 : 10}
        background="surfaceHover"
        padding={1.5}
        radius="medium"
        layoutAnimation={{ spring: 'snappy' }}
      >
        Layout animation
      </View>
    </Column>
  )
}
