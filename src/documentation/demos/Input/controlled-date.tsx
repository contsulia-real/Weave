import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Input, Text } from '../../../index'

export default function DateControlledDateDemo() {
  const { t } = useTranslation('copy')
  const [value, setValue] = useState('2026-10-09')

  return (
    <Column gap={12} width={352}>
      <Input
        type="date"
        value={value}
        onChange={setValue}
        viewProps={{ label: t('Selected date') }}
      />
      <Text typo="body-small" color="secondary">
        {t('Value: {{value}}', { value: value || t('Empty') })}
      </Text>
    </Column>
  )
}
