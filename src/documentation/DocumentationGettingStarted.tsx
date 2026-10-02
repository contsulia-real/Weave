import { useTranslation } from 'react-i18next'
import { Column, MarkSlider, Text } from '../index'

const markSliderExampleMarks = [
  { flag: 10, label: <Text typo="body-small">10</Text> },
  { flag: 35, label: <Text typo="body-small">35</Text> },
  { flag: 80, label: <Text typo="body-small">80</Text> },
] as const

export function DocumentationGettingStarted() {
  const { t } = useTranslation()

  return (
    <Column width="fill" padding={2} gap={2}>
      <Text typo="display-small">{t('docs.nav.gettingStarted')}</Text>
      <Column gap={1}>
        <Text typo="headline-small">MarkSlider</Text>
        <MarkSlider marks={markSliderExampleMarks} defaultValue={35} restricted />
      </Column>
    </Column>
  )
}
