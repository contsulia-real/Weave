import { useTranslation } from 'react-i18next'
import { Form, FormField, Input } from '../../../index'

export default function InputFileInputDemo() {
  const { t } = useTranslation('copy')

  return (
    <Form viewProps={{ width: 352 }}>
      <FormField label={t('Attachments')}>
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
