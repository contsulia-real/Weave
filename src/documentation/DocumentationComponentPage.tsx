import { type RefObject, useRef, useState } from 'react'
import { Card, Column, FormField, Input, Row, Select, SelectOption, Switch, Text } from '../index'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import {
  type DocumentationPlaygroundControl,
  type DocumentationPlaygroundValue,
  documentationComponentDefinition,
} from './documentation-component-playgrounds'

export interface DocumentationComponentPageProps {
  componentName: string
  scrollContainerRef: RefObject<HTMLDivElement | null>
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

export function DocumentationComponentPage({
  componentName,
  scrollContainerRef,
}: DocumentationComponentPageProps) {
  const definition = documentationComponentDefinition(componentName)
  const [values, setValues] = useState<Record<string, DocumentationPlaygroundValue>>(
    definition.defaults,
  )
  const contentRef = useRef<HTMLDivElement>(null)

  const previewKey = JSON.stringify(values)

  return (
    <Row width="fill" padding={2} gap={2} align="start">
      <Column ref={contentRef} grow={1} minWidth={0} gap={2}>
        <Column width="fill" gap={0.75}>
          <Text typo="display-medium">{componentName}</Text>
          <Text typo="body-medium">{definition.description}</Text>
        </Column>

        <Column
          id="playground"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': 'Playground',
          }}
          gap={1}
        >
          <Text typo="headline-small">Playground</Text>

          <Card viewProps={{padding: 0}}>
            <Row maxHeight={24}>
              <Column key={previewKey} overflow='auto' padding={1} style={{height: 'fill',flex: 1}}>
                {definition.render(values)}
              </Column>

              <Column gap={1} background='surfaceHover' overflow='auto' padding={1} minWidth='30%'>
                {definition.controls.map((control) => (
                  <FormField
                    key={control.prop}
                    label={control.prop}
                    viewProps={{
                      direction: 'row',
                      align: 'center',
                      justify: 'space-between',
                      style: { display: 'flex' },
                    }}
                  >
                    {parameterControl(control, values[control.prop], (next) => {
                      setValues((current) => ({ ...current, [control.prop]: next }))
                    })}
                  </FormField>
                ))}
              </Column>
            </Row>
          </Card>
        </Column>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} scrollContainerRef={scrollContainerRef} />
    </Row>
  )
}
