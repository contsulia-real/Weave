import { useTranslation } from 'react-i18next'
import { Column, Input } from '../../../index'

export default function InputFormStatesDemo() {
  const { t } = useTranslation('copy')
  return (
    <Column gap={16} width={320}>
      <Input placeholder={t('Required value')} required />
      <Input value={t('Read-only value')} readOnly />
      <Input value={t('Unavailable value')} disabled />
    </Column>
  )
}
