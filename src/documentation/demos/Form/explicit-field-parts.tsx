import { Form, FormDescription, FormError, FormField, FormLabel, Input } from '../../../index'

export default function FormExplicitFieldPartsDemo() {
  return (
    <Form viewProps={{ width: 24 }}>
      <FormField>
        <FormLabel>Username</FormLabel>
        <Input name="username" defaultValue="alex" />
        <FormDescription>Shown publicly on your profile.</FormDescription>
        <FormError>This username is unavailable.</FormError>
      </FormField>
    </Form>
  )
}
