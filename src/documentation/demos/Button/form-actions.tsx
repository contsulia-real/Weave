import { useState } from 'react'
import { Button, Column, Form, Input, Row, Text } from '../../../index'

export default function ButtonFormActionsDemo() {
  const [status, setStatus] = useState('Waiting')

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        setStatus('Submitted')
      }}
      onReset={() => setStatus('Reset')}
      viewProps={{ width: 320 }}
    >
      <Column gap={16}>
        <Input placeholder="Message" type="text" />
        <Row gap={16}>
          <Button type="submit" text="Submit" />
          <Button type="reset" text="Reset" variant="secondary" />
        </Row>
        <Text typo="body-small">{status}</Text>
      </Column>
    </Form>
  )
}
