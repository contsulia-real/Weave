import { Checkbox, Column } from '../../../index'

export default function CheckboxBasicUsageDemo() {
  return (
    <Column gap={12}>
      <Checkbox label="Small" group="features" value="small" size="small" defaultChecked />
      <Checkbox label="Medium" group="features" value="medium" size="medium" defaultChecked />
      <Checkbox label="Large" group="features" value="large" size="large" />
    </Column>
  )
}
