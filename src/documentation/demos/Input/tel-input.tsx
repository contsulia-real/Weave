import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function InputTelInputDemo() {
  const { t } = useTranslation('copy')
  const [phone, setPhone] = useState('')

  return (
    <Form viewProps={{ width: 320 }}>
      <FormField
        label={t('Phone number')}
        description={t('Telephone input does not validate number formats automatically.')}
      >
        <Input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder={t('Enter a phone number')}
          value={phone}
          onChange={setPhone}
          viewProps={{ width: 'fill', inputMode: 'tel' }}
        />
      </FormField>
    </Form>
  )
}
