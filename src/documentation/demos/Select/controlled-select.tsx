import { useState } from 'react'
import { Column, Select, SelectOption, Text } from '../../../index'

export default function SelectControlledSelectDemo() {
  const [value, setValue] = useState<string | null>('design')
  const [open, setOpen] = useState(false)

  return (
    <Column gap={0.75} align="start">
      <Select
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        placeholder="Choose a workspace"
      >
        <SelectOption value="design" text="Design" />
        <SelectOption value="engineering" text="Engineering" />
        <SelectOption value="research" text="Research" />
      </Select>
      <Text typo="body-small" color="secondary">
        Value: {value ?? 'none'} · open: {open ? 'true' : 'false'}
      </Text>
    </Column>
  )
}
