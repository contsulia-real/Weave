import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Text, TreeView } from '../../../index'

export default function TreeViewBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Column gap={12} width="fill">
      <TreeView
        label={t('Project files')}
        defaultExpanded={['src']}
        selected={selected}
        onSelect={setSelected}
        items={[
          {
            id: 'src',
            label: t('Source files'),
            children: [
              {
                id: 'components',
                label: t('Components folder'),
                children: [
                  { id: 'button', label: 'Button.tsx' },
                  { id: 'tree', label: 'TreeView.tsx' },
                ],
              },
              { id: 'index', label: 'index.ts' },
            ],
          },
          { id: 'readme', label: 'README.md' },
        ]}
      />
      <Text typo="body-small" color="secondary">
        {selected === null ? t('No file selected') : t('Selected: {{file}}', { file: selected })}
      </Text>
    </Column>
  )
}
