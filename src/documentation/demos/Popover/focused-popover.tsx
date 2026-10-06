import { Button, Input, Popover } from '../../../index'

export default function PopoverFocusedPopoverDemo() {
  return (
    <Popover
      content={<Input placeholder="Filter items" />}
      placement="bottom"
      autoFocus
      restoreFocus
    >
      <Button text="Open filter" />
    </Popover>
  )
}
