import { Column, Text } from '../../../index'

export default function TextTextEmphasisDemo() {
  return (
    <Column gap={0.5}>
      <Text weight="bold" color="primary">
        Primary emphasis
      </Text>
      <Text italic underline color="secondary">
        Secondary note
      </Text>
      <Text strikethrough color="disabled">
        Deprecated value
      </Text>
      <Text overline case="uppercase" typo="label-small" letterSpacing={0.05}>
        Metadata
      </Text>
    </Column>
  )
}
