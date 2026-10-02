import type { ReactNode } from 'react'
import type { ButtonIcon } from './button-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps, ViewStyleProps } from './view-types'

export type ListSelection = 'none' | 'single' | 'multiple'

export type ListOrientation = 'vertical' | 'horizontal'

export type ListItemIcon = ButtonIcon

export interface ListDataItem {
  id: string
  text: ReactNode
  icon?: ListItemIcon
  secondaryText?: ReactNode
  trailing?: ReactNode
  disabled?: boolean
}

export type ListViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'role' | 'selected' | 'disabled' | 'layout'
> &
  ViewDynamicBreakpointProps

export type ListItemViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'role' | 'selected' | 'disabled'
> &
  ViewDynamicBreakpointProps

export interface ListItemProps {
  id: string
  children: ReactNode
  disabled?: boolean
  viewProps?: ListItemViewProps
}

interface ListBaseProps {
  disabled?: boolean
  orientation?: ListOrientation
  gap?: ViewStyleProps['gap']
  noDividers?: boolean
  singleLine?: boolean
  virtualized?: boolean
  viewProps?: ListViewProps
}

type ListContentProps =
  | {
      items: readonly ListDataItem[]
      children?: never
    }
  | {
      items?: never
      children: ReactNode
    }

interface ListNoSelectionProps {
  selection?: 'none'
  selected?: never
  defaultSelected?: never
  onSelect?: never
}

interface ListSingleSelectionProps {
  selection: 'single'
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (selected: string | null) => void
}

interface ListMultipleSelectionProps {
  selection: 'multiple'
  selected?: readonly string[]
  defaultSelected?: readonly string[]
  onSelect?: (selected: readonly string[]) => void
}

export type ListProps = ListBaseProps &
  ListContentProps &
  (ListNoSelectionProps | ListSingleSelectionProps | ListMultipleSelectionProps)
