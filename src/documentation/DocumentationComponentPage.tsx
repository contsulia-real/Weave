import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Breadcrumb,
  Card,
  Column,
  Flex,
  Icon,
  MenuItem,
  Row,
  Text,
} from '../index'
import { DocumentationComponentApiLink } from './DocumentationComponentApiLink'
import { DocumentationComponentExample } from './DocumentationComponentExampleCard'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationComponentDocumentation } from './documentation-component-examples'
import { documentationCopy } from './documentation-copy'
import { documentationDemo } from './documentation-demo-registry'
import {
  componentNavigationSections,
  documentationAdjacentComponentNames,
  documentationNavigationSectionForPath,
} from './documentation-navigation-data'
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
  const activeSection = documentationNavigationSectionForPath(`/docs/components/${componentName}`)

  return (
    <Flex
      width="fill"
      padding={16}
      gap={32}
      align="start"
      direction="column"
      containerMd={{ padding: 32 }}
      containerLg={{ direction: 'row', justify: 'center' }}
    >
      <Column ref={contentRef} grow={1} minWidth={0} width="fill" maxWidth={832} gap={48}>
        <Column width="fill" gap={12}>
          <Breadcrumb
            items={[
              { text: t('copy:Home'), href: '/docs' },
              { text: t('copy:Components') },
              {
                text: componentName,
                menu: (
                  <Column maxHeight={320} overflow="auto">
                    <Accordion
                      noDividers
                      defaultValue={activeSection}
                      viewProps={{ width: 'fill' }}
                    >
                      {componentNavigationSections.map((section) => (
                        <AccordionItem key={section.value} value={section.value}>
                          <AccordionTrigger singleLine>{t(section.labelKey)}</AccordionTrigger>
                          <AccordionPanel>
                            {section.items.map((item) => (
                              <MenuItem
                                key={item.path}
                                text={item.label}
                                onSelect={() => navigate(item.path)}
                              />
                            ))}
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Column>
                ),
              },
            ]}
          />
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
              gap={16}
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

        <Flex width="fill" gap={16} direction="column" containerMd={{ direction: 'row' }}>
          <Card
            clickable={adjacent.previous !== null}
            viewProps={{
              grow: 1,
              width: 'fill',
              padding: 24,
              disabled: adjacent.previous === null,
              onClick:
                adjacent.previous === null
                  ? undefined
                  : () => {
                      navigate(`/docs/components/${adjacent.previous}`)
                    },
            }}
          >
            <Row gap={16} align="center" justify="start">
              <Icon icon={IconArrowLeft} size="large" />
              <Column gap={4}>
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
              padding: 24,
              disabled: adjacent.next === null,
              onClick:
                adjacent.next === null
                  ? undefined
                  : () => {
                      navigate(`/docs/components/${adjacent.next}`)
                    },
            }}
          >
            <Row gap={16} align="center" justify="end">
              <Column gap={4} align="end">
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
