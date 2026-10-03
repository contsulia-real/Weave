import { IconCode, IconCopy, IconRefresh } from '@tabler/icons-react'
import { Component, type ComponentType, type ReactNode, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  Code,
  Column,
  Divider,
  Flex,
  Input,
  Presence,
  Row,
  Stack,
  Text,
} from '../index'
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
  const codeRef = useRef<HTMLDivElement>(null)
  const preview = useMemo(() => compilePreview(source, codeMode), [codeMode, source])
  const LivePreview = preview.component

  return (
    <Card
      viewProps={{
        padding: 0,
        overflow: 'hidden',
        align: 'center',
        layoutAnimation: { spring: 'gentle' },
      }}
    >
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
            icon={IconCode}
            variant="ghost"
            size="small"
            pressed={expanded}
            viewProps={{
              label: expanded ? 'Collapse code' : 'Expand code',
              onClick: () => {
                setExpanded((current) => !current)
              },
            }}
          />
          <Button
            icon={IconCopy}
            variant="ghost"
            size="small"
            viewProps={{
              label: 'Copy code',
              onClick: () => {
                void navigator.clipboard.writeText(source)
              },
            }}
          />
          <Button
            icon={IconRefresh}
            variant="ghost"
            size="small"
            viewProps={{
              label: 'Reset code',
              onClick: () => {
                setSource(code)
              },
            }}
          />
        </Row>
      </Column>

      <Presence present={expanded}>
        <Column
          width="fill"
          overflow="hidden"
          enter={{ animation: 'fade-down', spring: 'gentle' }}
          exit={{ animation: 'fade-up', spring: 'gentle' }}
        >
          <Divider />
          <Stack width="fill">
            <Code
              language="tsx"
              viewProps={{
                ref: codeRef,
                width: 'fill',
                height: 'fill',
                paddingX: 1,
                paddingY: 1,
                pointerEvents: 'none',
              }}
            >
              {source}
            </Code>
            <Input
              multiline
              rows={8}
              value={source}
              onChange={setSource}
              viewProps={{
                width: 'fill',
                height: 'fill',
                paddingX: 1,
                paddingY: 1,
                background: 'transparent',
                color: 'transparent',
                border: 0,
                shadow: 'none',
                outlineWidth: 0,
                style: {
                  caretColor: 'var(--weave-color-primary)',
                  fontFamily: 'var(--weave-typography-family-mono)',
                  whiteSpace: 'pre',
                  overflowWrap: 'normal',
                },
                onScroll: (event) => {
                  const codeElement = codeRef.current
                  if (codeElement === null) return

                  codeElement.scrollTop = event.currentTarget.scrollTop
                  codeElement.scrollLeft = event.currentTarget.scrollLeft
                },
              }}
            />
          </Stack>
        </Column>
      </Presence>
    </Card>
  )
}
