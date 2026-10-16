import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, Card, Code, Column, Flex, Grid, Link, MenuItem, Text } from '../index'
import { DocumentationPageNavigation } from './DocumentationPageNavigation'
import { DocumentationReadingStatus } from './DocumentationReadingStatus'
import { documentationCopy } from './documentation-copy'
import {
  documentationComponentNavigationItems,
  documentationNavigationSections,
} from './documentation-navigation-data'
import { useDocsRoute } from './router'

const overviewItems =
  documentationNavigationSections.find((section) => section.value === 'overview')?.items ?? []

const apiItems =
  documentationNavigationSections.find((section) => section.value === 'components-api')?.items ?? []

const indexedComponents = new Map<string, { name: string; path: string }>()
for (const item of apiItems) {
  if (item.label !== undefined)
    indexedComponents.set(item.label, { name: item.label, path: item.path })
}
for (const item of documentationComponentNavigationItems) {
  indexedComponents.set(item.name, { name: item.name, path: item.path })
}

const alphabetGroups = new Map<string, { name: string; path: string }[]>()
for (const item of indexedComponents.values()) {
  const letter = item.name.charAt(0).toUpperCase()
  alphabetGroups.set(letter, [...(alphabetGroups.get(letter) ?? []), item])
}
const alphabet = [...alphabetGroups].sort(([left], [right]) => left.localeCompare(right))

export function DocumentationGuideBreadcrumb({ title }: { title: string }) {
  const { t } = useTranslation(['translation', 'copy'])
  const { navigate } = useDocsRoute()

  return (
    <Breadcrumb
      items={[
        { text: t('copy:Home'), href: '/docs' },
        { text: t('docs.nav.overview'), href: '/docs' },
        {
          text: title,
          menu: overviewItems.map((item) => (
            <MenuItem
              key={item.path}
              text={t(item.labelKey ?? '')}
              onSelect={() => navigate(item.path)}
            />
          )),
        },
      ]}
    />
  )
}

export function DocumentationGuideNavigation({ pathname }: { pathname: string }) {
  const { t } = useTranslation(['translation', 'copy'])
  const index = overviewItems.findIndex((item) => item.path === pathname)
  const previous = overviewItems[index - 1]
  const next = overviewItems[index + 1]
  const firstComponent =
    pathname === '/docs/a-z' ? documentationComponentNavigationItems[0] : undefined

  return (
    <DocumentationPageNavigation
      previous={
        previous === undefined ? null : { path: previous.path, label: t(previous.labelKey ?? '') }
      }
      next={
        next !== undefined
          ? { path: next.path, label: t(next.labelKey ?? '') }
          : firstComponent !== undefined
            ? { path: firstComponent.path, label: firstComponent.name }
            : null
      }
      previousLabel={documentationCopy(t, 'Previous')}
      nextLabel={documentationCopy(t, 'Next')}
    />
  )
}

export function DocumentationOverview() {
  const { t } = useTranslation(['translation', 'copy'])
  const copy = (value: string) => documentationCopy(t, value)
  const contentRef = useRef<HTMLDivElement>(null)

  const links = [
    {
      id: 'installation',
      href: '/docs/installation',
      title: t('docs.nav.installation'),
      description: copy('Install Weave from JSR and check the React requirements.'),
    },
    {
      id: 'getting-started',
      href: '/docs/getting-started',
      title: t('docs.nav.gettingStarted'),
      description: copy('Render a working Weave interface with React.'),
    },
    {
      id: 'a-z',
      href: '/docs/a-z',
      title: t('docs.nav.weaveAZ'),
      description: copy('Browse public components and API references alphabetically.'),
    },
    {
      id: 'layout',
      href: '/docs/components/Layout',
      title: copy('Layout primitives'),
      description: copy(
        'Compose responsive screens with Row, Column, Grid, and the other layout primitives.',
      ),
    },
  ]

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
          <Text typo="display-medium">{t('docs.route.overview')}</Text>
          <Text typo="body-large">{t('docs.gettingStarted.positioning')}</Text>
        </Column>

        {links.map((item) => (
          <Column
            key={item.href}
            id={item.id}
            data={{ 'weave-doc-section': '', 'weave-doc-section-label': item.title }}
            width="fill"
            gap={16}
          >
            <Text typo="headline-small">{item.title}</Text>
            <Text typo="body-medium">{item.description}</Text>
            <Link href={item.href} text={item.title} hideUnderline />
          </Column>
        ))}
      </Column>
      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}

export function DocumentationInstallation() {
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
          <DocumentationGuideBreadcrumb title={t('docs.nav.installation')} />
          <Text typo="display-medium">{t('docs.nav.installation')}</Text>
          <Text typo="body-large">
            {copy(
              'Weave is distributed through JSR. Install it in a React 19 application using a JSR-compatible package manager.',
            )}
          </Text>
        </Column>

        <Column
          id="requirements"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('Requirements') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Requirements')}</Text>
          <Text typo="body-medium">
            {copy(
              'React 19 and React DOM 19 are peer dependencies. Weave renders through React DOM and browser-native elements.',
            )}
          </Text>
          <Text typo="body-medium">
            {copy(
              'The package is currently in alpha. npm registry publication is disabled; use the JSR package instead.',
            )}
          </Text>
        </Column>

        <Column
          id="install"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('Install the package') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Install the package')}</Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="bash" viewProps={{ width: 'fill' }}>
              {'pnpm add jsr:@contsulia/weave'}
            </Code>
          </Card>
          <Text typo="body-medium">
            {copy('Run this command inside an existing React project.')}
          </Text>
        </Column>

        <Column
          id="imports"
          data={{ 'weave-doc-section': '', 'weave-doc-section-label': copy('Imports') }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Imports')}</Text>
          <Text typo="body-medium">
            {copy(
              'Import root and theme APIs from the package root; import components through their individual public subpaths.',
            )}
          </Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="tsx" viewProps={{ width: 'fill' }}>
              {
                "import { createRoot, ThemeProvider } from '@contsulia/weave'\nimport { Button } from '@contsulia/weave/components/Button'\nimport { Column } from '@contsulia/weave/components/Column'"
              }
            </Code>
          </Card>
        </Column>

        <Column
          id="optional-integrations"
          data={{
            'weave-doc-section': '',
            'weave-doc-section-label': copy('Optional integrations'),
          }}
          width="fill"
          gap={16}
        >
          <Text typo="headline-small">{copy('Optional integrations')}</Text>
          <Text typo="body-medium">
            {copy(
              'Install Tabler Icons only if you use its icon set, and Shiki if you use the Code component for syntax highlighting.',
            )}
          </Text>
          <Card viewProps={{ overflow: 'auto', align: 'center' }}>
            <Code language="bash" viewProps={{ width: 'fill' }}>
              {'pnpm add @tabler/icons-react\npnpm add shiki'}
            </Code>
          </Card>
        </Column>
        <DocumentationGuideNavigation pathname="/docs/installation" />
      </Column>
      <DocumentationReadingStatus contentRef={contentRef} />
    </Flex>
  )
}

export function DocumentationAZ() {
  const { t } = useTranslation(['translation', 'copy'])
  const copy = (value: string) => documentationCopy(t, value)

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
      <Column width="fill" maxWidth={1104} minWidth={0} grow={1} gap={48}>
        <Column width="fill" gap={12}>
          <DocumentationGuideBreadcrumb title={t('docs.nav.weaveAZ')} />
          <Text typo="display-medium">{t('docs.nav.weaveAZ')}</Text>
          <Text typo="body-large">
            {copy(
              'Alphabetical index of component guides and public API references. Guides open example pages; API entries open their prop references.',
            )}
          </Text>
        </Column>

        <Grid columns="repeat(auto-fit, minmax(min(100%, 160px), 1fr))" gap={32} width="fill">
          {alphabet.map(([letter, items]) => (
            <Column key={letter} id={`letter-${letter.toLowerCase()}`} width="fill" gap={16}>
              <Text typo="headline-small">{letter}</Text>
              {items.map((item) => (
                <Link key={item.name} href={item.path} text={item.name} hideUnderline />
              ))}
            </Column>
          ))}
        </Grid>
        <DocumentationGuideNavigation pathname="/docs/a-z" />
      </Column>
    </Flex>
  )
}
