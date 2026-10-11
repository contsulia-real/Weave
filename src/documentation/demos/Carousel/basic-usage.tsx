import { useTranslation } from 'react-i18next'
import { Card, Carousel, Text } from '../../../index'

export default function CarouselBasicUsageDemo() {
  const { t } = useTranslation('copy')

  return (
    <Carousel
      gap={12}
      label={t('Featured carousel')}
      previousLabel={t('Previous items')}
      nextLabel={t('Next items')}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} viewProps={{ width: 200, height: 128, padding: 16 }}>
          <Text>{t('Item {{number}}', { number: index + 1 })}</Text>
        </Card>
      ))}
    </Carousel>
  )
}
