import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Rating, Text } from '../../../index'

export default function RatingHalfStarSelectionDemo() {
  const { t } = useTranslation('copy')
  const [rating, setRating] = useState(3.5)

  return (
    <Column gap={12} align="start">
      <Rating value={rating} onChange={setRating} allowHalf label={t('Your rating')} />
      <Text typo="body-small">
        {t('Selected: {{value}} of {{max}}', { value: rating, max: 5 })}
      </Text>
    </Column>
  )
}
