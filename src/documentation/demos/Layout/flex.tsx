import { Button, Flex } from '../../../index'

export default function LayoutFlexDemo() {
  return (
    <Flex direction="row" gap={1} wrap justify="start" width={18}>
      <Button text="One" viewProps={{ width: 8 }} />
      <Button text="Two" viewProps={{ width: 8 }} />
      <Button text="Three" viewProps={{ width: 8 }} />
    </Flex>
  )
}
