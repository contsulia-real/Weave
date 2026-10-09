import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Pagination, Text } from '../../../index'

export default function ControlledPaginationDemo() {
  const { t } = useTranslation('copy')
  const [page, setPage] = useState(6)

  return (
    <Column gap={12}>
      <Pagination pageCount={20} page={page} onPageChange={setPage} />
      <Text typo="body-small" color="secondary">
        {t('Current page: {{page}} of {{count}}', { page, count: 20 })}
      </Text>
    </Column>
  )
}
