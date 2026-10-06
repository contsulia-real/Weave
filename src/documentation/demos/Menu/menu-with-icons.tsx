import { IconSearch, IconStar } from '@tabler/icons-react'
import { Button, Menu, MenuItem } from '../../../index'

export default function MenuMenuWithIconsDemo() {
  return (
    <Menu trigger={<Button text="Commands" />}>
      <MenuItem text="Search" icon={IconSearch} />
      <MenuItem text="Favorite" icon={IconStar} />
    </Menu>
  )
}
