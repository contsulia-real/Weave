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

export type SelectValue = string

export type SelectIcon =
  | IconComponent
  | IconSvg

export type SelectPlacement =
  PopoverPlacement

export type SelectViewProps =
  Omit<
    ViewCoreProps<HTMLButtonElement>,
    | 'children'
    | 'role'
    | 'disabled'
    | 'expanded'
    | 'controls'
  > &
  ViewDynamicBreakpointProps

export type SelectListboxViewProps =
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

export type SelectOptionViewProps =
  Omit<
    ViewCoreProps<HTMLDivElement>,
    | 'children'
    | 'role'
    | 'selected'
    | 'disabled'
  > &
  ViewDynamicBreakpointProps

export interface SelectProps {
  children?: ReactNode
  value?: SelectValue | null
  defaultValue?: SelectValue | null
  onValueChange?: (
    value: SelectValue,
  ) => void
  placeholder?: ReactNode
  disabled?: boolean
  placement?: SelectPlacement
  offset?: Length
  viewportPadding?: Length
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  viewProps?: SelectViewProps
  listboxViewProps?:
    SelectListboxViewProps
}

export interface SelectOptionProps {
  value: SelectValue
  text: ReactNode
  textValue?: string
  secondaryText?: ReactNode
  icon?: SelectIcon
  disabled?: boolean
  viewProps?: SelectOptionViewProps
}

export interface SelectOptionDescriptor {
  value: SelectValue
  text: ReactNode
  textValue: string
  secondaryText?: ReactNode
  icon?: SelectIcon
  disabled: boolean
}

export type SelectTriggerContent =
  Pick<
    SelectOptionDescriptor,
    'text' | 'icon'
  >

export type SelectChild =
  ReactElement<SelectOptionProps>
