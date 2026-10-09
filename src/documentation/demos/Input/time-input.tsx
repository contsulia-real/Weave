import { useTranslation } from 'react-i18next'
import { Column, Form, FormField, Input } from '../../../index'

export default function TimeInputDemo() {
  const { t } = useTranslation('copy')
  return (
    <Form viewProps={{ width: 352 }}>
      <Column gap={16}>
        <FormField label={t('Meeting time')}>
          <Input
            type="time"
            name="meetingTime"
            defaultValue="14:30"
            min="09:00"
            max="18:00"
            step={900}
            required
          />
        </FormField>
      </Column>
    </Form>
  )
}
