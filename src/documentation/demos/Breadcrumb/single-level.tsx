import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '../../../index'

export default function BreadcrumbSingleLevelDemo() {
  const { t } = useTranslation('copy')

  return <Breadcrumb items={[{ text: t('Current location') }]} />
}
