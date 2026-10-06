import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import { Button, Row } from '../../../index'

export default function ButtonIconOnlyActionsDemo() {
  return (
    <Row gap={1} align="center">
      <Button icon={IconSearch} viewProps={{ label: 'Search' }} />
      <Button icon={IconStar} variant="secondary" viewProps={{ label: 'Favorite' }} />
      <Button icon={IconDots} variant="ghost" viewProps={{ label: 'More actions' }} />
    </Row>
  )
}
