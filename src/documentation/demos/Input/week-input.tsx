import { Form, FormField, Input } from '../../../index'

export default function WeekInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label="Planning week">
        <Input
          type="week"
          name="planningWeek"
          defaultValue="2026-W41"
          min="2026-W01"
          max="2026-W53"
        />
      </FormField>
    </Form>
  )
}
