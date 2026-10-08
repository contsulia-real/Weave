import { Button, Popover, Text } from '../../../index'

export default function PopoverBasicUsageDemo() {
  return (
    <Popover
      content={<Text>Popover content</Text>}
      placement="bottom"
      offset={8}
      viewportPadding={16}
      autoFocus={false}
      restoreFocus
      defaultOpen
    >
      <Button text="Popover target" />
    </Popover>
  )
}
