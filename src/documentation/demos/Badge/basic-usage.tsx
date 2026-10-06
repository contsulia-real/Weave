import { Badge, Button } from '../../../index'

export default function BadgeBasicUsageDemo() {
  return (
    <Badge text="3" placement="top-right" visible>
      <Button text="Inbox" />
    </Badge>
  )
}
