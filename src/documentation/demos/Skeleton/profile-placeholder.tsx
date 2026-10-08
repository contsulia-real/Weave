import { Column, Row, Skeleton } from '../../../index'

export default function SkeletonProfilePlaceholderDemo() {
  return (
    <Row gap={16} align="center">
      <Skeleton shape="circle" viewProps={{ width: 48 }} />
      <Column gap={8}>
        <Skeleton shape="text" viewProps={{ width: 128 }} />
        <Skeleton shape="text" viewProps={{ width: 192 }} />
      </Column>
    </Row>
  )
}
