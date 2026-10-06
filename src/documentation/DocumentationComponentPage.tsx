import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Column, Flex, Icon, Row, Text } from '../index'
import { DocumentationComponentApiLink } from './DocumentationComponentApiLink'
import { DocumentationComponentExample } from './DocumentationComponentExampleCard'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationComponentDocumentation } from './documentation-component-examples'
import { documentationCopy } from './documentation-copy'
import { documentationDemo } from './documentation-demo-registry'
import { documentationAdjacentComponentNames } from './documentation-navigation-data'
import { useDocsRoute } from './router'

export interface DocumentationComponentPageProps {
  componentName: string
}

export function DocumentationComponentPage({ componentName }: DocumentationComponentPageProps) {
  const { t } = useTranslation(['translation', 'copy'])
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
      containerMd={{ padding: 2 }}
      containerLg={{ direction: 'row', justify: 'center' }}
    >
      <Column ref={contentRef} grow={1} minWidth={0} width="fill" maxWidth={52} gap={3}>
        <Column width="fill" gap={0.75}>
          <Text typo="display-medium">{componentName}</Text>
          <Text typo="body-large">{documentationCopy(t, definition.description)}</Text>
        </Column>

        {definition.examples.map((example) => {
          const demo = documentationDemo(example.demo)
          const title = documentationCopy(t, example.title)
          const description =
            typeof example.description === 'string'
              ? documentationCopy(t, example.description)
              : example.description

          return (
            <Column
              key={example.demo}
              id={example.id}
              data={{
                'weave-doc-section': '',
                'weave-doc-section-label': title,
              }}
              width="fill"
              minWidth={0}
              gap={1}
            >
              <Text typo="headline-small">{title}</Text>
              {description === undefined ? null : <Text typo="body-medium">{description}</Text>}
              <Suspense fallback={null}>
                <DocumentationComponentExample demo={demo} />
              </Suspense>
            </Column>
          )
        })}

        {apiComponents.length > 0 ? (
          <DocumentationComponentApiLink componentNames={apiComponents} />
        ) : null}

        <Flex width="fill" gap={1} direction="column" containerMd={{ direction: 'row' }}>
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
            <Row gap={1} align="center" justify="start">
              <Icon icon={IconArrowLeft} size="large" />
              <Column gap={0.25}>
                <Text typo="label-medium" color="secondary">
                  {t('docs.component.previous')}
                </Text>
                <Text typo="title-medium">{adjacent.previous ?? '—'}</Text>
              </Column>
            </Row>
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
            <Row gap={1} align="center" justify="end">
              <Column gap={0.25} align="end">
                <Text typo="label-medium" color="secondary">
                  {t('docs.component.next')}
                </Text>
                <Text typo="title-medium">{adjacent.next ?? '—'}</Text>
              </Column>
              <Icon icon={IconArrowRight} size="large" />
            </Row>
          </Card>
        </Flex>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
