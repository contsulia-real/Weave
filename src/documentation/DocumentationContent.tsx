import type { TFunction } from 'i18next'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Text } from '../index'
import { DocumentationComponentApiPage } from './DocumentationComponentApiPage'
import { DocumentationComponentPage } from './DocumentationComponentPage'
import { DocumentationGettingStarted } from './DocumentationGettingStarted'
import {
  DocumentationAZ,
  DocumentationInstallation,
  DocumentationOverview,
} from './DocumentationGuides'
import {
  documentationComponentApiNameForPath,
  documentationComponentNameForPath,
} from './documentation-navigation-data'

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
  const componentApiName = documentationComponentApiNameForPath(pathname)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const content =
    pathname === '/docs' ? (
      <DocumentationOverview />
    ) : pathname === '/docs/installation' ? (
      <DocumentationInstallation />
    ) : pathname === '/docs/a-z' || pathname === '/docs/components' ? (
      <DocumentationAZ />
    ) : pathname === '/docs/getting-started' ? (
      <DocumentationGettingStarted />
    ) : componentName !== null ? (
      <DocumentationComponentPage key={componentName} componentName={componentName} />
    ) : componentApiName !== null ? (
      <DocumentationComponentApiPage key={componentApiName} componentName={componentApiName} />
    ) : (
      <Column grow={1} width="fill">
        <Column width="fill" padding={32} gap={12}>
          <Text typo="display-small">{routeTitle(section, t)}</Text>
        </Column>
      </Column>
    )

  return (
    <Column
      ref={scrollContainerRef}
      width="fill"
      height="fill"
      overflow="auto"
      container="documentation-content"
    >
      {content}
    </Column>
  )
}
