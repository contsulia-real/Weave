import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Code, Column, Flex, Link, Text } from '../index'
import { DocumentationGuideBreadcrumb, DocumentationGuideNavigation } from './DocumentationGuides'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationCopy } from './documentation-copy'

const firstScreenSource = `import { useState } from 'react'
import { createRoot, createThemeFromColorSeed, ThemeProvider } from '@contsulia/weave'
import { Button } from '@contsulia/weave/components/Button'
import { Column } from '@contsulia/weave/components/Column'
import { Row } from '@contsulia/weave/components/Row'
import { Text } from '@contsulia/weave/components/Text'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Column gap={16} padding={24}>
      <Text typo="title-large">Hello from Weave</Text>
      <Text typo="body-medium">Count: {count}</Text>
      <Row gap={12} wrap>
        <Button
          text="Add one"
          viewProps={{ onClick: () => setCount((value) => value + 1) }}
        />
        <Button
          text="Reset"
          variant="secondary"
          viewProps={{ onClick: () => setCount(0) }}
        />
      </Row>
    </Column>
  )
}

const container = document.getElementById('app')
if (!container) throw new Error('Missing #app')

const theme = createThemeFromColorSeed('#1976d2')
createRoot(container).render(
  <ThemeProvider theme={theme} mode="system">
    <App />
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
          <DocumentationGuideBreadcrumb title={t('docs.nav.gettingStarted')} />
          <Text typo="display-medium">{t('docs.nav.gettingStarted')}</Text>
          <Text typo="body-large">
            {copy(
              'Build a working React interface with Weave: install the package, mount a root, respond to clicks, and set a theme.',
            )}
          </Text>
        </Column>

        <Column
          id="requirements"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('Start with a React project'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Start with a React project')}</Text>
          <Text typo="body-medium">
            {copy(
              'Use an existing React 19 and React DOM 19 application. Weave targets the browser; React handles your application state and rendering.',
            )}
          </Text>
        </Column>

        <Column
          id="install"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('Install Weave') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Install Weave')}</Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="bash" viewProps={{ width: 'fill' }}>
              {'pnpm add jsr:@contsulia/weave'}
            </Code>
          </Card>
          <Text typo="body-medium">
            {copy(
              'Run this in your React project. Weave is installed from JSR rather than the npm registry.',
            )}
          </Text>
          <Link href="/docs/installation" text={t('docs.nav.installation')} hideUnderline />
        </Column>

        <Column
          id="mount"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('Mount your interface'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Mount your interface')}</Text>
          <Text typo="body-medium">
            {copy(
              'Add this container to your HTML. The application entry below passes it to Weave createRoot, which uses React DOM.',
            )}
          </Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="html" viewProps={{ width: 'fill' }}>
              {'<div id="app"></div>'}
            </Code>
          </Card>
        </Column>

        <Column
          id="interactive-screen"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('Build an interactive screen'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Build an interactive screen')}</Text>
          <Text typo="body-medium">
            {copy(
              'Put this TSX code in your application entry. Click Add one to update the count; Reset clears it. Both buttons use ordinary React state.',
            )}
          </Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="tsx" viewProps={{ width: 'fill' }}>
              {firstScreenSource}
            </Code>
          </Card>
        </Column>

        <Column
          id="component-model"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('Understand the component model'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Understand the component model')}</Text>
          <Text typo="body-medium">
            {copy(
              'Import createRoot, ThemeProvider, and theme helpers from the package root. Import Button, Column, Row, and Text from their individual component subpaths.',
            )}
          </Text>
          <Text typo="body-medium">
            {copy(
              'Use Column for vertical layout and Row for horizontal layout. Numeric gap and padding values are pixels. Button text and variant are component props; its click handler belongs in viewProps.',
            )}
          </Text>
          <Link href="/docs/components/Layout" text={copy('Layout primitives')} hideUnderline />
          <Link href="/docs/components/Button" text="Button" hideUnderline />
        </Column>

        <Column
          id="theme"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('Configure the theme'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Configure the theme')}</Text>
          <Text typo="body-medium">
            {copy(
              'The example creates a theme from a CSS color seed. ThemeProvider applies it to the component tree, while mode="system" follows the device light or dark preference.',
            )}
          </Text>
          <Link href="/docs/components/ThemeProvider" text="ThemeProvider" hideUnderline />
        </Column>

        <Column
          id="next-steps"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('Explore further') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Explore further')}</Text>
          <Text typo="body-medium">
            {copy(
              'Use the component guides for live examples and the API reference for supported properties and import paths.',
            )}
          </Text>
          <Link href="/docs/a-z" text={t('docs.nav.weaveAZ')} hideUnderline />
          <Link href="/docs/components-api/Button" text="Button API" hideUnderline />
          <Link href="/docs/installation" text={t('docs.nav.installation')} hideUnderline />
        </Column>
        <DocumentationGuideNavigation pathname="/docs/getting-started" />
      </Column>
      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}
