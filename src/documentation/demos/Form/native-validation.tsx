import { Button, Column, Form, Input } from '../../../index'

export default function FormNativeValidationDemo() {
  return (
    <Form>
      <Column gap={1}>
        <Input name="email" type="email" placeholder="Email" required />
        <Button type="submit" text="Continue" />
      </Column>
    </Form>
  )
}
