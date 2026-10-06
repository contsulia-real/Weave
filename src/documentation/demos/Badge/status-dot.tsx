import { Avatar, Badge } from '../../../index'

export default function BadgeStatusDotDemo() {
  return (
    <Badge dot placement="bottom-right" visible>
      <Avatar name="Active account" fallback="AA" />
    </Badge>
  )
}
