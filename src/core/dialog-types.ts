import type { DialogHTMLAttributes, ReactElement, ReactNode, RefObject } from 'react'
import type { PopoverPlacement, PopoverViewProps } from './popover-types'
import type { Length, ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

interface DialogOpenProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  restoreFocus?: boolean
}

export interface NonModalDialogProps extends DialogOpenProps {
  modal?: false
  trigger: ReactElement
  children: ReactNode
  placement?: PopoverPlacement
  offset?: Length
  viewportPadding?: Length
  autoFocus?: boolean
  viewProps?: PopoverViewProps
}

export type ModalDialogViewProps = Omit<ViewCoreProps<HTMLDialogElement>, 'children' | 'role'> &
  Pick<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> &
  ViewDynamicBreakpointProps

export interface ModalDialogProps extends DialogOpenProps {
  modal: true
  children: ReactNode
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  initialFocus?: RefObject<HTMLElement | null>
  viewProps?: ModalDialogViewProps
}

export type DialogViewProps = PopoverViewProps | ModalDialogViewProps

export type DialogProps = NonModalDialogProps | ModalDialogProps
