import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, Column, MenuItem, Text } from '../../../index'

export default function BreadcrumbDropdownItemsDemo() {
  const { t } = useTranslation('copy')
  const [selected, setSelected] = useState('')

  return (
    <Column gap={12}>
      <Breadcrumb
        items={[
          { text: t('Home'), href: '/docs' },
          {
            text: t('Components'),
            menu: (
              <>
                <MenuItem text="Link" onSelect={() => setSelected('Link')} />
                <MenuItem text="Pagination" onSelect={() => setSelected('Pagination')} />
              </>
            ),
          },
          { text: selected || 'Breadcrumb' },
        ]}
      />
      <Text typo="body-small" color="secondary">
        {t('Selected: {{item}}', { item: selected || t('None') })}
      </Text>
    </Column>
  )
}
