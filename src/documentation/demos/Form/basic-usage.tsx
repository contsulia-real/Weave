import { Button, Form, FormField, Input } from '../../../index'

export default function FormBasicUsageDemo() {
  return (
    <Form viewProps={{ width: 24 }}>
      <FormField label="Email" description="Used for account notifications." required>
        <Input name="email" type="email" placeholder="you@example.com" />
      </FormField>
      <Button type="submit" text="Save" />
    </Form>
  )
}
