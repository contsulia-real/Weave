import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { Button, EmptyState, Icon } from '../../../index'

export default function EmptyStateBasicUsageDemo() {
  const [filtersCleared, setFiltersCleared] = useState(false)

  return (
    <EmptyState
      title="No results found"
      description={
        filtersCleared
          ? 'Filters cleared. There are no items to display yet.'
          : 'Try changing your filters or search terms.'
      }
      icon={<Icon icon={IconSearch} size="large" viewProps={{ color: 'secondary' }} />}
      action={
        <Button
          text={filtersCleared ? 'Filters cleared' : 'Clear filters'}
          variant="secondary"
          disabled={filtersCleared}
          viewProps={{ onClick: () => setFiltersCleared(true) }}
        />
      }
      viewProps={{ minHeight: 240 }}
    />
  )
}
