import { Column, Progress, Text } from '../../../index'

export default function ProgressBasicUsageDemo() {
  return (
    <Column gap={12} width={320}>
      <Text typo="body-small">Uploading 65%</Text>
      <Progress mode="linear" progress={0.65} tracked />
    </Column>
  )
}
