import { useTranslation } from 'react-i18next'
import { Input } from '../../../index'

export default function InputMultilineInputDemo() {
  const { t } = useTranslation('copy')
  return <Input multiline rows={4} placeholder={t('Write a short note…')} />
}
