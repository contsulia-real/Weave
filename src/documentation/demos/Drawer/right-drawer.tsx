import { Column, Drawer, Text } from '../../../index'

export default function DrawerRightDrawerDemo() {
  return (
    <Drawer
      side="right"
      mode="non-modal"
      defaultSize={256}
      resizable={false}
      defaultOpen
      drawer={<Text>Fixed inspector</Text>}
      viewProps={{ width: 'fill', height: 160 }}
    >
      <Column padding={16}>Canvas</Column>
    </Drawer>
  )
}
