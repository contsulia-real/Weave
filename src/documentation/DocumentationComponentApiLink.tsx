import { useTranslation } from 'react-i18next'
import { Column, Link, Text } from '../index'
import { DocumentationPropsTable } from './DocumentationPropsTable'
import { documentationComponentApi } from './documentation-component-api'

export interface DocumentationComponentApiLinkProps {
  componentNames: readonly string[]
}

export function DocumentationComponentApiLink({
  componentNames,
}: DocumentationComponentApiLinkProps) {
  const { t } = useTranslation()

  return (
    <Column
      id="api"
      data={{
        'weave-doc-section': '',
        'weave-doc-section-label': t('docs.api.heading'),
      }}
      gap={24}
    >
      <Column gap={8}>
        <Text typo="headline-small">{t('docs.api.heading')}</Text>
        <Text typo="body-medium">{t('docs.api.linkDescription')}</Text>
      </Column>

      {componentNames.map((componentName) => {
        const api = documentationComponentApi(componentName)

        return (
          <Column key={componentName} gap={12} width="fill">
            <Link
              href={`/docs/components-api/${componentName}`}
              text={<Text typo="title-medium">{'<' + componentName + '/>'}</Text>}
              hideUnderline
              viewProps={{ width: 'content' }}
            />
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
        )
      })}
    </Column>
  )
}
