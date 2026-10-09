import { useTranslation } from 'react-i18next'
import { Breadcrumb, Text } from '../../../index'

export default function BreadcrumbCustomSeparatorDemo() {
  const { t } = useTranslation('copy')

  return (
    <Breadcrumb
      separator={<Text>/</Text>}
      items={[
        { text: t('Home'), href: '/docs' },
        { text: t('Components'), href: '/docs/components/Link' },
        { text: 'Breadcrumb' },
      ]}
    />
  )
}
