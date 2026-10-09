import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '../../../index'

export default function BreadcrumbBasicUsageDemo() {
  const { t } = useTranslation('copy')

  return (
    <Breadcrumb
      items={[
        { text: t('Home'), href: '/docs' },
        { text: t('Components'), href: '/docs/components/Link' },
        { text: 'Breadcrumb' },
      ]}
    />
  )
}
