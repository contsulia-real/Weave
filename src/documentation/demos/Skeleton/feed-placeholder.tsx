import { Column, Skeleton } from '../../../index'

export default function SkeletonFeedPlaceholderDemo() {
  return (
    <Column gap={0.75} width={20}>
      <Skeleton shape="text" viewProps={{ width: 'fill' }} />
      <Skeleton shape="text" viewProps={{ width: 17 }} />
      <Skeleton shape="text" viewProps={{ width: 14 }} />
    </Column>
  )
}
