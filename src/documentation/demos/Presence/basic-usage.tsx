import { Column, Presence, Text } from '../../../index'

export default function PresenceBasicUsageDemo() {
  return (
    <Presence present>
      <Column background="surfaceHover" padding={1.5} radius="medium">
        <Text>Presence content</Text>
      </Column>
    </Presence>
  )
}
