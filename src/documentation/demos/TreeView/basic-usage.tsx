import { IconFile, IconFolder } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Icon, Text, TreeView } from '../../../index'

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
            leading: (
              <Icon icon={IconFolder} size="medium" viewProps={{ width: '100%', height: '100%' }} />
            ),
            trailing: (
              <Text typo="body-small" color="secondary">
                {t('Folder')}
              </Text>
            ),
            children: [
              {
                id: 'components',
                label: t('Components folder'),
                leading: (
                  <Icon
                    icon={IconFolder}
                    size="medium"
                    viewProps={{ width: '100%', height: '100%' }}
                  />
                ),
                children: [
                  {
                    id: 'button',
                    label: 'Button.tsx',
                    leading: (
                      <Icon
                        icon={IconFile}
                        size="medium"
                        viewProps={{ width: '100%', height: '100%' }}
                      />
                    ),
                  },
                  {
                    id: 'tree',
                    label: 'TreeView.tsx',
                    leading: (
                      <Icon
                        icon={IconFile}
                        size="medium"
                        viewProps={{ width: '100%', height: '100%' }}
                      />
                    ),
                  },
                ],
              },
              {
                id: 'index',
                label: 'index.ts',
                leading: (
                  <Icon
                    icon={IconFile}
                    size="medium"
                    viewProps={{ width: '100%', height: '100%' }}
                  />
                ),
              },
            ],
          },
          {
            id: 'readme',
            label: 'README.md',
            leading: (
              <Icon icon={IconFile} size="medium" viewProps={{ width: '100%', height: '100%' }} />
            ),
            trailing: (
              <Text typo="body-small" color="secondary">
                {t('File')}
              </Text>
            ),
          },
        ]}
      />
      <Text typo="body-small" color="secondary">
        {selected === null ? t('No file selected') : t('Selected: {{file}}', { file: selected })}
      </Text>
    </Column>
  )
}
