import { Button, Flex } from '../../../index'

export default function LayoutFlexDemo() {
  return (
    <Flex direction="row" gap={16} wrap justify="start" width={288}>
      <Button text="One" viewProps={{ width: 128 }} />
      <Button text="Two" viewProps={{ width: 128 }} />
      <Button text="Three" viewProps={{ width: 128 }} />
    </Flex>
  )
}
