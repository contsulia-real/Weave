import { Column, Drawer, Text } from '../../../index'

export default function DrawerClosedDrawerDemo() {
  return (
    <Drawer
      side="left"
      mode="non-modal"
      defaultOpen={false}
      drawer={<Text>Navigation</Text>}
      viewProps={{ width: 'fill', height: 128 }}
    >
      <Column padding={16}>Main content</Column>
    </Drawer>
  )
}
