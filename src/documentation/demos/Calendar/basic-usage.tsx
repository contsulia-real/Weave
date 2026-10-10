import { useState } from 'react'
import { Calendar, Column, Text } from '../../../index'

export default function CalendarBasicUsageDemo() {
  const [date, setDate] = useState('2026-10-15')

  return (
    <Column gap={12} align="start">
      <Calendar value={date} onChange={setDate} min="2026-09-10" max="2026-11-20" />
      <Text typo="body-small">{date}</Text>
    </Column>
  )
}
