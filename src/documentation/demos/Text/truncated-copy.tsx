import { Column, Text } from '../../../index'

export default function TextTruncatedCopyDemo() {
  return (
    <Column gap={1} width={18}>
      <Text singleLine>
        Single-line text truncates with an ellipsis when its content exceeds the available width.
      </Text>
      <Text maxLines={2} overflow="ellipsis">
        Multi-line content can stay readable without forcing every item in the surrounding layout to
        grow to the height of the longest piece of copy.
      </Text>
    </Column>
  )
}
