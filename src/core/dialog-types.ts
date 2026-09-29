import type { DialogHTMLAttributes, ReactNode, RefObject } from 'react'
import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type DialogViewProps = Omit<ViewCoreProps<HTMLDialogElement>, 'children' | 'role'> &
  Pick<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> &
  ViewDynamicBreakpointProps

export interface DialogProps {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  initialFocus?: RefObject<HTMLElement | null>
  restoreFocus?: boolean
  viewProps?: DialogViewProps
}
