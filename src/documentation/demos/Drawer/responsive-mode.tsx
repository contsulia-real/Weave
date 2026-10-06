import { Column, Drawer, Text } from '../../../index'

export default function DrawerResponsiveModeDemo() {
  return (
    <Drawer
      side="left"
      mode="auto"
      breakpoint="md"
      defaultOpen
      defaultSize={16}
      drawer={
        <Column gap={0.5}>
          <Text typo="label-medium">Responsive navigation</Text>
          <Text typo="body-small">Modal below md, non-modal at md and above.</Text>
        </Column>
      }
      viewProps={{ width: 'fill', height: 12 }}
    >
      <Column padding={1}>Main content</Column>
    </Drawer>
  )
}
