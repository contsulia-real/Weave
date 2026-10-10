import { useState } from 'react'
import { Column, Rating, Text } from '../../../index'

export default function RatingBasicUsageDemo() {
  const [rating, setRating] = useState(3.5)

  return (
    <Column gap={16} align="start">
      <Text typo="label-medium">Whole stars (default)</Text>
      <Rating defaultValue={3} label="Whole-star rating" />
      <Text typo="label-medium">Half stars (allowHalf)</Text>
      <Rating value={rating} onChange={setRating} allowHalf label="Your rating" />
      <Text typo="body-small">Selected: {rating} of 5</Text>
      <Text typo="label-medium">Read-only rating</Text>
      <Rating value={rating} readOnly allowHalf label="Read-only rating" />
      <Text typo="label-medium">Sizes</Text>
      <Rating size="small" defaultValue={2.5} allowHalf label="Small rating" />
      <Rating size="medium" defaultValue={2.5} allowHalf label="Medium rating" />
      <Rating size="large" defaultValue={2.5} allowHalf label="Large rating" />
    </Column>
  )
}
