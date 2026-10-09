import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function TimeSecondsDemo() {
  const { t } = useTranslation('copy')
  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label={t('Precise time')}>
        <Input
          type="time"
          name="preciseTime"
          defaultValue="14:30:15"
          min="09:00:00"
          max="18:00:59"
          step={1}
        />
      </FormField>
    </Form>
  )
}
