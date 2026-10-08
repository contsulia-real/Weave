import { useState } from 'react'
import { View } from '../../../index'

export default function ViewSemanticHostDemo() {
  const [pressed, setPressed] = useState(false)

  return (
    <View
      clickable
      label="Toggle details"
      pressed={pressed}
      background="surfaceHover"
      padding={24}
      radius="medium"
      onClick={() => setPressed((current) => !current)}
    >
      {pressed ? 'Pressed semantic state' : 'Clickable semantic surface'}
    </View>
  )
}
