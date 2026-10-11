import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateRangeValue } from '../../../index'
import { Column, DateRangePicker, Text } from '../../../index'

export default function DateRangePickerBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [range, setRange] = useState<DateRangeValue>(['2026-10-12', '2026-10-16'])

  return (
    <Column align="start" gap={12}>
      <DateRangePicker value={range} onChange={setRange} min="2026-10-01" max="2026-11-30" />
      <Text typo="body-small" color="secondary">
        {t('Selected range')}: {range[0]} – {range[1]}
      </Text>
    </Column>
  )
}
