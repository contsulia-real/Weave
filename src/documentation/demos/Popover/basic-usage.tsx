import { Button, Popover, Text } from '../../../index'

export default function PopoverBasicUsageDemo() {
  return (
    <Popover
      content={<Text>Popover content</Text>}
      placement="bottom"
      offset={0.5}
      viewportPadding={1}
      autoFocus={false}
      restoreFocus
      defaultOpen
    >
      <Button text="Popover target" />
    </Popover>
  )
}
