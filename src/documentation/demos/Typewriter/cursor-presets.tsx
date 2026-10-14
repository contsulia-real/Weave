import { Column, Row, Text, Typewriter } from '../../../index'

const presets = ['bar', 'underline', 'block', 'outline'] as const

export default function TypewriterCursorPresetsDemo() {
  return (
    <Column gap={12}>
      {presets.map((cursor) => (
        <Row key={cursor} gap={12} align="center">
          <Text color="secondary" typo="body-small">
            {cursor}
          </Text>
          <Typewriter texts={['Weave']} cursor={cursor} loop={false} typo="body-large" />
        </Row>
      ))}
    </Column>
  )
}
