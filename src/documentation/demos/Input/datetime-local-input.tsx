import { Form, FormField, Input } from '../../../index'

export default function DateTimeLocalInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label="Appointment date and time">
        <Input
          type="datetime-local"
          name="appointmentAt"
          defaultValue="2026-10-09T14:30"
          min="2026-10-01T09:00"
          max="2026-10-31T18:00"
          step={900}
        />
      </FormField>
    </Form>
  )
}
