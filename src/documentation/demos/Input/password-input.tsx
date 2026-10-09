import { useState } from 'react'
import { Form, FormField, Input } from '../../../index'

export default function InputPasswordInputDemo() {
  const [password, setPassword] = useState('')

  return (
    <Form viewProps={{ width: 320 }}>
      <FormField label="Password">
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={password}
          onChange={setPassword}
          viewProps={{ width: 'fill' }}
        />
      </FormField>
    </Form>
  )
}
