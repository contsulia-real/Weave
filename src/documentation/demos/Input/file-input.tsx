import { Form, FormField, Input } from '../../../index'

export default function InputFileInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
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
    </Form>
  )
}
