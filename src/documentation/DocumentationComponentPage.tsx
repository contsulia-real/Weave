import { type RefObject, useRef, useState } from 'react'
import {
  Card,
  Column,
  FormField,
  Input,
  Row,
  Select,
  SelectOption,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from '../index'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import {
  type DocumentationApiEditor,
  type DocumentationApiProp,
  documentationComponentApi,
} from './documentation-component-api'
import { applyDocumentationPlaygroundOverrides } from './documentation-component-playground-overrides'
import {
  type DocumentationPlaygroundControl,
  type DocumentationPlaygroundValue,
  documentationComponentDefinition,
} from './documentation-component-playgrounds'

export interface DocumentationComponentPageProps {
  componentName: string
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

type PlaygroundValues = Record<string, DocumentationPlaygroundValue>
type ParameterEditor = DocumentationPlaygroundControl | DocumentationApiEditor

function parameterControl(
  control: ParameterEditor,
  value: DocumentationPlaygroundValue | undefined,
  onChange: (value: DocumentationPlaygroundValue) => void,
) {
  switch (control.kind) {
    case 'boolean':
      return <Switch checked={value === true} onChange={onChange} />
    case 'number':
      return (
        <Input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(next) => {
            const parsed = Number(next)
            if (next.length > 0 && Number.isFinite(parsed)) onChange(parsed)
          }}
        />
      )
    case 'select':
      return (
        <Select value={value === undefined ? null : String(value)} onValueChange={onChange}>
          {control.options.map((option) => (
            <SelectOption key={option} value={option} text={option} />
          ))}
        </Select>
      )
    case 'text':
      return <Input value={value === undefined ? '' : String(value)} onChange={onChange} />
  }
}

function apiPropControl(
  prop: DocumentationApiProp,
  control: DocumentationPlaygroundControl | undefined,
  values: PlaygroundValues,
  overrides: PlaygroundValues,
  onValueChange: (prop: string, value: DocumentationPlaygroundValue) => void,
  onOverrideChange: (prop: string, value: DocumentationPlaygroundValue) => void,
) {
  const editor = control ?? prop.editor
  const value = control === undefined ? overrides[prop.name] : values[prop.name]

  return (
    <Column key={prop.name} gap={0.25}>
      {editor === undefined ? (
        <Text typo="label-medium">{prop.name}</Text>
      ) : (
        <FormField
          label={prop.name}
          viewProps={{
            direction: 'row',
            align: 'center',
            justify: 'space-between',
            gap: 1,
          }}
        >
          {parameterControl(editor, value, (next) => {
            if (control === undefined) {
              onOverrideChange(prop.name, next)
              return
            }

            onValueChange(prop.name, next)
          })}
        </FormField>
      )}
      <Text typo="body-xsmall">{prop.optional ? `optional · ${prop.type}` : prop.type}</Text>
    </Column>
  )
}

function apiPanel(
  props: readonly DocumentationApiProp[],
  controls: ReadonlyMap<string, DocumentationPlaygroundControl>,
  values: PlaygroundValues,
  overrides: PlaygroundValues,
  onValueChange: (prop: string, value: DocumentationPlaygroundValue) => void,
  onOverrideChange: (prop: string, value: DocumentationPlaygroundValue) => void,
) {
  return (
    <Column gap={1}>
      {props.map((prop) =>
        apiPropControl(
          prop,
          controls.get(prop.name),
          values,
          overrides,
          onValueChange,
          onOverrideChange,
        ),
      )}
    </Column>
  )
}

export function DocumentationComponentPage({
  componentName,
  scrollContainerRef,
}: DocumentationComponentPageProps) {
  const definition = documentationComponentDefinition(componentName)
  const api = documentationComponentApi(componentName)
  const [values, setValues] = useState<PlaygroundValues>(definition.defaults)
  const [attributeOverrides, setAttributeOverrides] = useState<PlaygroundValues>({})
  const [viewPropOverrides, setViewPropOverrides] = useState<PlaygroundValues>({})
  const contentRef = useRef<HTMLDivElement>(null)
  const controls = new Map(definition.controls.map((control) => [control.prop, control] as const))
  const overrides = {
    attributes: attributeOverrides,
    viewProps: viewPropOverrides,
  }
  const previewKey = JSON.stringify([values, attributeOverrides, viewPropOverrides])
  const preview = applyDocumentationPlaygroundOverrides(
    definition.render(values, overrides),
    componentName,
    api.hasViewProps,
    attributeOverrides,
    viewPropOverrides,
  )

  const updateValues = (prop: string, value: DocumentationPlaygroundValue) => {
    setValues((current) => ({ ...current, [prop]: value }))
  }
  const updateAttributeOverride = (prop: string, value: DocumentationPlaygroundValue) => {
    setAttributeOverrides((current) => ({ ...current, [prop]: value }))
  }
  const updateViewPropOverride = (prop: string, value: DocumentationPlaygroundValue) => {
    setViewPropOverrides((current) => ({ ...current, [prop]: value }))
  }

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

          <Card viewProps={{ padding: 0 }}>
            <Row maxHeight={24} align="stretch">
              <Column
                key={previewKey}
                grow={1}
                basis={0}
                minWidth={0}
                minHeight={0}
                overflow="auto"
                padding={1}
              >
                {preview}
              </Column>

              <Column
                grow={1}
                basis={0}
                minWidth={0}
                minHeight={0}
                background="surfaceHover"
                padding={1}
              >
                <Tabs defaultValue="viewProps" viewProps={{ grow: 1, minHeight: 0 }}>
                  <TabList>
                    <Tab value="viewProps">viewProps</Tab>
                    <Tab value="attributes">attributes</Tab>
                  </TabList>

                  <TabPanel
                    value="viewProps"
                    viewProps={{ grow: 1, minHeight: 0, overflow: 'auto', paddingTop: 1 }}
                  >
                    {apiPanel(
                      api.viewProps,
                      controls,
                      values,
                      viewPropOverrides,
                      updateValues,
                      updateViewPropOverride,
                    )}
                  </TabPanel>

                  <TabPanel
                    value="attributes"
                    viewProps={{ grow: 1, minHeight: 0, overflow: 'auto', paddingTop: 1 }}
                  >
                    {apiPanel(
                      api.attributes,
                      controls,
                      values,
                      attributeOverrides,
                      updateValues,
                      updateAttributeOverride,
                    )}
                  </TabPanel>
                </Tabs>
              </Column>
            </Row>
          </Card>
        </Column>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} scrollContainerRef={scrollContainerRef} />
    </Row>
  )
}
