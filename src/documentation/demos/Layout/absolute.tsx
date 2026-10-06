import { Absolute, Button, Column, Stack, Text } from '../../../index'

export default function LayoutAbsoluteDemo() {
  return (
    <Stack position="relative" width={18} height={8}>
      <Column width="fill" height="fill" background="surfaceHover" radius="medium" padding={1}>
        <Text>Positioning plane</Text>
      </Column>
      <Absolute top={1} left={2}>
        <Button text="Absolute" />
      </Absolute>
    </Stack>
  )
}
