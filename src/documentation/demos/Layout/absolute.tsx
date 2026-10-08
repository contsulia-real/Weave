import { Absolute, Button, Column, Stack, Text } from '../../../index'

export default function LayoutAbsoluteDemo() {
  return (
    <Stack position="relative" width={288} height={128}>
      <Column width="fill" height="fill" background="surfaceHover" radius="medium" padding={16}>
        <Text>Positioning plane</Text>
      </Column>
      <Absolute top={16} left={32}>
        <Button text="Absolute" />
      </Absolute>
    </Stack>
  )
}
