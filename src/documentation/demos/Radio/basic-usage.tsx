import { Column, Radio } from '../../../index'

export default function RadioBasicUsageDemo() {
  return (
    <Column gap={0.75}>
      <Radio label="Daily" group="digest" value="daily" defaultChecked />
      <Radio label="Weekly" group="digest" value="weekly" />
      <Radio label="Never" group="digest" value="never" />
    </Column>
  )
}
