import { IconSparkles } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Input } from '../../../index'

export default function InputBasicUsageDemo() {
  const { t } = useTranslation('copy')

  return (
    <Input
      type="search"
      defaultValue="Weave"
      placeholder={t('Search notes')}
      trailingIcon={IconSparkles}
      clearLabel={t('Clear search')}
    />
  )
}
