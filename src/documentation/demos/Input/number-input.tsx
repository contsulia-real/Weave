import { useState } from 'react'
import { Column, Form, FormField, Input, Text } from '../../../index'

export default function InputNumberInputDemo() {
  const [value, setValue] = useState('2.5')

  return (
    <Form viewProps={{ width: 320 }}>
      <Column gap={12}>
        <FormField label="Quantity">
          <Input
            type="number"
            name="quantity"
            min={0}
            max={5}
            step={0.25}
            value={value}
            onChange={setValue}
            viewProps={{ width: 'fill' }}
          />
        </FormField>
        <Text typo="body-small" color="secondary">
          Drag the selector icon left or right to adjust. Value: {value}
        </Text>
      </Column>
    </Form>
  )
}
