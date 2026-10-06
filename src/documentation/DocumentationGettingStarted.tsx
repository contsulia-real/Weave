import { useTranslation } from 'react-i18next'
import { Column, MarkSlider, Progress, RangeSlider, Row, Slider, Text } from '../index'

const markSliderExampleMarks = [
  { flag: 10, label: <Text typo="body-small">10</Text> },
  { flag: 35, label: <Text typo="body-small">35</Text> },
  { flag: 80, label: <Text typo="body-small">80</Text> },
] as const

export function DocumentationGettingStarted() {
  const { t } = useTranslation()
  const overriddenEndpointMarks = [
    { flag: 0, label: <Text typo="body-small">{t('docs.gettingStarted.min')}</Text> },
    { flag: 25, label: <Text typo="body-small">25</Text> },
    { flag: 70, label: <Text typo="body-small">70</Text> },
    { flag: 100, label: <Text typo="body-small">{t('docs.gettingStarted.max')}</Text> },
  ] as const

  return (
    <Column width="fill" padding={2} gap={3}>
      <Text typo="display-small">{t('docs.nav.gettingStarted')}</Text>

      <Column gap={1.5}>
        <Text typo="headline-small">{t('docs.gettingStarted.sliderHorizontal')}</Text>
        <Slider defaultValue={35} step={25} />
        <MarkSlider
          marks={markSliderExampleMarks}
          defaultValue={35}
          restricted
          viewProps={{ width: '1600px' }}
        />
        <RangeSlider defaultValue={[25, 75]} step={25} />
      </Column>

      <Column gap={1.5}>
        <Text typo="headline-small">{t('docs.gettingStarted.sliderHorizontalInverse')}</Text>
        <Slider defaultValue={35} step={25} inverse />
        <MarkSlider marks={markSliderExampleMarks} defaultValue={35} restricted inverse />
        <RangeSlider defaultValue={[25, 75]} step={25} inverse />
      </Column>

      <Column gap={1.5}>
        <Text typo="headline-small">{t('docs.gettingStarted.sliderVertical')}</Text>
        <Row gap={4} align="center">
          <Slider defaultValue={35} step={25} direction="vertical" />
          <MarkSlider
            marks={overriddenEndpointMarks}
            defaultValue={25}
            restricted
            direction="vertical"
          />
          <RangeSlider defaultValue={[25, 75]} step={25} direction="vertical" />
        </Row>
      </Column>

      <Column gap={1.5}>
        <Text typo="headline-small">{t('docs.gettingStarted.sliderVerticalInverse')}</Text>
        <Row gap={4} align="center">
          <Slider defaultValue={35} step={25} direction="vertical" inverse />
          <MarkSlider
            marks={overriddenEndpointMarks}
            defaultValue={25}
            restricted
            direction="vertical"
            inverse
          />
          <RangeSlider defaultValue={[25, 75]} step={25} direction="vertical" inverse />
        </Row>
      </Column>

      <Column gap={1.5}>
        <Text typo="headline-small">{t('docs.gettingStarted.progressHorizontal')}</Text>
        <Progress mode="linear" progress={0.65} tracked direction="horizontal" />
        <Progress mode="linear" indeterminate tracked direction="horizontal" />
        <Progress mode="linear" progress={0.65} tracked direction="horizontal" inverse />
        <Progress mode="linear" indeterminate tracked direction="horizontal" inverse />
      </Column>

      <Column gap={1.5}>
        <Text typo="headline-small">{t('docs.gettingStarted.progressVertical')}</Text>
        <Row gap={4} align="center">
          <Progress mode="linear" progress={0.65} tracked direction="vertical" />
          <Progress mode="linear" indeterminate tracked direction="vertical" />
          <Progress mode="linear" progress={0.65} tracked direction="vertical" inverse />
          <Progress mode="linear" indeterminate tracked direction="vertical" inverse />
        </Row>
      </Column>
    </Column>
  )
}
