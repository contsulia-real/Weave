import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Card, Column, Flex, Icon, Row, Text } from '../index'
import { useDocsRoute } from './router'

interface DocumentationPageNavigationItem {
  path: string
  label: string
}

export interface DocumentationPageNavigationProps {
  previous: DocumentationPageNavigationItem | null
  next: DocumentationPageNavigationItem | null
  previousLabel?: string
  nextLabel?: string
}

export function DocumentationPageNavigation({
  previous,
  next,
  previousLabel,
  nextLabel,
}: DocumentationPageNavigationProps) {
  const { t } = useTranslation()
  const { navigate } = useDocsRoute()

  return (
    <Flex width="fill" gap={16} direction="column" containerMd={{ direction: 'row' }}>
      <Card
        clickable={previous !== null}
        viewProps={{
          grow: 1,
          width: 'fill',
          padding: 24,
          disabled: previous === null,
          onClick: previous === null ? undefined : () => navigate(previous.path),
        }}
      >
        <Row gap={16} align="center" justify="start">
          <Icon icon={IconArrowLeft} size="large" />
          <Column gap={4}>
            <Text typo="label-medium" color="secondary">
              {previousLabel ?? t('docs.component.previous')}
            </Text>
            <Text typo="title-medium">{previous?.label ?? '—'}</Text>
          </Column>
        </Row>
      </Card>

      <Card
        clickable={next !== null}
        viewProps={{
          grow: 1,
          width: 'fill',
          padding: 24,
          disabled: next === null,
          onClick: next === null ? undefined : () => navigate(next.path),
        }}
      >
        <Row gap={16} align="center" justify="end">
          <Column gap={4} align="end">
            <Text typo="label-medium" color="secondary">
              {nextLabel ?? t('docs.component.next')}
            </Text>
            <Text typo="title-medium">{next?.label ?? '—'}</Text>
          </Column>
          <Icon icon={IconArrowRight} size="large" />
        </Row>
      </Card>
    </Flex>
  )
}
