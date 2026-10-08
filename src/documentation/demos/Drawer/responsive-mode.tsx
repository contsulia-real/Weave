import { Column, Drawer, Text } from '../../../index'

export default function DrawerResponsiveModeDemo() {
  return (
    <Drawer
      side="left"
      mode="auto"
      breakpoint="md"
      defaultOpen
      defaultSize={256}
      drawer={
        <Column gap={8}>
          <Text typo="label-medium">Responsive navigation</Text>
          <Text typo="body-small">Modal below md, non-modal at md and above.</Text>
        </Column>
      }
      viewProps={{ width: 'fill', height: 192 }}
    >
      <Column padding={16}>Main content</Column>
    </Drawer>
  )
}
