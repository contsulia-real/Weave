import { useTranslation } from 'react-i18next'
import { Alert, Column } from '../../../index'

export default function AlertBasicUsageDemo() {
  const { t } = useTranslation('copy')

  return (
    <Column gap={12}>
      <Alert title={t('Update available')} description={t('You can install this update later.')} />
      <Alert
        variant="success"
        title={t('Settings saved')}
        description={t('Your changes are now active.')}
      />
      <Alert
        variant="warning"
        title={t('Review required')}
        description={t('Check the details before continuing.')}
      />
      <Alert
        variant="error"
        title={t('Unable to save')}
        description={t('Check your connection and try again.')}
      />
    </Column>
  )
}
