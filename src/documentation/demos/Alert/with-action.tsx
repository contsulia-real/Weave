import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button } from '../../../index'

export default function AlertWithActionDemo() {
  const { t } = useTranslation('copy')
  const [retried, setRetried] = useState(false)

  return (
    <Alert
      variant={retried ? 'success' : 'error'}
      title={t(retried ? 'Upload complete' : 'Upload failed')}
      description={t(retried ? 'The file is ready.' : 'Try uploading the file again.')}
      action={
        retried ? undefined : (
          <Button
            text={t('Retry upload')}
            variant="secondary"
            viewProps={{ onClick: () => setRetried(true) }}
          />
        )
      }
    />
  )
}
