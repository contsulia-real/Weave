import { IconCode, IconCopy, IconRefresh } from '@tabler/icons-react'
import {
  Component,
  type ComponentType,
  type ReactNode,
  use,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  Code,
  Column,
  Divider,
  Flex,
  Grid,
  Input,
  Presence,
  Row,
  Stack,
  Text,
  ToolTip,
} from '../index'
import type { DocumentationDemo } from './documentation-demo-registry'
import {
  compileDocumentationSource,
  type DocumentationCompilation,
  subscribeDocumentationCompiler,
} from './documentation-example-compiler'
import { evaluateDocumentationExample } from './documentation-example-runtime'

export interface DocumentationComponentExampleCardProps {
  component: ComponentType
  source: string
}

export interface DocumentationComponentExampleProps {
  demo: Promise<DocumentationDemo>
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

function evaluatePreview(compilation: DocumentationCompilation): {
  component?: ComponentType
  error?: string
} {
  if (compilation.error !== undefined) return { error: compilation.error }
  try {
    return { component: evaluateDocumentationExample(compilation.outputText ?? '') }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export function DocumentationComponentExample({ demo }: DocumentationComponentExampleProps) {
  const resolved = use(demo)

  return (
    <DocumentationComponentExampleCard component={resolved.component} source={resolved.source} />
  )
}

export function DocumentationComponentExampleCard({
  component,
  source: initialSource,
}: DocumentationComponentExampleCardProps) {
  const { t } = useTranslation()
  const [source, setSource] = useState(initialSource)
  const [expanded, setExpanded] = useState(true)
  const codeRef = useRef<HTMLDivElement>(null)
  const owner = useRef(Symbol('documentation-example'))
  const [compilerStatus, setCompilerStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [compiled, setCompiled] = useState<
    { source: string; result: { component?: ComponentType; error?: string } } | undefined
  >()
  useEffect(() => subscribeDocumentationCompiler(setCompilerStatus), [])
  useEffect(() => {
    if (compilerStatus !== 'ready' || source === initialSource) return
    return compileDocumentationSource(owner.current, source, (result) => {
      setCompiled({ source, result: evaluatePreview(result) })
    })
  }, [compilerStatus, initialSource, source])
  // Keep the previous compiled preview visible until the current edit finishes compiling.
  const preview = source === initialSource ? { component } : (compiled?.result ?? { component })
  const previewKey = source === initialSource ? initialSource : (compiled?.source ?? initialSource)
  const LivePreview = preview.component
  const codeRows = Math.max(1, source.split('\n').length)

  return (
    <Card
      viewProps={{
        padding: 0,
        overflow: 'hidden',
        align: 'center',
      }}
    >
      <Column width="fill">
        <Flex width="fill" padding={32} align="center" justify="center">
          {LivePreview === undefined ? (
            preview.error === undefined ? null : (
              <Text color="danger">{preview.error}</Text>
            )
          ) : (
            <PreviewBoundary key={previewKey}>
              <LivePreview />
            </PreviewBoundary>
          )}
        </Flex>

        <Row width="fill" paddingX={16} paddingY={8} gap={8} justify="end">
          <ToolTip content={t(expanded ? 'docs.example.collapseCode' : 'docs.example.expandCode')}>
            <Button
              icon={IconCode}
              variant="ghost"
              size="small"
              pressed={expanded}
              viewProps={{
                label: t(expanded ? 'docs.example.collapseCode' : 'docs.example.expandCode'),
                onClick: () => {
                  setExpanded((current) => !current)
                },
              }}
            />
          </ToolTip>
          <ToolTip content={t('docs.example.copyCode')}>
            <Button
              icon={IconCopy}
              variant="ghost"
              size="small"
              viewProps={{
                label: t('docs.example.copyCode'),
                onClick: () => {
                  void navigator.clipboard.writeText(source)
                },
              }}
            />
          </ToolTip>
          <ToolTip content={t('docs.example.resetCode')}>
            <Button
              icon={IconRefresh}
              variant="ghost"
              size="small"
              viewProps={{
                label: t('docs.example.resetCode'),
                onClick: () => {
                  setSource(initialSource)
                },
              }}
            />
          </ToolTip>
        </Row>
      </Column>

      <Grid
        width="fill"
        overflow="hidden"
        transition={{ properties: ['gridTemplateRows'], spring: 'gentle' }}
        style={{ gridTemplateRows: expanded ? 'minmax(0, 1fr)' : 'minmax(0, 0fr)' }}
      >
        <Presence present={expanded}>
          <Column
            width="fill"
            minHeight={0}
            overflow="hidden"
            enter={{ animation: 'fade-down', spring: 'gentle' }}
            exit={{ animation: 'fade-up', spring: 'gentle' }}
          >
            <Divider />
            <Stack width="fill" maxHeight={256} background="surfaceHover">
              <Code
                language="tsx"
                viewProps={{
                  ref: codeRef,
                  width: 'fill',
                  maxHeight: 256,
                  overflow: 'hidden',
                  paddingX: 16,
                  paddingY: 16,
                  pointerEvents: 'none',
                }}
              >
                {source}
              </Code>
              <Input
                multiline
                rows={codeRows}
                disabled={compilerStatus !== 'ready'}
                value={source}
                onChange={setSource}
                viewProps={{
                  width: 'fill',
                  maxHeight: 256,
                  overflow: 'auto',
                  paddingX: 16,
                  paddingY: 16,
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
      </Grid>
    </Card>
  )
}
