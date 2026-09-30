import type { ReactNode, RefObject } from 'react'
import type { ButtonIcon } from './button-types'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type SnackVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export type SnackPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type SnackIcon = ButtonIcon

export type SnackContainer =
  | HTMLElement
  | RefObject<HTMLElement | null>
  | (() => HTMLElement | null)
  | null

export type SnackViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children' | 'role'> &
  ViewDynamicBreakpointProps

interface SnackRequestBase {
  variant?: SnackVariant
  duration?: number
  persistent?: boolean
  progress?: boolean
  placement?: SnackPlacement
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

export type SnackRequest = SnackRequestBase & (SnackShortcutContent | SnackCustomContent)

export type SnackProps = SnackRequest & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onDismissed?: () => void
}

export interface SnackController {
  show(request: SnackRequest): string
  dismiss(id: string): void
  dismissAll(): void
}
