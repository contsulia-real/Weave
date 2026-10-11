import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, OTPInput, Text } from '../../../index'

export default function OTPInputCharacterModesDemo() {
  const { t } = useTranslation('copy')
  const [mixed, setMixed] = useState('')
  const [upper, setUpper] = useState('')

  return (
    <Column gap={12} align="start">
      <OTPInput
        label={t('Alphanumeric code')}
        mode="alphanumeric"
        value={mixed}
        onChange={setMixed}
      />
      <Text typo="body-small" color="secondary">
        {t('Entered code: {{code}}', { code: mixed || '—' })}
      </Text>
      <OTPInput label={t('Uppercase code')} mode="uppercase" value={upper} onChange={setUpper} />
      <Text typo="body-small" color="secondary">
        {t('Entered code: {{code}}', { code: upper || '—' })}
      </Text>
    </Column>
  )
}
