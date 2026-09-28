import type {
  ReactElement,
  ReactNode,
} from 'react'
import type {
  Length,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type PopoverPlacement =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'

export type PopoverViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    | 'children'
    | 'role'
    | 'position'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
  > &
  ViewDynamicBreakpointProps

export interface PopoverProps {
  children: ReactElement
  content: ReactNode
  placement?: PopoverPlacement
  offset?: Length
  viewportPadding?: Length
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  autoFocus?: boolean
  restoreFocus?: boolean
  viewProps?: PopoverViewProps
}
