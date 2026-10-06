import { Column, Radio } from '../../../index'

export default function RadioUnavailableChoiceDemo() {
  return (
    <Column gap={0.75}>
      <Radio label="Standard" group="plan" value="standard" defaultChecked />
      <Radio label="Enterprise — contact sales" group="plan" value="enterprise" disabled />
    </Column>
  )
}
