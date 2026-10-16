import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Code, Column, Flex, Link, Text } from '../index'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationCopy } from './documentation-copy'

const firstScreenSource = `import { createRoot, ThemeProvider } from '@contsulia/weave'
import { Button } from '@contsulia/weave/components/Button'
import { Column } from '@contsulia/weave/components/Column'
import { Text } from '@contsulia/weave/components/Text'

const container = document.getElementById('app')
if (!container) throw new Error('Missing #app')

createRoot(container).render(
  <ThemeProvider mode="system">
    <Column gap={16} padding={24}>
      <Text typo="title-large">Hello from Weave</Text>
      <Button text="Continue" variant="primary" />
    </Column>
  </ThemeProvider>,
)`

export function DocumentationGettingStarted() {
  const { t } = useTranslation(['translation', 'copy'])
  const copy = (value: string) => documentationCopy(t, value)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <Flex
      width="fill"
      padding={16}
      gap={32}
      align="start"
      direction="column"
      containerMd={{ padding: 32 }}
      containerLg={{ direction: 'row', justify: 'center' }}
    >
      <Column ref={contentRef} grow={1} minWidth={0} width="fill" maxWidth={832} gap={48}>
        <Column width="fill" gap={12}>
          <Text typo="display-medium">{t('docs.nav.gettingStarted')}</Text>
          <Text typo="body-large">
            {copy(
              'Build your first Weave interface with React. This guide uses the public JSR package and ordinary React DOM rendering.',
            )}
          </Text>
        </Column>

        <Column
          id="install"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('1. Install Weave') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('1. Install Weave')}</Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="bash" viewProps={{ width: 'fill' }}>
              {'pnpm add jsr:@contsulia/weave'}
            </Code>
          </Card>
          <Link href="/docs/installation" text={t('docs.nav.installation')} hideUnderline />
        </Column>

        <Column
          id="mount"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('2. Mount your interface'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('2. Mount your interface')}</Text>
          <Text typo="body-medium">
            {copy(
              'Use an element with id="app" in your HTML, then render Weave components through createRoot.',
            )}
          </Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="html" viewProps={{ width: 'fill' }}>
              {'<div id="app"></div>'}
            </Code>
          </Card>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="tsx" viewProps={{ width: 'fill' }}>
              {firstScreenSource}
            </Code>
          </Card>
        </Column>

        <Column
          id="next-steps"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('Next steps') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Next steps')}</Text>
          <Text typo="body-medium">
            {copy(
              'Explore layout primitives, theme configuration, and component examples to build a complete interface.',
            )}
          </Text>
          <Link href="/docs/components/Layout" text={copy('Layout primitives')} hideUnderline />
          <Link href="/docs/components/ThemeProvider" text="ThemeProvider" hideUnderline />
          <Link href="/docs/components/Button" text="Button" hideUnderline />
        </Column>
      </Column>
      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
