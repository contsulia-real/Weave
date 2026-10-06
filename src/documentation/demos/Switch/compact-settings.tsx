import { Column, Switch } from '../../../index'

export default function SwitchCompactSettingsDemo() {
  return (
    <Column gap={0.75}>
      <Switch label="Wi-Fi" defaultChecked size="small" />
      <Switch label="Bluetooth" size="small" />
      <Switch label="AirDrop" defaultChecked size="small" />
    </Column>
  )
}
