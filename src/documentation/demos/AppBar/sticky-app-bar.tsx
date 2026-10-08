import { AppBar, Column, Text } from '../../../index'

export default function AppBarStickyAppBarDemo() {
  return (
    <Column height={224} overflowY="auto" background="surfaceHover" radius="medium">
      <AppBar sticky size="large" titleAlign="end" title={<Text>Sticky section</Text>} />
      <Column gap={16} padding={24}>
        {Array.from({ length: 10 }, (_, index) => (
          <Text key={index}>Scrollable content row {index + 1}</Text>
        ))}
      </Column>
    </Column>
  )
}
