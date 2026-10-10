import { useState } from 'react'
import { Column, Rating, Text } from '../../../index'

export default function RatingBasicUsageDemo() {
  const [rating, setRating] = useState(3.5)

  return (
    <Column gap={16} align="start">
      <Text typo="label-medium">Your rating</Text>
      <Rating value={rating} onChange={setRating} label="Your rating" />
      <Text typo="body-small">Selected: {rating} of 5</Text>
      <Text typo="label-medium">Read-only rating</Text>
      <Rating value={rating} readOnly label="Read-only rating" />
      <Text typo="label-medium">Sizes</Text>
      <Rating size="small" defaultValue={2.5} label="Small rating" />
      <Rating size="medium" defaultValue={2.5} label="Medium rating" />
      <Rating size="large" defaultValue={2.5} label="Large rating" />
    </Column>
  )
}
