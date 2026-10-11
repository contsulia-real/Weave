import { IconFile, IconSettings } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, CommandPalette, Text } from '../../../index'

export default function CommandPaletteBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState('')

  return (
    <Column gap={12} align="start">
      <Button text={t('Open command palette')} viewProps={{ onClick: () => setOpen(true) }} />
      {lastAction ? <Text typo="body-small">{lastAction}</Text> : null}
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        searchLabel={t('Search commands')}
        emptyContent={t('No matching commands')}
        dialogLabel={t('Command palette')}
        groups={[
          {
            id: 'actions',
            label: t('Actions'),
            commands: [
              {
                id: 'project',
                title: t('Open project'),
                description: t('Browse recent workspaces'),
                icon: IconFile,
                shortcut: 'Ctrl+1',
                onSelect: () => setLastAction(t('Opened project')),
              },
              {
                id: 'settings',
                title: t('Open settings'),
                description: t('Edit application preferences'),
                icon: IconSettings,
                onSelect: () => setLastAction(t('Opened settings')),
              },
            ],
          },
        ]}
      />
    </Column>
  )
}
