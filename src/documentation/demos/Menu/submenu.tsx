import { Button, Menu, MenuItem } from '../../../index'

export default function MenuSubmenuDemo() {
  return (
    <Menu trigger={<Button text="Export" />} defaultOpen submenuOffset={8} viewportPadding={16}>
      <MenuItem text="Quick export" />
      <MenuItem
        text="Export as"
        submenu={
          <>
            <MenuItem text="PDF" />
            <MenuItem text="PNG" />
            <MenuItem text="CSV" />
          </>
        }
      />
    </Menu>
  )
}
