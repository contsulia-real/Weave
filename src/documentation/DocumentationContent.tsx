import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Column, Text } from '../index'

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

  return (
    <Column width="fill" height="fill" overflow="auto">
      <Column grow={1} width="fill">
        <Column width="fill" padding={2} gap={0.75}>
          <Text typo="headline-large">{routeTitle(section, t)}</Text>
          <Text typo="body-medium" color="secondary">
            {t('docs.route.placeholder')}
          </Text>
          <Text typo="body-small" color="secondary">
            {pathname}
          </Text>
        </Column>
      </Column>
    </Column>
  )
}
