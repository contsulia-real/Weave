import { IconSearch, IconStar } from '@tabler/icons-react'
import { Combobox, ComboboxOption, Text } from '../../../index'

export default function ComboboxSearchableRichOptionsDemo() {
  return (
    <Combobox placeholder="Find a command" clearable defaultOpen>
      <ComboboxOption
        value="search"
        text={<Text>Search</Text>}
        textValue="Search"
        secondaryText="Find content"
        icon={IconSearch}
      />
      <ComboboxOption
        value="favorite"
        text="Favorite"
        secondaryText="Save for later"
        icon={IconStar}
      />
      <ComboboxOption value="archive" text="Archive" secondaryText="Unavailable" disabled />
    </Combobox>
  )
}
