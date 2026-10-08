import { Column, Form, FormField, Input, Text } from '../../../index'

export default function ColorInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
      <Column gap={12}>
        <FormField label="Accent color">
          <Input type="color" name="accentColor" defaultValue="#e76b94" />
        </FormField>
        <Text typo="body-small" color="secondary">
          Choose a swatch, adjust hue, saturation or lightness, or enter a HEX color.
        </Text>
      </Column>
    </Form>
  )
}
