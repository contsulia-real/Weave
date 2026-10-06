import { Column, Row, Skeleton } from '../../../index'

export default function SkeletonProfilePlaceholderDemo() {
  return (
    <Row gap={1} align="center">
      <Skeleton shape="circle" viewProps={{ width: 3 }} />
      <Column gap={0.5}>
        <Skeleton shape="text" viewProps={{ width: 8 }} />
        <Skeleton shape="text" viewProps={{ width: 12 }} />
      </Column>
    </Row>
  )
}
