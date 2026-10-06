import { IconSearch, IconStar } from '@tabler/icons-react'
import { Select, SelectOption, Text } from '../../../index'

export default function SelectRichOptionsDemo() {
  return (
    <Select placeholder="Choose a destination" defaultOpen>
      <SelectOption
        value="favorites"
        text={<Text>Favorites</Text>}
        textValue="Favorites"
        secondaryText="Pinned items"
        icon={IconStar}
      />
      <SelectOption
        value="search"
        text="Search"
        secondaryText="Browse everything"
        icon={IconSearch}
      />
      <SelectOption value="archive" text="Archive" secondaryText="Unavailable" disabled />
    </Select>
  )
}
