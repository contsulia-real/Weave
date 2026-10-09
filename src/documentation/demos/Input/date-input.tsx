import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function DateBasicUsageDemo() {
  const { t } = useTranslation('copy')
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label={t('Appointment date')}>
        <Input
          type="date"
          name="appointment"
          defaultValue="2026-10-09"
          min="2026-01-01"
          max="2026-12-31"
        />
      </FormField>
    </Form>
  )
}
