import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, Input } from '../../../index'

export default function DateControlledDateDemo() {
  const { t } = useTranslation('copy')
  const [start, setStart] = useState('2026-10-15')
  const [end, setEnd] = useState('2026-10-17')

  const changeStart = (next: string) => {
    setStart(next)
    setEnd((current) => (next && current < next ? next : current))
  }

  return (
    <Column gap={12} width={352} align="start">
      <Input
        type="date"
        value={start}
        onChange={changeStart}
        viewProps={{ label: t('Start date') }}
      />
      <Input
        type="date"
        value={end}
        onChange={setEnd}
        min={start || undefined}
        viewProps={{ label: t('End date') }}
      />
      <Button
        text={t('Move start to October 20')}
        variant="secondary"
        viewProps={{ onClick: () => changeStart('2026-10-20') }}
      />
    </Column>
  )
}
