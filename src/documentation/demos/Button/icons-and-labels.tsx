import { IconDots, IconSearch, IconStar } from '@tabler/icons-react'
import { Button, Row } from '../../../index'

const customSpark = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)

export default function ButtonIconsAndLabelsDemo() {
  return (
    <Row gap={16} wrap>
      <Button text="Favorite" icon={IconStar} />
      <Button text="Search" icon={IconSearch} variant="secondary" />
      <Button text="More" icon={IconDots} iconPosition="end" variant="tertiary" />
      <Button text="Custom SVG" icon={customSpark} variant="ghost" />
    </Row>
  )
}
