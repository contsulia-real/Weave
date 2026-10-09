import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Form, FormField, Input, Text } from '../../../index'

export default function InputSearchInputDemo() {
  const { t } = useTranslation('copy')
  const [query, setQuery] = useState('Weave')

  return (
    <Form viewProps={{ width: 320 }}>
      <Column gap={8}>
        <FormField label={t('Search')}>
          <Input
            type="search"
            name="query"
            value={query}
            onChange={setQuery}
            placeholder={t('Search notes')}
            viewProps={{ width: 'fill' }}
          />
        </FormField>
        <Text typo="body-small" color="secondary">
          {t('Query: {{value}}', { value: query || t('Empty') })}
        </Text>
      </Column>
    </Form>
  )
}
