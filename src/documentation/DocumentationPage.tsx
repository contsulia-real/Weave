import { IconDeviceDesktop, IconMenu2, IconMoon, IconSun } from '@tabler/icons-react'
import type { TFunction } from 'i18next'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ThemeMode } from '../index'
import { AppBar, Button, Column, Drawer, Input, Link, Popover, Row, Text, View } from '../index'
import { useDocsRoute } from './router'

export interface DocumentationPageProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
}

function routeTitle(section: string, t: TFunction): string {
  if (section === 'components') return t('docs.route.components')
  return t('docs.route.overview')
}

export function DocumentationPage({ themeMode, onThemeModeChange }: DocumentationPageProps) {
  const { t } = useTranslation()
  const route = useDocsRoute()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [themePopoverOpen, setThemePopoverOpen] = useState(false)

  const themeIcon =
    themeMode === 'light' ? IconSun : themeMode === 'dark' ? IconMoon : IconDeviceDesktop

  const navigate = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    route.navigate(path)
  }

  const selectThemeMode = (mode: ThemeMode) => {
    onThemeModeChange(mode)
    setThemePopoverOpen(false)
  }

  const navigation = (
    <Column gap={0.5} padding={1} label={t('docs.navigation')}>
      <Text typo="title-medium">{t('docs.title')}</Text>
      <Link
        href="/docs"
        text={t('docs.nav.overview')}
        hideIcon
        hideUnderline
        viewProps={{ onClick: navigate('/docs') }}
      />
      <Link
        href="/docs/components"
        text={t('docs.nav.components')}
        hideIcon
        hideUnderline
        viewProps={{ onClick: navigate('/docs/components') }}
      />
    </Column>
  )

  const themeSelector = (
    <Popover
      placement="bottom-right"
      open={themePopoverOpen}
      onOpenChange={setThemePopoverOpen}
      content={
        <Column gap={0.5} padding={0.5}>
          <Button
            text={t('docs.theme.system')}
            pressed={themeMode === 'system'}
            viewProps={{ onClick: () => selectThemeMode('system') }}
          />
          <Button
            text={t('docs.theme.light')}
            pressed={themeMode === 'light'}
            viewProps={{ onClick: () => selectThemeMode('light') }}
          />
          <Button
            text={t('docs.theme.dark')}
            pressed={themeMode === 'dark'}
            viewProps={{ onClick: () => selectThemeMode('dark') }}
          />
        </Column>
      }
    >
      <Button
        icon={themeIcon}
        viewProps={{
          label: t('docs.theme'),
        }}
      />
    </Popover>
  )

  return (
    <Column width="fill" height="100vh" background="surface" color="tertiary">
      <AppBar
        elevated
        mode="floating"
        sticky
        leading={
          <Button
            icon={IconMenu2}
            variant="primary"
            pressed={drawerOpen}
            viewProps={{
              label: t('docs.menu'),
              onClick: () => setDrawerOpen((current) => !current),
            }}
          />
        }
        title={<Text>{t('docs.title')}</Text>}
        trailing={
          <Row gap={0.5} align="center">
            <Input
              type="search"
              clearable
              placeholder={t('docs.search')}
              viewProps={{ label: t('docs.search') }}
            />
            {themeSelector}
          </Row>
        }
      />

      <View grow={1} minHeight={0} width="fill" overflow="hidden">
        <Drawer side="left" open={drawerOpen} onOpenChange={setDrawerOpen} drawer={navigation}>
          <Column width="fill" height="fill" overflow="auto">
            <View grow={1} width="fill">
              <Column width="fill" padding={2} gap={0.75}>
                <Text typo="headline-large">{routeTitle(route.section, t)}</Text>
                <Text typo="body-medium" color="secondary">
                  {t('docs.route.placeholder')}
                </Text>
                <Text typo="body-small" color="secondary">
                  {route.pathname}
                </Text>
              </Column>
            </View>
          </Column>
        </Drawer>
      </View>
    </Column>
  )
}
