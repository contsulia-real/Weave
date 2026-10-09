import { useState } from 'react'
import type { PaginationProps } from '../core/pagination-types'
import { Button } from './Button'
import { chevronLeftIcon, chevronRightIcon } from './internal/control-icons'
import { useDateLocalization } from './internal/date-localization'
import { Row } from './Row'
import { Text } from './Text'

function clampPage(page: number, count: number): number {
  if (!Number.isFinite(page)) return 1
  return Math.max(1, Math.min(count || 1, Math.floor(page)))
}

function visiblePages(page: number, count: number): number[] {
  const pages = new Set<number>()
  for (const candidate of [1, 2, page - 1, page, page + 1, count - 1, count]) {
    if (candidate >= 1 && candidate <= count) pages.add(candidate)
  }
  return [...pages].sort((left, right) => left - right)
}

export function Pagination({
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  disabled = false,
  size = 'small',
  viewProps = {},
}: PaginationProps): import('react').JSX.Element {
  const { messages } = useDateLocalization()
  const count = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage)
  const currentPage = clampPage(page ?? uncontrolledPage, count)
  const unavailable = disabled || count === 0

  const changePage = (next: number) => {
    if (unavailable || next === currentPage || next < 1 || next > count) return
    if (page === undefined) setUncontrolledPage(next)
    onPageChange?.(next)
  }

  const pages = visiblePages(currentPage, count)
  return (
    <Row
      {...viewProps}
      role="navigation"
      label={viewProps.label ?? messages.pagination}
      align="center"
      gap={4}
      data={{ ...viewProps.data, 'weave-pagination': '' }}
    >
      <Button
        icon={chevronLeftIcon}
        variant="ghost"
        size={size}
        disabled={unavailable || currentPage === 1}
        viewProps={{ label: messages.previousPage, onClick: () => changePage(currentPage - 1) }}
      />
      {pages.map((item, index) => (
        <Row key={item} align="center" gap={4}>
          {index > 0 && item - pages[index - 1] > 1 ? (
            <Text viewProps={{ 'aria-hidden': true }}>…</Text>
          ) : null}
          <Button
            text={String(item)}
            variant={item === currentPage ? 'secondary' : 'ghost'}
            size={size}
            disabled={unavailable}
            viewProps={{
              label: messages.pageNumber.replace('{page}', String(item)),
              'aria-current': item === currentPage ? 'page' : undefined,
              onClick: () => changePage(item),
            }}
          />
        </Row>
      ))}
      <Button
        icon={chevronRightIcon}
        variant="ghost"
        size={size}
        disabled={unavailable || currentPage === count}
        viewProps={{ label: messages.nextPage, onClick: () => changePage(currentPage + 1) }}
      />
    </Row>
  )
}
