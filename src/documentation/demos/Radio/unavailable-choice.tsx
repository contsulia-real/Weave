import { Column, Radio } from '../../../index'

export default function RadioUnavailableChoiceDemo() {
  return (
    <Column gap={12}>
      <Radio label="Standard" group="plan" value="standard" defaultChecked />
      <Radio label="Enterprise — contact sales" group="plan" value="enterprise" disabled />
    </Column>
  )
}
