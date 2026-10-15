import { IconBrandGithubFilled } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import './website.css'
import { DocumentationControls } from '../documentation/DocumentationControls'
import type { DocumentationThemeColorId } from '../documentation/documentation-theme'
import type { ThemeMode } from '../index'
import {
  AppBar,
  Button,
  Column,
  Grid,
  Icon,
  Link,
  List,
  ListItem,
  Row,
  Text,
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
          style: { gridTemplateColumns: '0 max-content minmax(0, 1fr)' },
        }}
        title={<Text>Weave</Text>}
        trailing={
          <Row width="fill" align="center" justify="end" gap={24} wrap>
            <Row align="center" gap={24} wrap>
              <Link href="/docs" text={t('Docs')} hideIcon />
              <Link href="/docs/components/Button" text={t('Components')} hideIcon />
              <Link href="/docs/getting-started" text={t('Get started')} hideIcon />
            </Row>
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
          </Row>
        }
      />

      <Column width="fill" grow={1} minHeight={0} overflow="auto" align="center">
        <Grid width="fill" maxWidth={1200} columns={1} xl={{ columns: 2 }}>
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
              <Grid width="fill" columns={1} containerSm={{ columns: 2 }} gap={16}>
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
      </Column>
    </Column>
  )
}
