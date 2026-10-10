import { useTranslation } from 'react-i18next'
import { Rating } from '../../../index'

export default function RatingBasicUsageDemo() {
  const { t } = useTranslation('copy')

  return <Rating defaultValue={3} label={t('Whole-star rating')} />
}
