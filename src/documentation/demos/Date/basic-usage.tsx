import { Date, Form, FormField } from '../../../index'

export default function DateBasicUsageDemo() {
  return (
    <Form viewProps={{ width: 22 }}>
      <FormField label="Appointment date">
        <Date name="appointment" defaultValue="2026-10-09" min="2026-01-01" max="2026-12-31" />
      </FormField>
    </Form>
  )
}
