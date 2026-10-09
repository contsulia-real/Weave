import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Pagination, Text } from '../../../index'

export default function PaginationBasicUsageDemo() {
  const { t } = useTranslation('copy')
  const [page, setPage] = useState(1)

  return (
    <Column gap={12}>
      <Pagination pageCount={12} onPageChange={setPage} />
      <Text typo="body-small" color="secondary">
        {t('Current page: {{page}} of {{count}}', { page, count: 12 })}
      </Text>
    </Column>
  )
}
