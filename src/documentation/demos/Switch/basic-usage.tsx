import { Column, Switch } from '../../../index'

export default function SwitchBasicUsageDemo() {
  return (
    <Column gap={1}>
      <Switch label="Notifications" defaultChecked />
      <Switch label="Background sync" />
    </Column>
  )
}
