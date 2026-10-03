import { Component, type ComponentType, type ReactNode, useMemo, useState } from 'react'
import { Button, Card, Column, Divider, Flex, Input, Row, Text } from '../index'
import type { DocumentationExampleCodeMode } from './documentation-component-example-data'
import { compileDocumentationExample } from './documentation-example-runtime'

export interface DocumentationComponentExampleCardProps {
  code: string
  codeMode?: DocumentationExampleCodeMode
}

interface PreviewBoundaryState {
  error: string | null
}

class PreviewBoundary extends Component<{ children: ReactNode }, PreviewBoundaryState> {
  state: PreviewBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): PreviewBoundaryState {
    return {
      error: error instanceof Error ? error.message : String(error),
    }
  }

  render() {
    if (this.state.error !== null) {
      return <Text color="danger">{this.state.error}</Text>
    }

    return this.props.children
  }
}

function compilePreview(
  source: string,
  codeMode: DocumentationExampleCodeMode,
): { component?: ComponentType; error?: string } {
  try {
    return { component: compileDocumentationExample(source, codeMode) }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function DocumentationComponentExampleCard({
  code,
  codeMode = 'expression',
}: DocumentationComponentExampleCardProps) {
  const [source, setSource] = useState(code)
  const [expanded, setExpanded] = useState(true)
  const preview = useMemo(() => compilePreview(source, codeMode), [codeMode, source])
  const LivePreview = preview.component

  return (
    <Card viewProps={{ padding: 0, overflow: 'hidden', align: 'center' }}>
      <Column width="fill">
        <Flex minHeight={12} width="fill" padding={2} align="center" justify="center">
          {LivePreview === undefined ? (
            <Text color="danger">{preview.error}</Text>
          ) : (
            <PreviewBoundary key={source}>
              <LivePreview />
            </PreviewBoundary>
          )}
        </Flex>

        <Row width="fill" paddingX={1} paddingY={0.5} gap={0.5} justify="end">
          <Button
            text={expanded ? 'Collapse code' : 'Expand code'}
            variant="ghost"
            size="small"
            viewProps={{
              onClick: () => {
                setExpanded((current) => !current)
              },
            }}
          />
          <Button
            text="Copy code"
            variant="ghost"
            size="small"
            viewProps={{
              onClick: () => {
                void navigator.clipboard.writeText(source)
              },
            }}
          />
          <Button
            text="Reset code"
            variant="ghost"
            size="small"
            viewProps={{
              onClick: () => {
                setSource(code)
              },
            }}
          />
        </Row>
      </Column>

      {expanded ? (
        <>
          <Divider />
          <Column width="fill" paddingX={1} paddingY={1}>
            <Input
              multiline
              rows={8}
              value={source}
              onChange={setSource}
              viewProps={{
                width: 'fill',
                background: 'transparent',
                border: 0,
                shadow: 'none',
                style: {
                  fontFamily: 'var(--weave-typography-family-mono)',
                },
              }}
            />
          </Column>
        </>
      ) : null}
    </Card>
  )
}
