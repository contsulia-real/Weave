import { Button, Column, Row } from '../../../index'

export default function ButtonBasicButtonDemo() {
  return (
    <Column gap={16}>
      <Row gap={16} wrap>
        <Button text="Primary" />
        <Button text="Secondary" variant="secondary" />
        <Button text="Tertiary" variant="tertiary" />
      </Row>
      <Row gap={16} wrap align="center">
        <Button text="Small" size="small" />
        <Button text="Medium" size="medium" />
        <Button text="Large" size="large" />
      </Row>
    </Column>
  )
}
