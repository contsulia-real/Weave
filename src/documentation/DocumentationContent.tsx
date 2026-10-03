import type { TFunction } from 'i18next'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Text } from '../index'
import { DocumentationComponentApiPage } from './DocumentationComponentApiPage'
import { DocumentationComponentPage } from './DocumentationComponentPage'
import { DocumentationGettingStarted } from './DocumentationGettingStarted'
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

  if (pathname === '/docs/getting-started') {
    return (
      <Column ref={scrollContainerRef} width="fill" height="fill" overflow="auto">
        <DocumentationGettingStarted />
      </Column>
    )
  }

  if (componentName !== null) {
    return (
      <Column ref={scrollContainerRef} width="fill" height="fill" overflow="auto">
        <DocumentationComponentPage key={componentName} componentName={componentName} />
      </Column>
    )
  }

  if (componentApiName !== null) {
    return (
      <Column ref={scrollContainerRef} width="fill" height="fill" overflow="auto">
        <DocumentationComponentApiPage key={componentApiName} componentName={componentApiName} />
      </Column>
    )
  }

  return (
    <Column ref={scrollContainerRef} width="fill" height="fill" overflow="auto">
      <Column grow={1} width="fill">
        <Column width="fill" padding={2} gap={0.75}>
          <Text typo="display-small">{routeTitle(section, t)}</Text>
        </Column>
      </Column>
    </Column>
  )
}
