import { type RefObject, useRef } from 'react'
import {
  Card,
  Code,
  Column,
  Link,
  Row,
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
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

function PropsTable({ props }: { props: readonly DocumentationApiProp[] }) {
  return (
    <Table dense>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Optional</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.map((prop) => (
          <TableRow key={prop.name} id={prop.name}>
            <TableCell>
              <Text typo="body-small" color="primary" weight="semibold">
                {prop.name}
              </Text>
            </TableCell>
            <TableCell>
              <Text
                typo="body-small"
                viewProps={{ style: { fontFamily: 'var(--weave-typography-family-mono)' } }}
              >
                {prop.type}
              </Text>
            </TableCell>
            <TableCell>
              <Text typo="body-small">{prop.optional ? 'Yes' : 'No'}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function DocumentationComponentApiPage({
  componentName,
  scrollContainerRef,
}: DocumentationComponentApiPageProps) {
  const api = documentationComponentApi(componentName)
  const contentRef = useRef<HTMLDivElement>(null)
  const directProps = api.hasViewProps ? api.attributes : api.viewProps
  const demoComponentName = documentationComponentDemoNameForApi(componentName)

  return (
    <Row width="fill" padding={2} gap={2} align="start">
      <Column ref={contentRef} grow={1} minWidth={0} gap={3}>
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
          <Link href={`/docs/components/${demoComponentName}`} text={demoComponentName} hideIcon />
        </Column>

        <Column
          id="import"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': 'Import' }}
          gap={1}
        >
          <Text typo="headline-small">Import</Text>
          <Card viewProps={{ padding: 0, overflow: 'hidden' }}>
            <Code
              language="typescript"
              viewProps={{ width: 'fill', padding: 1.25, background: 'surfaceHover' }}
            >
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
          {directProps.length > 0 ? <PropsTable props={directProps} /> : null}

          {api.hasViewProps && api.viewProps.length > 0 ? (
            <Column gap={1}>
              <Text typo="title-medium">viewProps</Text>
              <PropsTable props={api.viewProps} />
            </Column>
          ) : null}
        </Column>
      </Column>

      <DocumentationReadingStatus contentRef={contentRef} scrollContainerRef={scrollContainerRef} />
    </Row>
  )
}
