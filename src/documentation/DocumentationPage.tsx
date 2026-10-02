import {
  IconDeviceDesktop,
  IconLanguage,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconSun,
} from '@tabler/icons-react'
import type { TFunction } from 'i18next'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ThemeMode } from '../index'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  AppBar,
  Button,
  Column,
  Drawer,
  Input,
  Link,
  Popover,
  Text,
  View,
} from '../index'
import documentationI18n, {
  type DocumentationLanguagePreference,
  detectDocumentationLanguage,
  documentationLanguages,
} from './i18n'
import { useDocsRoute } from './router'

const documentationComponents = [
  'Absolute',
  'Accordion',
  'AccordionItem',
  'AccordionPanel',
  'AccordionTrigger',
  'AppBar',
  'Avatar',
  'Badge',
  'Button',
  'Card',
  'Checkbox',
  'Code',
  'Column',
  'Combobox',
  'ComboboxOption',
  'Dialog',
  'Divider',
  'Drawer',
  'Flex',
  'Form',
  'FormDescription',
  'FormError',
  'FormField',
  'FormFieldset',
  'FormLabel',
  'FormLegend',
  'Grid',
  'Icon',
  'Image',
  'Input',
  'Link',
  'List',
  'ListItem',
  'Menu',
  'MenuItem',
  'Popover',
  'Presence',
  'Progress',
  'Radio',
  'RangeSlider',
  'Row',
  'Select',
  'SelectOption',
  'Skeleton',
  'Slider',
  'Snack',
  'SnackProvider',
  'SplitBox',
  'SplitBoxPane',
  'Stack',
  'Switch',
  'Tab',
  'TabList',
  'Table',
  'TableBody',
  'TableCell',
  'TableHead',
  'TableHeader',
  'TableRow',
  'TabPanel',
  'Tabs',
  'Text',
  'ThemeProvider',
  'ToolTip',
  'View',
] as const

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
  const [languagePopoverOpen, setLanguagePopoverOpen] = useState(false)
  const [languagePreference, setLanguagePreference] =
    useState<DocumentationLanguagePreference>('auto')

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

  const selectLanguage = (preference: DocumentationLanguagePreference) => {
    setLanguagePreference(preference)
    const language = preference === 'auto' ? detectDocumentationLanguage() : preference
    void documentationI18n.changeLanguage(language)
    setLanguagePopoverOpen(false)
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
      <Accordion multiple>
        <AccordionItem value="components">
          <AccordionTrigger>{t('docs.nav.components')}</AccordionTrigger>
          <AccordionPanel>
            <Column>
              {documentationComponents.map((component) => {
                const path = `/docs/components/${component}`

                return (
                  <Link
                    key={component}
                    href={path}
                    text={component}
                    hideIcon
                    hideUnderline
                    viewProps={{ onClick: navigate(path) }}
                  />
                )
              })}
            </Column>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
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

  const languageSelector = (
    <Popover
      placement="bottom-right"
      open={languagePopoverOpen}
      onOpenChange={setLanguagePopoverOpen}
      content={
        <Column gap={0.5} padding={0.5}>
          <Button
            text={t('docs.language.auto')}
            pressed={languagePreference === 'auto'}
            viewProps={{ onClick: () => selectLanguage('auto') }}
          />
          {documentationLanguages.map(({ code, labelKey }) => (
            <Button
              key={code}
              text={t(labelKey)}
              pressed={languagePreference === code}
              viewProps={{ onClick: () => selectLanguage(code) }}
            />
          ))}
        </Column>
      }
    >
      <Button
        icon={IconLanguage}
        viewProps={{
          label: t('docs.language'),
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
          <>
            <Input
              type="search"
              clearable
              leadingIcon={IconSearch}
              placeholder={t('docs.search')}
              viewProps={{ label: t('docs.search') }}
            />
            {themeSelector}
            {languageSelector}
          </>
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
