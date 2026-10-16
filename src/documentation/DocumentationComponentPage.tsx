import { Fragment, lazy, Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, Column, Flex, MenuItem, Text } from '../index'
import { DocumentationComponentApiLink } from './DocumentationComponentApiLink'
import { DocumentationPageNavigation } from './DocumentationPageNavigation'
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

const DocumentationComponentExample = lazy(() =>
  import('./DocumentationComponentExampleCard').then(({ DocumentationComponentExample }) => ({
    default: DocumentationComponentExample,
  })),
)

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
  const activeGroup = componentNavigationSections.find((group) => group.value === activeSection)

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
              {
                text: t(activeGroup?.labelKey ?? 'copy:Components'),
                menu: componentNavigationSections.map((group) => (
                  <MenuItem
                    key={group.value}
                    text={t(group.labelKey)}
                    onSelect={() => {
                      const first = group.items[0]
                      if (first !== undefined) navigate(first.path)
                    }}
                  />
                )),
              },
              {
                text: componentName,
                menu: (
                  <Column maxHeight={320} overflow="auto">
                    {activeGroup?.items.map((item) => (
                      <MenuItem
                        key={item.path}
                        text={item.label}
                        onSelect={() => navigate(item.path)}
                      />
                    ))}
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
          const inputSection =
            componentName === 'Input' && example.id === 'email-input'
              ? { id: 'input-types', label: t('docs.input.types') }
              : componentName === 'Input' && example.id === 'controlled-input'
                ? { id: 'controlled-and-linked', label: t('docs.input.controlled') }
                : null
          const showInContents =
            componentName !== 'Input' ||
            example.id === 'basic-usage' ||
            example.id === 'form-states'

          return (
            <Fragment key={example.demo}>
              {inputSection === null ? null : (
                <Column
                  id={inputSection.id}
                  data={{
                    'weave-doc-section': '',
                    'weave-doc-section-label': inputSection.label,
                  }}
                  width="fill"
                >
                  <Text typo="headline-medium">{inputSection.label}</Text>
                </Column>
              )}
              <Column
                id={example.id}
                data={
                  showInContents
                    ? {
                        'weave-doc-section': '',
                        'weave-doc-section-label': title,
                      }
                    : undefined
                }
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
            </Fragment>
          )
        })}

        {apiComponents.length > 0 ? (
          <DocumentationComponentApiLink componentNames={apiComponents} />
        ) : null}

        <DocumentationPageNavigation
          previous={
            adjacent.previous === null
              ? { path: '/docs/a-z', label: t('docs.nav.weaveAZ') }
              : { path: `/docs/components/${adjacent.previous}`, label: adjacent.previous }
          }
          previousLabel={adjacent.previous === null ? documentationCopy(t, 'Previous') : undefined}
          next={
            adjacent.next === null
              ? null
              : { path: `/docs/components/${adjacent.next}`, label: adjacent.next }
          }
        />
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
