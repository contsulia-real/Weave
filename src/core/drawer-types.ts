import type { ReactNode, RefObject } from 'react'
import type { Length, ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
export type DrawerMode = 'auto' | 'modal' | 'non-modal'

export type DrawerViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  'children' | 'layout' | 'direction'
> &
  ViewDynamicBreakpointProps

export type DrawerSurfaceViewProps = Omit<
  ViewCoreProps<HTMLDivElement>,
  | 'children'
  | 'role'
  | 'ref'
  | 'position'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'width'
  | 'height'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
> &
  ViewDynamicBreakpointProps

interface DrawerBaseProps {
  children: ReactNode
  drawer: ReactNode
  side?: DrawerSide
  mode?: DrawerMode
  breakpoint?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSizeChange?: (size: string) => void
  minSize?: Length
  collapseThreshold?: Length
  expandThreshold?: Length
  closeThreshold?: Length
  resizable?: boolean
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  initialFocus?: RefObject<HTMLElement | null>
  restoreFocus?: boolean
  viewProps?: DrawerViewProps
  drawerViewProps?: DrawerSurfaceViewProps
}

interface DrawerControlledSizeProps {
  size: Length
  defaultSize?: never
}

interface DrawerUncontrolledSizeProps {
  size?: never
  defaultSize?: Length
}

export type DrawerProps = DrawerBaseProps &
  (DrawerControlledSizeProps | DrawerUncontrolledSizeProps)
