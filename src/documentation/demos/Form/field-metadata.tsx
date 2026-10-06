import { Form, FormField, Input } from '../../../index'

export default function FormFieldMetadataDemo() {
  return (
    <Form viewProps={{ width: 24 }}>
      <FormField
        label="Work email"
        description="Use the address associated with your organization."
        error="This address is already in use."
        required
      >
        <Input name="email" defaultValue="alex@example.com" />
      </FormField>
    </Form>
  )
}
