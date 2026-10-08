import { Button, Column, Dialog, Text } from '../../../index'

export default function DialogNonModalDialogDemo() {
  return (
    <Dialog modal={false} trigger={<Button text="Open details" />} placement="right" restoreFocus>
      <Column gap={8}>
        <Text typo="label-medium">Anchored details</Text>
        <Text typo="body-small">Background work remains available.</Text>
      </Column>
    </Dialog>
  )
}
