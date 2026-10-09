import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function InputEmailInputDemo() {
  const { t } = useTranslation('copy')
  const [email, setEmail] = useState('contact@example.com')
  const [touched, setTouched] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Form viewProps={{ width: 320 }}>
      <FormField
        label={t('Email address')}
        required
        error={touched && invalid ? t('Enter a valid email address.') : undefined}
      >
        <Input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t('Enter an email address')}
          value={email}
          onChange={(next) => {
            setEmail(next)
            if (touched) setInvalid(!inputRef.current?.validity.valid)
          }}
          viewProps={{
            width: 'fill',
            ref: inputRef,
            onBlur: () => {
              setTouched(true)
              setInvalid(!inputRef.current?.validity.valid)
            },
          }}
        />
      </FormField>
    </Form>
  )
}
