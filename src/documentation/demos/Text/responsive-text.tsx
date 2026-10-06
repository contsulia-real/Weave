import { Text } from '../../../index'

export default function TextResponsiveTextDemo() {
  return (
    <Text
      typo="body-small"
      align="start"
      wrap="balance"
      lineHeight={1.5}
      viewProps={{ width: 'fill', maxWidth: 32 }}
      md={{
        typo: 'title-medium',
        align: 'center',
        weight: 'semibold',
        case: 'capitalize',
      }}
    >
      Text can change its own typography and alignment at framework breakpoints.
    </Text>
  )
}
