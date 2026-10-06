import { Combobox, ComboboxOption } from '../../../index'

export default function ComboboxCustomFilterDemo() {
  return (
    <Combobox
      defaultInputValue="b"
      defaultOpen
      placeholder="Filter by id prefix"
      filter={(option, inputValue) =>
        option.value.startsWith(inputValue.trim().toLocaleLowerCase())
      }
    >
      <ComboboxOption value="alpha" text="Alpha" />
      <ComboboxOption value="beta" text="Beta" />
      <ComboboxOption value="bravo" text="Bravo" />
      <ComboboxOption value="charlie" text="Charlie" />
    </Combobox>
  )
}
