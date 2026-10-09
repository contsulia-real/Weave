import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function InputUrlInputDemo() {
  const { t } = useTranslation('copy')
  const [url, setUrl] = useState('https://example.com')
  const [touched, setTouched] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Form viewProps={{ width: 320 }}>
      <FormField
        label={t('Website URL')}
        required
        error={touched && invalid ? t('Enter a valid URL.') : undefined}
      >
        <Input
          type="url"
          name="website"
          required
          autoComplete="url"
          placeholder={t('Enter a website URL')}
          value={url}
          onChange={(next) => {
            setUrl(next)
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
