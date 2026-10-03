import { useRef } from 'react'
import {
  Card,
  Code,
  Column,
  Flex,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '../index'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { type DocumentationApiProp, documentationComponentApi } from './documentation-component-api'
import { documentationComponentDemoNameForApi } from './documentation-navigation-data'

export interface DocumentationComponentApiPageProps {
  componentName: string
}

interface PropsTableRow {
  name: string
  optional: boolean
  type?: string
  viewPropsReference?: boolean
}

function PropsTable({
  props,
  includeViewProps,
}: {
  props: readonly DocumentationApiProp[]
  includeViewProps: boolean
}) {
  const rows: PropsTableRow[] = props.map((prop) => ({ ...prop }))

  if (includeViewProps) {
    rows.push({
      name: 'viewProps',
      optional: true,
      viewPropsReference: true,
    })
  }

  rows.sort((left, right) => left.name.localeCompare(right.name))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead align="start">Name</TableHead>
          <TableHead align="start">Type</TableHead>
          <TableHead align="start">Optional</TableHead>
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
              <Text typo="body-small">{row.optional ? 'Yes' : 'No'}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function DocumentationComponentApiPage({
  componentName,
}: DocumentationComponentApiPageProps) {
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
      <Column ref={contentRef} grow={1} minWidth={0} width="fill" maxWidth={56} gap={3}>
        <Column width="fill" gap={0.75}>
          <Text typo="display-medium">{componentName} API</Text>
          <Text typo="body-large">API reference for the Weave {componentName} component.</Text>
        </Column>

        <Column
          id="demos"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': 'Demos' }}
          gap={1}
        >
          <Text typo="headline-small">Demos</Text>
          <Text typo="body-medium">For examples and usage details, visit the component page.</Text>
          <Link
            href={`/docs/components/${demoComponentName}`}
            text={demoComponentName}
            hideUnderline
            viewProps={{ width: 'content' }}
          />
        </Column>

        <Column
          id="import"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': 'Import' }}
          gap={1}
        >
          <Text typo="headline-small">Import</Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="typescript" viewProps={{ width: 'fill' }}>
              {`import { ${componentName} } from 'weave'`}
            </Code>
          </Card>
        </Column>

        <Column
          id="props"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': 'Props' }}
          gap={1}
        >
          <Text typo="headline-small">Props</Text>
          <Text typo="body-medium">Public props accepted by this component.</Text>
          {api.usesViewProps ? (
            <Link
              href="/docs/components-api/View#props"
              text={<Text typo="body-small">ViewProps</Text>}
              hideUnderline
              viewProps={{ width: 'content' }}
            />
          ) : null}
          {api.props.length > 0 || api.hasViewProps ? (
            <Column width="fill" overflow="auto">
              <PropsTable props={api.props} includeViewProps={api.hasViewProps} />
            </Column>
          ) : null}
        </Column>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
