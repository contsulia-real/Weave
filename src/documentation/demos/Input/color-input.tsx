import { useTranslation } from 'react-i18next'
import { Column, Form, FormField, Input, Text } from '../../../index'

export default function ColorInputDemo() {
  const { t } = useTranslation('copy')
  return (
    <Form viewProps={{ width: 352 }}>
      <Column gap={12}>
        <FormField label={t('Accent color')}>
          <Input type="color" name="accentColor" defaultValue="#e76b94" />
        </FormField>
        <Text typo="body-small" color="secondary">
          {t(
            'Adjust saturation and brightness on the color field, use the hue slider, or enter a HEX color.',
          )}
        </Text>
      </Column>
    </Form>
  )
}
