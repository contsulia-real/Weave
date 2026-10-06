import { useState } from 'react'
import { Column, Combobox, ComboboxOption, Text } from '../../../index'

export default function ComboboxControlledValuesDemo() {
  const [value, setValue] = useState<string | null>('atlas')
  const [inputValue, setInputValue] = useState('Atlas')

  return (
    <Column gap={0.75} align="start">
      <Combobox
        value={value}
        onValueChange={setValue}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        name="project"
        placeholder="Search projects"
      >
        <ComboboxOption value="atlas" text="Atlas" />
        <ComboboxOption value="borealis" text="Borealis" />
        <ComboboxOption value="cascade" text="Cascade" />
      </Combobox>
      <Text typo="body-small" color="secondary">
        Value: {value ?? 'none'} · input: {inputValue || 'empty'}
      </Text>
    </Column>
  )
}
