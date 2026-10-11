import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, CommandPalette, Text } from '../../../index'

export default function CommandPaletteKeyboardShortcutDemo() {
  const { t } = useTranslation('copy')
  const [lastAction, setLastAction] = useState('')

  return (
    <Column gap={12} align="start">
      <Text typo="body-medium">{t('Press Ctrl or Cmd + K to open the command palette.')}</Text>
      {lastAction ? <Text typo="body-small">{lastAction}</Text> : null}
      <CommandPalette
        shortcut
        searchLabel={t('Search commands')}
        emptyContent={t('No matching commands')}
        dialogLabel={t('Command palette')}
        groups={[
          {
            id: 'quick',
            label: t('Quick actions'),
            commands: [
              {
                id: 'note',
                title: t('Create note'),
                shortcut: 'N',
                onSelect: () => setLastAction(t('Created note')),
              },
              {
                id: 'help',
                title: t('Show help'),
                shortcut: '?',
                onSelect: () => setLastAction(t('Opened help')),
              },
            ],
          },
        ]}
      />
    </Column>
  )
}
