import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function WeekInputDemo() {
  const { t } = useTranslation('copy')
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label={t('Planning week')}>
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
