import { Select, SelectOption } from '../../../index'

export default function SelectBasicUsageDemo() {
  return (
    <Select placeholder="Choose a workspace">
      <SelectOption value="design" text="Design" />
      <SelectOption value="engineering" text="Engineering" />
      <SelectOption value="research" text="Research" />
    </Select>
  )
}
