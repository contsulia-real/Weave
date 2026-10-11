import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Chip, Column, Row, Text } from '../../../index'

export default function ChipRemovableDemo() {
  const { t } = useTranslation('copy')
  const [chips, setChips] = useState(['Design', 'Development', 'Review'])
  const [selected, setSelected] = useState(false)

  return (
    <Column gap={12}>
      <Row gap={8} wrap>
        {chips.map((name) => (
          <Chip
            key={name}
            text={t(name)}
            selected={name === 'Design' ? selected : undefined}
            onSelectedChange={name === 'Design' ? setSelected : undefined}
            onRemove={() => setChips((items) => items.filter((item) => item !== name))}
            removeLabel={t('Remove {{name}}', { name: t(name) })}
          />
        ))}
      </Row>
      <Text typo="body-small" color="secondary">
        {t('Remaining chips: {{count}}', { count: chips.length })}
      </Text>
      <Text typo="body-small" color="secondary">
        {t('Design selected: {{value}}', { value: selected ? t('Yes') : t('No') })}
      </Text>
    </Column>
  )
}
