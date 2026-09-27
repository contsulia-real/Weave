import type {
  ReactElement,
  ReactNode,
} from 'react'
import type {
  Length,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type ToolTipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

export type ToolTipViewProps =
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

export interface ToolTipProps {
  children: ReactElement
  content: ReactNode
  placement?: ToolTipPlacement
  delay?: number
  offset?: Length
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  viewProps?: ToolTipViewProps
}
