import { useTranslation } from 'react-i18next'
import { Column, OTPInput } from '../../../index'

export default function OTPInputCustomLengthDemo() {
  const { t } = useTranslation('copy')

  return (
    <Column gap={12} align="start">
      <OTPInput label={t('Four-digit code')} length={4} />
      <OTPInput label={t('Eight-digit code')} length={8} />
    </Column>
  )
}
