import { IconCode, IconCopy, IconRefresh } from '@tabler/icons-react'
import { Component, type ComponentType, type ReactNode, useMemo, useRef, useState } from 'react'
import ts from 'typescript'
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

function indentation(level: number): string {
  return '  '.repeat(level)
}

function formatAttributes(
  tagName: string,
  attributes: readonly string[],
  level: number,
  selfClosing: boolean,
): string {
  const suffix = selfClosing ? ' />' : '>'
  const inline = `<${tagName}${attributes.length === 0 ? '' : ` ${attributes.join(' ')}`}${suffix}`

  if (inline.length + level * 2 <= 88) {
    return `${indentation(level)}${inline}`
  }

  return [
    `${indentation(level)}<${tagName}`,
    ...attributes.map((attribute) => `${indentation(level + 1)}${attribute}`),
    `${indentation(level)}${selfClosing ? '/>' : '>'}`,
  ].join('\n')
}

function formatJsxNode(
  node: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxFragment,
  sourceFile: ts.SourceFile,
  level = 0,
): string {
  if (ts.isJsxSelfClosingElement(node)) {
    return formatAttributes(
      node.tagName.getText(sourceFile),
      node.attributes.properties.map((attribute) => attribute.getText(sourceFile)),
      level,
      true,
    )
  }

  if (ts.isJsxFragment(node)) {
    const children = node.children
      .filter((child) => !(ts.isJsxText(child) && child.getText(sourceFile).trim().length === 0))
      .map((child) => formatJsxChild(child, sourceFile, level + 1))
      .join('\n')

    return `${indentation(level)}<>\n${children}\n${indentation(level)}</>`
  }

  const opening = formatAttributes(
    node.openingElement.tagName.getText(sourceFile),
    node.openingElement.attributes.properties.map((attribute) => attribute.getText(sourceFile)),
    level,
    false,
  )
  const children = node.children
    .filter((child) => !(ts.isJsxText(child) && child.getText(sourceFile).trim().length === 0))
    .map((child) => formatJsxChild(child, sourceFile, level + 1))
    .join('\n')

  return `${opening}\n${children}\n${indentation(level)}</${node.closingElement.tagName.getText(sourceFile)}>`
}

function formatJsxChild(child: ts.JsxChild, sourceFile: ts.SourceFile, level: number): string {
  if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) {
    return formatJsxNode(child, sourceFile, level)
  }

  return `${indentation(level)}${child.getText(sourceFile).trim()}`
}

function formatDocumentationExampleSource(
  source: string,
  codeMode: DocumentationExampleCodeMode,
): string {
  const trimmed = source.trim()

  if (codeMode !== 'expression' || trimmed.includes('\n')) {
    return trimmed
  }

  const sourceFile = ts.createSourceFile(
    'documentation-example.tsx',
    `const documentationExample = (${trimmed})`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const statement = sourceFile.statements[0]

  if (!ts.isVariableStatement(statement)) {
    return trimmed
  }

  let initializer = statement.declarationList.declarations[0]?.initializer
  while (initializer !== undefined && ts.isParenthesizedExpression(initializer)) {
    initializer = initializer.expression
  }

  if (
    initializer === undefined ||
    (!ts.isJsxElement(initializer) &&
      !ts.isJsxSelfClosingElement(initializer) &&
      !ts.isJsxFragment(initializer))
  ) {
    return trimmed
  }

  return formatJsxNode(initializer, sourceFile)
}

export function DocumentationComponentExampleCard({
  code,
  codeMode = 'expression',
}: DocumentationComponentExampleCardProps) {
  const initialSource = useMemo(
    () => formatDocumentationExampleSource(code, codeMode),
    [code, codeMode],
  )
  const [source, setSource] = useState(initialSource)
  const [expanded, setExpanded] = useState(true)
  const codeRef = useRef<HTMLDivElement>(null)
  const preview = useMemo(() => compilePreview(source, codeMode), [codeMode, source])
  const LivePreview = preview.component
  const codeRows = Math.max(1, source.split('\n').length)

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
        <Flex width="fill" padding={2} align="center" justify="center">
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
                setSource(initialSource)
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
          <Stack width="fill" maxHeight={16}>
            <Code
              language="tsx"
              viewProps={{
                ref: codeRef,
                width: 'fill',
                maxHeight: 16,
                overflow: 'hidden',
                paddingX: 1,
                paddingY: 1,
                pointerEvents: 'none',
              }}
            >
              {source}
            </Code>
            <Input
              multiline
              rows={codeRows}
              value={source}
              onChange={setSource}
              viewProps={{
                width: 'fill',
                maxHeight: 16,
                overflow: 'auto',
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
