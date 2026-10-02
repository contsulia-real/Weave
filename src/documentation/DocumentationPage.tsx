import { IconMenu2, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ThemeMode } from '../index'
import { AppBar, Button, Column, Drawer, Input, Text } from '../index'
import { DocumentationContent } from './DocumentationContent'
import { DocumentationControls } from './DocumentationControls'
import { DocumentationLoadingProgress } from './DocumentationLoadingProgress'
import { DocumentationNavigation } from './DocumentationNavigation'
import { useDocsRoute } from './router'

export interface DocumentationPageProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
}

export function DocumentationPage({ themeMode, onThemeModeChange }: DocumentationPageProps) {
  const { t } = useTranslation()
  const route = useDocsRoute()
  const [drawerOpen, setDrawerOpen] = useState(false)

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
          <>
            <Input
              type="search"
              clearable
              leadingIcon={IconSearch}
              placeholder={t('docs.search')}
              viewProps={{ label: t('docs.search') }}
            />
            <DocumentationControls themeMode={themeMode} onThemeModeChange={onThemeModeChange} />
          </>
        }
      />

      <DocumentationLoadingProgress />

      <Column grow={1} minHeight={0} width="fill" overflow="hidden">
        <Drawer
          defaultOpen
          side="left"
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          drawer={<DocumentationNavigation pathname={route.pathname} onNavigate={route.navigate} />}
        >
          <DocumentationContent section={route.section} pathname={route.pathname} />
        </Drawer>
      </Column>
    </Column>
  )
}
