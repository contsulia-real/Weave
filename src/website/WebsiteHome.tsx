import { IconBrandGithubFilled } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import './website.css'
import { DocumentationControls } from '../documentation/DocumentationControls'
import type { DocumentationThemeColorId } from '../documentation/documentation-theme'
import type { ThemeMode } from '../index'
import { AppBar, Button, Column, Grid, Icon, Link, List, Row, Text, Typewriter } from '../index'
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
    ['Browser-native by design', 'Semantic React components render directly to the DOM and CSS.'],
    ['One theme, cohesive interfaces', 'Theme tokens and color seeds keep components consistent.'],
    ['Responsive without reinvention', 'Breakpoint-aware props adapt layouts to every screen.'],
    ['Motion that respects preferences', 'Built-in motion responds to reduced-motion preferences.'],
    [
      'Composable for real apps',
      'Combine controls, forms, data displays and navigation into working interfaces.',
    ],
  ] as const

  return (
    <Column width="fill" height="100vh" overflow="auto" background="surface" color="tertiary">
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

      <Grid width="fill" columns={1} xl={{ columns: 2 }}>
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
          <Column width="fill" maxWidth={480} gap={24} align="start">
            <Text typo="display-large">Weave</Text>
            <Row background="primary" color="onPrimary" radius="medium" padding={12}>
              <Typewriter
                texts={[
                  t('Browser-native React UI'),
                  t('Interfaces that work together'),
                  t('Built for real products'),
                ]}
                typo="headline-large"
                color="onPrimary"
              />
            </Row>
            <Text typo="body-large" color="secondary">
              {t('A browser-native React UI framework built on semantic components, DOM and CSS.')}
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
            <List
              selection="none"
              viewProps={{ width: 'fill' }}
              items={whyWeave.map(([title, description]) => ({
                id: title,
                text: t(title),
                secondaryText: t(description),
              }))}
            />
          </Column>
        </Column>
      </Grid>
    </Column>
  )
}
