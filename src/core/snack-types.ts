import type {
  ReactNode,
} from 'react'
import type {
  ButtonIcon,
} from './button-types'
import type {
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type SnackVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type SnackPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type SnackIcon = ButtonIcon

export type SnackViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    | 'children'
    | 'role'
    | 'busy'
  > &
  ViewDynamicBreakpointProps

interface SnackBaseProps {
  variant?: SnackVariant
  duration?: number
  persistent?: boolean
  placement?: SnackPlacement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  viewProps?: SnackViewProps
}

type SnackAction =
  | {
      action?: never
      onAction?: never
    }
  | {
      action: ReactNode
      onAction: () => void
    }

type SnackShortcutContent = {
  children?: never
  text: ReactNode
  icon?: SnackIcon
} & SnackAction

type SnackCustomContent = {
  children: ReactNode
  text?: never
  icon?: never
  action?: never
  onAction?: never
}

export type SnackProps =
  SnackBaseProps &
  (
    | SnackShortcutContent
    | SnackCustomContent
  )
