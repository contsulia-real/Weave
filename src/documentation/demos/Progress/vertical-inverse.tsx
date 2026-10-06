import { Progress } from '../../../index'

export default function ProgressVerticalInverseDemo() {
  return (
    <Progress
      mode="linear"
      progress={0.6}
      direction="vertical"
      inverse
      tracked
      size="large"
      speed="fast"
      viewProps={{ height: 12 }}
    />
  )
}
