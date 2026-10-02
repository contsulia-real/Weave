import { useState } from 'react'
import { Column, FormField, Input, Row, Select, SelectOption, Switch, Text } from '../index'
import {
  type DocumentationPlaygroundControl,
  type DocumentationPlaygroundValue,
  documentationComponentDefinition,
} from './documentation-component-playgrounds'

export interface DocumentationComponentPageProps {
  componentName: string
}

function parameterControl(
  control: DocumentationPlaygroundControl,
  value: DocumentationPlaygroundValue,
  onChange: (value: DocumentationPlaygroundValue) => void,
) {
  switch (control.kind) {
    case 'boolean':
      return <Switch checked={value === true} onChange={onChange} />
    case 'number':
      return (
        <Input
          type="number"
          value={typeof value === 'number' ? value : Number(value)}
          onChange={(next) => {
            const parsed = Number(next)
            if (Number.isFinite(parsed)) onChange(parsed)
          }}
        />
      )
    case 'select':
      return (
        <Select value={String(value)} onValueChange={onChange}>
          {control.options.map((option) => (
            <SelectOption key={option} value={option} text={option} />
          ))}
        </Select>
      )
    case 'text':
      return <Input value={String(value)} onChange={onChange} />
  }
}

export function DocumentationComponentPage({ componentName }: DocumentationComponentPageProps) {
  const definition = documentationComponentDefinition(componentName)
  const [values, setValues] = useState<Record<string, DocumentationPlaygroundValue>>(
    definition.defaults,
  )

  const previewKey = JSON.stringify(values)

  return (
    <Column width="fill" padding={2} gap={2}>
      <Column width="fill" gap={0.75}>
        <Text typo="display-medium">{componentName}</Text>
        <Text typo="body-medium">{definition.description}</Text>
      </Column>

      <Column width="fill" gap={1.5}>
        <Text typo="headline-small">Playground</Text>

        <Row width="fill" gap={2} align="start">
          <Column key={previewKey} grow={1} basis={0} minWidth={0} padding={2}>
            {definition.render(values)}
          </Column>

          <Column grow={1} basis={0} minWidth={0} gap={1.5}>
            {definition.controls.map((control) => (
              <FormField key={control.prop} label={control.prop}>
                {parameterControl(control, values[control.prop], (next) => {
                  setValues((current) => ({ ...current, [control.prop]: next }))
                })}
              </FormField>
            ))}
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
