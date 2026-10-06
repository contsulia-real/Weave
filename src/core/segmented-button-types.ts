import type { ReactNode } from 'react'
import type { ButtonSize, ButtonVariant, ButtonViewProps } from './button-types'
import type { RowProps } from './layout-types'

export type SegmentedButtonSelection = 'none' | 'single' | 'multiple'

export type SegmentedButtonViewProps = Omit<RowProps, 'children' | 'role'>

export interface SegmentedButtonItem {
  id: string
  children: Exclude<ReactNode, undefined>
  disabled?: boolean
  viewProps?: ButtonViewProps
}

interface SegmentedButtonBaseProps {
  items: readonly SegmentedButtonItem[]
  variant?: ButtonVariant
  size?: ButtonSize
  viewProps?: SegmentedButtonViewProps
}

interface SegmentedButtonNoSelectionProps {
  selection?: 'none'
  selected?: never
  defaultSelected?: never
  onSelect?: never
}

interface SegmentedButtonSingleSelectionProps {
  selection: 'single'
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (selected: string | null) => void
}

interface SegmentedButtonMultipleSelectionProps {
  selection: 'multiple'
  selected?: readonly string[]
  defaultSelected?: readonly string[]
  onSelect?: (selected: readonly string[]) => void
}

export type SegmentedButtonProps = SegmentedButtonBaseProps &
  (
    | SegmentedButtonNoSelectionProps
    | SegmentedButtonSingleSelectionProps
    | SegmentedButtonMultipleSelectionProps
  )
