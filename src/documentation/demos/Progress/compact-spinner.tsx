import { Progress, Row, Text } from '../../../index'

export default function ProgressCompactSpinnerDemo() {
  return (
    <Row gap={0.75} align="center">
      <Progress mode="spin" indeterminate size="small" />
      <Text>Saving changes</Text>
    </Row>
  )
}
