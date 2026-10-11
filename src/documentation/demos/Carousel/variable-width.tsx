import { useTranslation } from 'react-i18next'
import { Card, Carousel, Text } from '../../../index'

export default function CarouselVariableWidthDemo() {
  const { t } = useTranslation('copy')

  return (
    <Carousel
      gap={16}
      label={t('Variable-width carousel')}
      previousLabel={t('Previous items')}
      nextLabel={t('Next items')}
    >
      {[160, 240, 180, 280, 200].map((width, index) => (
        <Card key={index} viewProps={{ width, height: 128, padding: 16 }}>
          <Text>{t('Item {{number}}', { number: index + 1 })}</Text>
        </Card>
      ))}
    </Carousel>
  )
}
