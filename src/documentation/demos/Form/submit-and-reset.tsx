import { useState } from 'react'
import { Button, Form, FormField, Input, Row, Text } from '../../../index'

export default function FormSubmitAndResetDemo() {
  const [status, setStatus] = useState('Waiting')

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        const project = new FormData(event.currentTarget).get('project')
        setStatus(`Submitted: ${project ?? ''}`)
      }}
      onReset={() => setStatus('Reset')}
      viewProps={{ width: 24 }}
    >
      <FormField label="Project name">
        <Input name="project" defaultValue="Atlas" required />
      </FormField>
      <Row gap={1}>
        <Button type="submit" text="Save" />
        <Button type="reset" text="Reset" variant="secondary" />
      </Row>
      <Text typo="body-small">{status}</Text>
    </Form>
  )
}
