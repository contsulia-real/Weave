import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Input, Text } from '../../../index'

export default function ControlledTimeDemo() {
  const { t } = useTranslation('copy')
  const [value, setValue] = useState('14:30')

  return (
    <Column width={352} gap={12}>
      <Input
        type="time"
        value={value}
        onChange={setValue}
        min="09:00"
        max="18:00"
        step={60}
        viewProps={{ label: t('Selected time') }}
      />
      <Text typo="body-small" color="secondary">
        {t('Value: {{value}}', { value: value || t('Empty') })}
      </Text>
    </Column>
  )
}
