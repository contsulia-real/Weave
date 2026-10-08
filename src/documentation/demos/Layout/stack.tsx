import { Column, Stack, Text } from '../../../index'

export default function LayoutStackDemo() {
  return (
    <Stack width={288} height={128}>
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
        width={128}
        height={64}
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
