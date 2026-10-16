import { Progress } from '../../../index'

export default function ProgressIndeterminateLoadingDemo() {
  return (
    <Progress
      mode="linear"
      indeterminate
      tracked
      viewProps={{ width: 'content', minWidth: 'var(--weave-progress-width)' }}
    />
  )
}
