import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Column, CommandPalette, Text } from '../../../index'

export default function CommandPaletteGroupedSearchDemo() {
  const { t } = useTranslation('copy')
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState('')

  return (
    <Column gap={12} align="start">
      <Button
        text={t('Browse commands')}
        variant="secondary"
        viewProps={{ onClick: () => setOpen(true) }}
      />
      <Text typo="body-small" color="secondary">
        {lastAction || t('Search by name or keyword, then press Enter.')}
      </Text>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        searchLabel={t('Search commands')}
        emptyContent={t('No matching commands')}
        dialogLabel={t('Command palette')}
        groups={[
          {
            id: 'files',
            label: t('Files'),
            commands: [
              {
                id: 'new',
                title: t('New file'),
                keywords: ['create', 'document', 'write'],
                onSelect: () => setLastAction(t('Created file')),
              },
              {
                id: 'export',
                title: t('Export document'),
                description: t('Download the current file'),
                keywords: ['download', 'save'],
                onSelect: () => setLastAction(t('Exported document')),
              },
            ],
          },
          {
            id: 'workspace',
            label: t('Workspace'),
            commands: [
              {
                id: 'switch',
                title: t('Switch workspace'),
                keywords: ['change', 'project'],
                onSelect: () => setLastAction(t('Switched workspace')),
              },
              {
                id: 'archive',
                title: t('Archive workspace'),
                disabled: true,
                onSelect: () => setLastAction(t('Archived workspace')),
              },
            ],
          },
        ]}
      />
    </Column>
  )
}
