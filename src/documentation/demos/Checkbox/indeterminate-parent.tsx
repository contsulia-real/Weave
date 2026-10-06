import { Checkbox, Column } from '../../../index'

export default function CheckboxIndeterminateParentDemo() {
  return (
    <Column gap={0.75}>
      <Checkbox label="All permissions" indeterminate />
      <Column gap={0.5} paddingLeft={2}>
        <Checkbox label="Read" defaultChecked size="small" />
        <Checkbox label="Write" size="small" />
      </Column>
    </Column>
  )
}
