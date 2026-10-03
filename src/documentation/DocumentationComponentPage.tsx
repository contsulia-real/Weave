import { useRef } from 'react'
import { Column, Row, Text } from '../index'
import { DocumentationComponentApiLink } from './DocumentationComponentApiLink'
import { DocumentationComponentExampleCard } from './DocumentationComponentExampleCard'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationComponentDocumentation } from './documentation-component-examples'

export interface DocumentationComponentPageProps {
  componentName: string
}

export function DocumentationComponentPage({ componentName }: DocumentationComponentPageProps) {
  const definition = documentationComponentDocumentation(componentName)
  const contentRef = useRef<HTMLDivElement>(null)
  const apiComponents = definition.apiComponents ?? [componentName]

  return (
    <Row width="fill" padding={2} gap={2} align="start">
      <Column ref={contentRef} grow={1} minWidth={0} gap={3}>
        <Column width="fill" gap={0.75}>
          <Text typo="display-medium">{componentName}</Text>
          <Text typo="body-large">{definition.description}</Text>
        </Column>

        {definition.examples.map((example) => (
          <Column
            key={example.id}
            id={example.id}
            data={{
              'weave-doc-section': '',
              'weave-doc-section-label': example.title,
            }}
            gap={1}
          >
            <Text typo="headline-small">{example.title}</Text>
            <DocumentationComponentExampleCard preview={example.preview} code={example.code} />
          </Column>
        ))}

        <DocumentationComponentApiLink componentNames={apiComponents} />
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} />
    </Row>
  )
}
