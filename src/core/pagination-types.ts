import type { ButtonSize } from './button-types'
import type { RowProps } from './layout-types'

export interface PaginationProps {
  /** Number of available pages. Zero disables page navigation. */
  pageCount: number
  /** Controlled current page, numbered from 1. */
  page?: number
  /** Initial page when uncontrolled; defaults to 1. */
  defaultPage?: number
  onPageChange?: (page: number) => void
  disabled?: boolean
  size?: ButtonSize
  viewProps?: Omit<RowProps, 'children' | 'role'>
}
