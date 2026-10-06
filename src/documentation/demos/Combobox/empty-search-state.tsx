import { Combobox, ComboboxOption, Text } from '../../../index'

export default function ComboboxEmptySearchStateDemo() {
  return (
    <Combobox
      placeholder="Search projects"
      defaultInputValue="Nothing matches"
      emptyContent={<Text>No matching projects</Text>}
      defaultOpen
    >
      <ComboboxOption value="atlas" text="Atlas" />
      <ComboboxOption value="borealis" text="Borealis" />
    </Combobox>
  )
}
