import { Column, Drawer, Text } from '../../../index'

export default function DrawerRightDrawerDemo() {
  return (
    <Drawer
      side="right"
      mode="non-modal"
      defaultSize={16}
      resizable={false}
      defaultOpen
      drawer={<Text>Fixed inspector</Text>}
      viewProps={{ width: 'fill', height: 10 }}
    >
      <Column padding={1}>Canvas</Column>
    </Drawer>
  )
}
