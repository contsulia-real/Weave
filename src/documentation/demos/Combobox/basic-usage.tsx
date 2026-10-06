import { Combobox, ComboboxOption } from '../../../index'

export default function ComboboxBasicUsageDemo() {
  return (
    <Combobox placeholder="Search projects" clearable>
      <ComboboxOption value="atlas" text="Atlas" />
      <ComboboxOption value="borealis" text="Borealis" />
      <ComboboxOption value="cascade" text="Cascade" />
    </Combobox>
  )
}
