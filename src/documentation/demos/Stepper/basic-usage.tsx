import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Stepper, Text } from '../../../index'

export default function StepperBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [current, setCurrent] = useState(2)
  const steps = [
    { label: t('Account'), description: t('Create your profile') },
    { label: t('Details'), description: t('Add your information') },
    { label: t('Review'), description: t('Check your entries') },
    { label: t('Submit'), disabled: true },
  ]

  return (
    <Column width="fill" gap={16}>
      <Stepper steps={steps} defaultStep={2} onStepChange={setCurrent} label={t('Steps')} />
      <Text typo="body-small" color="secondary">
        {t('Current step: {{step}}', { step: current })}
      </Text>
    </Column>
  )
}
