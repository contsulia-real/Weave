import { Button, Row } from '../../../index'

export default function ButtonDisabledActionsDemo() {
  return (
    <Row gap={16} wrap>
      <Button text="Unavailable" disabled />
      <Button text="Cannot delete" variant="danger" disabled />
    </Row>
  )
}
