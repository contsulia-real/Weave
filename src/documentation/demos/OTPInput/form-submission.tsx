import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, Form, OTPInput, Text } from '../../../index'

export default function OTPInputFormSubmissionDemo() {
  const { t } = useTranslation('copy')
  const [submitted, setSubmitted] = useState('')

  return (
    <Column gap={12} align="start">
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get('verification') ?? ''))
        }}
      >
        <OTPInput label={t('Verification code')} name="verification" required />
        <Button text={t('Verify')} type="submit" />
        <Button text={t('Reset')} type="reset" variant="secondary" />
      </Form>
      <Text typo="body-small" color="secondary">
        {t('Submitted code: {{code}}', { code: submitted || '—' })}
      </Text>
    </Column>
  )
}
