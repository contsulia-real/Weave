import { Column, Link, Text } from '../index'

export interface DocumentationComponentApiLinkProps {
  componentName: string
}

export function DocumentationComponentApiLink({
  componentName,
}: DocumentationComponentApiLinkProps) {
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
      <Text typo="body-medium">See the complete public API reference for this component.</Text>
      <Link href={`/docs/components-api/${componentName}`} text={`<${componentName} />`} hideIcon />
    </Column>
  )
}
