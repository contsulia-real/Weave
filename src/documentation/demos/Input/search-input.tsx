import { useState } from 'react'
import { Column, Form, FormField, Input, Text } from '../../../index'

export default function InputSearchInputDemo() {
  const [query, setQuery] = useState('Weave')

  return (
    <Form viewProps={{ width: 320 }}>
      <Column gap={8}>
        <FormField label="Search">
          <Input
            type="search"
            name="query"
            value={query}
            onChange={setQuery}
            placeholder="Search notes"
            viewProps={{ width: 'fill' }}
          />
        </FormField>
        <Text typo="body-small" color="secondary">
          Query: {query || 'Empty'}
        </Text>
      </Column>
    </Form>
  )
}
