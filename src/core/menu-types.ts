import type {
  ReactElement,
  ReactNode,
} from 'react'
import type {
  IconComponent,
  IconSvg,
} from './icon-types'
import type {
  PopoverPlacement,
} from './popover-types'
import type {
  Length,
  ViewCoreProps,
  ViewDynamicBreakpointProps,
} from './view-types'

export type MenuPlacement =
  PopoverPlacement

export type MenuItemIcon =
  IconComponent | IconSvg

export type MenuViewProps =
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

export type MenuItemViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    | 'children'
    | 'role'
    | 'selected'
  > &
  ViewDynamicBreakpointProps

export interface MenuProps {
  trigger: ReactElement
  children?: ReactNode
  placement?: MenuPlacement
  offset?: Length
  submenuOffset?: Length
  viewportPadding?: Length
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  closeOnSelect?: boolean
  viewProps?: MenuViewProps
}

export interface MenuItemProps {
  text: ReactNode
  secondaryText?: ReactNode
  icon?: MenuItemIcon
  disabled?: boolean
  danger?: boolean
  onSelect?: () => void
  closeOnSelect?: boolean
  submenu?: ReactNode
  viewProps?: MenuItemViewProps
}

export type MenuSeparatorViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    'children' | 'role'
  > &
  ViewDynamicBreakpointProps

export interface MenuSeparatorProps {
  viewProps?: MenuSeparatorViewProps
}
