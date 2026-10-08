import { Column, Skeleton } from '../../../index'

export default function SkeletonBasicUsageDemo() {
  return (
    <Column gap={16} width={320}>
      <Skeleton shape="rect" viewProps={{ width: 'fill', height: 112 }} />
      <Skeleton shape="text" viewProps={{ width: 192 }} />
      <Skeleton shape="text" viewProps={{ width: 288 }} />
    </Column>
  )
}
