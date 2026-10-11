import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Chip, Column, Row, Text } from '../../../index'

export default function ChipBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [selected, setSelected] = useState(false)

  return (
    <Column gap={12}>
      <Row gap={8} wrap>
        <Chip text={t('Design chip')} selected={selected} onSelectedChange={setSelected} />
        <Chip text={t('Development chip')} defaultSelected />
        <Chip text={t('Disabled chip')} disabled />
      </Row>
      <Text typo="body-small" color="secondary">
        {t('Design selected: {{value}}', { value: selected ? t('Yes') : t('No') })}
      </Text>
    </Column>
  )
}
