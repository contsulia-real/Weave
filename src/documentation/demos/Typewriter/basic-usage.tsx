import { Column, Text, Typewriter } from '../../../index'

export default function TypewriterBasicUsageDemo() {
  return (
    <Column gap={8}>
      <Typewriter
        texts={['Hello, Weave!', '你好，世界！', 'Typewriter 👩‍💻✨']}
        typo="title-medium"
      />
      <Text color="secondary" typo="body-small">
        Types, pauses, deletes, and repeats.
      </Text>
    </Column>
  )
}
