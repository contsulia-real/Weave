import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Column, Text } from '../index'
import { DocumentationComponentPage } from './DocumentationComponentPage'
import { DocumentationGettingStarted } from './DocumentationGettingStarted'
import { documentationComponentNameForPath } from './documentation-navigation-data'

export interface DocumentationContentProps {
  section: string
  pathname: string
}

function routeTitle(section: string, t: TFunction): string {
  if (section === 'components') return t('docs.route.components')
  return t('docs.route.overview')
}

export function DocumentationContent({ section, pathname }: DocumentationContentProps) {
  const { t } = useTranslation()
  const componentName = documentationComponentNameForPath(pathname)

  if (pathname === '/docs/getting-started') {
    return (
      <Column width="fill" height="fill" overflow="auto">
        <DocumentationGettingStarted />
      </Column>
    )
  }

  if (componentName !== null) {
    return (
      <Column width="fill" height="fill" overflow="auto">
        <DocumentationComponentPage key={componentName} componentName={componentName} />
      </Column>
    )
  }

  return (
    <Column width="fill" height="fill" overflow="auto">
      <Column grow={1} width="fill">
        <Column width="fill" padding={2} gap={0.75}>
          <Text typo="display-small">{routeTitle(section, t)}</Text>
        </Column>
      </Column>
    </Column>
  )
}
