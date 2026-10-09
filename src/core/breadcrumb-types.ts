import type { ReactNode } from 'react'
import type { RowProps } from './layout-types'

export interface BreadcrumbItem {
  /** Visible content of a navigation level. */
  text: ReactNode
  /** Destination for an ancestor level. The final level is always the current page. */
  href?: string
}

export interface BreadcrumbProps {
  /** Ordered levels, from the root to the current page. */
  items: readonly BreadcrumbItem[]
  /** Accessible name of the navigation landmark. */
  label?: string
  /** Layout props applied to the internal Row. */
  viewProps?: Omit<RowProps, 'children' | 'role' | 'label'>
}
