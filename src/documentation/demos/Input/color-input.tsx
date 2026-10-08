import { Column, Form, FormField, Input, Text } from '../../../index'

export default function ColorInputDemo() {
  return (
    <Form viewProps={{ width: 352 }}>
      <Column gap={12}>
        <FormField label="Accent color">
          <Input type="color" name="accentColor" defaultValue="#e76b94" />
        </FormField>
        <Text typo="body-small" color="secondary">
          Adjust saturation and brightness on the color field, use the hue slider, or enter a HEX
          color.
        </Text>
      </Column>
    </Form>
  )
}
