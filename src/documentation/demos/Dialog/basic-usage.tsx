import { Button, Dialog, Text } from '../../../index'

export default function DialogBasicUsageDemo() {
  return (
    <Dialog
      modal={false}
      trigger={<Button text="Dialog trigger" />}
      placement="bottom"
      offset={0.5}
      viewportPadding={1}
      autoFocus={false}
      restoreFocus
      defaultOpen
    >
      <Text>Dialog content</Text>
    </Dialog>
  )
}
