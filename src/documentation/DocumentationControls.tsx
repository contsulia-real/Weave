import { IconDeviceDesktop, IconLanguage, IconMoon, IconSun } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ThemeMode } from '../index'
import { Button, Column, Popover } from '../index'
import documentationI18n, {
  type DocumentationLanguagePreference,
  detectDocumentationLanguage,
  documentationLanguages,
} from './i18n'

export interface DocumentationControlsProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
}

export function DocumentationControls({
  themeMode,
  onThemeModeChange,
}: DocumentationControlsProps) {
  const { t } = useTranslation()
  const [themePopoverOpen, setThemePopoverOpen] = useState(false)
  const [languagePopoverOpen, setLanguagePopoverOpen] = useState(false)
  const [languagePreference, setLanguagePreference] =
    useState<DocumentationLanguagePreference>('auto')

  const themeIcon =
    themeMode === 'light' ? IconSun : themeMode === 'dark' ? IconMoon : IconDeviceDesktop

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

  return (
    <>
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
    </>
  )
}
