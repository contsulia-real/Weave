import { Column, Stack, Text } from '../../../index'

export default function LayoutStackDemo() {
  return (
    <Stack width={18} height={8}>
      <Column
        width="fill"
        height="fill"
        background="surfaceHover"
        radius="medium"
        align="center"
        justify="center"
      >
        <Text>Base</Text>
      </Column>
      <Column
        width={8}
        height={4}
        background="surface"
        radius="medium"
        align="center"
        justify="center"
        justifySelf="center"
        alignSelf="center"
      >
        <Text>Middle</Text>
      </Column>
      <Text viewProps={{ justifySelf: 'center', alignSelf: 'center' }}>Top</Text>
    </Stack>
  )
}
