import { useRef, useState } from 'react'
import { Column, Form, FormField, Input, Text } from '../../../index'

export default function InputFileInputDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<string[]>([])

  return (
    <Form onReset={() => setSelected([])} viewProps={{ width: 352 }}>
      <Column gap={12}>
        <FormField label="Attachments">
          <Input
            type="file"
            name="attachments"
            accept=".pdf,image/*"
            multiple
            onChange={() =>
              setSelected(Array.from(inputRef.current?.files ?? [], (file) => file.name))
            }
            viewProps={{ ref: inputRef, width: 'fill' }}
          />
        </FormField>
        <Text typo="body-small" color="secondary">
          {selected.length ? selected.join(', ') : 'No files selected'}
        </Text>
      </Column>
    </Form>
  )
}
