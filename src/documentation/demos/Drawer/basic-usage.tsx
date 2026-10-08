import { Column, Drawer, Text } from '../../../index'

export default function DrawerBasicUsageDemo() {
  return (
    <Drawer
      side="left"
      mode="non-modal"
      defaultSize={256}
      minSize={160}
      collapseThreshold={32}
      expandThreshold={64}
      resizable
      defaultOpen
      drawer={
        <Column gap={8}>
          <Text typo="label-medium">Navigation</Text>
          <Text typo="body-small">Drag the shared splitter to resize.</Text>
        </Column>
      }
      viewProps={{ width: 'fill', height: 192 }}
    >
      <Column padding={16}>Main content</Column>
    </Drawer>
  )
}
