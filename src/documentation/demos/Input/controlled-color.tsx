import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Input, Text } from '../../../index'

export default function ControlledColorDemo() {
  const { t } = useTranslation('copy')
  const [value, setValue] = useState('#3b82f6')

  return (
    <Column width={352} gap={12}>
      <Input
        type="color"
        value={value}
        onChange={setValue}
        viewProps={{ label: t('Selected color') }}
      />
      <Text typo="body-small" color="secondary">
        {t('Value: {{value}}', { value })}
      </Text>
    </Column>
  )
}
