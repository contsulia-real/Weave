import type { ReactNode } from 'react'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type CardViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'clickable' | 'pressed' | 'selected'
> &
  ViewDynamicBreakpointProps

interface CardBaseProps {
  children: ReactNode
  clickable?: boolean
  viewProps?: CardViewProps
}

interface PassiveSelectionCardProps {
  selectable?: false
  selected?: never
  defaultSelected?: never
  onSelectedChange?: never
}

interface SelectableCardProps {
  selectable: true
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
}

export type CardProps = CardBaseProps & (PassiveSelectionCardProps | SelectableCardProps)
