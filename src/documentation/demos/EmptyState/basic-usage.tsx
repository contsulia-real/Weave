import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, EmptyState, Icon } from '../../../index'

export default function EmptyStateBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [filtersCleared, setFiltersCleared] = useState(false)

  return (
    <EmptyState
      title={t('No results found')}
      description={
        filtersCleared
          ? t('Filters cleared. There are no items to display yet.')
          : t('Try changing your filters or search terms.')
      }
      icon={<Icon icon={IconSearch} size="large" viewProps={{ color: 'secondary' }} />}
      action={
        <Button
          text={filtersCleared ? t('Filters cleared') : t('Clear filters')}
          variant="secondary"
          disabled={filtersCleared}
          viewProps={{ onClick: () => setFiltersCleared(true) }}
        />
      }
      viewProps={{ minHeight: 240 }}
    />
  )
}
