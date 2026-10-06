import { useState } from 'react'
import { Button } from '../../../index'

export default function ButtonPressedStateDemo() {
  const [pressed, setPressed] = useState(false)

  return (
    <Button
      text={pressed ? 'Pressed' : 'Not pressed'}
      pressed={pressed}
      viewProps={{ onClick: () => setPressed((current) => !current) }}
    />
  )
}
