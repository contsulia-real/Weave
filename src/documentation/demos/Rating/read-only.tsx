import { useTranslation } from 'react-i18next'
import { Rating } from '../../../index'

export default function RatingReadOnlyDemo() {
  const { t } = useTranslation('copy')

  return <Rating value={3.5} allowHalf readOnly label={t('Read-only rating')} />
}
