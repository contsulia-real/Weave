import { IconDots, IconSearch } from '@tabler/icons-react'
import { AppBar, Button, Text } from '../../../index'

export default function AppBarBasicUsageDemo() {
  return (
    <AppBar
      leading={<Button icon={IconDots} />}
      title={<Text>Example</Text>}
      trailing={<Button icon={IconSearch} />}
      size="medium"
      mode="full"
      titleAlign="start"
    />
  )
}
