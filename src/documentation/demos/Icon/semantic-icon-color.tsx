import { IconStar } from '@tabler/icons-react'
import { Icon, Row } from '../../../index'

export default function IconSemanticIconColorDemo() {
  return (
    <Row gap={24}>
      <Icon icon={IconStar} viewProps={{ color: 'primary' }} />
      <Icon icon={IconStar} viewProps={{ color: 'success' }} />
      <Icon icon={IconStar} viewProps={{ color: 'danger' }} />
    </Row>
  )
}
