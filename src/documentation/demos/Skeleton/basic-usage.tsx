import { Column, Skeleton } from '../../../index'

export default function SkeletonBasicUsageDemo() {
  return (
    <Column gap={1} width={20}>
      <Skeleton shape="rect" viewProps={{ width: 'fill', height: 7 }} />
      <Skeleton shape="text" viewProps={{ width: 12 }} />
      <Skeleton shape="text" viewProps={{ width: 18 }} />
    </Column>
  )
}
