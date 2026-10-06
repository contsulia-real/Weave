import { Column, Drawer, Text } from '../../../index'

export default function DrawerBasicUsageDemo() {
  return (
    <Drawer
      side="left"
      mode="non-modal"
      defaultSize={16}
      minSize={10}
      collapseThreshold={2}
      expandThreshold={4}
      resizable
      defaultOpen
      drawer={
        <Column gap={0.5}>
          <Text typo="label-medium">Navigation</Text>
          <Text typo="body-small">Drag the shared splitter to resize.</Text>
        </Column>
      }
      viewProps={{ width: 'fill', height: 12 }}
    >
      <Column padding={1}>Main content</Column>
    </Drawer>
  )
}
