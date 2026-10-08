import { Column, Input } from '../../../index'

export default function InputFormStatesDemo() {
  return (
    <Column gap={16} width={320}>
      <Input placeholder="Required value" required />
      <Input value="Read-only value" readOnly />
      <Input value="Unavailable value" disabled />
    </Column>
  )
}
