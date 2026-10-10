import { useState } from 'react'
import { Column, Rating, Text } from '../../../index'

export default function RatingBasicUsageDemo() {
  const [rating, setRating] = useState(3)

  return (
    <Column gap={16} align="start">
      <Text typo="label-medium">Your rating</Text>
      <Rating value={rating} onChange={setRating} label="Your rating" />
      <Text typo="body-small">Selected: {rating} of 5</Text>
      <Text typo="label-medium">Read-only rating</Text>
      <Rating value={rating} readOnly label="Read-only rating" />
    </Column>
  )
}
