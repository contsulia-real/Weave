import { IconBrandGithubFilled, IconCopy } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import './website.css'
import { DocumentationControls } from '../documentation/DocumentationControls'
import type { DocumentationThemeColorId } from '../documentation/documentation-theme'
import type { ThemeMode } from '../index'
import {
  AppBar,
  Button,
  Card,
  Code,
  Column,
  Divider,
  Grid,
  Icon,
  Link,
  List,
  ListItem,
  Row,
  Text,
  ToolTip,
  Typewriter,
} from '../index'
import {
  LaunchFlow,
  ProjectOverview,
  StudioInsights,
  TeamCalendar,
  TeamInbox,
  WorkspacePreferences,
} from './WebsiteShowcase'

const jsrLogo = (
  <svg viewBox="0 0 13 7" xmlns="http://www.w3.org/2000/svg">
    <path fill="#083344" d="M0 6h4v1h7V5h2V1H9V0H2v2H0" />
    <path fill="#f7df1e" d="M4 5V1H3v3H2V3H1v2h6V4H5V1h3v1h4v2h-1V3h-1v3H9V2H6v1h2v3H5V5" />
  </svg>
)

const websiteInstallCommand = 'pnpm add jsr:@contsulia/weave'

const websiteExampleSource = `import { ThemeProvider, createRoot } from '@contsulia/weave'
import { Button } from '@contsulia/weave/components/Button'
import { Column } from '@contsulia/weave/components/Column'
import { Text } from '@contsulia/weave/components/Text'

createRoot(document.getElementById('app')!).render(
  <ThemeProvider mode="system">
    <Column gap={16} padding={24}>
      <Text typo="title-large">Hello from Weave</Text>
      <Button text="Continue" variant="primary" />
    </Column>
  </ThemeProvider>,
)`

interface WebsiteHomeProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
  themeColorId: DocumentationThemeColorId
  onThemeColorChange: (id: DocumentationThemeColorId) => void
}

export function WebsiteHome({
  themeMode,
  onThemeModeChange,
  themeColorId,
  onThemeColorChange,
}: WebsiteHomeProps) {
  const { t } = useTranslation('website')
  const whyWeave = [
    [
      'Interaction-first components',
      'Press, drag and state feedback are built into the component experience.',
    ],
    ['One theme, cohesive interfaces', 'Theme tokens and color seeds keep components consistent.'],
    ['Responsive without reinvention', 'Breakpoint-aware props adapt layouts to every screen.'],
    ['Motion that respects preferences', 'Built-in motion responds to reduced-motion preferences.'],
    [
      'Built for developers, ready for AI',
      'Semantic APIs, real examples and source-derived metadata support both developers and AI tools.',
    ],
  ] as const

  return (
    <Column width="fill" height="100vh" background="surface" color="tertiary">
      <AppBar
        mode="floating"
        sticky
        elevated
        viewProps={{
          shrink: 0,
          zIndex: 1,
          columns: 'minmax(0, 1fr) 0',
          sm: { columns: 'minmax(0, 1fr) 0 max-content' },
        }}
        leading={
          <Row align="center" gap={24} wrap>
            <Link href="/docs" text={t('Docs')} hideIcon hideUnderline />
            <Link href="/docs/components/Button" text={t('Components')} hideIcon hideUnderline />
            <Link href="/docs/getting-started" text={t('Get started')} hideIcon hideUnderline />
          </Row>
        }
        title={<Text>{''}</Text>}
        trailing={
          <Row align="center" gap={16} wrap>
            <Link
              href="https://github.com/contsulia-real/Weave"
              text={<Icon icon={IconBrandGithubFilled} size="xlarge" />}
              hideIcon
              hideUnderline
              viewProps={{ label: 'GitHub' }}
            />
            <Link
              href="https://jsr.io/@contsulia/weave"
              text={<Icon svg={jsrLogo} size="xlarge" viewProps={{ width: 42, height: 42 }} />}
              hideIcon
              hideUnderline
              viewProps={{ label: 'JSR' }}
            />
            <DocumentationControls
              themeMode={themeMode}
              onThemeModeChange={onThemeModeChange}
              themeColorId={themeColorId}
              onThemeColorChange={onThemeColorChange}
            />
          </Row>
        }
      />
      <Column width="fill" grow={1} minHeight={0} overflow="auto" align="center">
        <Grid width="fill" maxWidth={1600} columns={1} xl={{ columns: 2 }}>
          <Column
            width="fill"
            minWidth={0}
            align="center"
            justify="center"
            padding={32}
            height="85vh"
            xl={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'start' }}
            data={{ 'weave-website-hero': '' }}
          >
            <Column width="fill" maxWidth={720} gap={24} align="start">
              <Text typo="display-large">Weave</Text>
              <Row background="primary" color="onPrimary" radius="full" paddingX={24} paddingY={12}>
                <Typewriter
                  texts={[
                    t('Interaction is built in'),
                    t('Built for developers, ready for AI'),
                    t('Built for real products'),
                  ]}
                  typeInterval={50}
                  deleteInterval={30}
                  typo="headline-large"
                  color="onPrimary"
                  wrap="nowrap"
                  viewProps={{ style: { fontSize: 'clamp(11px, 2.2vw, 26px)' } }}
                />
              </Row>
              <Text typo="body-large" color="secondary">
                {t(
                  'An interaction-first React UI framework with visual feedback, direct manipulation and motion built into every component.',
                )}
              </Text>
              <Button
                text={t('Explore documentation')}
                viewProps={{ onClick: () => window.location.assign('/docs') }}
              />
            </Column>
          </Column>

          <Column width="fill" minWidth={0}>
            <Column
              width="fill"
              minWidth={0}
              padding={24}
              container="website-showcase"
              data={{ 'weave-website-showcase': '' }}
            >
              <Grid width="fill" columns={1} sm={{ columns: 2 }} gap={16}>
                <Column width="fill" minWidth={0} gap={16}>
                  <ProjectOverview />
                  <TeamCalendar />
                  <LaunchFlow />
                </Column>
                <Column width="fill" minWidth={0} gap={16}>
                  <TeamInbox />
                  <StudioInsights />
                  <WorkspacePreferences />
                </Column>
              </Grid>
            </Column>
            <Column
              width="fill"
              minWidth={0}
              minHeight="100vh"
              padding={24}
              justify="center"
              gap={24}
              data={{ 'weave-website-why': '' }}
            >
              <Text typo="headline-large">{t('Why Weave?')}</Text>
              <List selection="none" noDividers gap={8} viewProps={{ width: 'fill' }}>
                {whyWeave.map(([title, description]) => (
                  <ListItem key={title} id={title} viewProps={{ paddingX: 0, paddingY: 12 }}>
                    <Column width="fill" gap={8}>
                      <Text typo="title-medium">{t(title)}</Text>
                      <Text typo="body-medium" color="secondary">
                        {t(description)}
                      </Text>
                    </Column>
                  </ListItem>
                ))}
              </List>
            </Column>
          </Column>
        </Grid>
        <Column
          width="fill"
          maxWidth={1600}
          paddingX={32}
          paddingY={64}
          gap={64}
          data={{ 'weave-website-more': '' }}
        >
          <Column width="fill" gap={24} data={{ 'weave-website-capabilities': '' }}>
            <Column gap={12}>
              <Text typo="headline-large">{t('Explore the building blocks')}</Text>
              <Text typo="body-large" color="tertiary">
                {t(
                  'From interactive controls to layout and tooling, Weave keeps the same component language throughout.',
                )}
              </Text>
            </Column>
            <Grid width="fill" columns={1} md={{ columns: 3 }} gap={24}>
              <Column width="fill" minWidth={0} gap={12}>
                <Text typo="title-large">{t('Interactive components')}</Text>
                <Text typo="body-medium" color="tertiary">
                  {t(
                    'Buttons, forms and data displays with feedback designed into their default behavior.',
                  )}
                </Text>
                <Link href="/docs/components/Button" text={t('Explore components')} />
              </Column>
              <Column width="fill" minWidth={0} gap={12}>
                <Text typo="title-large">{t('Layout and theme')}</Text>
                <Text typo="body-medium" color="tertiary">
                  {t('Build responsive views with semantic layouts and shared theme tokens.')}
                </Text>
                <Link href="/docs/components/Column" text={t('Explore layouts')} />
              </Column>
              <Column width="fill" minWidth={0} gap={12}>
                <Text typo="title-large">{t('Examples for developers and AI')}</Text>
                <Text typo="body-medium" color="tertiary">
                  {t(
                    'Real component demos and source-derived metadata help humans and AI tools use the same APIs.',
                  )}
                </Text>
                <Link href="/docs" text={t('Browse examples')} />
              </Column>
            </Grid>
          </Column>

          <Column width="fill" marginTop={32} gap={24} data={{ 'weave-website-quickstart': '' }}>
            <Grid width="fill" columns={1} xl={{ columns: 2 }} gap={24}>
              <Column width="fill" minWidth={0} gap={24}>
                <Column gap={12}>
                  <Text typo="headline-large">{t('Start building with Weave')}</Text>
                  <Text typo="body-large" color="tertiary">
                    {t('Install from JSR, then render a Weave interface with React.')}
                  </Text>
                </Column>
                <Column width="fill" minWidth={0} gap={12}>
                  <Card viewProps={{ width: 'fill', padding: 0, overflow: 'hidden' }}>
                    <Column width="fill" minWidth={0}>
                      <Row
                        width="fill"
                        paddingX={16}
                        paddingY={8}
                        align="center"
                        justify="space-between"
                        gap={16}
                      >
                        <Text typo="title-medium">{t('Install')}</Text>
                        <ToolTip content={t('Copy code')}>
                          <Button
                            icon={IconCopy}
                            variant="ghost"
                            size="small"
                            viewProps={{
                              label: t('Copy code'),
                              onClick: () => {
                                void navigator.clipboard.writeText(websiteInstallCommand)
                              },
                            }}
                          />
                        </ToolTip>
                      </Row>
                      <Divider />
                      <Code
                        language="bash"
                        viewProps={{ width: 'fill', overflow: 'auto', padding: 16 }}
                      >
                        {websiteInstallCommand}
                      </Code>
                    </Column>
                  </Card>
                </Column>
                <Button
                  text={t('Continue with documentation')}
                  viewProps={{
                    width: 'content',
                    onClick: () => window.location.assign('/docs/getting-started'),
                  }}
                />
              </Column>
              <Column width="fill" minWidth={0} gap={12}>
                <Card viewProps={{ width: 'fill', padding: 0, overflow: 'hidden' }}>
                  <Column width="fill" minWidth={0}>
                    <Row
                      width="fill"
                      paddingX={16}
                      paddingY={8}
                      align="center"
                      justify="space-between"
                      gap={16}
                    >
                      <Text typo="title-medium">{t('Render your first interface')}</Text>
                      <ToolTip content={t('Copy code')}>
                        <Button
                          icon={IconCopy}
                          variant="ghost"
                          size="small"
                          viewProps={{
                            label: t('Copy code'),
                            onClick: () => {
                              void navigator.clipboard.writeText(websiteExampleSource)
                            },
                          }}
                        />
                      </ToolTip>
                    </Row>
                    <Divider />
                    <Code
                      language="tsx"
                      viewProps={{ width: 'fill', overflow: 'auto', padding: 16 }}
                    >
                      {websiteExampleSource}
                    </Code>
                  </Column>
                </Card>
              </Column>
            </Grid>
          </Column>

          <Column width="fill" gap={24} data={{ 'weave-website-footer': '' }}>
            <Divider />
            <Row width="fill" align="center" justify="space-between" gap={24} wrap>
              <Text typo="body-medium" color="tertiary">
                {t('Weave is open source under the MIT License.')}
              </Text>
              <Row align="center" gap={24} wrap>
                <Link href="/docs" text={t('Docs')} hideIcon />
                <Link href="/docs/components/Button" text={t('Components')} hideIcon />
                <Link href="https://github.com/contsulia-real/Weave" text="GitHub" hideIcon />
                <Link href="https://jsr.io/@contsulia/weave" text="JSR" hideIcon />
              </Row>
            </Row>
          </Column>
        </Column>
      </Column>
    </Column>
  )
}
