import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, Row, Stepper } from '../../../index'

export default function StepperControlledVerticalDemo() {
  const { t } = useTranslation('copy')
  const [step, setStep] = useState(2)
  const steps = [
    { label: t('Profile'), description: t('Personal information') },
    { label: t('Preferences'), description: t('Customize your choices') },
    { label: t('Confirmation'), description: t('Finish setup') },
  ]

  return (
    <Column width={336} gap={16}>
      <Stepper
        orientation="vertical"
        steps={steps}
        step={step}
        onStepChange={setStep}
        label={t('Steps')}
      />
      <Row gap={8}>
        <Button
          text={t('Previous')}
          variant="secondary"
          disabled={step === 1}
          viewProps={{ onClick: () => setStep((current) => Math.max(1, current - 1)) }}
        />
        <Button
          text={t('Next')}
          disabled={step === steps.length}
          viewProps={{ onClick: () => setStep((current) => Math.min(steps.length, current + 1)) }}
        />
      </Row>
    </Column>
  )
}
