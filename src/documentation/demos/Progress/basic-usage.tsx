import { Column, Progress, Text } from '../../../index'

export default function ProgressBasicUsageDemo() {
  return (
    <Column gap={0.75} width={20}>
      <Text typo="body-small">Uploading 65%</Text>
      <Progress mode="linear" progress={0.65} tracked />
    </Column>
  )
}
