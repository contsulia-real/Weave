import { AppBar, Column, Text } from '../../../index'

export default function AppBarStickyAppBarDemo() {
  return (
    <Column height={14} overflowY="auto" background="surfaceHover" radius="medium">
      <AppBar sticky size="large" titleAlign="end" title={<Text>Sticky section</Text>} />
      <Column gap={1} padding={1.5}>
        {Array.from({ length: 10 }, (_, index) => (
          <Text key={index}>Scrollable content row {index + 1}</Text>
        ))}
      </Column>
    </Column>
  )
}
