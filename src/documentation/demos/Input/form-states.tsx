import { Column, Input } from '../../../index'

export default function InputFormStatesDemo() {
  return (
    <Column gap={1} width={20}>
      <Input placeholder="Required value" required />
      <Input value="Read-only value" readOnly />
      <Input value="Unavailable value" disabled />
    </Column>
  )
}
