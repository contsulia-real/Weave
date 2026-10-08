import { IconDeviceDesktop, IconLanguage, IconMoon, IconSun } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ThemeMode } from '../index'
import { Button, Column, Grid, Popover, SegmentedButton } from '../index'
import { type DocumentationThemeColorId, documentationThemeColors } from './documentation-theme'
import documentationI18n, {
  type DocumentationLanguagePreference,
  documentationLanguages,
} from './i18n'

export interface DocumentationControlsProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
  themeColorId: DocumentationThemeColorId
  onThemeColorChange: (id: DocumentationThemeColorId) => void
}

export function DocumentationControls({
  themeMode,
  onThemeModeChange,
  themeColorId,
  onThemeColorChange,
}: DocumentationControlsProps) {
  const { t } = useTranslation()
  const [themePopoverOpen, setThemePopoverOpen] = useState(false)
  const [languagePopoverOpen, setLanguagePopoverOpen] = useState(false)
  const [languagePreference, setLanguagePreference] =
    useState<DocumentationLanguagePreference>('auto')

  const themeIcon =
    themeMode === 'light' ? IconSun : themeMode === 'dark' ? IconMoon : IconDeviceDesktop

  const selectThemeMode = (selected: string | null) => {
    if (selected === 'system' || selected === 'light' || selected === 'dark') {
      onThemeModeChange(selected)
      setThemePopoverOpen(false)
    }
  }

  const selectThemeColor = (id: DocumentationThemeColorId) => {
    onThemeColorChange(id)
    setThemePopoverOpen(false)
  }

  const selectLanguage = (preference: DocumentationLanguagePreference) => {
    setLanguagePreference(preference)
    void documentationI18n.changeLanguage(preference === 'auto' ? undefined : preference)
    setLanguagePopoverOpen(false)
  }

  return (
    <>
      <Popover
        placement="bottom-right"
        open={themePopoverOpen}
        onOpenChange={setThemePopoverOpen}
        content={
          <Column gap={16} padding={8}>
            <SegmentedButton
              variant="secondary"
              selection="single"
              selected={themeMode}
              onSelect={selectThemeMode}
              items={[
                { id: 'system', children: t('docs.theme.system') },
                { id: 'light', children: t('docs.theme.light') },
                { id: 'dark', children: t('docs.theme.dark') },
              ]}
            />
            <Grid columns={3} gap={8}>
              {documentationThemeColors.map(({ id, labelKey, seed }) => (
                <Button
                  key={id}
                  text=""
                  variant="secondary"
                  pressed={themeColorId === id}
                  viewProps={{
                    width: 'fill',
                    label: t(labelKey),
                    style: { backgroundColor: seed },
                    onClick: () => selectThemeColor(id),
                  }}
                />
              ))}
            </Grid>
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
          <Column gap={8} padding={8}>
            <Button
              text={t('docs.language.auto')}
              pressed={languagePreference === 'auto'}
              viewProps={{ onClick: () => selectLanguage('auto') }}
            />
            {documentationLanguages.map(({ code, label }) => (
              <Button
                key={code}
                text={label}
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
