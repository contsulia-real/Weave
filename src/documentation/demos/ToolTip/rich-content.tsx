import { Button, Column, Text, ToolTip } from '../../../index'

export default function ToolTipRichContentDemo() {
  return (
    <ToolTip
      delay={0}
      defaultOpen
      content={
        <Column gap={0.25}>
          <Text typo="label-medium">Keyboard shortcut</Text>
          <Text typo="body-xsmall">Press Command + K to open search.</Text>
        </Column>
      }
    >
      <Button text="Search help" />
    </ToolTip>
  )
}
