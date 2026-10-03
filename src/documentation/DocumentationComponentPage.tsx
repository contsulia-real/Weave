import { useRef } from 'react'
import { Card, Column, Flex, Text } from '../index'
import { DocumentationComponentApiLink } from './DocumentationComponentApiLink'
import { DocumentationComponentExampleCard } from './DocumentationComponentExampleCard'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationComponentDocumentation } from './documentation-component-examples'
import { documentationAdjacentComponentNames } from './documentation-navigation-data'
import { useDocsRoute } from './router'

export interface DocumentationComponentPageProps {
  componentName: string
}

export function DocumentationComponentPage({ componentName }: DocumentationComponentPageProps) {
  const definition = documentationComponentDocumentation(componentName)
  const contentRef = useRef<HTMLDivElement>(null)
  const apiComponents = definition.apiComponents ?? [componentName]
  const { navigate } = useDocsRoute()
  const adjacent = documentationAdjacentComponentNames(componentName)

  return (
    <Flex
      width="fill"
      padding={1}
      gap={2}
      align="start"
      direction="column"
      md={{ padding: 2 }}
      xl={{ direction: 'row' }}
    >
      <Column ref={contentRef} grow={1} minWidth={0} width="fill" gap={3}>
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
            width="fill"
            minWidth={0}
            gap={1}
          >
            <Text typo="headline-small">{example.title}</Text>
            {example.description === undefined ? null : (
              <Text typo="body-medium">{example.description}</Text>
            )}
            <DocumentationComponentExampleCard code={example.code} codeMode={example.codeMode} />
          </Column>
        ))}

        {apiComponents.length > 0 ? (
          <DocumentationComponentApiLink componentNames={apiComponents} />
        ) : null}

        <Flex width="fill" gap={1} direction="column" md={{ direction: 'row' }}>
          <Card
            clickable={adjacent.previous !== null}
            viewProps={{
              grow: 1,
              width: 'fill',
              padding: 1.5,
              disabled: adjacent.previous === null,
              onClick:
                adjacent.previous === null
                  ? undefined
                  : () => {
                      navigate(`/docs/components/${adjacent.previous}`)
                    },
            }}
          >
            <Column gap={0.25}>
              <Text typo="label-medium" color="secondary">
                Previous component
              </Text>
              <Text typo="title-medium">{adjacent.previous ?? '—'}</Text>
            </Column>
          </Card>

          <Card
            clickable={adjacent.next !== null}
            viewProps={{
              grow: 1,
              width: 'fill',
              padding: 1.5,
              disabled: adjacent.next === null,
              onClick:
                adjacent.next === null
                  ? undefined
                  : () => {
                      navigate(`/docs/components/${adjacent.next}`)
                    },
            }}
          >
            <Column gap={0.25}>
              <Text typo="label-medium" color="secondary">
                Next component
              </Text>
              <Text typo="title-medium">{adjacent.next ?? '—'}</Text>
            </Column>
          </Card>
        </Flex>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
