import { Form, FormField, Input } from '../../../index'

export default function MonthInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label="Billing month">
        <Input
          type="month"
          name="billingMonth"
          defaultValue="2026-10"
          min="2026-01"
          max="2026-12"
        />
      </FormField>
    </Form>
  )
}
