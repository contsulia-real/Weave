import { useTranslation } from 'react-i18next'
import { Chip, Column, Row } from '../../../index'

export default function ChipSizesAndShapesDemo() {
  const { t } = useTranslation('copy')

  return (
    <Column gap={12}>
      <Row gap={8} align="center" wrap>
        <Chip text={t('Small chip')} size="small" />
        <Chip text={t('Medium chip')} size="medium" />
        <Chip text={t('Large chip')} size="large" />
      </Row>
      <Row gap={8} align="center" wrap>
        <Chip text={t('Rounded rectangle')} />
        <Chip text={t('Pill shape')} pill />
        <Chip text={t('Selectable pill')} pill selectable />
      </Row>
    </Column>
  )
}
