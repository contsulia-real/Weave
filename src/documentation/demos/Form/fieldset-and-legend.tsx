import { Form, FormFieldset, FormLegend, Radio } from '../../../index'

export default function FormFieldsetAndLegendDemo() {
  return (
    <Form viewProps={{ width: 24 }}>
      <FormFieldset>
        <FormLegend>Digest frequency</FormLegend>
        <Radio label="Daily" group="digest" value="daily" defaultChecked />
        <Radio label="Weekly" group="digest" value="weekly" />
        <Radio label="Never" group="digest" value="never" />
      </FormFieldset>
    </Form>
  )
}
