import { Select, SelectOption } from '../../../index'

export default function SelectPreselectedValueDemo() {
  return (
    <Select defaultValue="medium" name="density">
      <SelectOption value="compact" text="Compact" />
      <SelectOption value="medium" text="Comfortable" />
      <SelectOption value="roomy" text="Roomy" />
    </Select>
  )
}
