import { IconDots, IconStar } from '@tabler/icons-react'
import { AppBar, Button, Text } from '../../../index'

export default function AppBarCenteredTitleDemo() {
  return (
    <AppBar
      leading={<Button icon={IconDots} viewProps={{ label: 'Back' }} />}
      title={<Text>Profile</Text>}
      trailing={<Button icon={IconStar} viewProps={{ label: 'Favorite' }} />}
      titleAlign="center"
    />
  )
}
