import { IconSearch } from '@tabler/icons-react'
import { Icon, Row } from '../../../index'

export default function IconStrokeEmphasisDemo() {
  return (
    <Row gap={24} align="center">
      <Icon icon={IconSearch} stroke="thin" />
      <Icon icon={IconSearch} stroke="regular" />
      <Icon icon={IconSearch} stroke="bold" />
    </Row>
  )
}
