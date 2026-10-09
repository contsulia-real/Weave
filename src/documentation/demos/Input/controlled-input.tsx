import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Input, Text } from '../../../index'

export default function InputControlledInputDemo() {
  const { t } = useTranslation('copy')
  const [value, setValue] = useState('Weave')

  return (
    <Column gap={12} width={320}>
      <Input
        value={value}
        onChange={setValue}
        name="project"
        autoComplete="off"
        maxLength={24}
        placeholder={t('Project name')}
      />
      <Text typo="body-small" color="secondary">
        {t('Value: {{value}}', { value: value || t('Empty') })}
      </Text>
    </Column>
  )
}
