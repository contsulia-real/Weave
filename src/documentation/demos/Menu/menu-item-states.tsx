import { Button, Menu, MenuItem } from '../../../index'

export default function MenuMenuItemStatesDemo() {
  return (
    <Menu trigger={<Button text="File actions" />} defaultOpen>
      <MenuItem text="Duplicate" secondaryText="⌘D" />
      <MenuItem text="Move" disabled />
      <MenuItem text="Delete" danger />
    </Menu>
  )
}
