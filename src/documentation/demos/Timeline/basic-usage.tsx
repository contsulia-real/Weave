import { useTranslation } from 'react-i18next'
import { Timeline } from '../../../index'

export default function TimelineBasicUsageDemo() {
  const { t } = useTranslation('copy')

  return (
    <Timeline
      items={[
        {
          id: 'created',
          time: '09:00',
          title: t('Request created'),
          description: t('The request was submitted.'),
        },
        {
          id: 'review',
          time: '10:30',
          title: t('Review started'),
          description: t('The request is being reviewed.'),
        },
        {
          id: 'approved',
          time: '11:45',
          title: t('Request approved'),
          description: t('The request was approved.'),
        },
      ]}
      viewProps={{ width: 'fill' }}
    />
  )
}
