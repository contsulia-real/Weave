import { useTranslation } from 'react-i18next'
import { Column, Rating } from '../../../index'

export default function RatingSizesDemo() {
  const { t } = useTranslation('copy')

  return (
    <Column gap={12} align="start">
      <Rating size="small" defaultValue={2.5} allowHalf label={t('Small rating')} />
      <Rating size="medium" defaultValue={2.5} allowHalf label={t('Medium rating')} />
      <Rating size="large" defaultValue={2.5} allowHalf label={t('Large rating')} />
    </Column>
  )
}
