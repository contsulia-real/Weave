import type { ReactNode } from 'react'
import type { RowProps } from './layout-types'

export type BreadcrumbItem = {
  /** Visible content of a navigation level. */
  text: ReactNode
} & (
  | {
      /** Destination for an ancestor level. The final level is never a link. */
      href?: string
      menu?: never
    }
  | {
      /** MenuItem elements rendered in the existing Weave Menu. */
      menu: ReactNode
      href?: never
    }
)

export interface BreadcrumbProps {
  /** Ordered levels, from the root to the current page. */
  items: readonly BreadcrumbItem[]
  /** Decorative separator between levels; defaults to a right-chevron Icon. */
  separator?: ReactNode
  /** Accessible name of the navigation landmark. */
  label?: string
  /** Layout props applied to the internal Row. */
  viewProps?: Omit<RowProps, 'children' | 'role' | 'label'>
}
