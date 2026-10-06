import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Code, Column, Flex, Link, Text } from '../index'
import { DocumentationPropsTable } from './DocumentationPropsTable'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationComponentApi } from './documentation-component-api'
import { documentationComponentDemoNameForApi } from './documentation-navigation-data'

export interface DocumentationComponentApiPageProps {
  componentName: string
}

export function DocumentationComponentApiPage({
  componentName,
}: DocumentationComponentApiPageProps) {
  const { t } = useTranslation()
  const api = documentationComponentApi(componentName)
  const contentRef = useRef<HTMLDivElement>(null)
  const demoComponentName = documentationComponentDemoNameForApi(componentName)

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
          <Text typo="display-medium">{t('docs.api.pageTitle', { component: componentName })}</Text>
          <Text typo="body-large">
            {t('docs.api.pageDescription', { component: componentName })}
          </Text>
        </Column>

        <Column
          id="demos"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': t('docs.api.demos') }}
          gap={1}
        >
          <Text typo="headline-small">{t('docs.api.demos')}</Text>
          <Text typo="body-medium">{t('docs.api.demosDescription')}</Text>
          <Link
            href={`/docs/components/${demoComponentName}`}
            text={demoComponentName}
            hideUnderline
            viewProps={{ width: 'content' }}
          />
        </Column>

        <Column
          id="import"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': t('docs.api.import') }}
          gap={1}
        >
          <Text typo="headline-small">{t('docs.api.import')}</Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="typescript" viewProps={{ width: 'fill' }}>
              {`import { ${componentName} } from '${api.importPath}'`}
            </Code>
          </Card>
        </Column>

        <Column
          id="props"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': t('docs.api.props') }}
          gap={1}
        >
          <Text typo="headline-small">{t('docs.api.props')}</Text>
          <Text typo="body-medium">{t('docs.api.propsDescription')}</Text>
          {api.usesViewProps ? (
            <Link
              href="/docs/components-api/View#props"
              text={<Text typo="body-small">ViewProps</Text>}
              hideUnderline
              viewProps={{ width: 'content' }}
            />
          ) : null}
          {api.nativeProps ? (
            <Text typo="body-small" color="secondary">
              {t('docs.api.nativePropsDescription')}
            </Text>
          ) : null}
          {api.props.length > 0 || api.hasViewProps ? (
            <Column width="fill" overflow="auto">
              <DocumentationPropsTable props={api.props} includeViewProps={api.hasViewProps} />
            </Column>
          ) : null}
        </Column>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
