import { Column, Link, Text } from '../index'

export interface DocumentationComponentApiLinkProps {
  componentNames: readonly string[]
}

export function DocumentationComponentApiLink({
  componentNames,
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
      <Text typo="body-medium">See the complete public API reference for these components.</Text>
      <Column gap={0.5}>
        {componentNames.map((componentName) => (
          <Link
            key={componentName}
            href={`/docs/components-api/${componentName}`}
            text={<Text>{'<' + componentName + '/>'}</Text>}
            hideUnderline
            viewProps={{ width: 'content' }}
          />
        ))}
      </Column>
    </Column>
  )
}
