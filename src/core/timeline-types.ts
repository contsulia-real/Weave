import type { ReactNode } from 'react'
import type { ColumnProps } from './layout-types'

export interface TimelineItem {
  /** Stable event identifier. */
  id: string
  /** Main event heading. */
  title: ReactNode
  /** Optional event timestamp or time label. */
  time?: ReactNode
  /** Optional supporting content. */
  description?: ReactNode
}

export interface TimelineProps {
  /** Events displayed in the order provided. */
  items: readonly TimelineItem[]
  /** Layout props for the timeline's outer column. */
  viewProps?: Omit<ColumnProps, 'children' | 'role'>
}
