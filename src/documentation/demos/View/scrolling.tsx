import { Column, Text, View } from '../../../index'

export default function ViewScrollingDemo() {
  return (
    <View
      width={24}
      height={8}
      overflowY="auto"
      scrollbar={{ size: 'medium', color: 'primary', radius: 'full', opacity: 0.8 }}
      background="surfaceHover"
      radius="medium"
    >
      <Column gap={1} padding={1.5}>
        {Array.from({ length: 8 }, (_, index) => (
          <Text key={index}>Scrollable row {index + 1}</Text>
        ))}
      </Column>
    </View>
  )
}
