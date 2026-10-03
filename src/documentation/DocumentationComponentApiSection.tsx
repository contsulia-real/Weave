import { Card, Code, Column, Text } from '../index'
import { type DocumentationApiProp, documentationComponentApi } from './documentation-component-api'

export interface DocumentationComponentApiSectionProps {
  componentName: string
}

function apiSource(props: readonly DocumentationApiProp[]): string {
  return props.map((prop) => `${prop.name}${prop.optional ? '?' : ''}: ${prop.type}`).join('\n')
}

function ApiGroup({ title, props }: { title: string; props: readonly DocumentationApiProp[] }) {
  if (props.length === 0) return null

  return (
    <Column gap={0.75}>
      <Text typo="title-medium">{title}</Text>
      <Card viewProps={{ padding: 0, overflow: 'hidden' }}>
        <Code
          language="typescript"
          viewProps={{
            width: 'fill',
            overflow: 'auto',
            padding: 1.25,
            background: 'surfaceHover',
          }}
        >
          {apiSource(props)}
        </Code>
      </Card>
    </Column>
  )
}

export function DocumentationComponentApiSection({
  componentName,
}: DocumentationComponentApiSectionProps) {
  const api = documentationComponentApi(componentName)

  return (
    <Column
      id="api"
      data={{
        'weave-doc-section': '',
        'weave-doc-section-label': 'API',
      }}
      gap={1}
    >
      <Text typo="headline-small">API</Text>
      <ApiGroup title="attributes" props={api.attributes} />
      <ApiGroup title="viewProps" props={api.viewProps} />
    </Column>
  )
}
