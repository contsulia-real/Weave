import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function MonthInputDemo() {
  const { t } = useTranslation('copy')
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label={t('Billing month')}>
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
