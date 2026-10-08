import { useTranslation } from 'react-i18next'
import { Link, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '../index'
import type { DocumentationApiProp } from './documentation-component-api'
import { documentationCopy } from './documentation-copy'

interface PropsTableRow {
  name: string
  description: string
  optional: boolean
  type?: string
  viewPropsReference?: boolean
}

export interface DocumentationPropsTableProps {
  props: readonly DocumentationApiProp[]
  includeViewProps: boolean
}

export function DocumentationPropsTable({ props, includeViewProps }: DocumentationPropsTableProps) {
  const { t } = useTranslation(['translation', 'copy'])
  const rows: PropsTableRow[] = props.map((prop) => ({ ...prop }))

  if (includeViewProps) {
    rows.push({
      name: 'viewProps',
      description: t('docs.api.viewPropsDescription'),
      optional: true,
      viewPropsReference: true,
    })
  }

  rows.sort((left, right) => left.name.localeCompare(right.name))

  return (
    <Table viewProps={{ depthCompensation: true }}>
      <TableHeader>
        <TableRow>
          <TableHead align="start">{t('docs.api.name')}</TableHead>
          <TableHead align="start">{t('docs.api.description')}</TableHead>
          <TableHead align="start">{t('docs.api.type')}</TableHead>
          <TableHead align="start">{t('docs.api.optional')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name} id={row.name}>
            <TableCell>
              <Text typo="body-small" color="primary" weight="semibold">
                {row.name}
              </Text>
            </TableCell>
            <TableCell>
              <Text typo="body-small">
                {row.description === '' ? '—' : documentationCopy(t, row.description)}
              </Text>
            </TableCell>
            <TableCell>
              {row.viewPropsReference === true ? (
                <Link
                  href="/docs/components-api/View#props"
                  text={<Text typo="body-small">ViewProps</Text>}
                  hideUnderline
                  viewProps={{ width: 'content' }}
                />
              ) : (
                <Text
                  typo="body-small"
                  viewProps={{ style: { fontFamily: 'var(--weave-typography-family-mono)' } }}
                >
                  {row.type}
                </Text>
              )}
            </TableCell>
            <TableCell>
              <Text typo="body-small">{t(row.optional ? 'docs.api.yes' : 'docs.api.no')}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
