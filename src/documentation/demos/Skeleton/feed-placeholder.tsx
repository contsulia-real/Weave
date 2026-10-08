import { Column, Skeleton } from '../../../index'

export default function SkeletonFeedPlaceholderDemo() {
  return (
    <Column gap={12} width={320}>
      <Skeleton shape="text" viewProps={{ width: 'fill' }} />
      <Skeleton shape="text" viewProps={{ width: 272 }} />
      <Skeleton shape="text" viewProps={{ width: 224 }} />
    </Column>
  )
}
