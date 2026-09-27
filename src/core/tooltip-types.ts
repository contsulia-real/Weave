import type {
  ReactElement,
  ReactNode,
} from 'react'
import type {
  Length,
  ViewProps,
} from './view-types'

export type ToolTipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

export type ToolTipViewProps = Omit<
  ViewProps<HTMLDivElement>,
  | 'children'
  | 'role'
  | 'position'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
>

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
