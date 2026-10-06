import { IconSearch } from '@tabler/icons-react'
import { AppBar, Button, Text } from '../../../index'

export default function AppBarFloatingAppBarDemo() {
  return (
    <AppBar
      title={<Text>Floating</Text>}
      trailing={<Button icon={IconSearch} viewProps={{ label: 'Search' }} />}
      mode="floating"
      elevated
      size="small"
    />
  )
}
