import { Checkbox, Column } from '../../../index'

export default function CheckboxIndeterminateParentDemo() {
  return (
    <Column gap={12}>
      <Checkbox label="All permissions" indeterminate />
      <Column gap={8} paddingLeft={32}>
        <Checkbox label="Read" defaultChecked size="small" />
        <Checkbox label="Write" size="small" />
      </Column>
    </Column>
  )
}
