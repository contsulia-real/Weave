import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function InputPasswordInputDemo() {
  const { t } = useTranslation('copy')
  const [password, setPassword] = useState('')

  return (
    <Form viewProps={{ width: 320 }}>
      <FormField label={t('Password')}>
        <Input
          type="password"
          mask="*"
          name="password"
          autoComplete="current-password"
          placeholder={t('Enter password')}
          value={password}
          onChange={setPassword}
          viewProps={{ width: 'fill' }}
        />
      </FormField>
    </Form>
  )
}
