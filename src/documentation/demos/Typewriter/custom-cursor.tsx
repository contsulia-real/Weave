import { Text, Typewriter } from '../../../index'

export default function TypewriterCustomCursorDemo() {
  return (
    <Typewriter
      texts={['A custom cursor']}
      loop={false}
      cursor={<Text color="primary">✦</Text>}
      typo="body-large"
    />
  )
}
