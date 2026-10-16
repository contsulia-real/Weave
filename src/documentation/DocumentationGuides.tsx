import { useTranslation } from 'react-i18next'
import { Card, Code, Column, Flex, Link, Text } from '../index'
import { documentationCopy } from './documentation-copy'
import {
  documentationComponentNavigationItems,
  documentationNavigationSections,
} from './documentation-navigation-data'

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

export function DocumentationOverview() {
  const { t } = useTranslation(['translation', 'copy'])
  const copy = (value: string) => documentationCopy(t, value)

  const links = [
    {
      href: '/docs/installation',
      title: t('docs.nav.installation'),
      description: copy('Install Weave from JSR and check the React requirements.'),
    },
    {
      href: '/docs/getting-started',
      title: t('docs.nav.gettingStarted'),
      description: copy('Render a working Weave interface with React.'),
    },
    {
      href: '/docs/a-z',
      title: t('docs.nav.weaveAZ'),
      description: copy('Browse public components and API references alphabetically.'),
    },
    {
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
      <Column width="fill" maxWidth={832} minWidth={0} grow={1} gap={48}>
        <Column width="fill" gap={12}>
          <Text typo="display-medium">{t('docs.route.overview')}</Text>
          <Text typo="body-large">{t('docs.gettingStarted.positioning')}</Text>
        </Column>

        {links.map((item) => (
          <Column key={item.href} width="fill" gap={16}>
            <Text typo="headline-small">{item.title}</Text>
            <Text typo="body-medium">{item.description}</Text>
            <Link href={item.href} text={item.title} hideUnderline />
          </Column>
        ))}
      </Column>
    </Flex>
  )
}

export function DocumentationInstallation() {
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
      <Column width="fill" maxWidth={832} minWidth={0} grow={1} gap={48}>
        <Column width="fill" gap={12}>
          <Text typo="display-medium">{t('docs.nav.installation')}</Text>
          <Text typo="body-large">
            {copy(
              'Weave is distributed through JSR. Install it in a React 19 application using a JSR-compatible package manager.',
            )}
          </Text>
        </Column>

        <Column width="fill" gap={16}>
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

        <Column width="fill" gap={16}>
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

        <Column width="fill" gap={16}>
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

        <Column width="fill" gap={16}>
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
        <Link href="/docs/getting-started" text={t('docs.nav.gettingStarted')} hideUnderline />
      </Column>
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
      <Column width="fill" maxWidth={832} minWidth={0} grow={1} gap={48}>
        <Column width="fill" gap={12}>
          <Text typo="display-medium">{t('docs.nav.weaveAZ')}</Text>
          <Text typo="body-large">
            {copy(
              'Alphabetical index of component guides and public API references. Guides open example pages; API entries open their prop references.',
            )}
          </Text>
        </Column>

        {alphabet.map(([letter, items]) => (
          <Column key={letter} width="fill" gap={16}>
            <Text typo="headline-small">{letter}</Text>
            {items.map((item) => (
              <Link key={item.name} href={item.path} text={item.name} hideUnderline />
            ))}
          </Column>
        ))}
      </Column>
    </Flex>
  )
}
