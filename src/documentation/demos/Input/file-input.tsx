import { Column, Form, FormField, Input, Text } from '../../../index'

export default function InputFileInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
      <Column gap={8}>
        <FormField label="Attachments">
          <Input
            type="file"
            name="attachments"
            accept=".pdf,image/*"
            multiple
            dropzone
            viewProps={{ width: 'fill' }}
          />
        </FormField>
        <Text typo="body-small" color="secondary">
          Drop PDF or image files here, or click to browse.
        </Text>
      </Column>
    </Form>
  )
}
