import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, OTPInput, Text } from '../../../index'

export default function OTPInputBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [code, setCode] = useState('')

  return (
    <Column gap={12} align="start">
      <OTPInput label={t('Verification code')} value={code} onChange={setCode} />
      <Text typo="body-small" color="secondary">
        {t('Entered code: {{code}}', { code: code || '—' })}
      </Text>
    </Column>
  )
}
