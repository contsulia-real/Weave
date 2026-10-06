import { IconSearch, IconSparkles } from '@tabler/icons-react'
import { Input } from '../../../index'

export default function InputBasicUsageDemo() {
  return (
    <Input
      type="search"
      defaultValue="Weave"
      placeholder="Search notes"
      leadingIcon={IconSearch}
      trailingIcon={IconSparkles}
      clearLabel="Clear search"
    />
  )
}
