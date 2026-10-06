import { Button, Menu, MenuItem } from '../../../index'

export default function MenuBasicUsageDemo() {
  return (
    <Menu
      trigger={<Button text="Menu trigger" />}
      placement="bottom-left"
      offset={0.5}
      closeOnSelect
      defaultOpen
    >
      <MenuItem text="First action" />
      <MenuItem text="Second action" />
    </Menu>
  )
}
