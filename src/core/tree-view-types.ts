import type { ReactNode } from 'react'
import type { ColumnProps } from './layout-types'

export interface TreeViewItem {
  /** Unique identifier across the entire tree. */
  id: string
  label: ReactNode
  /** Optional icon or content before the label, separate from the expand indicator. */
  leading?: ReactNode
  /** Optional trailing content or action. */
  trailing?: ReactNode
  children?: readonly TreeViewItem[]
  disabled?: boolean
}

export interface TreeViewProps {
  items: readonly TreeViewItem[]
  /** Accessible name of the tree. */
  label: string
  /** Controlled expanded node identifiers. */
  expanded?: readonly string[]
  /** Initially expanded nodes when uncontrolled. */
  defaultExpanded?: readonly string[]
  onExpandedChange?: (expanded: string[]) => void
  /** Controlled selected node identifier. */
  selected?: string | null
  /** Initially selected node when uncontrolled. */
  defaultSelected?: string | null
  onSelect?: (selected: string) => void
  viewProps?: Omit<ColumnProps, 'children' | 'role' | 'label' | 'selected'>
}
