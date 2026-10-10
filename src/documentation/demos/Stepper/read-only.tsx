import { useTranslation } from 'react-i18next'
import { Column, Stepper } from '../../../index'

export default function StepperReadOnlyDemo() {
  const { t } = useTranslation('copy')

  return (
    <Column width="fill">
      <Stepper
        readOnly
        defaultStep={2}
        steps={[
          { label: t('Account'), description: t('Create your profile') },
          { label: t('Details'), description: t('Add your information') },
          { label: t('Review'), description: t('Check your entries') },
          { label: t('Submit'), disabled: true },
        ]}
        label={t('Steps')}
      />
    </Column>
  )
}
