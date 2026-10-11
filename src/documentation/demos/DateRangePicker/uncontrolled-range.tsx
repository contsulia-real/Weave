import { useTranslation } from 'react-i18next'
import { Column, DateRangePicker, Text } from '../../../index'

export default function DateRangePickerUncontrolledDemo() {
  const { t } = useTranslation('copy')
  return (
    <Column align="start" gap={12}>
      <DateRangePicker defaultValue={['2026-10-30', '2026-11-03']} />
      <Text typo="body-small" color="secondary">
        {t('Choose the start and end dates in the same calendar.')}
      </Text>
    </Column>
  )
}
