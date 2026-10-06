import { Button, Row } from '../../../index'

export default function LayoutRowDemo() {
  return (
    <Row gap={1} align="center" justify="start">
      <Button text="One" />
      <Button text="Two" />
      <Button text="Three" />
    </Row>
  )
}
