import { Progress } from '../../../index'

export default function ProgressIndeterminateLoadingDemo() {
  return <Progress mode="linear" indeterminate tracked viewProps={{ width: 20 }} />
}
