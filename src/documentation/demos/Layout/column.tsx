import { Button, Column } from '../../../index'

export default function LayoutColumnDemo() {
  return (
    <Column width={18} height={14} align="end" justify="space-between">
      <Button text="One" />
      <Button text="Two" />
      <Button text="Three" />
    </Column>
  )
}
